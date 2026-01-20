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
        const yOffset = 0; // optional adjustment
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
                        REVAL SECTION
================================================================================================================================================================================ */

const mainSection = document.querySelector('.main');
const mainChildren = mainSection.querySelectorAll('.reveal');

window.addEventListener('scroll', revealMainContent);

function revealMainContent() {
    const windowHeight = window.innerHeight;
    const mainTop = mainSection.getBoundingClientRect().top;
    const mainVisible = 150;

    if (mainTop < windowHeight - mainVisible) {
        mainChildren.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('active');
            }, index * 150); // Delay each child by 150ms
        });
    } else {
        mainChildren.forEach(child => {
            child.classList.remove('active');
        });
    }
}

revealMainContent(); // Run once on load

/* ===============================================================================================================================================================================
                        BACK TO TOP
================================================================================================================================================================================ */
// Reuse the already declared mainSection
const backToTopBtn = document.getElementById('backToTopBtn');

mainSection.addEventListener('scroll', () => {
    if (mainSection.scrollTop > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});

backToTopBtn.addEventListener('click', () => {
    mainSection.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ===============================================================================================================================================================================
                        TYPE WRITING
================================================================================================================================================================================ */
const typewriterEl = document.getElementById("typewriter");
const typeText = "Davidyili230@gmail.com";
let index = 0;

function type() {
    if (index < typeText.length) {
        typewriterEl.textContent += typeText.charAt(index);
        index++;
        setTimeout(type, 80); // adjust typing speed
    }
}

// Trigger after slight delay for smoother reveal
setTimeout(type, 1000);

/* ===============================================================================================================================================================================
                        DARK MODE
================================================================================================================================================================================ */
document.addEventListener('DOMContentLoaded', () => {
const toggleInput = document.querySelector('#darkModeToggle');
const body = document.body;
  
// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    toggleInput.checked = true;
}
  
// Listen to toggle changes
toggleInput.addEventListener('change', () => {
    if (toggleInput.checked) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});
});
  
/* ===============================================================================================================================================================================
                        implement json for easier maintainance
================================================================================================================================================================================ */
/* ===============================================================================================================================================================================
                        about.html
================================================================================================================================================================================ */
async function loadAboutData() {
    // Only run on about.html
    const isAboutPage = window.location.pathname.endsWith("about.html") || document.title.toLowerCase().includes("about");
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
  
          // Preserve line breaks from JSON using text nodes + <br>
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
  
  // Run after your existing script loads
  document.addEventListener("DOMContentLoaded", loadAboutData);
  