document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // Set the toggle to on if dark mode is enabled by default
    if (body.classList.contains("dark-mode")) {
        darkModeToggle.checked = true;
    }

    // Toggle dark mode on switch change
    darkModeToggle.addEventListener("change", function () {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }
    });
});
