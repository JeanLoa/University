/* Carrusel horizontal: flechas y teclado */
document.addEventListener("DOMContentLoaded", () => {
    const rail = document.getElementById("testimonialSlider");
    const prev = document.querySelector(".testimonial-nav--prev");
    const next = document.querySelector(".testimonial-nav--next");

    if (!rail || !prev || !next) return;

    const scrollStep = () => {
        const card = rail.querySelector(".card-testimonial");
        if (!card) return 320;
        const gap = parseFloat(getComputedStyle(rail).gap) || 20;
        return card.getBoundingClientRect().width + gap;
    };

    prev.addEventListener("click", () => {
        rail.scrollBy({ left: -scrollStep(), behavior: "smooth" });
    });
    next.addEventListener("click", () => {
        rail.scrollBy({ left: scrollStep(), behavior: "smooth" });
    });

    rail.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            rail.scrollBy({ left: -scrollStep(), behavior: "smooth" });
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            rail.scrollBy({ left: scrollStep(), behavior: "smooth" });
        }
    });
});
