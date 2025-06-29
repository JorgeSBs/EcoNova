// Este código debería ir en tu archivo JavaScript de la página principal (ej: assets_dashboard/js/main_dashboard.js)
// O directamente en un bloque <script> antes del cierre de </body> en index2.html

// Función para mostrar la notificación de éxito personalizada (la misma que en la página de inicio)
function mostrarNotificacionExito(mensaje) {
    const toast = document.getElementById("custom-toast-success");
    if (!toast) {
        console.error("El elemento con id 'custom-toast-success' no se encontró en el DOM.");
        return;
    }
    const toastMessage = toast.querySelector(".custom-toast-message");
    
    toastMessage.textContent = mensaje;
    toast.classList.remove("custom-toast-hidden");
    toast.classList.add("custom-toast-visible");

    // Oculta la notificación automáticamente después de 3 segundos
    setTimeout(() => {
        toast.classList.remove("custom-toast-visible");
        toast.classList.add("custom-toast-hidden");
        // Limpia las banderas de localStorage después de que la notificación se oculta
        localStorage.removeItem('sesionIniciada');
        localStorage.removeItem('mensajeNotificacion');
    }, 3000);
}

// Asegura que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    // Listener para el botón de cerrar la notificación manualmente
    const closeButton = document.querySelector('#custom-toast-success [data-dismiss-target]');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const toast = document.getElementById("custom-toast-success");
            if (toast) {
                toast.classList.remove("custom-toast-visible");
                toast.classList.add("custom-toast-hidden");
                // Limpia las banderas de localStorage si el usuario cierra la notificación
                localStorage.removeItem('sesionIniciada');
                localStorage.removeItem('mensajeNotificacion');
            }
        });
    }

    // *** Lógica para verificar y mostrar la notificación al cargar la página ***
    const sesionIniciada = localStorage.getItem('sesionIniciada');
    const mensajeNotificacion = localStorage.getItem('mensajeNotificacion');

    if (sesionIniciada === 'true' && mensajeNotificacion) {
        mostrarNotificacionExito(mensajeNotificacion);
    }
});