/* Música de fondo: botón flotante */
document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("musica-fondo");
    const audioButton = document.getElementById("btn-audio");
    const audioIcon = document.getElementById("icono-audio");
    if (!music || !audioButton || !audioIcon) return;

    music.volume = 0.3;
    let isPlaying = false;

    const renderState = () => {
        audioIcon.classList.toggle("fa-volume-up", isPlaying);
        audioIcon.classList.toggle("fa-volume-off", !isPlaying);
        audioButton.setAttribute("aria-pressed", String(isPlaying));
    };

    audioButton.addEventListener("click", async () => {
        if (isPlaying) {
            music.pause();
            isPlaying = false;
            renderState();
            return;
        }

        try {
            await music.play();
            isPlaying = true;
        } catch (_error) {
            isPlaying = false;
        }
        renderState();
    });

    renderState();
});
