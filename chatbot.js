(function () {
  const KB = {
    about: "David (Yi Li) is a computer science student at Hunter College focused on building practical software. He primarily works with C++ and JavaScript, developing a strong foundation in data structures, algorithms, and OOP.",
    location: "Brooklyn, NY",
    email: "Davidyili230@gmail.com",
    github: "https://github.com/Davidyili230",
    linkedin: "https://www.linkedin.com/in/davidyili/",
    resume: "downloads/Yi_Li__David__Resume.pdf",
    whyDavid: "David's real name is Yi Li. Back in elementary school, teachers and students constantly mispronounced it as 'Yee' instead of 'Ee'. His mom's American friend suggested 'David' as an easy alternative. The name stuck through high school — so much so that many close friends didn't find out his real name was Yi until graduation!",
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
    hobbies: [
      "Exploring NYC for new food spots",
      "Traveling and spending time in nature",
      "Gaming with friends at night",
      "Playing pool with close friends",
    ],
  };

  const intents = [
    {
      patterns: ["hello", "hi", "hey", "start", "help", "what can"],
      response: () => `Hi! 👋 I'm David's assistant. I can tell you about his **projects**, **skills**, **education**, **experience**, or how to **contact** him. What would you like to know?`,
    },
    {
      patterns: ["who is", "about david", "introduce", "tell me about", "yourself"],
      response: () => `${KB.about}\n\nHe's based in ${KB.location} and expected to graduate June 2026. He's also VP of the Hunter Chinese Student & Scholar Association.`,
    },
    {
      patterns: ["why david", "nickname", "real name", "yi li", "name come from"],
      response: () => KB.whyDavid,
    },
    {
      patterns: ["project", "built", "portfolio", "made", "website", "ios", "app"],
      response: () =>
        `David has built **${KB.projects.length} projects**:\n\n` +
        KB.projects.map((p) => `• **${p.name}** (${p.tech})\n  ${p.desc}`).join("\n\n"),
    },
    {
      patterns: ["skill", "language", "tech", "stack", "know", "program", "framework", "tool"],
      response: () =>
        `David's technical skills:\n\n• **Programming**: Python, C++, JavaScript, Swift\n• **Frameworks**: HTML/CSS, React.js, Node.js, SwiftUI\n• **Tools**: Git/GitHub, Firebase, Cloudinary`,
    },
    {
      patterns: ["school", "college", "education", "study", "degree", "hunter", "graduate", "coursework", "class"],
      response: () =>
        `David attends **Hunter College** in Manhattan, pursuing a **BA in Computer Science** (expected June 2026). Relevant courses include Data Structures, Algorithms, Operating Systems, Web Development, iOS Development, and Database Management.`,
    },
    {
      patterns: ["experience", "job", "work", "intern", "employ", "receptionist", "camp"],
      response: () =>
        `David's work experience:\n\n` +
        KB.experience.map((e) => `• **${e.role}** at ${e.company} (${e.dates})`).join("\n") +
        `\n\nHe's also **VP of Hunter's CSSA**, leading 20+ board members and organizing events with 50+ attendees.`,
    },
    {
      patterns: ["contact", "reach", "email", "hire", "recruiter", "message", "get in touch"],
      response: () =>
        `You can reach David at:\n\n• 📧 **Email**: ${KB.email}\n• 💼 **LinkedIn**: linkedin.com/in/davidyili\n• 🐙 **GitHub**: github.com/Davidyili230\n\nOr use the **Contact** page on this site!`,
    },
    {
      patterns: ["resume", "cv", "download"],
      response: () =>
        `You can <a href="${KB.resume}" download style="color:inherit;text-decoration:underline;font-weight:bold">download David's resume here</a>, or visit the **Resume** page for a full interactive view.`,
    },
    {
      patterns: ["hobby", "hobbies", "fun", "enjoy", "free time", "outside", "interest"],
      response: () =>
        `Outside of coding, David enjoys:\n\n` +
        KB.hobbies.map((h) => `• ${h}`).join("\n"),
    },
    {
      patterns: ["hike", "hiking", "bear mountain", "bull hill", "nature", "mountain"],
      response: () =>
        `David loves hiking! He's completed **Bull Hill** (1,400 ft) and the challenging **Bear Mountain** (1,473 ft). On Bear Mountain, his group even got lost, stumbled upon deer, and found walking sticks left by a stranger — totally worth it!`,
    },
    {
      patterns: ["swift", "mealfinder", "meal", "recipe"],
      response: () =>
        `**MealFinder** is David's iOS app built with SwiftUI and the Spoonacular API. It lets users search meals by ingredient and view full recipe details. He used MVVM architecture for scalable state management. Check out the video demo on his Projects page!`,
    },
    {
      patterns: ["project clean", "maintenance", "firebase", "report"],
      response: () =>
        `**Project Clean** is a full-stack web app where students/professors can report school maintenance issues, and staff can manage and resolve them — with live-time updates. Built with React, Tailwind, and Firebase.`,
    },
    {
      patterns: ["pizza", "cravers", "restaurant", "cart"],
      response: () =>
        `**Cravers Pizza** is a fun project David built for his web dev class at Hunter College. It features a pizza slideshow, an add-to-cart system, and checkout price calculation. Built with React and Node.js.`,
    },
    {
      patterns: ["linkedin", "github", "social", "link"],
      response: () =>
        `Find David online:\n\n• 💼 **LinkedIn**: linkedin.com/in/davidyili\n• 🐙 **GitHub**: github.com/Davidyili230`,
    },
  ];

  function getResponse(input) {
    const msg = input.toLowerCase().trim();
    for (const intent of intents) {
      if (intent.patterns.some((p) => msg.includes(p))) {
        return intent.response();
      }
    }
    return `I'm not sure about that! Try asking about David's **projects**, **skills**, **education**, **experience**, or **how to contact** him. 😊`;
  }

  function formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  function createWidget() {
    const widget = document.createElement("div");
    widget.id = "chat-widget";

    const bubble = document.createElement("button");
    bubble.className = "chat-bubble-btn";
    bubble.setAttribute("aria-label", "Open chat assistant");
    bubble.innerHTML = "💬";

    const chatWin = document.createElement("div");
    chatWin.className = "chat-window";
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

    const quickReplies = document.createElement("div");
    quickReplies.className = "quick-replies";
    ["About David", "Projects", "Skills", "Contact"].forEach((label) => {
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

    addMessage("Hi! 👋 I'm David's assistant. Ask me about his projects, skills, education, or how to reach him!", "bot");

    bubble.addEventListener("click", () => {
      const isOpen = chatWin.classList.contains("open");
      chatWin.classList.toggle("open");
      bubble.innerHTML = isOpen ? "💬" : "✕";
      if (!isOpen) setTimeout(() => input.focus(), 200);
    });

    header.querySelector(".chat-close-btn").addEventListener("click", () => {
      chatWin.classList.remove("open");
      bubble.innerHTML = "💬";
    });

    sendBtn.addEventListener("click", submit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submit();
    });

    function submit() {
      const val = input.value.trim();
      if (!val) return;
      sendMessage(val);
      input.value = "";
    }

    function addMessage(text, type) {
      const div = document.createElement("div");
      div.className = `chat-message ${type}`;
      div.innerHTML = formatText(text);
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
      const el = document.createElement("div");
      el.className = "typing-indicator";
      el.innerHTML =
        '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    }

    function sendMessage(text) {
      addMessage(text, "user");
      const typing = showTyping();
      const delay = 600 + Math.random() * 400;
      setTimeout(() => {
        typing.remove();
        addMessage(getResponse(text), "bot");
      }, delay);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
