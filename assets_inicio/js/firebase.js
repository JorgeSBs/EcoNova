
    const firebaseConfig = {
      apiKey: "AIzaSyDtDX0Upgn6eUWP6PWqACduw0UJSpQ7cYc",
      authDomain: "evalucacion-fb656.firebaseapp.com",
      databaseURL: "https://evalucacion-fb656-default-rtdb.firebaseio.com",
      projectId: "evalucacion-fb656",
      storageBucket: "evalucacion-fb656.appspot.com",
      messagingSenderId: "446865801864",
      appId: "1:446865801864:web:b51d561c84c62cb4a7553d"
    };

    firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(user => {
      const profileArea = document.getElementById('userProfileArea');
      const loginBtn = document.getElementById('loginBtnArea');
      const userNameSpan = document.getElementById('userName');

      if (user) {
        profileArea.style.display = 'flex';
        if (loginBtn) loginBtn.style.display = 'none';

        const displayName = user.displayName || user.email;
        userNameSpan.textContent = displayName;
      } else {
        profileArea.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'block';
        userNameSpan.textContent = '';
      }
    });

    function cerrarSesion() {
      firebase.auth().signOut().then(() => {
        window.location.href = "index.html";
      });
    }

    function toggleMenu() {
      const menu = document.getElementById('profileMenu');
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }

      document.addEventListener("DOMContentLoaded", () => {
    const toggler = document.querySelector(".menu-toggler");
    const navMenu = document.querySelector(".nav-menu");

    toggler.addEventListener("click", () => {
      navMenu.classList.toggle("nav-menu--open");
    });
  });
firebase.auth().onAuthStateChanged(user => {
    const profileArea = document.getElementById('userProfileArea');
    const loginBtn = document.getElementById('loginBtnArea'); // Assuming you might have a login button area to hide/show
    const userNameSpan = document.getElementById('userName');
    const userProfilePic = document.getElementById('userProfilePic'); // The <img> tag for the profile photo

    if (user) {
        // If a user is logged in
        if (profileArea) profileArea.style.display = 'flex'; // Show the profile area
        if (loginBtn) loginBtn.style.display = 'none'; // Hide the login button area

        const displayName = user.displayName || user.email; // Prefer display name, fallback to email
        if (userNameSpan) userNameSpan.textContent = displayName;

        // Display user's profile picture or a default avatar
        if (userProfilePic) {
            if (user.photoURL) {
                userProfilePic.src = user.photoURL;
                userProfilePic.style.display = 'block'; // Make sure the image is visible
            } else {
                // If no photoURL, use a default image you've prepared
                userProfilePic.src = 'assets_inicio/img/default-avatar.png'; // Path to your default avatar image
                userProfilePic.style.display = 'block';
            }
        }
    } else {
        // If no user is logged in
        if (profileArea) profileArea.style.display = 'none'; // Hide the profile area
        if (loginBtn) loginBtn.style.display = 'block'; // Show the login button area
        if (userNameSpan) userNameSpan.textContent = ''; // Clear user name
        if (userProfilePic) {
            userProfilePic.src = 'assets_inicio/img/default-avatar.png'; // Reset to default avatar
            userProfilePic.style.display = 'none'; // Hide the image when logged out
        }
    }
});

// Function to handle user logout
function cerrarSesion() {
    firebase.auth().signOut().then(() => {
        // Redirect to the login page after successful logout
        window.location.href = "../index.html";
    }).catch((error) => {
        console.error("Error al cerrar sesión:", error);
        alert("Hubo un error al cerrar sesión. Inténtalo de nuevo.");
    });
}

// Function to toggle the visibility of the profile dropdown menu
function toggleMenu() {
    const menu = document.getElementById('profileMenu');
    if (menu) { // Check if the menu element exists
        // Toggle display between 'block' (or 'flex' if you styled it this way) and 'none'
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

// Event listener for the mobile menu toggler (if applicable)
document.addEventListener("DOMContentLoaded", () => {
    const toggler = document.querySelector(".menu-toggler");
    const navMenu = document.querySelector(".nav-menu");

    if (toggler && navMenu) { // Check if elements exist
        toggler.addEventListener("click", () => {
            navMenu.classList.toggle("nav-menu--open");
        });
    }
});

