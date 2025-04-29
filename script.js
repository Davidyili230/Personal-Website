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
