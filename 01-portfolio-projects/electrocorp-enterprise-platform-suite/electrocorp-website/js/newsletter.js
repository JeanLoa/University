/* Formulario de suscripción (demostración de interfaz) */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-suscripcion");
    const message = document.getElementById("mensaje-suscripcion");
    if (!form || !message) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailInput = document.getElementById("email-boletin");
        if (!emailInput) return;

        console.log("Nuevo lead capturado:", emailInput.value);
        message.textContent = typeof getTranslation === "function"
            ? getTranslation("subscription_success", "¡Gracias por unirte!")
            : "¡Gracias por unirte!";
        message.style.display = "block";
        form.reset();

        window.setTimeout(() => {
            message.style.display = "none";
        }, 4500);
    });
});
