#!/usr/bin/env node
// Regenerates data/resume.json from resume.tex.
//
// resume.tex uses a small set of custom macros (\entryHead, \entryHeadNoSub,
// \skillRow, \certRow, \rItem) that make it straightforward to parse without
// a full LaTeX engine. Fields that don't exist in the .tex (sidebar bio/social,
// header icons, header location, resume-download link, per-entry location
// when the .tex leaves it blank) are preserved from the existing resume.json
// instead of being overwritten.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TEX_PATH = path.join(ROOT, "resume.tex");
const JSON_PATH = path.join(ROOT, "data", "resume.json");

function clean(s) {
  return s
    .replace(/(?<!\\)%.*/g, "") // strip LaTeX comments (unescaped %)
    .replace(/\\vspace\*?\{[^}]*\}/g, "") // strip no-op spacing macros
    .replace(/\\(?:bigskip|medskip|smallskip|newpage|clearpage)\b/g, "")
    .replace(/\\&/g, "&")
    .replace(/\\%/g, "%")
    .replace(/\\#/g, "#")
    .replace(/---/g, "—")
    .replace(/--/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function extractBalanced(str, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < str.length; i++) {
    if (str[i] === "{") depth++;
    else if (str[i] === "}") {
      depth--;
      if (depth === 0) return { content: str.slice(openIndex + 1, i), end: i + 1 };
    }
  }
  throw new Error(`Unbalanced braces starting at index ${openIndex}`);
}

function readArgs(str, pos, count) {
  const args = [];
  let i = pos;
  for (let n = 0; n < count; n++) {
    while (str[i] !== "{") {
      if (i >= str.length) throw new Error("Expected '{' while reading macro args");
      i++;
    }
    const { content, end } = extractBalanced(str, i);
    args.push(content);
    i = end;
  }
  return { args, end: i };
}

function findMacroCalls(str, macroName, argCount) {
  const calls = [];
  const re = new RegExp(`\\\\${macroName}(?![a-zA-Z])`, "g");
  let m;
  while ((m = re.exec(str))) {
    const { args, end } = readArgs(str, m.index + m[0].length, argCount);
    calls.push({ args, start: m.index, end });
    re.lastIndex = end;
  }
  return calls;
}

function getSections(str) {
  // Only scan the document body: the preamble can reference "\section" as a
  // bare token (e.g. \titleformat{\section}{...}) which would otherwise be
  // mistaken for a real \section{...} call and throw off every offset after it.
  const bodyStart = str.indexOf("\\begin{document}");
  const body = bodyStart === -1 ? str : str.slice(bodyStart);
  const calls = findMacroCalls(body, "section", 1);
  const endOfDoc = body.indexOf("\\end{document}");
  const sections = {};
  calls.forEach((call, i) => {
    const name = clean(call.args[0]);
    const start = call.end;
    const end = i + 1 < calls.length ? calls[i + 1].start : (endOfDoc === -1 ? body.length : endOfDoc);
    sections[name] = body.slice(start, end);
  });
  return sections;
}

function getEntries(sectionText) {
  const full = findMacroCalls(sectionText, "entryHead", 4).map((c) => ({ ...c, type: "full" }));
  const noSub = findMacroCalls(sectionText, "entryHeadNoSub", 2).map((c) => ({ ...c, type: "noSub" }));
  const all = [...full, ...noSub].sort((a, b) => a.start - b.start);
  return all.map((entry, idx) => {
    const chunkEnd = idx + 1 < all.length ? all[idx + 1].start : sectionText.length;
    const chunk = sectionText.slice(entry.end, chunkEnd);
    const bullets = findMacroCalls(chunk, "rItem", 1).map((c) => clean(c.args[0]));
    return { ...entry, bullets };
  });
}

function parseHeader(tex) {
  const centerMatch = tex.match(/\\begin\{center\}([\s\S]*?)\\end\{center\}/);
  const centerText = centerMatch ? centerMatch[1] : "";

  const nameMatch = centerText.match(/\\huge\\bfseries\\color\{darknavy\}\s*([^}]+)\}/);
  const name = nameMatch ? clean(nameMatch[1]) : null;

  const phoneMatch = centerText.match(/(\d{3}-\d{3}-\d{4})/);
  const phone = phoneMatch ? phoneMatch[1] : null;

  const hrefs = findMacroCalls(centerText, "href", 2).map((c) => ({
    url: c.args[0].trim(),
    text: clean(c.args[1]),
  }));

  const emailHref = hrefs.find((h) => h.url.startsWith("mailto:"));
  const linkedinHref = hrefs.find((h) => /linkedin\.com/i.test(h.url));
  const githubHref = hrefs.find((h) => /^https?:\/\/github\.com/i.test(h.url));

  return {
    name,
    phone,
    email: emailHref ? emailHref.url.slice("mailto:".length) : null,
    linkedin: linkedinHref ? { href: linkedinHref.url, text: linkedinHref.text } : null,
    github: githubHref ? { href: githubHref.url, text: githubHref.text } : null,
  };
}

function buildContacts(oldContacts, parsedHeader) {
  return (oldContacts || []).map((c) => {
    if (c.alt === "phone" && parsedHeader.phone) {
      const digits = parsedHeader.phone.replace(/\D/g, "");
      return { ...c, href: `tel:+1${digits}`, text: parsedHeader.phone };
    }
    if (c.alt === "email" && parsedHeader.email) {
      return { ...c, href: `mailto:${parsedHeader.email}`, text: parsedHeader.email };
    }
    if (c.alt === "linkedin" && parsedHeader.linkedin) {
      return { ...c, href: parsedHeader.linkedin.href, text: parsedHeader.linkedin.text };
    }
    if (c.alt === "github" && parsedHeader.github) {
      return { ...c, href: parsedHeader.github.href, text: parsedHeader.github.text };
    }
    return c;
  });
}

function findOldLocation(oldArray, matchKey, name, index) {
  const arr = oldArray || [];
  const byName = arr.find((e) => e[matchKey] === name);
  if (byName) return byName.location;
  if (arr[index]) return arr[index].location;
  console.warn(`Warning: no location found for "${name}" (tex left it blank) — leaving empty, please fill in manually.`);
  return "";
}

function main() {
  const tex = fs.readFileSync(TEX_PATH, "utf8");
  const oldData = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));

  const sections = getSections(tex);
  const parsedHeader = parseHeader(tex);

  const summary = sections["PROFESSIONAL SUMMARY"] ? clean(sections["PROFESSIONAL SUMMARY"]) : oldData.summary;

  const technicalSkills = sections["TECHNICAL SKILLS"]
    ? findMacroCalls(sections["TECHNICAL SKILLS"], "skillRow", 2).map((c) => ({
        label: clean(c.args[0]),
        value: clean(c.args[1]),
      }))
    : oldData.technicalSkills;

  const projects = sections["ENGINEERING PROJECTS"]
    ? getEntries(sections["ENGINEERING PROJECTS"])
        .filter((e) => e.type === "noSub")
        .map((e) => ({
          name: clean(e.args[0]),
          dates: clean(e.args[1]),
          bullets: e.bullets,
        }))
    : oldData.projects;

  const experience = sections["PROFESSIONAL EXPERIENCE"]
    ? getEntries(sections["PROFESSIONAL EXPERIENCE"])
        .filter((e) => e.type === "full")
        .map((e, idx) => {
          const company = clean(e.args[0]);
          const location = clean(e.args[3]) || findOldLocation(oldData.experience, "company", company, idx);
          return {
            company,
            dates: clean(e.args[1]),
            role: clean(e.args[2]),
            location,
            bullets: e.bullets,
          };
        })
    : oldData.experience;

  const leadershipExtracurricular = sections["LEADERSHIP & ACTIVITIES"]
    ? getEntries(sections["LEADERSHIP & ACTIVITIES"])
        .filter((e) => e.type === "full")
        .map((e, idx) => {
          const company = clean(e.args[0]);
          const location = clean(e.args[3]) || findOldLocation(oldData.leadershipExtracurricular, "company", company, idx);
          return {
            company,
            dates: clean(e.args[1]),
            role: clean(e.args[2]),
            location,
            bullets: e.bullets,
          };
        })
    : oldData.leadershipExtracurricular;

  const educationEntries = sections["EDUCATION"] ? getEntries(sections["EDUCATION"]) : [];
  const education = educationEntries.length
    ? {
        school: clean(educationEntries[0].args[0]),
        grad: `Expected Graduation: ${clean(educationEntries[0].args[1])}`,
        degree: clean(educationEntries[0].args[2]),
        city: clean(educationEntries[0].args[3]),
      }
    : oldData.education;

  const certifications = sections["CERTIFICATIONS"]
    ? findMacroCalls(sections["CERTIFICATIONS"], "certRow", 2).map((c) => ({
        title: clean(c.args[0]),
        date: clean(c.args[1]),
        detail: "",
      }))
    : oldData.certifications;

  const header = {
    ...oldData.header,
    nameLine: parsedHeader.name ? parsedHeader.name.toUpperCase() : oldData.header.nameLine,
    contacts: buildContacts(oldData.header.contacts, parsedHeader),
  };

  const merged = {
    sidebar: oldData.sidebar,
    header,
    summary,
    education,
    certifications,
    technicalSkills,
    projects,
    experience,
    leadershipExtracurricular,
  };

  fs.writeFileSync(JSON_PATH, JSON.stringify(merged, null, 2) + "\n");
  console.log(`Synced ${path.relative(ROOT, JSON_PATH)} from ${path.relative(ROOT, TEX_PATH)}`);
}

main();
