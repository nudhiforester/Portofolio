/* Loads the requested page fragment and populates it with local JSON data. */
const navigationItems = document.querySelectorAll("[data-nav]");
const pageContent = document.querySelector("#page-content");
const preloader = document.querySelector("#preloader");
const preloaderProgress = document.querySelector(".preloader__progress-fill");
const homeIdleTextSelector = ".hero__greeting, .hero__role, .hero__intro, .hero__name, .hero__skill";
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const pageRoutes = {
  home: {
    file: "page/home.html",
    title: "Solihul Hadi | Web Developer"
  },
  education: {
    file: "page/education.html",
    title: "Education | Solihul Hadi"
  },
  skills: {
    file: "page/skills.html",
    title: "Skills | Solihul Hadi"
  },
  project: {
    file: "page/project.html",
    title: "Project | Solihul Hadi"
  },
  contact: {
    file: "page/contact.html",
    title: "Contact | Solihul Hadi"
  }
};

let portfolioContent = null;
let activePageRequest = null;
let pageSwiper = null;
let skillChart = null;
let swiperResizeObserver = null;
let swiperResizeFrame = 0;
let pageRequestId = 0;
let homeIdleEnabled = false;
let homeIdleIndex = 0;
let homeIdleTimer = 0;
let homeIdleMotionTimer = 0;
let homeIdleCurrentText = null;

function stopHomeIdleMotion() {
  homeIdleEnabled = false;
  window.clearTimeout(homeIdleTimer);
  window.clearTimeout(homeIdleMotionTimer);
  homeIdleCurrentText?.classList.remove("home-idle-nudge");
  homeIdleCurrentText = null;
  homeIdleIndex = 0;
}

function scheduleHomeIdleMotion() {
  window.clearTimeout(homeIdleTimer);
  if (!homeIdleEnabled || reducedMotionPreference.matches) {
    return;
  }

  homeIdleTimer = window.setTimeout(() => {
    const textItems = pageContent.querySelectorAll(homeIdleTextSelector);
    if (textItems.length === 0) {
      return;
    }

    homeIdleCurrentText?.classList.remove("home-idle-nudge");
    homeIdleCurrentText = textItems[homeIdleIndex % textItems.length];
    homeIdleIndex += 1;
    homeIdleCurrentText.classList.add("home-idle-nudge");

    homeIdleMotionTimer = window.setTimeout(() => {
      homeIdleCurrentText?.classList.remove("home-idle-nudge");
      homeIdleCurrentText = null;
    }, 360);
    scheduleHomeIdleMotion();
  }, 2000);
}

function startHomeIdleMotion() {
  stopHomeIdleMotion();
  if (reducedMotionPreference.matches) {
    return;
  }

  homeIdleEnabled = true;
  scheduleHomeIdleMotion();
}

function resetHomeIdleMotion() {
  if (!homeIdleEnabled) {
    return;
  }

  window.clearTimeout(homeIdleMotionTimer);
  homeIdleCurrentText?.classList.remove("home-idle-nudge");
  homeIdleCurrentText = null;
  scheduleHomeIdleMotion();
}

/* User input restarts the idle delay so text only moves while Home is quiet. */
["pointerdown", "pointermove", "keydown", "touchstart", "wheel"].forEach((eventName) => {
  window.addEventListener(eventName, resetHomeIdleMotion, { passive: true });
});

reducedMotionPreference.addEventListener("change", () => {
  if (reducedMotionPreference.matches) {
    stopHomeIdleMotion();
  } else if (pageContent.querySelector(".hero")) {
    startHomeIdleMotion();
  }
});

function updateActiveSwiper() {
  pageSwiper?.setBreakpoint();
  pageSwiper?.update();
}

function scheduleActiveSwiperUpdate() {
  if (swiperResizeFrame) {
    cancelAnimationFrame(swiperResizeFrame);
  }

  swiperResizeFrame = requestAnimationFrame(() => {
    swiperResizeFrame = 0;
    updateActiveSwiper();
  });
}

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
      const linkedName = "Solihul Hadi";
      const nameIndex = hero.copyright.indexOf(linkedName);

      if (nameIndex === -1) {
        copyright.textContent = hero.copyright;
      } else {
        const profileLink = document.createElement("a");
        profileLink.className = "site-footer__link";
        profileLink.href = "https://github.com/solihulhadi141213";
        profileLink.target = "_blank";
        profileLink.rel = "noopener noreferrer";
        profileLink.setAttribute("aria-label", "Solihul Hadi di GitHub");
        profileLink.textContent = linkedName;

        copyright.replaceChildren(
          document.createTextNode(hero.copyright.slice(0, nameIndex)),
          profileLink,
          document.createTextNode(hero.copyright.slice(nameIndex + linkedName.length))
        );
      }
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

function renderSkillRecords(records, carousel) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("Skills data must be a non-empty array.");
  }

  const track = carousel.querySelector("[data-skills-track]");
  const skillsPage = carousel.closest(".skills-page") ?? pageContent;
  let dialog = skillsPage.querySelector("[data-skill-dialog]");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.className = "skill-dialog";
    dialog.dataset.skillDialog = "";
    dialog.setAttribute("aria-labelledby", "skill-dialog-title");

    const content = document.createElement("div");
    content.className = "skill-dialog__content";
    const closeButton = document.createElement("button");
    closeButton.className = "skill-dialog__close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Tutup grafik");
    closeButton.dataset.skillDialogClose = "";
    const closeIcon = document.createElement("i");
    closeIcon.className = "ri-close-line";
    closeIcon.setAttribute("aria-hidden", "true");
    closeButton.append(closeIcon);

    const title = document.createElement("h2");
    title.className = "skill-dialog__title";
    title.id = "skill-dialog-title";
    title.dataset.skillDialogTitle = "";
    const chart = document.createElement("div");
    chart.className = "skill-dialog__chart";
    chart.dataset.skillChart = "";
    chart.setAttribute("role", "img");
    chart.setAttribute("aria-label", "Grafik batang vertikal statistik skill");

    content.append(closeButton, title, chart);
    dialog.append(content);
    skillsPage.append(dialog);
  }
  const dialogTitle = dialog?.querySelector("[data-skill-dialog-title]");
  const chartElement = dialog?.querySelector("[data-skill-chart]");
  if (!track || !dialog || !dialogTitle || !chartElement) {
    throw new Error("Skills page is missing its chart dialog markup.");
  }
  if (typeof window.ApexCharts !== "function") {
    throw new Error("ApexCharts is not loaded. Install project dependencies with npm install.");
  }

  records.forEach((record) => {
    if (
      !record ||
      !Number.isFinite(record.order) ||
      typeof record.name_of_skill !== "string" ||
      typeof record.image_url !== "string" ||
      !record.statistik ||
      typeof record.statistik !== "object" ||
      record.name_of_skill.trim() === "" ||
      record.image_url.trim() === "" ||
      Object.keys(record.statistik).length === 0 ||
      Object.values(record.statistik).some((value) => !Number.isFinite(value) || value < 0 || value > 100)
    ) {
      throw new Error("Each skill record must include its name, image, and percentage statistics from 0 to 100.");
    }
  });

  const showSkillChart = async (record) => {
    if (skillChart) {
      skillChart.destroy();
      skillChart = null;
    }
    chartElement.replaceChildren();
    dialogTitle.textContent = `${record.name_of_skill} — Statistik Skill`;
    dialog.showModal();

    const labels = Object.keys(record.statistik).map((label) =>
      label.replaceAll("_", " ").replace(/\b\p{L}/gu, (letter) => letter.toUpperCase())
    );
    skillChart = new window.ApexCharts(chartElement, {
      chart: {
        type: "bar",
        height: 390,
        toolbar: { show: false },
        foreColor: "#fff7ff",
        fontFamily: "Geologica, sans-serif",
        background: "transparent",
        animations: { easing: "easeinout", speed: 500 }
      },
      series: [{ name: "Persentase", data: Object.values(record.statistik) }],
      colors: ["#ead8e8", "#f4a7c5", "#f7c873", "#8fd8c7", "#9ebcff", "#c3a0f4"],
      plotOptions: { bar: { horizontal: false, distributed: true, columnWidth: "48%", borderRadius: 7 } },
      dataLabels: {
        enabled: true,
        formatter: (value) => `${value}%`,
        offsetY: -22,
        style: { colors: ["#fff7ff"], fontSize: "12px" }
      },
      xaxis: {
        categories: labels,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { rotate: -25, trim: true, style: { colors: "#f4e8f2" } }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: { formatter: (value) => `${Math.round(value)}%` }
      },
      grid: { borderColor: "rgba(255, 247, 255, 0.13)", strokeDashArray: 4 },
      tooltip: { y: { formatter: (value) => `${value}%` } },
      responsive: [{ breakpoint: 600, options: { chart: { height: 340 }, plotOptions: { bar: { columnWidth: "58%" } } } }]
    });
    await skillChart.render();
  };

  dialog.querySelector("[data-skill-dialog-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    skillChart?.destroy();
    skillChart = null;
    chartElement.replaceChildren();
  });

  const orderedRecords = records.slice().sort((first, second) => first.order - second.order);
  for (let index = 0; index < orderedRecords.length; index += 4) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const grid = document.createElement("div");
    grid.className = "skills-slide-grid";

    orderedRecords.slice(index, index + 4).forEach((record) => {
      const card = document.createElement("button");
      card.className = "skill-card";
      card.type = "button";
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `Lihat statistik ${record.name_of_skill}`);

      const name = document.createElement("h2");
      name.className = "skill-card__name";
      name.textContent = record.name_of_skill;

      const imageFrame = document.createElement("div");
      imageFrame.className = "skill-card__image-frame";

      const image = document.createElement("img");
      image.className = "skill-card__image";
      image.src = record.image_url;
      image.alt = `${record.name_of_skill} logo`;
      image.loading = "eager";
      image.addEventListener("error", () => {
        console.error(`Skill image could not be loaded: ${record.image_url}`);
      }, { once: true });

      imageFrame.append(image);
      card.append(name, imageFrame);
      card.addEventListener("click", () => {
        showSkillChart(record).catch((error) => {
          console.error(`Skill chart could not be rendered for ${record.name_of_skill}.`, error);
          dialog.close();
        });
      });
      grid.append(card);
    });

    slide.append(grid);
    track.append(slide);
  }
}

async function loadSkillsData(signal) {
  const carousel = pageContent.querySelector("[data-skills-carousel]");
  if (!carousel) {
    throw new Error("Skills page is missing its carousel.");
  }

  const response = await fetch("data/skills.json", { signal });
  if (!response.ok) {
    throw new Error(`Unable to load skills data (${response.status}).`);
  }

  renderSkillRecords(await response.json(), carousel);

  await initializeSwiper(carousel, signal, {
    slidesPerView: 1,
    slidesPerGroup: 1
  });
}

async function initializeSwiper(carousel, signal, options, SwiperConstructor) {
  const Swiper = SwiperConstructor ??
    (await import("../vendor/swiper/swiper-bundle.min.mjs")).default;
  if (signal.aborted) {
    return;
  }

  pageSwiper = new Swiper(carousel, {
    ...options,
    pagination: {
      el: carousel.parentElement.querySelector(".project-pagination, .skills-pagination"),
      clickable: true
    },
    speed: 650,
    watchOverflow: true
  });

  swiperResizeObserver = new ResizeObserver(scheduleActiveSwiperUpdate);
  swiperResizeObserver.observe(carousel);
}

function renderProjectRecords(records, carousel, container = pageContent) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error("Project data must be a non-empty array.");
  }

  const track = carousel.querySelector("[data-projects-track]");
  const dialog = container.querySelector("[data-project-dialog]");
  const dialogTitle = dialog?.querySelector("[data-project-dialog-title]");
  const dialogDescription = dialog?.querySelector("[data-project-dialog-description]");
  const dialogImage = dialog?.querySelector("[data-project-dialog-image]");

  if (!track || !dialog || !dialogTitle || !dialogDescription || !dialogImage) {
    throw new Error("Project page is missing its carousel or description dialog.");
  }

  records.forEach((record) => {
    if (
      !record ||
      typeof record.project_name !== "string" ||
      typeof record.description !== "string" ||
      typeof record.image !== "string" ||
      record.project_name.trim() === "" ||
      record.description.trim() === "" ||
      record.image.trim() === ""
    ) {
      throw new Error("Each project record must include a project_name, description, and image.");
    }
  });

  records.forEach((record) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    const card = document.createElement("button");
    card.className = "project-card";
    card.classList.add("reveal", "reveal--left");
    card.dataset.reveal = "";
    card.type = "button";
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", `Lihat deskripsi ${record.project_name}`);

    const imageFrame = document.createElement("span");
    imageFrame.className = "project-card__image-frame";

    const image = document.createElement("img");
    image.className = "project-card__image";
    image.src = record.image;
    image.alt = "";
    image.loading = "eager";
    image.addEventListener("error", () => {
      console.error(`Project image could not be loaded: ${record.image}`);
    }, { once: true });

    const title = document.createElement("span");
    title.className = "project-card__title";
    title.textContent = record.project_name;

    imageFrame.append(image);
    card.append(imageFrame, title);
    card.addEventListener("click", () => {
      dialogTitle.textContent = record.project_name;
      dialogDescription.textContent = record.description;
      dialogImage.src = record.image;
      dialogImage.alt = record.project_name;
      dialog.showModal();
    });

    slide.append(card);
    track.append(slide);
  });

  dialog.querySelector("[data-project-dialog-close]")?.addEventListener("click", () => {
    dialog.close();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });
}

function getProjectSwiperOptions() {
  return {
    effect: "coverflow",
    centeredSlides: true,
    initialSlide: 2,
    slidesPerView: "auto",
    slidesPerGroup: 1,
    spaceBetween: -25,
    watchSlidesProgress: true,
    coverflowEffect: {
      rotate: 0,
      stretch: -60,
      depth: 180,
      modifier: 1,
      scale: 0.78,
      slideShadows: false
    },
    breakpoints: {
      701: {
        spaceBetween: -160
      }
    }
  };
}

async function loadProjectData(signal, container = pageContent, initialize = true) {
  const carousel = container.querySelector("[data-projects-carousel]");
  if (!carousel) {
    throw new Error("Project page is missing its carousel.");
  }

  const response = await fetch("data/project.json", { signal });
  if (!response.ok) {
    throw new Error(`Unable to load project data (${response.status}).`);
  }

  renderProjectRecords(await response.json(), carousel, container);
  if (initialize) {
    await initializeSwiper(carousel, signal, getProjectSwiperOptions());
  }
}

function renderContactData(record) {
  const contactCarousel = pageContent.querySelector("[data-contact-carousel]");
  const contactList = pageContent.querySelector("[data-contact-list]");
  const information = pageContent.querySelector("[data-contact-information]");
  if (!record || !contactCarousel || !contactList || !information) {
    throw new Error("Contact page is missing its contact carousel or contact data.");
  }

  const contactDefinitions = [
    { key: "email", label: "Email", icon: "ri-mail-line", getHref: (value) => `mailto:${value}` },
    { key: "phone", label: "Telepon", icon: "ri-smartphone-line", getHref: (value) => `tel:${value}` },
    { key: "whatsapp", label: "WhatsApp", icon: "ri-whatsapp-line", external: true },
    { key: "tiktok", label: "TikTok", icon: "ri-music-2-line", external: true },
    { key: "youtube", label: "YouTube", icon: "ri-youtube-line", external: true },
    { key: "x", label: "X", icon: "ri-twitter-x-line", external: true },
    { key: "facebook", label: "Facebook", icon: "ri-facebook-circle-line", external: true },
    { key: "linkedin", label: "LinkedIn", icon: "ri-linkedin-box-line", external: true },
    { key: "instagram", label: "Instagram", icon: "ri-instagram-line", external: true },
    { key: "google_map", label: "Google Maps", icon: "ri-map-pin-line", external: true }
  ];
  const contacts = contactDefinitions
    .filter(({ key }) => typeof record[key] === "string" && record[key].trim() !== "")
    .map((definition) => ({ ...definition, value: record[definition.key].trim() }));

  if (contacts.length === 0) {
    information.textContent = "Belum ada informasi kontak yang tersedia.";
    contactList.replaceChildren();
    contactCarousel.classList.add("contact-carousel--empty");
    return;
  }

  let selectedIndex = 0;
  const selectContact = (index) => {
    selectedIndex = (index + contacts.length) % contacts.length;
    const selected = contacts[selectedIndex];
    contactList.querySelectorAll(".contact-item").forEach((item, itemIndex) => {
      const active = itemIndex === selectedIndex;
      item.classList.toggle("is-selected", active);
      item.querySelector("button").setAttribute("aria-pressed", String(active));
    });

    information.replaceChildren();
    const label = document.createElement("span");
    label.className = "contact-carousel__label";
    label.textContent = selected.label;
    const link = document.createElement("a");
    link.className = "contact-carousel__value";
    const externalHref = /^https?:\/\//i.test(selected.value)
      ? selected.value
      : `https://${selected.value}`;
    link.href = selected.getHref ? selected.getHref(selected.value) : externalHref;
    link.textContent = selected.value;
    link.setAttribute("aria-label", `${selected.label}: ${selected.value}`);
    if (selected.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    information.append(label, link);
  };

  contacts.forEach((contact, index) => {
    const item = document.createElement("li");
    item.className = "contact-item";
    const angle = (index / contacts.length) * Math.PI * 2 - Math.PI / 2;
    const positionX = 50 + Math.cos(angle) * 50;
    const positionY = 50 + Math.sin(angle) * 50;
    item.style.setProperty("--contact-left", `${positionX}%`);
    item.style.setProperty("--contact-top", `${positionY}%`);

    const button = document.createElement("button");
    button.className = "contact-item__button";
    button.type = "button";
    button.setAttribute("aria-label", `Tampilkan ${contact.label}`);
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => selectContact(index));
    const icon = document.createElement("i");
    icon.className = contact.icon;
    icon.setAttribute("aria-hidden", "true");
    button.append(icon);
    item.append(button);
    contactList.append(item);
  });

  contactCarousel.querySelector("[data-contact-previous]").addEventListener("click", () => {
    selectContact(selectedIndex - 1);
  });
  contactCarousel.querySelector("[data-contact-next]").addEventListener("click", () => {
    selectContact(selectedIndex + 1);
  });
  selectContact(selectedIndex);
}

async function loadContactData(signal) {
  const response = await fetch("data/contact.json", { signal });
  if (!response.ok) {
    throw new Error(`Unable to load contact data (${response.status}).`);
  }

  renderContactData(await response.json());
}

async function loadPage(pageKey) {
  const route = pageRoutes[pageKey];
  if (!route) {
    return;
  }

  stopHomeIdleMotion();
  skillChart?.destroy();
  skillChart = null;

  if (activePageRequest) {
    activePageRequest.abort();
  }
  swiperResizeObserver?.disconnect();
  swiperResizeObserver = null;
  if (swiperResizeFrame) {
    cancelAnimationFrame(swiperResizeFrame);
    swiperResizeFrame = 0;
  }
  pageSwiper?.destroy(true, true);
  pageSwiper = null;

  const controller = new AbortController();
  activePageRequest = controller;
  const requestId = ++pageRequestId;
  pageContent.setAttribute("aria-busy", "true");
  if (pageKey !== "project" || pageContent.childElementCount === 0) {
    pageContent.innerHTML = '<p class="page-status" role="status">Memuat halaman...</p>';
  }

  try {
    const response = await fetch(route.file, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Unable to load ${route.file} (${response.status}).`);
    }

    const fragment = document.createRange().createContextualFragment(await response.text());
    if (requestId !== pageRequestId) {
      return;
    }

    if (!preloader || preloader.classList.contains("is-hidden")) {
      document.documentElement.classList.add("motion-ready");
    }

    if (pageKey === "project") {
      const stagingContainer = document.createElement("div");
      stagingContainer.append(fragment);
      applyPortfolioContent(stagingContainer);
      await loadProjectData(controller.signal, stagingContainer, false);
      const { default: Swiper } = await import("../vendor/swiper/swiper-bundle.min.mjs");
      if (controller.signal.aborted || requestId !== pageRequestId) {
        return;
      }

      pageContent.replaceChildren(...stagingContainer.childNodes);
      const carousel = pageContent.querySelector("[data-projects-carousel]");
      await initializeSwiper(carousel, controller.signal, getProjectSwiperOptions(), Swiper);
    } else {
      pageContent.replaceChildren(fragment);
      applyPortfolioContent(pageContent);
    }

    if (pageKey === "education") {
      await loadEducationData(controller.signal);
    }

    if (pageKey === "skills") {
      await loadSkillsData(controller.signal);
    }

    if (pageKey === "contact") {
      await loadContactData(controller.signal);
    }

    document.title = route.title;
    if (pageKey === "home") {
      startHomeIdleMotion();
    }
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

/* Route supported page fragments and keep unavailable navigation items unchanged. */
navigationItems.forEach((item) => {
  item.addEventListener("click", () => {
    const pageKey = item.dataset.nav;
    if (!pageRoutes[pageKey]) {
      return;
    }
    if (
      item.getAttribute("aria-pressed") === "true" &&
      pageContent.getAttribute("aria-busy") === "false"
    ) {
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

/* Dismiss on progress completion, with a timeout fallback for reduced motion. */
function dismissPreloader() {
  if (!preloader || preloader.classList.contains("is-hidden")) {
    return;
  }

  preloader?.classList.add("is-hidden");
  preloader?.setAttribute("aria-hidden", "true");
  requestAnimationFrame(() => {
    document.documentElement.classList.add("motion-ready");
  });
}

preloaderProgress?.addEventListener("animationend", dismissPreloader, { once: true });
window.setTimeout(dismissPreloader, 2100);

initializePortfolio().catch((error) => {
  console.error("The portfolio could not be initialized.", error);
});

/* Recalculate slide widths when the viewport changes, such as on device rotation. */
window.addEventListener("resize", () => {
  scheduleActiveSwiperUpdate();
});
