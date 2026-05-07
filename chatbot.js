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

  // Intents — ordered specific → general; greeting is the last-resort match.
  // Responses are lambdas so they always read the latest KB after fetch resolves.
  const intents = [
    {
      patterns: ["mealfinder", "meal finder", "spoonacular", "recipe app"],
      response: () => {
        const m = KB.projects.find((x) => /mealfinder/i.test(x.name));
        if (!m) return "MealFinder is David's iOS recipe app — details coming soon.";
        return `**${m.name}** (${m.tech})\n\n${m.desc}${m.link ? `\n\n<a href="${m.link}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">Watch the demo</a>` : ""}`;
      },
    },
    {
      patterns: ["project clean", "maintenance app", "school maintenance"],
      response: () => {
        const m = KB.projects.find((x) => /project clean/i.test(x.name));
        if (!m) return "Project Clean is a school-maintenance reporting platform.";
        return `**${m.name}** (${m.tech})\n\n${m.desc}${m.link ? `\n\n<a href="${m.link}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">Live site</a>` : ""}`;
      },
    },
    {
      patterns: ["cravers", "pizza", "add to cart"],
      response: () => {
        const m = KB.projects.find((x) => /cravers|pizza/i.test(x.name));
        if (!m) return "Cravers Pizza is a class project with cart + checkout.";
        return `**${m.name}** (${m.tech})\n\n${m.desc}${m.link ? `\n\n<a href="${m.link}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">Live site</a>` : ""}`;
      },
    },
    {
      patterns: ["hike", "hiking", "bear mountain", "bull hill", "mountain", "trail"],
      response: () => {
        const hikes = KB.journey.filter((j) => /hike|hill|bear mountain|trail/i.test(j.text));
        if (hikes.length) {
          return (
            `David loves hiking! Here's a snapshot:\n\n` +
            hikes
              .slice(0, 2)
              .map((h) => `**${h.date}**\n${truncate(h.text, 320)}`)
              .join("\n\n")
          );
        }
        return `David has hiked **Bull Hill** (1,400 ft) and **Bear Mountain** (1,473 ft).`;
      },
    },
    {
      patterns: ["recent", "recently", "what did you do", "lately", "this year", "this month", "story", "stories"],
      response: () => {
        if (!KB.journey.length) return "I don't have any recent stories on file yet.";
        const top = KB.journey.slice(0, 2);
        return (
          `Some of David's recent moments:\n\n` +
          top.map((j) => `**${j.date}**\n${truncate(j.text, 280)}`).join("\n\n")
        );
      },
    },
    {
      patterns: ["resume", "cv", "download"],
      response: () =>
        `You can <a href="${KB.resume}" download style="color:inherit;text-decoration:underline;font-weight:bold">download David's resume here</a>, or visit the **Resume** page for a full interactive view.`,
    },
    {
      patterns: ["phone", "number", "call", "phone number"],
      response: () => {
        if (!KB.phone) return `Best way to reach David is by **email**: ${KB.email}.`;
        return `📞 **Phone**: ${KB.phone}\n📧 **Email**: ${KB.email}`;
      },
    },
    {
      patterns: ["contact", "reach", "email", "hire", "recruiter", "get in touch", "message him"],
      response: () => {
        const lines = [`• 📧 **Email**: ${KB.email}`];
        if (KB.phone) lines.push(`• 📞 **Phone**: ${KB.phone}`);
        lines.push(`• 💼 **LinkedIn**: linkedin.com/in/davidyili`);
        lines.push(`• 🐙 **GitHub**: github.com/Davidyili230`);
        return `You can reach David at:\n\n${lines.join("\n")}\n\nOr use the **Contact** page on this site!`;
      },
    },
    {
      patterns: ["linkedin", "github", "instagram", "twitter", "facebook", "social", "socials", "links"],
      response: () => {
        if (!KB.socials.length) {
          return `Find David online:\n\n• 💼 **LinkedIn**: linkedin.com/in/davidyili\n• 🐙 **GitHub**: github.com/Davidyili230`;
        }
        return (
          `Find David online:\n\n` +
          KB.socials
            .map((s) => `• **${s.name[0].toUpperCase() + s.name.slice(1)}**: ${s.url}`)
            .join("\n")
        );
      },
    },
    {
      patterns: ["why david", "nickname", "real name", "yi li", "name come from", "name origin"],
      response: () => KB.whyDavid,
    },
    {
      patterns: ["project", "projects", "portfolio", "built", "what has he made", "ios", "apps"],
      response: () =>
        `David has built **${KB.projects.length} projects**:\n\n` +
        KB.projects
          .map((x) => {
            const link = x.link
              ? ` — <a href="${x.link}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">link</a>`
              : "";
            return `• **${x.name}** (${x.tech})${link}\n  ${x.desc}`;
          })
          .join("\n\n"),
    },
    {
      patterns: ["skill", "skills", "language", "languages", "tech", "stack", "framework", "frameworks", "tool", "tools", "programming"],
      response: () =>
        `David's technical skills:\n\n` +
        KB.technicalSkills.map((t) => `• **${t.label}**: ${t.value.trim()}`).join("\n"),
    },
    {
      patterns: ["coursework", "classes", "class taken", "courses taken", "courses"],
      response: () =>
        `Relevant coursework at Hunter College:\n\n` +
        KB.coursework.map((c) => `• ${c}`).join("\n"),
    },
    {
      patterns: ["certification", "certifications", "certificate", "codepath"],
      response: () => {
        if (!KB.certifications.length) return `No certifications recorded yet.`;
        return (
          `Certifications:\n\n` +
          KB.certifications.map((c) => `• **${c.title}** (${c.date})\n  ${c.detail || ""}`.trim()).join("\n\n")
        );
      },
    },
    {
      patterns: ["school", "college", "education", "study", "studies", "degree", "hunter", "graduate", "graduation", "major"],
      response: () => {
        const e = KB.education;
        return `David attends **${e.school}** in ${e.city || "Manhattan, NY"}, pursuing a **${e.degree}** (${e.grad}).`;
      },
    },
    {
      patterns: ["experience", "job", "jobs", "work", "intern", "internship", "employment", "receptionist", "camp counselor"],
      response: () => {
        const expLines = KB.experience.map((e) => `• **${e.role}** at ${e.company} (${e.dates})`).join("\n");
        const lead = KB.leadership.length
          ? `\n\nLeadership:\n` +
            KB.leadership.map((e) => `• **${e.role}** at ${e.company} (${e.dates})`).join("\n")
          : "";
        return `David's work experience:\n\n${expLines}${lead}`;
      },
    },
    {
      patterns: ["leadership", "club", "vp", "president", "cssa", "extracurricular", "organization"],
      response: () => {
        if (!KB.leadership.length) return `No leadership roles on record.`;
        return (
          `Leadership & extracurriculars:\n\n` +
          KB.leadership
            .map((e) => {
              const bullets = e.bullets?.length ? "\n  - " + e.bullets.slice(0, 2).join("\n  - ") : "";
              return `• **${e.role}** at ${e.company} (${e.dates})${bullets}`;
            })
            .join("\n\n")
        );
      },
    },
    {
      patterns: [
        "hobby",
        "hobbies",
        "fun",
        "enjoy",
        "free time",
        "interest",
        "interests",
        "like to do",
        "what does he like",
        "what do you like",
        "what does david like",
        "outside of work",
        "outside of coding",
        "for fun",
      ],
      response: () => {
        const list = KB.hobbies.map((h) => `• ${h}`).join("\n");
        const recent = KB.journey[0];
        const recentLine = recent
          ? `\n\nRecently (**${recent.date}**): ${truncate(recent.text, 220)}`
          : "";
        return `Outside of coding, David likes to:\n\n${list}${recentLine}`;
      },
    },
    {
      patterns: ["where does he live", "where is he", "where based", "location", "city", "where do you live"],
      response: () => `David is based in **${KB.location}**.`,
    },
    {
      patterns: ["who is david", "about david", "introduce", "tell me about david", "tell me about him", "yourself"],
      response: () => {
        const base = KB.intro || KB.about;
        return `${base}\n\nHe's based in ${KB.location}${KB.education?.grad ? `, ${KB.education.grad.toLowerCase()}` : ""}.`;
      },
    },
    {
      patterns: ["hello", "hi", "hey", "yo", "hiya", "howdy", "help", "what can you do", "menu", "options"],
      response: () =>
        `Hi! 👋 I'm David's assistant. I can tell you about his **projects**, **skills**, **education**, **experience**, **hobbies**, or how to **contact** him. What would you like to know?`,
    },
  ];

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function patternMatches(pattern, msg) {
    const re = new RegExp("(^|[^a-z0-9])" + escapeRegex(pattern) + "([^a-z0-9]|$)", "i");
    return re.test(msg);
  }

  function getResponse(input) {
    const msg = input.toLowerCase().trim();
    let best = null;
    let bestScore = 0;
    for (const intent of intents) {
      let score = 0;
      for (const p of intent.patterns) {
        if (patternMatches(p, msg)) score += p.length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = intent;
      }
    }
    if (best) return best.response();
    return `I'm not sure about that! Try one of the buttons below, or ask about David's **projects**, **skills**, **hobbies**, **education**, **experience**, or **contact info**. 😊`;
  }

  function formatBotText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

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
        "Hi! 👋 I'm David's assistant. Ask me about his projects, skills, hobbies, education, or how to reach him!";
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
