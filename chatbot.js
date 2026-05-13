(function () {
  // Fallback data — used if fetch fails (e.g. opened via file://).
  const DEFAULT_KB = {
    name: "Yi 'David' Li",
    about:
      "David (Yi Li) is a computer science student at Hunter College focused on building practical software. He primarily works with C++ and JavaScript, developing a strong foundation in data structures, algorithms, and OOP.",
    location: "Brooklyn, NY",
    email: "Davidyili230@gmail.com",
    phone: null,
    github: "https://github.com/Davidyili230",
      linkedin: "https://www.linkedin.com/in/davidyili/",
    resume: "downloads/Yi_Li__David__Resume.pdf",
    whyDavid:
      "David's real name is Yi Li. Back in elementary school, teachers and students constantly mispronounced it as 'Yee' instead of 'Ee'. His mom's American friend suggested 'David' as an easy alternative. The name stuck through high school — so much so that many close friends didn't find out his real name was Yi until graduation!",
    intro: null,
    education: {
      school: "Hunter College",
      grad: "Expected Graduation: June 2026",
      degree: "Bachelor of Art in Computer Science",
      city: "Manhattan, NY",
    },
    coursework: [
      "Data Structures",
      "Algorithms Analysis",
      "Operating Systems",
      "Web Development",
      "iOS Development",
      "Database Management",
    ],
    certifications: [],
    technicalSkills: [
      { label: "Programming", value: "Python, C++, JavaScript, Swift" },
      { label: "Frameworks", value: "HTML/CSS, React.js, Node.js, SwiftUI" },
      { label: "Tools", value: "Git/GitHub, Firebase, Cloudinary" },
    ],
    projects: [
      { name: "Personal Website", tech: "HTML, CSS, JavaScript", desc: "A portfolio recording his journey as a first-gen college student — showcasing projects, resume, and skills." },
      { name: "MealFinder (iOS)", tech: "Swift, SwiftUI, Spoonacular API", desc: "iOS app that searches meals by ingredient and shows recipe details using MVVM architecture." },
      { name: "Project Clean", tech: "React, Tailwind, Firebase", desc: "Web app for reporting school maintenance issues with multi-user authorization and live-time updates." },
      { name: "Cravers Pizza", tech: "React, Node.js", desc: "Pizza restaurant site with a slideshow, add-to-cart, and checkout calculation — built for a web dev class." },
    ],
    experience: [
      { role: "Medical Receptionist / IT Support", company: "Zhang and Cheng Medical P.C.", dates: "Jan 2022 – Present" },
      { role: "Summer Camp Counselor", company: "Kings Bay JCC Brooklyn", dates: "July – Sept 2021" },
    ],
    leadership: [
      { role: "Vice President", company: "Hunter Chinese Student & Scholar Association (CSSA)", dates: "Feb 2024 – Present" },
    ],
    hobbies: [
      "Exploring NYC for new food spots",
      "Traveling and spending time in nature",
      "Gaming with friends at night",
      "Playing pool with close friends",
    ],
    journey: [],
    socials: [
      { name: "github", url: "https://github.com/Davidyili230" },
      { name: "linkedin", url: "https://www.linkedin.com/in/davidyili/" },
    ],
  };

  let KB = DEFAULT_KB;

  async function loadData() {
    const sources = {
      about: "data/about.json",
      projects: "data/projects.json",
      resume: "data/resume.json",
      sidebar: "data/sidebar.json",
    };
    const out = {};
    await Promise.all(
      Object.entries(sources).map(async ([key, path]) => {
        try {
          const r = await fetch(path, { cache: "default" });
          if (r.ok) out[key] = await r.json();
        } catch {
          /* ignore — fall back to defaults */
        }
      })
    );
    return out;
  }

  function mergeKB(data) {
    const kb = { ...DEFAULT_KB };
    const a = data.about;
    const p = data.projects;
    const r = data.resume;
    const s = data.sidebar;

    if (a?.profile?.email) kb.email = a.profile.email;
    if (a?.profile?.name) kb.name = a.profile.name;
    if (a?.sidebarAbout) kb.about = a.sidebarAbout;
    if (a?.sections?.intro) {
      kb.intro = [a.sections.intro.p1, a.sections.intro.p2, a.sections.intro.p3]
        .filter(Boolean)
        .join("\n\n");
    }
    if (Array.isArray(a?.sections?.whyDavid?.p)) {
      kb.whyDavid = a.sections.whyDavid.p.join("\n\n");
    }
    if (Array.isArray(a?.sections?.hobbies?.items)) {
      kb.hobbies = a.sections.hobbies.items;
    }
    if (Array.isArray(a?.sections?.journey?.items)) {
      kb.journey = a.sections.journey.items;
    }

    if (Array.isArray(p?.projects)) {
      kb.projects = p.projects.map((x) => ({
        name: x.title,
        tech: Array.isArray(x.tech) ? x.tech.join(", ") : x.tech || "",
        desc: x.description || "",
        link: x.link || "",
        status: x.status || "",
        updated: x.updated || "",
      }));
    }

    if (r?.education) kb.education = r.education;
    if (Array.isArray(r?.coursework)) kb.coursework = r.coursework;
    if (Array.isArray(r?.certifications)) kb.certifications = r.certifications;
    if (Array.isArray(r?.technicalSkills)) kb.technicalSkills = r.technicalSkills;
    if (Array.isArray(r?.experience)) {
      kb.experience = r.experience.map((e) => ({
        role: e.role,
        company: e.company,
        dates: e.dates,
        location: e.location,
        bullets: e.bullets || [],
      }));
    }
    if (Array.isArray(r?.leadershipExtracurricular)) {
      kb.leadership = r.leadershipExtracurricular.map((e) => ({
        role: e.role,
        company: e.company,
        dates: e.dates,
        bullets: e.bullets || [],
      }));
    }
    if (r?.header?.location) kb.location = r.header.location;
    if (Array.isArray(r?.header?.contacts)) {
      const phone = r.header.contacts.find((c) => c.alt === "phone");
      if (phone?.text) kb.phone = phone.text;
    }

    if (Array.isArray(s?.socials)) kb.socials = s.socials;
    return kb;
  }

  function truncate(s, n) {
    if (!s) return "";
    return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
  }

  // Page paths
  const P = {
    home: "index.html",
    about: "about.html",
    resume: "resume.html",
    projects: "projects.html",
    contact: "contact.html",
  };

  function linkTo(label, href) {
    return `<a href="${href}" style="color:inherit;text-decoration:underline;font-weight:600">${label} →</a>`;
  }

  function ext(label, href) {
    return `<a href="${href}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;font-weight:600">${label}</a>`;
  }

  function more(label, href) {
    return `\n\n${linkTo(`More on ${label}`, href)}`;
  }

  // ======================== Knowledge base — facts (intents) ========================
  // Each fact: keywords (trigger words/phrases), response (short answer + page link).
  // Ordered specific → general; greeting last.
  function buildIntents() {
    return [
      // ---- Identity ----
      {
        keywords: ["who is david", "who is yi", "who are you", "introduce yourself", "tell me about david", "tell me about yourself", "tell me about him", "yourself", "introduce david", "describe david", "describe yourself"],
        response: () =>
          `David (Yi Li) is a CS student at ${KB.education.school}, ${KB.education.grad.replace("Expected Graduation: ", "graduating ")}. Based in ${KB.location}.${more("his story", P.about)}`,
      },
      {
        keywords: ["why david", "nickname", "real name", "yi li", "name origin", "name come from", "called david", "why david name", "name story"],
        response: () =>
          `His real name is Yi — pronounced "Ee." Mispronunciation in elementary school led his mom's friend to suggest "David."${more("the full story", `${P.about}#Question`)}`,
      },
      {
        keywords: ["name", "first name", "last name", "full name", "real name", "actual name"],
        response: () =>
          `**${KB.name}** — most people call him David, but his legal name is Yi Li.${more("About", `${P.about}#Question`)}`,
      },
      {
        keywords: ["location", "live", "lives", "based", "city", "where is he", "where do you live", "where are you", "from", "brooklyn", "nyc", "new york"],
        response: () => `David is based in **${KB.location}**.${more("Contact", P.contact)}`,
      },
      {
        keywords: ["age", "old", "year in school", "what year"],
        response: () =>
          `David is a senior at Hunter — ${KB.education.grad.replace("Expected Graduation: ", "graduating ")}.${more("Resume", P.resume)}`,
      },

      // ---- Education ----
      {
        keywords: ["school", "schools", "college", "university", "education", "study", "studies", "studied", "degree", "hunter", "major", "graduate", "graduation", "when graduating", "when do you graduate", "attended", "attend"],
        response: () => {
          const e = KB.education;
          return `${e.degree} at **${e.school}** (${e.city || "Manhattan, NY"}). ${e.grad}.${more("Resume", P.resume)}`;
        },
      },
      {
        keywords: ["coursework", "classes", "courses", "class taken", "courses taken", "course", "subjects", "what classes"],
        response: () =>
          `Relevant coursework: ${KB.coursework.slice(0, 4).join(", ")} and more.${more("the full list on Resume", P.resume)}`,
      },
      {
        keywords: ["certification", "certifications", "certificate", "codepath", "cert"],
        response: () => {
          if (!KB.certifications.length) return `No certifications on file yet.${more("Resume", P.resume)}`;
          const c = KB.certifications[0];
          return `**${c.title}** (${c.date}) — ${c.detail || ""}${more("Resume", P.resume)}`;
        },
      },

      // ---- Skills ----
      {
        keywords: ["skill", "skills", "language", "languages", "tech", "stack", "tech stack", "framework", "frameworks", "tool", "tools", "programming", "what can you code", "what do you code", "what languages"],
        response: () => {
          const lang = KB.technicalSkills.find((t) => /programming/i.test(t.label))?.value?.trim();
          const fw = KB.technicalSkills.find((t) => /framework/i.test(t.label))?.value?.trim();
          return `**Languages**: ${lang}\n**Frameworks**: ${fw}${more("Resume", P.resume)}`;
        },
      },
      {
        keywords: ["python", "c++", "cpp", "javascript", "swift", "do you know"],
        response: () =>
          `Yes — David codes in **Python, C++, JavaScript, and Swift**.${more("Resume", P.resume)}`,
      },
      {
        keywords: ["react", "node", "node.js", "swiftui", "firebase", "tailwind", "cloudinary", "html", "css"],
        response: () =>
          `He works with **React, Node.js, SwiftUI, Firebase, Tailwind**, and Cloudinary.${more("Resume", P.resume)}`,
      },

      // ---- Individual projects ----
      {
        keywords: ["mealfinder", "meal finder", "spoonacular", "recipe app", "recipes"],
        response: () => {
          const m = KB.projects.find((x) => /mealfinder/i.test(x.name));
          if (!m) return `MealFinder is David's iOS recipe app.${more("Projects", P.projects)}`;
          return `**${m.name}** (${m.tech}). ${truncate(m.desc, 140)}${m.link ? `\n\n${ext("Watch demo", m.link)}` : ""}${more("all projects", P.projects)}`;
        },
      },
      {
        keywords: ["project clean", "maintenance app", "school maintenance"],
        response: () => {
          const m = KB.projects.find((x) => /project clean/i.test(x.name));
          if (!m) return `Project Clean is a school-maintenance reporting app.${more("Projects", P.projects)}`;
          return `**${m.name}** (${m.tech}). ${truncate(m.desc, 140)}${m.link ? `\n\n${ext("Live site", m.link)}` : ""}${more("all projects", P.projects)}`;
        },
      },
      {
        keywords: ["cravers", "pizza"],
        response: () => {
          const m = KB.projects.find((x) => /cravers|pizza/i.test(x.name));
          if (!m) return `Cravers Pizza is a class project with cart + checkout.${more("Projects", P.projects)}`;
          return `**${m.name}** (${m.tech}). ${truncate(m.desc, 140)}${m.link ? `\n\n${ext("Live site", m.link)}` : ""}${more("all projects", P.projects)}`;
        },
      },
      {
        keywords: ["companion care", "companion"],
        response: () => {
          const m = KB.projects.find((x) => /companion/i.test(x.name));
          if (!m) return `Companion Care is a web app connecting users with care services.${more("Projects", P.projects)}`;
          return `**${m.name}** (${m.tech}). ${truncate(m.desc, 140)}${m.link ? `\n\n${ext("Live site", m.link)}` : ""}${more("all projects", P.projects)}`;
        },
      },
      {
        keywords: ["personal website", "this site", "this website", "portfolio site", "this portfolio"],
        response: () => {
          const m = KB.projects.find((x) => /personal website/i.test(x.name));
          if (!m) return `This site is David's portfolio.${more("Projects", P.projects)}`;
          return `**${m.name}** (${m.tech}). ${truncate(m.desc, 140)}${more("all projects", P.projects)}`;
        },
      },
      {
        keywords: ["project", "projects", "portfolio", "built", "what has he made", "what have you built", "what did you build", "ios", "apps", "side projects"],
        response: () => {
          const list = KB.projects
            .slice(0, 5)
            .map((p) => `• **${p.name}**${p.link ? ` — ${ext("link", p.link)}` : ""}`)
            .join("\n");
          return `David has built **${KB.projects.length} projects**:\n${list}${more("the projects page", P.projects)}`;
        },
      },

      // ---- Experience / Work ----
      {
        keywords: ["experience", "job", "jobs", "work", "intern", "internship", "employment", "career"],
        response: () => {
          const lines = KB.experience.map((e) => `• **${e.role}** at ${e.company} (${e.dates})`).join("\n");
          return `Work experience:\n${lines}${more("Resume", P.resume)}`;
        },
      },
      {
        keywords: ["receptionist", "zhang", "cheng", "medical", "clinic", "it support", "current job"],
        response: () => {
          const e = KB.experience.find((x) => /medical|receptionist/i.test(`${x.role} ${x.company}`));
          if (!e) return `David is a medical receptionist & IT support.${more("Resume", P.resume)}`;
          return `**${e.role}** at ${e.company} (${e.dates}). Handles patient intake, EHR, and IT support.${more("Resume", P.resume)}`;
        },
      },
      {
        keywords: ["camp", "counselor", "summer", "kings bay", "jcc", "syep"],
        response: () => {
          const e = KB.experience.find((x) => /camp/i.test(x.role));
          if (!e) return `Worked as a summer camp counselor in 2021.${more("Resume", P.resume)}`;
          return `**${e.role}** at ${e.company} (${e.dates}). Supervised 25+ campers daily.${more("Resume", P.resume)}`;
        },
      },

      // ---- Leadership ----
      {
        keywords: ["leadership", "club", "clubs", "vp", "vice president", "president", "cssa", "chinese student", "extracurricular", "organization", "board"],
        response: () => {
          if (!KB.leadership.length) return `No leadership roles on record.${more("Resume", P.resume)}`;
          const l = KB.leadership[0];
          return `**${l.role}** at ${l.company} (${l.dates}). Leads a 20+ member exec board planning campus events.${more("Resume", P.resume)}`;
        },
      },

      // ---- Hobbies / Interests ----
      {
        keywords: ["hobby", "hobbies", "fun", "enjoy", "free time", "interest", "interests", "like to do", "what does he like", "what do you like", "what does david like", "outside of work", "outside of coding", "for fun", "passion", "passions"],
        response: () => {
          const items = KB.hobbies.slice(0, 4).map((h) => `• ${h.replace(/\.$/, "")}`).join("\n");
          return `Outside of coding, David likes to:\n${items}${more("his story on About", `${P.about}#Hobbies`)}`;
        },
      },
      {
        keywords: ["food", "nyc food", "restaurant", "restaurants", "eat", "eating", "cuisine", "foodie"],
        response: () =>
          `David loves exploring NYC for new food spots — hotpot in Flushing, Friendsgiving feasts, and Raising Cane's reunions show up in his journal.${more("the journey on About", `${P.about}#Journey`)}`,
      },
      {
        keywords: ["pool", "billiards"],
        response: () =>
          `He plays pool with close friends at night to unwind.${more("his hobbies", `${P.about}#Hobbies`)}`,
      },
      {
        keywords: ["game", "gaming", "games", "play games", "video game", "video games"],
        response: () =>
          `David games with friends at night — his way to relax and laugh.${more("his hobbies", `${P.about}#Hobbies`)}`,
      },
      {
        keywords: ["travel", "trip", "trips", "vacation", "nature", "outdoor"],
        response: () =>
          `He likes traveling to new places, spending time in nature, and has done resort trips with friends.${more("the journey", `${P.about}#Journey`)}`,
      },

      // ---- Hiking ----
      {
        keywords: ["hike", "hiking", "bear mountain", "bull hill", "mountain", "trail", "hiked", "summit"],
        response: () =>
          `David has hiked **Bull Hill** (1,400 ft, Apr 2025) and **Bear Mountain** (1,473 ft, Jul 2025) — the latter took 5 hours with deer sightings along the way.${more("the full stories", `${P.about}#Journey`)}`,
      },

      // ---- Specific journey events ----
      {
        keywords: ["hotpot", "secret santa", "badminton", "christmas hangout", "club hangout", "flushing"],
        response: () =>
          `**Dec 23, 2025** — David's club celebrated Christmas with badminton, Secret Santa, and hotpot in Flushing. The guys finished 21 plates of meat.${more("the full story", `${P.about}#Journey`)}`,
      },
      {
        keywords: ["friendsgiving", "thanksgiving"],
        response: () =>
          `**Nov 30, 2025** — His first-ever Friendsgiving. He cooked a perfect medium steak and played Mafia with new friends.${more("the full story", `${P.about}#Journey`)}`,
      },
      {
        keywords: ["raising cane", "high school friends", "reunion", "old friends"],
        response: () =>
          `**Aug 10, 2025** — He met two high school friends after 4 years at Raising Cane's. They caught up like nothing had changed.${more("the full story", `${P.about}#Journey`)}`,
      },
      {
        keywords: ["kalahari", "resort", "water park"],
        response: () =>
          `**Aug 2024** — David and 3 friends took a 2-day trip to Kalahari Resort — water slides, snacks, and a memorable ding-dong-ditch.${more("the full story", `${P.about}#Journey`)}`,
      },

      // ---- Recent / stories ----
      {
        keywords: ["recent", "recently", "lately", "this year", "this month", "what have you been up to", "story", "stories", "journey", "what did you do", "diary", "journal"],
        response: () => {
          if (!KB.journey.length) return `No journal entries available yet.${more("About", `${P.about}#Journey`)}`;
          const top = KB.journey[0];
          return `Most recently (**${top.date}**): ${truncate(top.text, 200)}${more("more stories on About", `${P.about}#Journey`)}`;
        },
      },

      // ---- Resume / CV ----
      {
        keywords: ["resume", "cv", "download resume", "download", "pdf"],
        response: () =>
          `<a href="${KB.resume}" download style="color:inherit;text-decoration:underline;font-weight:600">Download his resume (PDF) →</a>${more("the full Resume page", P.resume)}`,
      },

      // ---- Contact ----
      {
        keywords: ["phone", "phone number", "call him", "number", "telephone"],
        response: () => {
          if (!KB.phone) return `Best way to reach David is by email: **${KB.email}**.${more("Contact", P.contact)}`;
          return `📞 **${KB.phone}**\n📧 **${KB.email}**${more("Contact", P.contact)}`;
        },
      },
      {
        keywords: ["email", "e-mail", "gmail", "mail him"],
        response: () =>
          `📧 **${KB.email}**${more("the Contact form", P.contact)}`,
      },
      {
        keywords: ["contact", "reach", "hire", "recruiter", "get in touch", "message him", "send a message", "how to contact"],
        response: () => {
          const lines = [`📧 ${KB.email}`];
          if (KB.phone) lines.push(`📞 ${KB.phone}`);
          lines.push(`💼 linkedin.com/in/davidyili`);
          lines.push(`🐙 github.com/Davidyili230`);
          return `Reach David at:\n${lines.join("\n")}${more("the Contact form", P.contact)}`;
        },
      },
      {
        keywords: ["linkedin"],
        response: () => {
          const li = KB.socials.find((s) => s.name === "linkedin");
          return `💼 ${ext("linkedin.com/in/davidyili", li?.url || "https://www.linkedin.com/in/davidyili/")}${more("Contact", P.contact)}`;
        },
      },
      {
        keywords: ["github", "git"],
        response: () => {
          const gh = KB.socials.find((s) => s.name === "github");
          return `🐙 ${ext("github.com/Davidyili230", gh?.url || "https://github.com/Davidyili230")}${more("Projects", P.projects)}`;
        },
      },
      {
        keywords: ["instagram", "ig", "insta"],
        response: () => {
          const ig = KB.socials.find((s) => s.name === "instagram");
          if (!ig) return `David's Instagram isn't listed.${more("Contact", P.contact)}`;
          return `📷 ${ext(ig.url.replace(/^https?:\/\/(www\.)?/, ""), ig.url)}`;
        },
      },
      {
        keywords: ["facebook", "fb"],
        response: () => {
          const fb = KB.socials.find((s) => s.name === "facebook");
          if (!fb) return `David's Facebook isn't listed.${more("Contact", P.contact)}`;
          return `${ext(fb.url.replace(/^https?:\/\/(www\.)?/, ""), fb.url)}`;
        },
      },
      {
        keywords: ["twitter", "x.com"],
        response: () => {
          const t = KB.socials.find((s) => s.name === "twitter");
          if (!t) return `David's Twitter/X isn't listed.${more("Contact", P.contact)}`;
          return `${ext(t.url.replace(/^https?:\/\//, ""), t.url)}`;
        },
      },
      {
        keywords: ["social", "socials", "links", "online", "find you", "find him"],
        response: () =>
          `Find David online:\n${KB.socials
            .map((s) => `• **${s.name[0].toUpperCase() + s.name.slice(1)}**: ${ext(s.url.replace(/^https?:\/\/(www\.)?/, ""), s.url)}`)
            .join("\n")}${more("Contact", P.contact)}`,
      },

      // ---- Greeting / Help ----
      {
        keywords: ["hello", "hi", "hey", "yo", "hiya", "howdy", "help", "what can you do", "menu", "options", "start", "begin"],
        response: () =>
          `Hi! 👋 I'm David's assistant. Ask me about his **projects**, **skills**, **education**, **experience**, **hobbies**, **stories**, or how to **contact** him.`,
      },
    ];
  }

  // ======================== Fuzzy search corpus (fallback) ========================
  // If no intent matches confidently, scan free-text content across all pages for
  // the best snippet to return, with a link to the source page.
  function buildCorpus() {
    const docs = [];

    KB.journey.forEach((j) => {
      docs.push({
        text: j.text,
        prefix: `**${j.date}**`,
        page: `${P.about}#Journey`,
        label: "About — Journey",
      });
    });

    KB.projects.forEach((p) => {
      docs.push({
        text: `${p.name} ${p.tech} ${p.desc}`,
        prefix: `**${p.name}** (${p.tech})`,
        page: P.projects,
        label: "Projects",
        link: p.link,
      });
    });

    KB.experience.forEach((e) => {
      docs.push({
        text: `${e.role} ${e.company} ${(e.bullets || []).join(" ")}`,
        prefix: `**${e.role}** at ${e.company}`,
        page: P.resume,
        label: "Resume",
      });
    });

    KB.leadership.forEach((e) => {
      docs.push({
        text: `${e.role} ${e.company} ${(e.bullets || []).join(" ")}`,
        prefix: `**${e.role}** at ${e.company}`,
        page: P.resume,
        label: "Resume",
      });
    });

    KB.hobbies.forEach((h) => {
      docs.push({ text: h, prefix: `Hobby`, page: `${P.about}#Hobbies`, label: "About — Hobbies" });
    });

    if (KB.intro) docs.push({ text: KB.intro, prefix: `About David`, page: `${P.about}#Intro`, label: "About" });
    if (KB.whyDavid) docs.push({ text: KB.whyDavid, prefix: `Why "David"?`, page: `${P.about}#Question`, label: "About" });
    if (KB.about) docs.push({ text: KB.about, prefix: `About David`, page: P.about, label: "About" });

    KB.coursework.forEach((c) => {
      docs.push({ text: c, prefix: `Coursework`, page: P.resume, label: "Resume" });
    });

    KB.technicalSkills.forEach((t) => {
      docs.push({ text: `${t.label} ${t.value}`, prefix: `**${t.label}**`, page: P.resume, label: "Resume" });
    });

    return docs;
  }

  const STOPWORDS = new Set(
    "a an and any are as at be been being but by can could did do does doing for from get got had has have he her him his how i if in into is it its just like me my of on or our s she should so some such t than that the their them then there these they this those to too us was we were what when where which who why will with would you your yours yourself".split(
      " "
    )
  );

  function tokenize(s) {
    return (s.toLowerCase().match(/[a-z0-9'+#]+/g) || [])
      .map((t) => t.replace(/^'+|'+$/g, ""))
      .filter((t) => t && !STOPWORDS.has(t) && t.length > 1);
  }

  function fuzzySearch(query) {
    const qTokens = tokenize(query);
    if (!qTokens.length) return null;
    const corpus = buildCorpus();
    let best = null;
    let bestScore = 0;
    for (const doc of corpus) {
      const docText = doc.text.toLowerCase();
      const docTokens = new Set(tokenize(doc.text));
      let score = 0;
      for (const q of qTokens) {
        if (docTokens.has(q)) {
          score += 2; // exact token match
        } else if (docText.includes(q)) {
          score += 1; // substring match (handles plural/stems loosely)
        }
      }
      if (score > bestScore) {
        bestScore = score;
        best = doc;
      }
    }
    if (bestScore < 2) return null; // need at least one solid token hit
    return best;
  }

  // ======================== Matching / response ========================
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function patternMatches(pattern, msg) {
    const re = new RegExp("(^|[^a-z0-9])" + escapeRegex(pattern) + "([^a-z0-9]|$)", "i");
    return re.test(msg);
  }

  function getResponse(input) {
    const msg = input.toLowerCase().trim();

    // 1) Intent matching — best-scoring fact wins.
    const intents = buildIntents();
    let best = null;
    let bestScore = 0;
    for (const intent of intents) {
      let score = 0;
      for (const k of intent.keywords) {
        if (patternMatches(k, msg)) score += k.length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    }
    if (best && bestScore >= 3) return best.response();

    // 2) Fuzzy fallback — free-text search across all KB content.
    const hit = fuzzySearch(input);
    if (hit) {
      const linkRow = hit.link
        ? `\n\n${ext("Open link", hit.link)} · ${linkTo(`More on ${hit.label}`, hit.page)}`
        : `\n\n${linkTo(`More on ${hit.label}`, hit.page)}`;
      return `${hit.prefix}: ${truncate(hit.text, 200)}${linkRow}`;
    }

    // 3) Default.
    return `I'm not sure about that one! Try asking about David's **projects**, **skills**, **hobbies**, **education**, **experience**, **stories**, or **contact info**. 😊`;
  }

  function formatBotText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  // ======================== Widget UI ========================
  const MAX_INPUT_LEN = 300;
  const HISTORY_KEY = "davidChatHistory";
  const HISTORY_MAX = 40;

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-HISTORY_MAX)));
    } catch {
      /* quota or disabled storage — silently skip */
    }
  }

  function createWidget() {
    // Kick off data load in the background; KB updates as soon as it resolves.
    loadData().then((data) => {
      KB = mergeKB(data);
    });

    const widget = document.createElement("div");
    widget.id = "chat-widget";

    const bubble = document.createElement("button");
    bubble.className = "chat-bubble-btn";
    bubble.setAttribute("aria-label", "Open chat assistant");
    bubble.setAttribute("aria-expanded", "false");
    bubble.setAttribute("aria-controls", "chat-window");
    bubble.innerHTML = "💬";

    const chatWin = document.createElement("div");
    chatWin.className = "chat-window";
    chatWin.id = "chat-window";
    chatWin.setAttribute("role", "dialog");
    chatWin.setAttribute("aria-label", "Chat with David's assistant");

    const header = document.createElement("div");
    header.className = "chat-header";
    header.innerHTML = `
      <div class="chat-header-info">
        <img src="img/potrait.jpg" class="chat-avatar" alt="David Li">
        <div>
          <div style="font-size:14px;font-weight:bold">David's Assistant</div>
          <div style="font-size:11px;opacity:0.75;font-weight:normal">Ask me anything about David</div>
        </div>
      </div>
      <button class="chat-close-btn" aria-label="Close chat">✕</button>
    `;

    const msgs = document.createElement("div");
    msgs.className = "chat-messages";
    msgs.setAttribute("role", "log");
    msgs.setAttribute("aria-live", "polite");

    const quickReplies = document.createElement("div");
    quickReplies.className = "quick-replies";
    ["About David", "Projects", "Hobbies", "Contact"].forEach((label) => {
      const btn = document.createElement("button");
      btn.className = "quick-reply-btn";
      btn.textContent = label;
      btn.addEventListener("click", () => sendMessage(label));
      quickReplies.appendChild(btn);
    });

    const inputArea = document.createElement("div");
    inputArea.className = "chat-input-area";
    const input = document.createElement("input");
    input.className = "chat-input";
    input.type = "text";
    input.placeholder = "Ask something...";
    input.maxLength = MAX_INPUT_LEN;
    input.setAttribute("aria-label", "Chat message input");
    const sendBtn = document.createElement("button");
    sendBtn.className = "chat-send-btn";
    sendBtn.setAttribute("aria-label", "Send message");
    sendBtn.innerHTML = "&#10148;";
    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);

    chatWin.appendChild(header);
    chatWin.appendChild(msgs);
    chatWin.appendChild(quickReplies);
    chatWin.appendChild(inputArea);
    widget.appendChild(chatWin);
    widget.appendChild(bubble);
    document.body.appendChild(widget);

    let history = loadHistory();
    let isResponding = false;
    let typingEl = null;

    if (history.length === 0) {
      const greeting =
        "Hi! 👋 I'm David's assistant. Ask me anything — projects, skills, education, experience, hobbies, stories, or how to reach him!";
      history.push({ text: greeting, type: "bot" });
      saveHistory(history);
    }
    history.forEach((m) => renderMessage(m.text, m.type));

    function setOpen(open) {
      chatWin.classList.toggle("open", open);
      bubble.innerHTML = open ? "✕" : "💬";
      bubble.setAttribute("aria-label", open ? "Close chat assistant" : "Open chat assistant");
      bubble.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) setTimeout(() => input.focus(), 200);
    }

    bubble.addEventListener("click", () => {
      setOpen(!chatWin.classList.contains("open"));
    });

    header.querySelector(".chat-close-btn").addEventListener("click", () => {
      setOpen(false);
      bubble.focus();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && chatWin.classList.contains("open")) {
        setOpen(false);
        bubble.focus();
      }
    });

    sendBtn.addEventListener("click", submit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });

    function submit() {
      if (isResponding) return;
      const val = input.value.trim();
      if (!val) return;
      input.value = "";
      sendMessage(val);
    }

    function renderMessage(text, type) {
      const div = document.createElement("div");
      div.className = `chat-message ${type}`;
      if (type === "user") {
        div.textContent = text;
      } else {
        div.innerHTML = formatBotText(text);
      }
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function addMessage(text, type) {
      renderMessage(text, type);
      history.push({ text, type });
      saveHistory(history);
    }

    function showTyping() {
      if (typingEl) return typingEl;
      const el = document.createElement("div");
      el.className = "typing-indicator";
      el.setAttribute("aria-label", "Assistant is typing");
      el.innerHTML =
        '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      typingEl = el;
      return el;
    }

    function sendMessage(text) {
      if (isResponding) return;
      const trimmed = text.slice(0, MAX_INPUT_LEN);
      addMessage(trimmed, "user");
      isResponding = true;
      input.disabled = true;
      sendBtn.disabled = true;
      showTyping();
      const delay = 600 + Math.random() * 400;
      setTimeout(() => {
        if (typingEl) {
          typingEl.remove();
          typingEl = null;
        }
        addMessage(getResponse(trimmed), "bot");
        isResponding = false;
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
      }, delay);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
