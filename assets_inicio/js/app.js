// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

// Animación entre formularios
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

// Event listeners para cambiar entre formularios de inicio de sesión y registro
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});
sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Función para validar si una cadena es un correo electrónico válido
function esCorreoValido(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para mostrar mensajes de error traducidos según el código de Firebase
function mostrarError(codigo) {
    switch (codigo) {
        case 'auth/invalid-email':
            alert("Correo electrónico no válido.");
            break;
        case 'auth/user-disabled':
            alert("Usuario deshabilitado.");
            break;
        case 'auth/user-not-found':
            alert("Usuario no encontrado.");
            break;
        case 'auth/wrong-password':
            alert("Contraseña incorrecta.");
            break;
        case 'auth/email-already-in-use':
            alert("El correo ya está en uso.");
            break;
        case 'auth/weak-password':
            alert("La contraseña es demasiado débil (mínimo 6 caracteres).");
            break;
        default:
            alert("Error: " + codigo);
    }
}


// Función para mostrar la notificación de éxito personalizada (sin Tailwind)
function mostrarNotificacionExito(mensaje) {
    const toast = document.getElementById("custom-toast-success");
    if (!toast) {
        // Muestra un error en consola si el elemento de notificación no se encuentra
        console.error("El elemento con id 'custom-toast-success' no se encontró en el DOM.");
        return;
    }
    const toastMessage = toast.querySelector(".custom-toast-message");
    
    // Actualiza el mensaje y hace visible la notificación
    toastMessage.textContent = mensaje;
    toast.classList.remove("custom-toast-hidden");
    toast.classList.add("custom-toast-visible");

    // Configura un temporizador para ocultar la notificación automáticamente después de 3 segundos
    setTimeout(() => {
        toast.classList.remove("custom-toast-visible");
        toast.classList.add("custom-toast-hidden");
        // Limpia las banderas de localStorage después de que la notificación se oculta automáticamente
        localStorage.removeItem('sesionIniciada');
        localStorage.removeItem('mensajeNotificacion');
    }, 3000); // 3000 milisegundos = 3 segundos
}

// Asegura que el DOM esté completamente cargado antes de añadir listeners y verificar localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Listener para el botón de cerrar la notificación manualmente
    const closeButton = document.querySelector('#custom-toast-success [data-dismiss-target]');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const toast = document.getElementById("custom-toast-success");
            if (toast) {
                toast.classList.remove("custom-toast-visible");
                toast.classList.add("custom-toast-hidden");
                // Limpia las banderas de localStorage si el usuario cierra la notificación manualmente
                localStorage.removeItem('sesionIniciada');
                localStorage.removeItem('mensajeNotificacion');
            }
        });
    }

    // Verifica si hay una notificación pendiente de mostrar al cargar la página (ej. después de una redirección)
    const sesionIniciada = localStorage.getItem('sesionIniciada');
    const mensajeNotificacion = localStorage.getItem('mensajeNotificacion');

    if (sesionIniciada === 'true' && mensajeNotificacion) {
        mostrarNotificacionExito(mensajeNotificacion);
    }
});


// Funciones de Autenticación de Firebase


// Función para iniciar sesión con correo electrónico y contraseña
function iniciarSesionCorreo() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Valida que los campos no estén vacíos
    if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Valida el formato del correo electrónico
    if (!esCorreoValido(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    // Intenta iniciar sesión con Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => {
            // Guarda indicadores en localStorage para que la notificación se muestre en la página de destino
            localStorage.setItem('sesionIniciada', 'true');
            localStorage.setItem('mensajeNotificacion', '¡Sesión iniciada correctamente!');
            
            console.log(user.user); // Muestra los datos del usuario en consola
            // *** CAMBIO AQUÍ: Redirige a la página de destino en la misma pestaña/ventana ***
            window.location.href = 'chatbot.html';
        })
        .catch(error => {
            // Muestra un mensaje de error si el inicio de sesión falla
            mostrarError(error.code);
        });
}

// Función para registrar un nuevo usuario con correo electrónico y contraseña
function registrar() {
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    // Valida que los campos no estén vacíos
    if (!email || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Valida el formato del correo electrónico
    if (!esCorreoValido(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
    }

    // Valida la longitud de la contraseña
    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    // Intenta crear un nuevo usuario con Firebase
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
            alert("Usuario registrado correctamente."); // Notificación simple para el registro
            console.log(user.user); // Muestra los datos del usuario en consola
        })
        .catch(error => {
            // Muestra un mensaje de error si el registro falla
            mostrarError(error.code);
        });
}

// Función para iniciar sesión usando la cuenta de Google
function iniciarSesionGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(result => {
            // Guarda indicadores en localStorage para que la notificación se muestre en la página de destino
            localStorage.setItem('sesionIniciada', 'true');
            localStorage.setItem('mensajeNotificacion', '¡Sesión con Google iniciada!');

            console.log(result.user); // Muestra los datos del usuario en consola
            // *** CAMBIO AQUÍ: Redirige a la página de destino en la misma pestaña/ventana ***
            window.location.href = 'chatbot.html'; 
        })
        .catch(error => {
            // Muestra un mensaje de error si el inicio de sesión con Google falla
            alert("Error con Google: " + error.message);
        });
}