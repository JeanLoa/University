/* Acordeón accesible para preguntas frecuentes */
document.addEventListener("DOMContentLoaded", () => {
    const questions = Array.from(document.querySelectorAll(".faq-question"));
    if (!questions.length) return;

    const closeQuestion = (question) => {
        const answer = question.nextElementSibling;
        question.classList.remove("active");
        question.setAttribute("aria-expanded", "false");
        if (answer) answer.style.maxHeight = "0px";
    };

    const openQuestion = (question) => {
        const answer = question.nextElementSibling;
        question.classList.add("active");
        question.setAttribute("aria-expanded", "true");
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
    };

    questions.forEach((question) => {
        question.addEventListener("click", () => {
            const shouldOpen = !question.classList.contains("active");
            questions.forEach(closeQuestion);
            if (shouldOpen) openQuestion(question);
        });
    });

    document.addEventListener("languagechange", () => {
        requestAnimationFrame(() => {
            questions.forEach((question) => {
                if (!question.classList.contains("active")) return;
                const answer = question.nextElementSibling;
                if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
            });
        });
    });
});
