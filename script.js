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

(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  if (!revealEls.length) return;

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

  revealEls.forEach((el) => observer.observe(el));
})();


/* ===============================================================================================================================================================================
                      BACK TO TOP
================================================================================================================================================================================ */

(function initBackToTop() {
  const mainSection = document.querySelector('.main');
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!mainSection || !backToTopBtn) return;

  mainSection.addEventListener('scroll', () => {
    backToTopBtn.style.display = mainSection.scrollTop > 300 ? 'block' : 'none';
  });

  backToTopBtn.addEventListener('click', () => {
    mainSection.scrollTo({ top: 0, behavior: 'smooth' });
  });
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

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('theme'); } catch (e) { /* storage disabled */ }
  if (savedTheme === 'dark') {
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

    // Sidebar profile
    const imgEl = document.getElementById("profileImage");
    const nameEl = document.getElementById("profileName");
    const emailEl = document.getElementById("profileEmail");
    const sidebarAboutEl = document.getElementById("sidebarAboutText");

    if (imgEl && data.profile?.image) imgEl.src = data.profile.image;
    if (nameEl && data.profile?.name) nameEl.textContent = data.profile.name;
    if (emailEl && data.profile?.email) emailEl.textContent = data.profile.email;
    if (sidebarAboutEl && data.sidebarAbout) sidebarAboutEl.textContent = data.sidebarAbout;

    // Intro
    const introTitle = document.getElementById("IntroTitle");
    const introP1 = document.getElementById("IntroP1");
    const introP2 = document.getElementById("IntroP2");

    if (introTitle) introTitle.textContent = data.sections?.intro?.title ?? "Intro";
    if (introP1) introP1.textContent = data.sections?.intro?.p1 ?? "";
    if (introP2) introP2.textContent = data.sections?.intro?.p2 ?? "";

    // Why David (multiple paragraphs)
    const whyContainer = document.getElementById("WhyDavidContainer");
    if (whyContainer) {
      whyContainer.innerHTML = "";
      const paragraphs = data.sections?.whyDavid?.p ?? [];
      paragraphs.forEach((t, idx) => {
        const p = document.createElement("p");
        p.textContent = t;
        whyContainer.appendChild(p);
        if (idx !== paragraphs.length - 1) {
          const hr = document.createElement("hr");
          hr.className = "extra-line";
          whyContainer.appendChild(hr);
        }
      });
    }

    // Journey list
    const journeyList = document.getElementById("JourneyList");
    if (journeyList) {
      journeyList.innerHTML = "";
      const items = data.sections?.journey?.items ?? [];
      items.forEach((it) => {
        const li = document.createElement("li");
        const p = document.createElement("p");

        const strong = document.createElement("strong");
        strong.textContent = it.date ? `${it.date} — ` : "";
        p.appendChild(strong);

        const textParts = (it.text || "").split("\n");
        textParts.forEach((part, i) => {
          p.appendChild(document.createTextNode(part));
          if (i !== textParts.length - 1) p.appendChild(document.createElement("br"));
        });

        li.appendChild(p);
        journeyList.appendChild(li);
      });
    }

    // Hobbies list
    const hobbiesList = document.getElementById("HobbiesList");
    if (hobbiesList) {
      hobbiesList.innerHTML = "";
      const hobbies = data.sections?.hobbies?.items ?? [];
      hobbies.forEach((txt) => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = txt;
        li.appendChild(p);
        hobbiesList.appendChild(li);
      });
    }

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

        const detail = document.createElement("h3");
        detail.textContent = cert.detail ?? "";

        certContainer.appendChild(grid);
        certContainer.appendChild(detail);
      });
    }

    // -------------------------
    // Coursework
    // -------------------------
    const courseList = document.getElementById("courseworkList");
    if (courseList) {
      courseList.innerHTML = "";
      (data.coursework ?? []).forEach((course) => {
        const li = document.createElement("li");
        li.className = "course-listing-li";
        li.textContent = course;
        courseList.appendChild(li);
      });
    }

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

async function loadSidebar() {
  const mount = document.getElementById("sidebar");
  if (!mount) return;

  try {
    const res = await fetch("data/sidebar.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load sidebar.json (${res.status})`);
    const data = await res.json();

    const socials = (data.socials ?? []).map(s => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer">
        <img src="${s.icon}" alt="${s.name}" width="40%">
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

        <div class="sidebar-about">
          <hr class="extra-line">
          <h3>ABOUT</h3>
          <hr class="extra-line">
          <p>${profile.about ?? ""}</p>
        </div>

        <div class="sidebar-social-icons">${socials}</div>

        <hr class="extra-line">
        <h4>&copy;${data.copyright ?? ""}</h4>
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
