// Author: Yi Li
// Project: Personal Webpage
// Start date: April 1, 2025
// Document: JAVASCRIPT file, electricity and water system

/* ===============================================================================================================================================================================
                        SCROLL TO SECTION
================================================================================================================================================================================ */

function scrollToSection(sectionId) {
    const main = document.querySelector('.main'); // Get the scrollable main area
    const section = document.getElementById(sectionId); // Target section inside main

    if (main && section) {
        const yOffset = -55; // Adjust for internal nav (if needed)
        const y = section.offsetTop + yOffset;
        main.scrollTo({ top: y, behavior: "smooth" });
    } else {
        console.log("Section or main not found");
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
  