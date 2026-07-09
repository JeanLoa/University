/*
 * Buscador inteligente para una landing page de una sola página.
 * - Indexa el contenido visible de la web.
 * - Tolera acentos y errores de escritura pequeños.
 * - Ofrece resultados instantáneos y navegación con teclado.
 */
document.addEventListener("DOMContentLoaded", () => {
    const siteSearch = document.querySelector(".site-search");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const searchStatus = document.getElementById("searchStatus");
    const searchButton = document.getElementById("btn-buscar");
    const clearButton = document.getElementById("btn-clear-search");
    const searchChips = document.querySelectorAll(".search-chip");

    if (!siteSearch || !searchInput || !searchResults || !searchStatus || !searchButton || !clearButton) {
        return;
    }

    const MIN_QUERY_LENGTH = 2;
    const MAX_RESULTS = 6;
    const DEBOUNCE_TIME = 90;

    const stopWords = new Set([
        "a", "about", "al", "algo", "and", "are", "as", "can", "como", "con", "could", "cuál", "cual",
        "da", "das", "de", "del", "do", "does", "donde", "dónde", "dos", "e", "el", "en", "es", "esta",
        "está", "estan", "están", "este", "eu", "find", "for", "hay", "how", "i", "in", "is", "la", "las",
        "los", "me", "mi", "mostrar", "muestrame", "muéstrame", "need", "necesito", "o", "of", "onde", "our",
        "para", "please", "podria", "podría", "por", "posso", "preciso", "puedo", "que", "qué", "quero", "quiero",
        "saber", "seu", "show", "sobre", "su", "sua", "sus", "tell", "tem", "the", "tienen", "to", "un", "una",
        "unas", "unos", "us", "ver", "voce", "você", "want", "we", "what", "where", "would", "y", "you", "your"
    ].map(normalizeText));

    const entrySpecs = [
        {
            targetId: "hero",
            titleKey: "nav_home",
            descriptionSelector: ".hero-lead",
            icon: "fa-home",
            aliases: "inicio home início portada principal comenzar empezar start ahorro ahorrar economizar energia energy electricidad luz recibo factura consumo control dashboard"
        },
        {
            targetId: "service",
            titleSelector: ".section-heading .title",
            descriptionSelector: ".section-heading > p",
            icon: "fa-tags",
            aliases: "planes plan pricing precios costo costes cuanto cuesta how much suscripcion membresia planos preço assinatura comprar servicio starter profesional enterprise empresarial"
        },
        {
            targetId: "plan-starter",
            titleSelector: "h3",
            descriptionSelector: ":scope > p",
            icon: "fa-home",
            priority: 14,
            aliases: "plan inicial starter plan basico básico basic economico económico barato hogar pequeño small home cinco 5 dispositivos 18.90 precio cuanto cuesta how much"
        },
        {
            targetId: "plan-professional",
            titleSelector: "h3",
            descriptionSelector: ":scope > p",
            icon: "fa-star",
            priority: 16,
            aliases: "plan profesional professional pro avanzado advanced negocio pequeño business veinte 20 dispositivos automatizacion automation reportes 48.90 precio cuanto cuesta how much popular elegido"
        },
        {
            targetId: "plan-enterprise",
            titleSelector: "h3",
            descriptionSelector: ":scope > p",
            icon: "fa-building",
            priority: 14,
            aliases: "plan empresarial enterprise empresa empresas varias sedes multiple locations equipo perfiles soporte prioritario 128.90 precio cuanto cuesta how much"
        },
        {
            targetId: "que_frequents",
            titleSelector: ".title",
            descriptionSelector: ".subtitle",
            icon: "fa-question-circle",
            aliases: "preguntas frecuentes faq dudas ayuda questions perguntas consumo ahorro economia energía"
        },
        {
            targetId: "faq-high-consumption",
            titleSelector: ".faq-question span[data-i18n]",
            descriptionSelector: ".faq-answer p",
            icon: "fa-bolt",
            priority: 18,
            aliases: "electrodomesticos aparatos equipos consumen gastan mas electricidad mayor consumo appliances use uses most highest power refrigeradora refrigerator microondas microwave terma heater plancha iron calor frio"
        },
        {
            targetId: "faq-realtime-monitoring",
            titleSelector: ".faq-question span[data-i18n]",
            descriptionSelector: ".faq-answer p",
            icon: "fa-line-chart",
            priority: 18,
            aliases: "monitoreo tiempo real ahorro energia consumo picos alertas equipos encendidos real time monitoring saving energy alerts habits"
        },
        {
            targetId: "faq-standby-consumption",
            titleSelector: ".faq-question span[data-i18n]",
            descriptionSelector: ".faq-answer p",
            icon: "fa-power-off",
            priority: 18,
            aliases: "consumo fantasma standby stand by vampire power espera evitar recibo horarios alertas energía nocturno"
        },
        {
            targetId: "reviews",
            titleSelector: ".title",
            descriptionSelector: ".section-heading > p",
            icon: "fa-comments",
            aliases: "testimonios opiniones reseñas clientes reviews testimonials experiencia comentarios gente"
        },
        {
            targetId: "description",
            titleSelector: ".proposal-copy .title",
            descriptionSelector: ".proposal-lead",
            icon: "fa-lightbulb-o",
            aliases: "descripcion descripción startup que es electrocorp propuesta solución objetivos metas mision misión vision visión sostenibilidad propósito goals mission purpose domotica plataforma app hogar peru ecosistema"
        },
        {
            targetId: "proposal-problem",
            titleSelector: "h3",
            descriptionSelector: "p",
            icon: "fa-exclamation-triangle",
            priority: 14,
            aliases: "problema costoso caro complicado cables tecnicos aplicaciones difficult expensive electricity energy cost"
        },
        {
            targetId: "proposal-solution",
            titleSelector: "h3",
            descriptionSelector: "p",
            icon: "fa-cogs",
            priority: 15,
            aliases: "solucion solución ecosistema conectado monitoreo tiempo real automatizacion control remoto plataforma facil easy connected monitoring automation"
        },
        {
            targetId: "proposal-goal",
            titleSelector: "h3",
            descriptionSelector: "p",
            icon: "fa-bullseye",
            priority: 15,
            aliases: "objetivo objetivos meta metas sostenible sostenibilidad ahorro familias negocios peru goal goals sustainable savings"
        },
        {
            targetId: "about",
            titleSelector: ".title",
            descriptionSelector: ".about-lead",
            icon: "fa-users",
            aliases: "nosotros equipo integrantes desarrolladores estudiantes upc team about quienes somos diego sebastian ghorghet alexander ronal"
        },
        {
            targetId: "direction",
            titleSelector: ".title",
            descriptionSelector: ".subtitle",
            icon: "fa-map-marker",
            aliases: "direccion dirección ubicacion ubicación ubicado ubicados located mapa sede oficina office offices headquarters onde fica donde estan visitarnos address location map surco monterrico upc horario"
        },
        {
            targetId: "contact",
            titleKey: "nav_support",
            descriptionSelector: ".contact-copy > p",
            icon: "fa-life-ring",
            aliases: "soporte ayuda contacto contact support email correo telefono teléfono newsletter boletin boletín suscribirse atención novedades"
        }
    ];

    let searchIndex = [];
    let currentResults = [];
    let activeResultIndex = -1;
    let debounceTimer = null;
    let highlightTimer = null;

    function normalizeText(value) {
        return String(value ?? "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, " ")
            .trim();
    }

    function cleanText(value) {
        return String(value ?? "").replace(/\s+/g, " ").trim();
    }

    function truncate(value, maxLength = 115) {
        const text = cleanText(value);
        return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}…` : text;
    }

    function findText(target, selector) {
        if (!selector) {
            return "";
        }

        const element = target.matches(selector) ? target : target.querySelector(selector);
        return cleanText(element?.textContent);
    }

    function translate(key, fallback = "") {
        return typeof getTranslation === "function" ? getTranslation(key, fallback) : fallback;
    }

    function formatMessage(key, values, fallback = "") {
        if (typeof formatTranslation === "function") {
            return formatTranslation(key, values, fallback);
        }

        let message = fallback;
        Object.entries(values).forEach(([name, replacement]) => {
            message = message.replaceAll(`{${name}}`, String(replacement));
        });
        return message;
    }

    function rebuildIndex() {
        searchIndex = entrySpecs.flatMap((spec) => {
            const target = document.getElementById(spec.targetId);
            if (!target) {
                return [];
            }

            target.classList.add("search-target");

            const title = spec.titleKey
                ? translate(spec.titleKey, spec.targetId)
                : findText(target, spec.titleSelector) || spec.targetId;
            const description = findText(target, spec.descriptionSelector) || title;
            const searchableClone = target.cloneNode(true);
            searchableClone.querySelectorAll("[data-search-ignore], script, style").forEach((element) => element.remove());
            const body = cleanText(searchableClone.textContent);
            const aliases = cleanText(spec.aliases);

            return [{
                ...spec,
                target,
                title,
                description: truncate(description),
                normalizedTitle: normalizeText(title),
                normalizedDescription: normalizeText(description),
                normalizedBody: normalizeText(body),
                normalizedAliases: normalizeText(aliases),
                priority: spec.priority ?? 0
            }];
        });
    }

    function levenshteinDistance(left, right) {
        if (left === right) return 0;
        if (!left.length) return right.length;
        if (!right.length) return left.length;

        let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

        for (let i = 1; i <= left.length; i += 1) {
            const current = [i];

            for (let j = 1; j <= right.length; j += 1) {
                const substitutionCost = left[i - 1] === right[j - 1] ? 0 : 1;
                current[j] = Math.min(
                    current[j - 1] + 1,
                    previous[j] + 1,
                    previous[j - 1] + substitutionCost
                );
            }

            previous = current;
        }

        return previous[right.length];
    }

    function wordMatchQuality(queryWord, candidateWord) {
        if (!queryWord || !candidateWord) return 0;
        if (queryWord === candidateWord) return 1;

        if (queryWord.length >= 3 && candidateWord.startsWith(queryWord)) {
            return 0.88;
        }

        if (
            candidateWord.length >= 4
            && queryWord.startsWith(candidateWord)
            && candidateWord.length / queryWord.length >= 0.7
        ) {
            return 0.84;
        }

        if (queryWord.length < 3 || candidateWord.length < 3) {
            return 0;
        }

        const maxDistance = Math.max(queryWord.length, candidateWord.length) <= 5 ? 1 : 2;
        if (Math.abs(queryWord.length - candidateWord.length) > maxDistance) {
            return 0;
        }

        const distance = levenshteinDistance(queryWord, candidateWord);
        if (distance > maxDistance) {
            return 0;
        }

        const similarity = 1 - distance / Math.max(queryWord.length, candidateWord.length);
        return similarity >= 0.62 ? similarity * 0.78 : 0;
    }

    function bestWordQuality(queryWord, normalizedField) {
        let best = 0;
        const candidateWords = normalizedField.split(" ");

        for (const candidateWord of candidateWords) {
            best = Math.max(best, wordMatchQuality(queryWord, candidateWord));
            if (best === 1) break;
        }

        return best;
    }

    function scoreEntry(entry, rawQuery) {
        const query = normalizeText(rawQuery);
        if (!query) return 0;

        const rawWords = query.split(" ").filter(Boolean);
        const meaningfulWords = rawWords.filter((word) => !stopWords.has(word));
        const queryWords = meaningfulWords.length ? meaningfulWords : rawWords;

        let score = entry.priority;

        if (entry.normalizedTitle === query) score += 150;
        else if (entry.normalizedTitle.startsWith(query)) score += 115;
        else if (entry.normalizedTitle.includes(query)) score += 92;

        if (entry.normalizedAliases.includes(query)) score += 78;
        if (entry.normalizedDescription.includes(query)) score += 54;
        if (entry.normalizedBody.includes(query)) score += 30;

        let matchedWords = 0;

        queryWords.forEach((queryWord) => {
            const titleQuality = bestWordQuality(queryWord, entry.normalizedTitle);
            const aliasQuality = queryWord.length <= 3
                ? Number(entry.normalizedAliases.split(" ").includes(queryWord))
                : bestWordQuality(queryWord, entry.normalizedAliases);
            const descriptionQuality = queryWord.length <= 3
                ? Number(entry.normalizedDescription.split(" ").includes(queryWord))
                : bestWordQuality(queryWord, entry.normalizedDescription);
            const bodyQuality = queryWord.length <= 3
                ? Number(entry.normalizedBody.split(" ").includes(queryWord))
                : bestWordQuality(queryWord, entry.normalizedBody);

            const wordScore = Math.max(
                titleQuality * 31,
                aliasQuality * 25,
                descriptionQuality * 15,
                bodyQuality * 8
            );

            if (wordScore > 0) {
                matchedWords += 1;
                score += wordScore;
            }
        });

        const coverage = queryWords.length ? matchedWords / queryWords.length : 0;
        const minimumCoverage = queryWords.length <= 3 ? 1 : 0.65;
        if (coverage < minimumCoverage) {
            return 0;
        }

        score += coverage * 22;
        return score;
    }

    function findResults(query) {
        const rankedResults = searchIndex
            .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
            .filter((result) => result.score > 0)
            .sort((left, right) => right.score - left.score || left.entry.title.localeCompare(right.entry.title));

        const deduplicatedResults = [];

        for (const result of rankedResults) {
            const strongerChildAlreadyIncluded = deduplicatedResults.some((selectedResult) => (
                result.entry.target !== selectedResult.entry.target
                && result.entry.target.contains(selectedResult.entry.target)
                && selectedResult.score >= result.score + 20
            ));

            if (!strongerChildAlreadyIncluded) {
                deduplicatedResults.push(result);
            }

            if (deduplicatedResults.length === MAX_RESULTS) {
                break;
            }
        }

        return deduplicatedResults;
    }

    function closeResults() {
        searchResults.hidden = true;
        searchInput.setAttribute("aria-expanded", "false");
        searchInput.removeAttribute("aria-activedescendant");
        activeResultIndex = -1;
    }

    function openResults() {
        searchResults.hidden = false;
        searchInput.setAttribute("aria-expanded", "true");
    }

    function setActiveResult(index) {
        const resultElements = searchResults.querySelectorAll(".search-result");
        if (!resultElements.length) return;

        activeResultIndex = (index + resultElements.length) % resultElements.length;

        resultElements.forEach((element, elementIndex) => {
            const isActive = elementIndex === activeResultIndex;
            element.classList.toggle("is-active", isActive);
            element.setAttribute("aria-selected", String(isActive));
        });

        const activeElement = resultElements[activeResultIndex];
        searchInput.setAttribute("aria-activedescendant", activeElement.id);
        activeElement.scrollIntoView({ block: "nearest" });
    }

    function createResultElement(result, index) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "search-result";
        button.id = `search-result-${index}`;
        button.setAttribute("role", "option");
        button.setAttribute("aria-selected", "false");
        button.tabIndex = -1;

        const icon = document.createElement("span");
        icon.className = "search-result-icon";
        icon.setAttribute("aria-hidden", "true");
        const iconGlyph = document.createElement("i");
        iconGlyph.className = `fa ${result.entry.icon}`;
        icon.appendChild(iconGlyph);

        const copy = document.createElement("span");
        copy.className = "search-result-copy";

        const title = document.createElement("span");
        title.className = "search-result-title";
        title.textContent = result.entry.title;

        const description = document.createElement("span");
        description.className = "search-result-description";
        description.textContent = result.entry.description;

        copy.append(title, description);

        const arrow = document.createElement("i");
        arrow.className = "fa fa-chevron-right search-result-arrow";
        arrow.setAttribute("aria-hidden", "true");

        button.append(icon, copy, arrow);
        button.setAttribute("aria-label", `${result.entry.title}. ${result.entry.description}`);

        button.addEventListener("mouseenter", () => setActiveResult(index));
        button.addEventListener("click", () => navigateToResult(result.entry));

        return button;
    }

    function renderNoResults(query) {
        currentResults = [];
        activeResultIndex = -1;
        searchResults.replaceChildren();

        const emptyState = document.createElement("div");
        emptyState.className = "search-empty";

        const icon = document.createElement("span");
        icon.className = "search-empty-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.innerHTML = '<i class="fa fa-search"></i>';

        const title = document.createElement("strong");
        title.textContent = formatMessage(
            "search_no_results",
            { query },
            `No results for “${query}”.`
        );

        const hint = document.createElement("span");
        hint.textContent = translate(
            "search_no_results_hint",
            "Try plans, energy saving, the proposal or support."
        );

        emptyState.append(icon, title, hint);
        searchResults.appendChild(emptyState);
        searchStatus.textContent = title.textContent;
        openResults();
    }

    function renderResults(query, results) {
        currentResults = results;
        activeResultIndex = -1;
        searchResults.replaceChildren();

        if (!results.length) {
            renderNoResults(query);
            return;
        }

        const fragment = document.createDocumentFragment();
        results.forEach((result, index) => {
            fragment.appendChild(createResultElement(result, index));
        });
        searchResults.appendChild(fragment);

        const statusKey = results.length === 1 ? "search_results_one" : "search_results_many";
        searchStatus.textContent = formatMessage(
            statusKey,
            { count: results.length, query },
            `${results.length} results for “${query}”.`
        );

        openResults();
    }

    function executeSearch({ navigateFirst = false, announceMinimum = false } = {}) {
        const query = cleanText(searchInput.value);
        const normalizedQuery = normalizeText(query);

        clearButton.hidden = !query;

        if (normalizedQuery.length < MIN_QUERY_LENGTH) {
            currentResults = [];
            closeResults();
            searchStatus.textContent = announceMinimum && query
                ? translate("search_min_chars", "Enter at least 2 characters to search.")
                : "";
            return;
        }

        const results = findResults(query);
        renderResults(query, results);

        if (navigateFirst && results.length) {
            navigateToResult(results[0].entry);
        }
    }

    function openFaqIfNeeded(target) {
        if (!target.classList.contains("faq-item")) {
            return target;
        }

        const questionButton = target.querySelector("button");
        if (questionButton && !questionButton.classList.contains("active")) {
            questionButton.click();
        }

        return questionButton || target;
    }

    function navigateToResult(entry) {
        const target = document.getElementById(entry.targetId);
        if (!target) return;

        closeResults();
        searchInput.blur();

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
            block: target.matches("section") ? "start" : "center"
        });

        const focusTarget = openFaqIfNeeded(target);
        if (!focusTarget.hasAttribute("tabindex") && !focusTarget.matches("button, a, input, select, textarea")) {
            focusTarget.setAttribute("tabindex", "-1");
        }

        window.clearTimeout(highlightTimer);
        target.classList.remove("search-highlight");
        void target.offsetWidth;
        target.classList.add("search-highlight");
        highlightTimer = window.setTimeout(() => target.classList.remove("search-highlight"), 1800);

        window.setTimeout(() => {
            focusTarget.focus({ preventScroll: true });
        }, reducedMotion ? 0 : 450);

        searchStatus.textContent = formatMessage(
            "search_navigated",
            { title: entry.title },
            `Showing: ${entry.title}.`
        );

        try {
            history.replaceState(null, "", `#${entry.targetId}`);
        } catch (_error) {
            // El desplazamiento sigue funcionando aunque el navegador bloquee el historial local.
        }
    }

    function clearSearch() {
        window.clearTimeout(debounceTimer);
        searchInput.value = "";
        clearButton.hidden = true;
        searchStatus.textContent = "";
        currentResults = [];
        closeResults();
        searchInput.focus();
    }

    searchInput.addEventListener("input", () => {
        clearButton.hidden = !searchInput.value;
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => executeSearch(), DEBOUNCE_TIME);
    });

    searchInput.addEventListener("focus", () => {
        if (normalizeText(searchInput.value).length >= MIN_QUERY_LENGTH) {
            executeSearch();
        }
    });

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
            if (!searchResults.hidden && currentResults.length) {
                event.preventDefault();
                setActiveResult(activeResultIndex + 1);
            }
            return;
        }

        if (event.key === "ArrowUp") {
            if (!searchResults.hidden && currentResults.length) {
                event.preventDefault();
                setActiveResult(activeResultIndex <= 0 ? currentResults.length - 1 : activeResultIndex - 1);
            }
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            if (!searchResults.hidden && activeResultIndex >= 0 && currentResults[activeResultIndex]) {
                navigateToResult(currentResults[activeResultIndex].entry);
            } else {
                executeSearch({ navigateFirst: true, announceMinimum: true });
            }
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closeResults();
        }
    });

    searchButton.addEventListener("click", () => {
        executeSearch({ navigateFirst: true, announceMinimum: true });
    });

    clearButton.addEventListener("click", clearSearch);

    searchChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            searchInput.value = cleanText(chip.textContent);
            clearButton.hidden = false;
            searchInput.focus();
            executeSearch();
        });
    });

    document.addEventListener("click", (event) => {
        if (!siteSearch.contains(event.target)) {
            closeResults();
        }
    });

    document.addEventListener("languagechange", () => {
        rebuildIndex();
        if (normalizeText(searchInput.value).length >= MIN_QUERY_LENGTH) {
            executeSearch();
        } else {
            searchStatus.textContent = "";
        }
    });

    rebuildIndex();

    // Utilidad mínima para verificar el buscador desde pruebas del navegador.
    window.ElectroCorpSearch = Object.freeze({
        normalizeText,
        findResults: (query) => findResults(query).map(({ entry, score }) => ({
            targetId: entry.targetId,
            title: entry.title,
            score
        })),
        rebuildIndex
    });
});
