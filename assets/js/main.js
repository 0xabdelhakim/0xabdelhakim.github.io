(function () {
  const content = window.SITE_CONTENT;

  if (!content) {
    return;
  }

  const { site, aboutCards = [], publications = [], projects = [], news = [] } = content;

  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => Array.from(document.querySelectorAll(selector));
  const absoluteAssetUrl = (path) =>
    `${site.url.replace(/\/$/, "")}/${String(path || "").replace(/^\//, "")}`;

  function updateMetadata() {
    const title = `${site.name} — ${site.footerTagline || site.role}`;
    document.title = title;

    const metaMap = {
      'meta[name="description"]': site.intro,
      'meta[name="author"]': site.name,
      'meta[property="og:title"]': title,
      'meta[property="og:description"]': site.intro,
      'meta[property="og:url"]': site.url,
      'meta[property="og:image"]': absoluteAssetUrl("assets/images/og-preview.svg"),
      'meta[property="og:image:alt"]': `Academic website preview card for ${site.name}`,
      'meta[name="twitter:title"]': title,
      'meta[name="twitter:description"]': site.intro,
      'meta[name="twitter:image"]': absoluteAssetUrl("assets/images/og-preview.svg"),
      'link[rel="canonical"]': site.url,
    };

    Object.entries(metaMap).forEach(([selector, value]) => {
      const element = select(selector);
      if (!element || !value) {
        return;
      }

      if (element.tagName === "LINK") {
        element.setAttribute("href", value);
      } else {
        element.setAttribute("content", value);
      }
    });
  }

  function populateHero() {
    select("[data-site-name]").textContent = site.name;
    select("[data-name]").textContent = site.name;
    select("[data-title-prefix]").textContent = site.title;
    select("[data-role]").textContent = site.role;
    select("[data-intro]").textContent = site.intro;
    select("[data-current-focus]").textContent = site.currentFocus;
    select("[data-location]").textContent = site.location;
    select("[data-open-to]").textContent = site.openTo;
    select("[data-contact-copy]").textContent = site.contactCopy;
    select("[data-footer-name]").textContent = site.name;
    select("[data-footer-tagline]").textContent = site.footerTagline || site.role;
    select("[data-last-updated]").textContent = `Last updated ${site.lastUpdated}.`;

    const image = select("[data-profile-image]");
    image.src = site.profileImage;
    image.alt = site.profileImageAlt;

    const emailLink = select("[data-email-link]");
    const emailLinkSecondary = select("[data-email-link-secondary]");
    const emailHref = `mailto:${site.email}`;

    emailLink.href = emailHref;
    emailLink.textContent = site.email;
    emailLinkSecondary.href = emailHref;
    emailLinkSecondary.textContent = `Email ${site.name}`;

    const cvLink = select("[data-cv-link]");
    cvLink.href = site.cvUrl;
    if (!site.cvUrl || site.cvUrl === "#") {
      cvLink.setAttribute("aria-disabled", "true");
    } else {
      cvLink.removeAttribute("aria-disabled");
    }
  }

  function renderHeroFacts() {
    const root = select("[data-hero-facts]");
    const template = select("#fact-item-template");

    if (!site.heroFacts || !site.heroFacts.length) {
      root.remove();
      return;
    }

    site.heroFacts.forEach((fact) => {
      const node = template.content.cloneNode(true);
      node.querySelector(".hero-fact-label").textContent = fact.label;
      node.querySelector(".hero-fact-value").textContent = fact.value;
      root.appendChild(node);
    });
  }

  function renderSocialLinks(selector) {
    const container = select(selector);
    if (!container) {
      return;
    }

    const items = (site.socialLinks || [])
      .filter((item) => item && item.label && item.url)
      .map(
        (item) =>
          `<li><a href="${item.url}" target="_blank" rel="noreferrer">${item.label}</a></li>`
      )
      .join("");

    if (!items) {
      container.remove();
      return;
    }

    container.innerHTML = items;
  }

  function renderInfoCards() {
    const root = select("[data-info-cards]");
    const template = select("#info-card-template");

    aboutCards.forEach((card) => {
      if (!card.title && !card.text) {
        return;
      }

      const node = template.content.cloneNode(true);
      node.querySelector(".info-card-label").textContent = card.label || "";
      node.querySelector(".info-card-title").textContent = card.title || "";
      node.querySelector(".info-card-text").textContent = card.text || "";
      root.appendChild(node);
    });
  }

  function renderNews() {
    const root = select("[data-news-list]");
    const template = select("#news-item-template");
    const empty = select("[data-news-empty]");

    if (!news.length) {
      root.remove();
      empty.classList.remove("is-hidden");
      return;
    }

    news.forEach((item) => {
      if (!item.date && !item.text) {
        return;
      }

      const node = template.content.cloneNode(true);
      node.querySelector(".timeline-date").textContent = item.date || "Update";
      node.querySelector(".timeline-text").textContent = item.text || "";
      root.appendChild(node);
    });
  }

  function createLinkMarkup(links) {
    const validLinks = (links || []).filter((link) => link && link.label && link.url && link.url !== "#");

    if (!validLinks.length) {
      return "";
    }

    return validLinks
      .map(
        (link) =>
          `<a class="text-link" href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`
      )
      .join("");
  }

  function renderEntries(items, rootSelector, emptySelector, defaultType) {
    const root = select(rootSelector);
    const empty = select(emptySelector);
    const template = select("#entry-card-template");
    let rendered = 0;

    items.forEach((entry) => {
      if (!entry || !entry.title) {
        return;
      }

      const node = template.content.cloneNode(true);
      const card = node.querySelector(".entry-card");
      const mediaWrap = node.querySelector(".entry-media-wrap");
      const media = node.querySelector(".entry-media");
      const subtitle = node.querySelector(".entry-subtitle");
      const authors = node.querySelector(".entry-authors");
      const summary = node.querySelector(".entry-summary");
      const links = node.querySelector(".entry-links");
      const details = node.querySelector(".entry-details");
      const abstract = node.querySelector(".entry-abstract");
      const bibtexBlock = node.querySelector(".bibtex-block");
      const bibtexCode = node.querySelector(".bibtex-block code");
      const copyButton = node.querySelector(".copy-button");

      node.querySelector(".entry-type").textContent = entry.type || defaultType;
      node.querySelector(".entry-year").textContent = entry.year || "";
      node.querySelector(".entry-title").textContent = entry.title;

      if (entry.subtitle) {
        subtitle.textContent = entry.subtitle;
      } else {
        subtitle.remove();
      }

      if (entry.authors) {
        authors.textContent = entry.authors;
      } else {
        authors.remove();
      }

      if (entry.summary) {
        summary.textContent = entry.summary;
      } else {
        summary.remove();
      }

      const linksMarkup = createLinkMarkup(entry.links);
      if (linksMarkup) {
        links.innerHTML = linksMarkup;
      } else {
        links.remove();
      }

      if (entry.image) {
        media.src = entry.image;
        media.alt = entry.imageAlt || entry.title;
      } else {
        mediaWrap.remove();
        card.classList.add("entry-card-no-media");
      }

      if (entry.abstract) {
        abstract.textContent = entry.abstract;
      } else {
        abstract.remove();
      }

      if (entry.bibtex) {
        bibtexCode.textContent = entry.bibtex;
        copyButton.dataset.bibtex = entry.bibtex;
      } else {
        bibtexBlock.remove();
        copyButton.remove();
      }

      if (!entry.abstract && !entry.bibtex) {
        details.remove();
      }

      root.appendChild(card);
      rendered += 1;
    });

    if (!rendered) {
      root.remove();
      empty.classList.remove("is-hidden");
    }
  }

  function setupMenu() {
    const button = select(".menu-toggle");
    const nav = select(".site-nav");

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open");
    });

    selectAll(".site-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        button.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  function setupActiveNav() {
    const links = selectAll(".site-nav a");
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: 0.05,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setupReveal() {
    const items = selectAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
      }
    );

    items.forEach((item) => observer.observe(item));
  }

  function setupBibtexCopy() {
    selectAll(".copy-button").forEach((button) => {
      button.addEventListener("click", async () => {
        const bibtex = button.dataset.bibtex || "";
        if (!bibtex) {
          return;
        }

        try {
          await navigator.clipboard.writeText(bibtex);
          const original = button.textContent;
          button.textContent = "Copied";
          window.setTimeout(() => {
            button.textContent = original;
          }, 1600);
        } catch (error) {
          button.textContent = "Copy failed";
          window.setTimeout(() => {
            button.textContent = "Copy BibTeX";
          }, 1600);
        }
      });
    });
  }

  updateMetadata();
  populateHero();
  renderHeroFacts();
  renderSocialLinks("[data-social-links]");
  renderSocialLinks("[data-social-links-secondary]");
  renderInfoCards();
  renderEntries(publications, "[data-publication-list]", "[data-publication-empty]", "Publication");
  renderEntries(projects, "[data-project-list]", "[data-project-empty]", "Project");
  renderNews();
  setupMenu();
  setupActiveNav();
  setupReveal();
  setupBibtexCopy();
})();
