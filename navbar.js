// navbar.js

document.addEventListener("DOMContentLoaded", function () {
    // Load the navbar dynamically
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;

            const hamburger = document.querySelector('.hamburger');
            const dropdownMenu = document.querySelector('.dropdown-menu');
            const menuContainer = document.querySelector('.menu-container');
            const closeMenu = document.querySelector('.close-menu');

            // Dropdown Menu Functionality
            hamburger.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent the click from bubbling up to the window
                dropdownMenu.classList.toggle('show');
                menuContainer.classList.toggle('show'); // Toggle sliding menu
            });

            // Close the sliding menu
            closeMenu.addEventListener('click', function () {
                menuContainer.classList.remove('show');
            });

            // Close the dropdown menu when clicking outside
            window.addEventListener('click', function (e) {
                if (!hamburger.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
                if (!hamburger.contains(e.target) && !menuContainer.contains(e.target)) {
                    menuContainer.classList.remove('show'); // Close sliding menu
                }
            });

            // Close menu on navigation link click
            const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
            dropdownLinks.forEach(link => {
                link.addEventListener('click', () => {
                    dropdownMenu.classList.remove('show');
                    menuContainer.classList.remove('show'); // Also close sliding menu
                });
            });

            // Close sliding menu on menu link click
            const menuLinks = document.querySelectorAll('.menu-container a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuContainer.classList.remove('show');
                });
            });

            // Accessibility Enhancements
            hamburger.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dropdownMenu.classList.toggle('show');
                    menuContainer.classList.toggle('show'); // Toggle sliding menu
                }
            });

            // Close menu with Escape key
            window.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    dropdownMenu.classList.remove('show');
                    menuContainer.classList.remove('show'); // Close sliding menu
                }
            });
        })
        .catch(error => console.error('Error loading navbar:', error));
});



// window.addEventListener('load', function() {
//     setTimeout(function() {
//         document.getElementById('loader').style.display = 'none'; // Loader ko hide karen
//     }, 2000); // 2000 milliseconds (2 seconds) baad
// });

// // Page loading ke shuru hone par spinner ko dikhaiye
// document.querySelector('.spinner').style.display = 'block'; // Spinner ko show karen


// Page loading ke shuru hone par spinner ko dikhaiye
document.querySelector('.spinner').style.display = 'block'; // Spinner ko show karen

window.addEventListener('load', function() {
    setTimeout(function() {
        document.getElementById('loader').style.display = 'none'; // Loader ko hide karen
    }, 900); // 2000 milliseconds (2 seconds) baad
});