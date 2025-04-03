// Author: Yi Li
// Project: Personal Webpage
// Start date: April 1, 2025
// Document: JAVASCRIPT file, people say "make a person alive"

//
//
//      This function scrolls the page to the given section ID
//
//

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId); // Use the correct sectionId
    if (section) {
        section.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
    } else {
        console.log("Section not found: " + sectionId); // Debugging line
    }
}

//
//
//      Below is functions for turning display inverted color
//
//

let themeButton = document.getElementById("theme-button"); //themeButton = theme-button
let navbar = document.querySelector(".navigation-bar"); // navbar = navigation-bar
let button = document.querySelector(".button"); // button = button

const toggleDarkMode = () => {
  document.body.classList.toggle("dark-mode");
  navbar.classList.toggle("dark-mode"); // Toggle dark mode on navbar as well
  button.classList.toggle("dark-mode"); // Toggle dark mode on button as well
  localStorage.setItem('dark-mode', document.body.classList.contains("dark-mode"));
};

// On page load, check if dark mode is enabled
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    navbar.classList.add('dark-mode'); // Apply dark mode to navbar if it's enabled
    button.classList.toggle("dark-mode"); // Apply dark mode to button if it's enabled
}

themeButton.addEventListener("click", toggleDarkMode);

const socialIcons = document.querySelectorAll(".social-icon"); // socialIcons = social-icon

// Apply filter to icons when dark mode is enabled
if (document.body.classList.contains("dark-mode")) {
    socialIcons.forEach(icon => {
        icon.style.filter = 'invert(1) brightness(0)'; // Dark mode icon color (invert and brighten)
    });
} else {
    socialIcons.forEach(icon => {
        icon.style.filter = 'invert(0) brightness(1)'; // Normal mode icon color (reset to original)
    });
}

//
//
//      Reveal section when scrolling
//
//

document.addEventListener("DOMContentLoaded", function () { // run when HTML is fully executed
    const sections = document.querySelectorAll(".reveal"); // select all class that has reveal

    function revealSections() { // check when class reveal is seen in viewport
        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top; // return element position relative to viewport
            const windowHeight = window.innerHeight; // return height of visable browser
            if (sectionTop < windowHeight * 0.85) { // when element is 85% close to the window height, start revealing
                section.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", revealSections); // when scrolling, sections reveals
    revealSections();
});

//
//
//      loading-screen with text and fading out to webpage
//
//

document.addEventListener("DOMContentLoaded", function () { // wait for HTML to run
    setTimeout(() => {
        const loadingScreen = document.getElementById("loading-screen"); // gets loading-screen
        loadingScreen.classList.add("fade-out"); // apply fade-out
    },2500); // have this fade out effect last for 2.5 seconds
});