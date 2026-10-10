/* Loads the requested page fragment and populates it with local JSON data. */
const navigationItems = document.querySelectorAll("[data-nav]");
const pageContent = document.querySelector("#page-content");
const pageRoutes = {
  home: {
    file: "page/home.html",
    title: "Solihul Hadi | Web Developer"
  },
  education: {
    file: "page/education.html",
    title: "Education | Solihul Hadi"
  }
};

let portfolioContent = null;
let activePageRequest = null;
let pageRequestId = 0;

function setActiveNavigation(activeKey) {
  navigationItems.forEach((item) => {
    const isActive = item.dataset.nav === activeKey;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
}

function applyPortfolioContent(container) {
  const hero = portfolioContent?.hero;
  if (!hero) {
    return;
  }

  container.querySelectorAll("[data-copy]").forEach((element) => {
    const value = hero[element.dataset.copy];
    if (typeof value === "string" && value.trim() !== "") {
      element.textContent = value;
    }
  });

  const portrait = container.querySelector("[data-portrait]");
  if (portrait && typeof hero.portraitAlt === "string") {
    portrait.alt = hero.portraitAlt;
  }
}

async function loadPortfolioContent() {
  try {
    const response = await fetch("data/portfolio.json");
    if (!response.ok) {
      throw new Error(`Unable to load portfolio content (${response.status}).`);
    }

    portfolioContent = await response.json();
    const hero = portfolioContent.hero;
    if (hero && typeof hero.documentTitle === "string" && hero.documentTitle.trim() !== "") {
      pageRoutes.home.title = hero.documentTitle;
    }

    const copyright = document.querySelector('[data-copy="copyright"]');
    if (copyright && typeof hero?.copyright === "string" && hero.copyright.trim() !== "") {
      copyright.textContent = hero.copyright;
    }

    const navigationLabels = portfolioContent.navigation;
    if (navigationLabels && typeof navigationLabels === "object") {
      Object.entries(navigationLabels).forEach(([key, label]) => {
        const target = document.querySelector(`[data-nav-label="${key}"]`);
        if (target && typeof label === "string" && label.trim() !== "") {
          target.textContent = label;
        }
      });
    }
  } catch (error) {
    console.error("Portfolio configuration could not be loaded.", error);
  }
}

function renderEducationRecords(records, list) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("Education data must be a non-empty array.");
  }

  records.forEach((record) => {
    if (
      !record ||
      typeof record.level !== "string" ||
      typeof record.school_name !== "string"
    ) {
      throw new Error("Each education record must include a level and school_name.");
    }

    const card = document.createElement("article");
    card.className = "education-card";

    const level = document.createElement("h3");
    level.className = "education-card__level";
    level.textContent = record.level;

    const school = document.createElement("p");
    school.className = "education-card__school";
    school.textContent = record.school_name;

    card.append(level, school);
    list.append(card);
  });
}

async function loadEducationData(signal) {
  const list = pageContent.querySelector("[data-education-list]");
  if (!list) {
    throw new Error("Education page is missing its education list.");
  }

  const response = await fetch("data/education.json", { signal });
  if (!response.ok) {
    throw new Error(`Unable to load education data (${response.status}).`);
  }

  renderEducationRecords(await response.json(), list);
}

async function loadPage(pageKey) {
  const route = pageRoutes[pageKey];
  if (!route) {
    return;
  }

  if (activePageRequest) {
    activePageRequest.abort();
  }

  const controller = new AbortController();
  activePageRequest = controller;
  const requestId = ++pageRequestId;
  pageContent.setAttribute("aria-busy", "true");
  pageContent.innerHTML = '<p class="page-status" role="status">Memuat halaman...</p>';

  try {
    const response = await fetch(route.file, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Unable to load ${route.file} (${response.status}).`);
    }

    const fragment = document.createRange().createContextualFragment(await response.text());
    if (requestId !== pageRequestId) {
      return;
    }

    pageContent.replaceChildren(fragment);
    applyPortfolioContent(pageContent);
    document.documentElement.classList.add("motion-ready");

    if (pageKey === "education") {
      await loadEducationData(controller.signal);
    }

    document.title = route.title;
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    console.error(`The ${pageKey} page could not be loaded.`, error);
    if (requestId === pageRequestId) {
      const message = document.createElement("p");
      message.className = "page-status page-status--error";
      message.setAttribute("role", "alert");
      message.textContent = "Halaman gagal dimuat. Silakan pilih menu lagi untuk mencoba kembali.";
      pageContent.replaceChildren(message);
    }
  } finally {
    if (requestId === pageRequestId) {
      pageContent.setAttribute("aria-busy", "false");
      activePageRequest = null;
    }
  }
}

/* Only Home and Education have page fragments available at this time. */
navigationItems.forEach((item) => {
  item.addEventListener("click", () => {
    const pageKey = item.dataset.nav;
    if (!pageRoutes[pageKey]) {
      return;
    }

    setActiveNavigation(pageKey);
    loadPage(pageKey);
  });
});

async function initializePortfolio() {
  await loadPortfolioContent();
  await loadPage("home");
}

initializePortfolio();