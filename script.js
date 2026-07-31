// Author: Yi Li
// Project: Personal Webpage
// Start date: April 1, 2025
// Document: JAVASCRIPT file, electricity and water system

/* ===============================================================================================================================================================================
                        SCROLL TO SECTION
================================================================================================================================================================================ */

function scrollToSection(sectionId) {
  const main = document.querySelector('.main');
  const section = document.getElementById(sectionId);

  if (main && section) {
    const yOffset = 0;
    const sectionY = section.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop + yOffset;

    main.scrollTo({
      top: sectionY,
      behavior: 'smooth'
    });
  } else {
    console.log("Section or main not found for:", sectionId);
  }
}


/* ===============================================================================================================================================================================
                        REVEAL SECTION
================================================================================================================================================================================ */

/* ===============================================================================================================================================================================
                      INTERSECTION OBSERVER REVEAL
================================================================================================================================================================================ */

// Shared across the whole site: observe any .reveal/.reveal-left/.reveal-scale
// element and fade it in once. Exposed as window.bindReveals so pages that
// inject content after load (e.g. about.html's JSON-driven story chapters)
// can register their new elements too — a plain querySelectorAll at script
// load time only ever sees static markup.
const bindReveals = (function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
  );

  return function bindReveals(root = document) {
    root.querySelectorAll('.reveal:not([data-reveal-bound]), .reveal-left:not([data-reveal-bound]), .reveal-scale:not([data-reveal-bound])')
      .forEach((el) => {
        el.setAttribute('data-reveal-bound', '');
        observer.observe(el);
      });
  };
})();

bindReveals();


/* ===============================================================================================================================================================================
                      LIVING BACKGROUND — CURSOR REVEAL
================================================================================================================================================================================ */

(function initBgReveal() {
  const bgScene = document.querySelector('.bg-scene');
  if (!bgScene) return;

  const root = document.documentElement;

  // Raw cursor position drives the background reveal mask (--mx/--my) with
  // zero lag. The light glow instead eases toward it every frame (--lx/--ly),
  // so it visibly trails a beat behind before catching up to the cursor.
  let rawX = window.innerWidth / 2;
  let rawY = window.innerHeight / 2;
  let lightX = rawX;
  let lightY = rawY;
  const LIGHT_EASE = 0.12;

  // The reveal patch's radius is spring-driven (not a plain fade) so the
  // moss/mushrooms/dragonflies underneath visibly sprout outward with a
  // touch of overshoot on hover, then retract back to nothing on leave.
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  let targetRadius = mobileQuery.matches ? 100 : 160;
  mobileQuery.addEventListener('change', (e) => {
    targetRadius = e.matches ? 100 : 160;
  });

  let hovering = false;
  let radius = 0;
  let radiusVelocity = 0;
  const SPRING_STIFFNESS = 0.1;
  const SPRING_DAMPING = 0.78;

  function tick() {
    root.style.setProperty('--mx', `${rawX}px`);
    root.style.setProperty('--my', `${rawY}px`);

    lightX += (rawX - lightX) * LIGHT_EASE;
    lightY += (rawY - lightY) * LIGHT_EASE;
    root.style.setProperty('--lx', `${lightX}px`);
    root.style.setProperty('--ly', `${lightY}px`);

    const target = hovering ? targetRadius : 0;
    radiusVelocity += (target - radius) * SPRING_STIFFNESS;
    radiusVelocity *= SPRING_DAMPING;
    radius = Math.max(0, radius + radiusVelocity);
    root.style.setProperty('--mr', `${radius}px`);

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  function activate(x, y) {
    rawX = x;
    rawY = y;
    hovering = true;
    document.body.classList.add('bg-hover');
  }

  function deactivate() {
    hovering = false;
    document.body.classList.remove('bg-hover');
  }

  window.addEventListener('pointermove', (e) => activate(e.clientX, e.clientY), { passive: true });
  window.addEventListener('pointerdown', (e) => activate(e.clientX, e.clientY), { passive: true });
  document.addEventListener('pointerleave', deactivate);
  window.addEventListener('blur', deactivate);

  window.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'touch') deactivate();
  });
  window.addEventListener('pointercancel', deactivate);
})();


/* ===============================================================================================================================================================================
                      BACK TO TOP
================================================================================================================================================================================ */

(function initBackToTop() {
  const mainSection = document.querySelector('.main');
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!mainSection || !backToTopBtn) return;

  // The story page (about.html) has no sidebar/middle-bar row, so .main is
  // normal document flow rather than its own scroll container — track and
  // scroll the window there instead.
  const usesWindowScroll = document.body.classList.contains('page-about');
  const scrollTarget = usesWindowScroll ? window : mainSection;
  const getScrollTop = () => (usesWindowScroll ? window.scrollY : mainSection.scrollTop);

  scrollTarget.addEventListener('scroll', () => {
    backToTopBtn.style.display = getScrollTop() > 300 ? 'block' : 'none';
  });

  backToTopBtn.addEventListener('click', () => {
    scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ===============================================================================================================================================================================
                      STORY SCROLL PROGRESS
================================================================================================================================================================================ */

(function initStoryProgress() {
  const bar = document.getElementById('storyProgressBar');
  if (!bar) return;

  let ticking = false;

  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();


/* ===============================================================================================================================================================================
                        TYPE WRITING
================================================================================================================================================================================ */

const typewriterEl = document.getElementById("typewriter");
if (typewriterEl) {
  const typeText = "Davidyili230@gmail.com";
  let index = 0;

  function type() {
    if (index < typeText.length) {
      typewriterEl.textContent += typeText.charAt(index);
      index++;
      setTimeout(type, 80);
    }
  }

  setTimeout(type, 1000);
}


/* ===============================================================================================================================================================================
                        DARK MODE
================================================================================================================================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const toggleInput = document.querySelector('#darkModeToggle');
  const body = document.body;

  if (!toggleInput) return;

  // Dark is the default theme, so only an explicit 'light' choice opts out.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) { /* storage disabled */ }
  if (savedTheme !== 'light') {
    body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
    toggleInput.checked = true;
  }

  toggleInput.addEventListener('change', () => {
    const dark = toggleInput.checked;
    body.classList.toggle('dark-mode', dark);
    document.documentElement.classList.toggle('dark-mode', dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { /* storage disabled */ }
  });
});


/* ===============================================================================================================================================================================
                        implement json for easier maintainance
================================================================================================================================================================================ */

/* ===============================================================================================================================================================================
                        about.html
================================================================================================================================================================================ */

async function loadAboutData() {
  const isAboutPage =
    window.location.pathname.endsWith("about.html") ||
    document.title.toLowerCase().includes("about");

  if (!isAboutPage) return;

  try {
    const res = await fetch("data/about.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load data/about.json");
    const data = await res.json();

    // Intro
    const introTitle = document.getElementById("IntroTitle");
    const introP1 = document.getElementById("IntroP1");
    const introP2 = document.getElementById("IntroP2");
    const introP3 = document.getElementById("IntroP3");

    if (introTitle) introTitle.textContent = data.sections?.intro?.title ?? "Intro";
    if (introP1) introP1.textContent = data.sections?.intro?.p1 ?? "";
    if (introP2) introP2.textContent = data.sections?.intro?.p2 ?? "";
    if (introP3) introP3.textContent = data.sections?.intro?.p3 ?? "";

    // Why David (multiple paragraphs, each its own reveal beat)
    const whyDavidTitle = document.getElementById("WhyDavidTitle");
    const whyContainer = document.getElementById("WhyDavidContainer");
    if (whyDavidTitle) whyDavidTitle.textContent = data.sections?.whyDavid?.title ?? whyDavidTitle.textContent;
    if (whyContainer) {
      whyContainer.innerHTML = "";
      const paragraphs = data.sections?.whyDavid?.p ?? [];
      paragraphs.forEach((t, idx) => {
        const p = document.createElement("p");
        p.className = idx === 0 ? "reveal" : "reveal delay-1";
        p.textContent = t;
        whyContainer.appendChild(p);
      });
    }

    // Journey timeline — oldest first, so it reads as a narrative building to now
    const journeyTitle = document.getElementById("JourneyTitle");
    const journeyList = document.getElementById("JourneyList");
    if (journeyTitle) journeyTitle.textContent = data.sections?.journey?.title ?? journeyTitle.textContent;
    if (journeyList) {
      journeyList.innerHTML = "";
      const items = [...(data.sections?.journey?.items ?? [])].reverse();
      items.forEach((it, idx) => {
        const li = document.createElement("li");
        li.className = `story-timeline-item ${idx % 2 === 0 ? "reveal-left" : "reveal"}`;

        const body = document.createElement("div");
        body.className = "story-timeline-body";

        // Image floats inside the text body so paragraphs wrap around it,
        // instead of sitting in its own flex column.
        const media = document.createElement("div");
        media.className = `story-media story-media--${idx % 2 === 0 ? "warm" : "cool"} story-media--timeline`;
        body.appendChild(media);

        const meta = document.createElement("div");
        meta.className = "story-timeline-meta";

        const date = document.createElement("p");
        date.className = "story-timeline-date";
        date.textContent = it.date ?? "";
        meta.appendChild(date);

        if (it.title) {
          const title = document.createElement("h3");
          title.className = "story-timeline-title";
          title.textContent = it.title;
          meta.appendChild(title);
        }

        body.appendChild(meta);

        const p = document.createElement("p");
        const textParts = (it.text || "").split("\n");
        textParts.forEach((part, i) => {
          p.appendChild(document.createTextNode(part));
          if (i !== textParts.length - 1) p.appendChild(document.createElement("br"));
        });
        body.appendChild(p);

        li.appendChild(body);
        journeyList.appendChild(li);
      });
    }

    // Hobbies tiles
    const hobbiesTitle = document.getElementById("HobbiesTitle");
    const hobbiesList = document.getElementById("HobbiesList");
    if (hobbiesTitle) hobbiesTitle.textContent = data.sections?.hobbies?.title ?? hobbiesTitle.textContent;
    if (hobbiesList) {
      hobbiesList.innerHTML = "";
      const hobbies = data.sections?.hobbies?.items ?? [];
      const delays = ["", "delay-1", "delay-2", "delay-3", "delay-4", "delay-5"];
      hobbies.forEach((txt, idx) => {
        const li = document.createElement("li");
        li.className = `story-tile reveal-scale ${delays[idx % delays.length]}`.trim();

        const media = document.createElement("div");
        media.className = `story-media story-media--${idx % 2 === 0 ? "warm" : "cool"} story-media--tile`;
        li.appendChild(media);

        const p = document.createElement("p");
        p.textContent = txt;
        li.appendChild(p);

        hobbiesList.appendChild(li);
      });
    }

    // Static markup is already bound at script-load; this picks up everything
    // just injected above (WhyDavid paragraphs, Journey items, Hobby tiles).
    bindReveals();

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadAboutData);


/* ===============================================================================================================================================================================
                      resume.html
================================================================================================================================================================================ */

async function loadResumeData() {
  const isResumePage =
    window.location.pathname.endsWith("resume.html") ||
    document.title.toLowerCase().includes("resume");

  if (!isResumePage) return;

  try {
    const res = await fetch("data/resume.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load data/resume.json");
    const data = await res.json();

    // -------------------------
    // Sidebar
    // -------------------------
    const sImg = document.getElementById("sidebarProfileImage");
    const sName = document.getElementById("sidebarName");
    const sEmail = document.getElementById("sidebarEmail");
    const sAbout = document.getElementById("sidebarAbout");
    const sSocial = document.getElementById("sidebarSocialIcons");
    const sCopy = document.getElementById("sidebarCopyright");

    if (sImg && data.sidebar?.profileImage) sImg.src = data.sidebar.profileImage;
    if (sName) sName.textContent = data.sidebar?.name ?? "";
    if (sEmail) sEmail.textContent = data.sidebar?.email ?? "";
    if (sAbout) sAbout.textContent = data.sidebar?.about ?? "";
    if (sCopy) sCopy.textContent = data.sidebar?.copyright ?? "";

    if (sSocial) {
      sSocial.innerHTML = "";
      (data.sidebar?.social ?? []).forEach((item) => {
        const a = document.createElement("a");
        a.href = item.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const img = document.createElement("img");
        img.src = item.icon;
        img.alt = item.alt || "social";
        img.width = "40%";

        a.appendChild(img);
        sSocial.appendChild(a);
      });
    }

    // -------------------------
    // Header name/location/contacts
    // -------------------------
    const nameLine = document.getElementById("resumeNameLine");
    const location = document.getElementById("resumeLocation");
    const contacts = document.getElementById("resumeContacts");

    if (nameLine) nameLine.textContent = data.header?.nameLine ?? "";
    if (location) location.textContent = data.header?.location ?? "";

    if (contacts) {
      contacts.innerHTML = "";
      (data.header?.contacts ?? []).forEach((c) => {
        const wrap = document.createElement("div");
        wrap.className = "main-contact-items";

        const img = document.createElement("img");
        img.src = c.icon;
        img.alt = c.alt || "contact";
        img.width = "10%";

        const a = document.createElement("a");
        a.href = c.href;
        a.textContent = c.text;

        if (c.download) {
          a.setAttribute("download", "");
        } else {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }

        wrap.appendChild(img);
        wrap.appendChild(a);
        contacts.appendChild(wrap);
      });
    }

    // -------------------------
    // Education
    // -------------------------
    const edu = data.education ?? {};
    const eduSchool = document.getElementById("eduSchool");
    const eduGrad = document.getElementById("eduGrad");
    const eduDegree = document.getElementById("eduDegree");
    const eduCity = document.getElementById("eduCity");

    if (eduSchool) eduSchool.textContent = edu.school ?? "";
    if (eduGrad) eduGrad.textContent = edu.grad ?? "";
    if (eduDegree) eduDegree.textContent = edu.degree ?? "";
    if (eduCity) eduCity.textContent = edu.city ?? "";

    // -------------------------
    // Certifications
    // -------------------------
    const certContainer = document.getElementById("certificationsContainer");
    if (certContainer) {
      certContainer.innerHTML = "";
      (data.certifications ?? []).forEach((cert) => {
        const grid = document.createElement("div");
        grid.className = "grid-container";

        const left = document.createElement("div");
        left.className = "left-text";
        left.innerHTML = `<h2>${cert.title ?? ""}</h2>`;

        const right = document.createElement("div");
        right.className = "right-text";
        right.innerHTML = `<h2>${cert.date ?? ""}</h2>`;

        grid.appendChild(left);
        grid.appendChild(right);

        certContainer.appendChild(grid);

        if (cert.detail) {
          const detail = document.createElement("h3");
          detail.textContent = cert.detail;
          certContainer.appendChild(detail);
        }
      });
    }

    // -------------------------
    // Professional Summary
    // -------------------------
    const summary = document.getElementById("resumeSummary");
    if (summary) summary.textContent = data.summary ?? "";

    // -------------------------
    // Experience
    // -------------------------
    const expContainer = document.getElementById("experienceContainer");
    if (expContainer) {
      expContainer.innerHTML = "";
      const jobs = data.experience ?? [];

      jobs.forEach((job, idx) => {
        const grid1 = document.createElement("div");
        grid1.className = "grid-container";
        grid1.innerHTML = `
          <div class="left-text"><h2>${job.company ?? ""}</h2></div>
          <div class="right-text"><h2>${job.dates ?? ""}</h2></div>
        `;

        const grid2 = document.createElement("div");
        grid2.className = "grid-container";
        grid2.innerHTML = `
          <div class="left-text"><h3>${job.role ?? ""}</h3></div>
          <div class="right-text"><h3>${job.location ?? ""}</h3></div>
        `;

        const ul = document.createElement("ul");
        (job.bullets ?? []).forEach((b) => {
          const li = document.createElement("li");
          li.textContent = b;
          ul.appendChild(li);
        });

        expContainer.appendChild(grid1);
        expContainer.appendChild(grid2);
        expContainer.appendChild(ul);

        if (idx !== jobs.length - 1) {
          const hr = document.createElement("hr");
          hr.className = "extra-line";
          expContainer.appendChild(hr);
        }
      });
    }

    // -------------------------
    // Projects
    // -------------------------
    const projContainer = document.getElementById("projectsContainer");
    if (projContainer) {
      projContainer.innerHTML = "";
      (data.projects ?? []).forEach((p) => {
        const grid = document.createElement("div");
        grid.className = "grid-container";
        grid.innerHTML = `
          <div class="left-text">
            <h2><strong>${p.name ?? ""}</strong> <span class="code-language"> | ${p.tech ?? ""}</span></h2>
          </div>
          <div class="right-text"><h2>${p.dates ?? ""}</h2></div>
        `;

        const ul = document.createElement("ul");
        (p.bullets ?? []).forEach((b) => {
          const li = document.createElement("li");
          li.textContent = b;
          ul.appendChild(li);
        });

        projContainer.appendChild(grid);
        projContainer.appendChild(ul);
      });
    }

    // -------------------------
    // Technical skills
    // -------------------------
    const skillsList = document.getElementById("skillsList");
    if (skillsList) {
      skillsList.innerHTML = "";
      (data.technicalSkills ?? []).forEach((s) => {
        const li = document.createElement("li");
        li.className = "skills-listing-li";
        li.innerHTML = `<strong>${s.label}:</strong> ${s.value}`;
        skillsList.appendChild(li);
      });
    }

    // -------------------------
    // Leadership / Extracurricular (company/dates/role/location + bullets)
    // -------------------------
    const leadershipContainer = document.getElementById("leadershipContainer");
    if (leadershipContainer) {
      leadershipContainer.innerHTML = "";

      const leadershipItems = data.leadershipExtracurricular ?? [];

      leadershipItems.forEach((item, idx) => {
        const grid1 = document.createElement("div");
        grid1.className = "grid-container";
        grid1.innerHTML = `
          <div class="left-text"><h2>${item.company ?? ""}</h2></div>
          <div class="right-text"><h2>${item.dates ?? ""}</h2></div>
        `;

        const grid2 = document.createElement("div");
        grid2.className = "grid-container";
        grid2.innerHTML = `
          <div class="left-text"><h3>${item.role ?? ""}</h3></div>
          <div class="right-text"><h3>${item.location ?? ""}</h3></div>
        `;

        const ul = document.createElement("ul");
        (item.bullets ?? []).forEach((b) => {
          const li = document.createElement("li");
          li.textContent = b;
          ul.appendChild(li);
        });

        leadershipContainer.appendChild(grid1);
        leadershipContainer.appendChild(grid2);
        leadershipContainer.appendChild(ul);

        if (idx !== leadershipItems.length - 1) {
          const hr = document.createElement("hr");
          hr.className = "extra-line";
          leadershipContainer.appendChild(hr);
        }
      });
    }

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadResumeData);


/* =============================================================================================
                    NAV ACTIVE LINK + LAST UPDATED + PROJECTS PAGE
============================================================================================= */

function setActiveNavLink() {
const nav = document.querySelector(".nav-links");
if (!nav) return;

const links = Array.from(nav.querySelectorAll("a[href]"));
const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

links.forEach((a) => {
  const href = (a.getAttribute("href") || "").toLowerCase();
  if (!href) return;

  if (href === current) {
    a.classList.add("active");
    a.setAttribute("aria-current", "page");
  } else if (a.getAttribute("aria-current") === "page") {
    a.removeAttribute("aria-current");
  }
});
}

function renderLastUpdatedFromMeta() {
const el = document.getElementById("lastUpdated");
if (!el) return;

const meta = document.querySelector('meta[name="last-updated"]');
const value = meta?.getAttribute("content");
if (!value) return;

// Keep this simple and consistent (avoid locale differences)
el.textContent = `Last updated: ${value}`;
}

function createTechChips(techList) {
const wrap = document.createElement("div");
wrap.className = "tech-chips";
(techList || []).forEach((t) => {
  const chip = document.createElement("span");
  chip.className = "tech-chip";
  chip.textContent = t;
  wrap.appendChild(chip);
});
return wrap;
}

function loadProjectsPageData() {
const grid = document.getElementById("projectsGrid");
if (!grid) return;

const errorEl = document.getElementById("projectsError");
grid.innerHTML = "";

fetch("data/projects.json")
  .then((res) => {
    if (!res.ok) throw new Error(`Failed to load projects.json (${res.status})`);
    return res.json();
  })
  .then((data) => {
    const projects = data?.projects ?? [];
    if (!projects.length) {
      if (errorEl) errorEl.textContent = "No projects found yet. Add items in data/projects.json.";
      return;
    }

    projects.forEach((p, idx) => {
      const link = p?.link || "#";

      const a = document.createElement("a");
      a.className = idx === 0 ? "project-card project-card--featured" : "project-card";
      a.style.animationDelay = `${idx * 0.1}s`;
      a.href = link;

      // Open external links in a new tab for safety + UX
      try {
        const url = new URL(link, window.location.href);
        const isExternal = url.origin !== window.location.origin;
        if (isExternal) {
          a.target = "_blank";
          a.rel = "noopener";
        }
      } catch (_) { /* ignore */ }

      a.setAttribute("role", "listitem");

      // Status badge
      if (p?.status) {
        const badge = document.createElement("span");
        const slug = p.status.toLowerCase().replace(/[\s/]+/g, "-");
        badge.className = `project-status project-status--${slug}`;
        badge.textContent = p.status;
        a.appendChild(badge);
      }

      const title = document.createElement("h2");
      title.className = "project-title";
      title.textContent = p?.title ?? "Untitled Project";

      const desc = document.createElement("p");
      desc.className = "project-desc";
      desc.textContent = p?.description ?? "";

      const metaRow = document.createElement("div");
      metaRow.className = "project-meta-row";

      const updated = document.createElement("p");
      updated.className = "project-updated";
      updated.textContent = p?.updated ? `Updated: ${p.updated}` : "";

      const linkLabel = document.createElement("span");
      linkLabel.className = "project-link-label";
      linkLabel.textContent = p?.linkLabel ? p.linkLabel : "Open";

      metaRow.appendChild(updated);
      metaRow.appendChild(linkLabel);

      a.appendChild(title);
      if (p?.description) a.appendChild(desc);
      if (Array.isArray(p?.tech) && p.tech.length) a.appendChild(createTechChips(p.tech));
      a.appendChild(metaRow);

      // Faded ordinal number (decorative, absolutely positioned)
      const numEl = document.createElement("span");
      numEl.className = "project-num";
      numEl.setAttribute("aria-hidden", "true");
      numEl.textContent = String(idx + 1).padStart(2, "0");
      a.appendChild(numEl);

      grid.appendChild(a);
    });

    // If JSON provides an updated date, prefer it for the projects page
    const lastUpdatedEl = document.getElementById("lastUpdated");
    if (lastUpdatedEl && data?.lastUpdated) {
      lastUpdatedEl.textContent = `Last updated: ${data.lastUpdated}`;
    }

    initCardTilt();
  })
  .catch((err) => {
    console.error(err);
    if (errorEl) errorEl.textContent = "Could not load projects. Check that data/projects.json exists.";
  });
}

document.addEventListener("DOMContentLoaded", () => {
setActiveNavLink();
renderLastUpdatedFromMeta();
loadProjectsPageData();
});

/* =============================================================================================
                    SIDE BAR
============================================================================================= */

// Outline icons (same stroke style as the contact page) so social links render as
// currentColor SVGs instead of fixed-color PNGs — they pick up the accent color and
// need no dark-mode invert filter.
const SOCIAL_ICON_SVGS = {
  facebook: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
  github: `<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>`,
  instagram: `<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>`,
  linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>`,
  twitter: `<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>`,
};

function socialIconSvg(name) {
  const inner = SOCIAL_ICON_SVGS[name?.toLowerCase()];
  if (!inner) return "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

async function loadSidebar() {
  const mount = document.getElementById("sidebar");
  if (!mount) return;

  try {
    const res = await fetch("data/sidebar.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load sidebar.json (${res.status})`);
    const data = await res.json();

    const socials = (data.socials ?? []).map(s => `
      <a class="social-icon-link" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}">
        ${socialIconSvg(s.name)}
      </a>
    `).join("");

    const profile = data.profile ?? {};
    mount.innerHTML = `
      <div>
        <div class="profile-img-ring">
          <img class="profile-img" src="${profile.image ?? ""}" alt="profile" width="100%">
        </div>
        <h1>${profile.name ?? ""}</h1>
        <h2>${profile.email ?? ""}</h2>

        <div class="sidebar-card sidebar-about">
          <div class="sidebar-card-header">
            <span class="sidebar-card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg></span>
            <span class="sidebar-card-title">About</span>
          </div>
          <p>${profile.about ?? ""}</p>
        </div>

        <div class="sidebar-social-icons">${socials}</div>

        <div class="sidebar-footer">&copy;${data.copyright ?? ""}</div>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadSidebar);


/* ===============================================================================================================================================================================
                      3D CARD TILT
================================================================================================================================================================================ */

function initCardTilt() {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transition =
        'transform 0.08s ease, box-shadow var(--transition-md), border-color var(--transition-md)';
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      card.style.transform =
        `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition =
        'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow var(--transition-md), border-color var(--transition-md)';
      card.style.transform = '';
    });
  });
}


/* ===============================================================================================================================================================================
                      RIPPLE EFFECT
================================================================================================================================================================================ */

function initRipple() {
  document.querySelectorAll('.cta-btn--primary, .submit-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width  = ripple.style.height = size + 'px';
      ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

document.addEventListener('DOMContentLoaded', initRipple);
