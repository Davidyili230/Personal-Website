// This function scrolls the page to the given section ID
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId); // Use the correct sectionId
    if (section) {
        section.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to section
    } else {
        console.log("Section not found: " + sectionId); // Debugging line
    }
}

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