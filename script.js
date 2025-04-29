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

function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
  
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 150; // adjust trigger height if needed
  
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      } else {
        reveals[i].classList.remove('active');
      }
    }
  }
  
  window.addEventListener('scroll', revealOnScroll);
  