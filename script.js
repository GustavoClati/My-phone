(() => {
  "use strict";

  const config = window.MYPHONNE_CONFIG || {};
  const products = Array.isArray(window.MYPHONNE_PRODUCTS) ? window.MYPHONNE_PRODUCTS : [];

  const whatsappUrl = (message) => {
    const number = String(config.whatsappNumber || "").replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message || "Olá! Vim pelo site da My Phonne.")}`;
  };

  const applyBusinessConfig = () => {
    document.querySelectorAll(".js-whatsapp").forEach((link) => {
      link.href = whatsappUrl(link.dataset.whatsappMessage);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    document.querySelectorAll(".js-phone").forEach((link) => {
      link.href = `tel:+${String(config.phoneNumber || "").replace(/\D/g, "")}`;
    });

    document.querySelectorAll(".js-facebook").forEach((link) => {
      link.href = config.facebookUrl || "#";
    });

    document.querySelectorAll(".js-reviews").forEach((link) => {
      link.href = config.googleReviewsUrl || "#";
    });

    document.querySelectorAll(".js-directions").forEach((link) => {
      link.href = config.directionsUrl || "#";
    });

    document.querySelectorAll("[data-config-text]").forEach((element) => {
      const value = config[element.dataset.configText];
      if (!value) return;

      if (element.children.length === 0) {
        element.textContent = value;
        return;
      }

      const textNode = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
      if (textNode) textNode.textContent = value;
    });
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const renderProducts = () => {
    const grid = document.querySelector("#product-grid");
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = '<p class="product-empty">Novidades chegando. Consulte a equipe pelo WhatsApp.</p>';
      return;
    }

    grid.innerHTML = products.map((product) => {
      const name = escapeHtml(product.name);
      const message = `Olá! Vi o produto ${product.name} no site da My Phonne e gostaria de saber mais informações.`;
      return `
        <article class="product-card reveal">
          <div class="product-media">
            <img src="${escapeHtml(product.image)}" alt="${name}" loading="lazy" style="object-position:${escapeHtml(product.imagePosition || "center")}">
            <span class="product-category">${escapeHtml(product.category)}</span>
          </div>
          <div class="product-body">
            <h3>${name}</h3>
            <p class="product-description">${escapeHtml(product.description)}</p>
            <div class="product-bottom">
              <span class="product-price">Preço <strong>${escapeHtml(product.price || "Consulte")}</strong></span>
              <a class="button button-primary product-interest" href="${whatsappUrl(message)}" target="_blank" rel="noopener noreferrer" aria-label="Tenho interesse em ${name}">Tenho interesse</a>
            </div>
          </div>
        </article>`;
    }).join("");
  };

  const setupMenu = () => {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("menu-open");
    };

    toggle.addEventListener("click", () => {
      const shouldOpen = toggle.getAttribute("aria-expanded") !== "true";
      nav.classList.toggle("open", shouldOpen);
      toggle.setAttribute("aria-expanded", String(shouldOpen));
      toggle.setAttribute("aria-label", shouldOpen ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-open", shouldOpen);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1160) closeMenu();
    });
  };

  const setupHeader = () => {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const update = () => header.classList.toggle("scrolled", window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
  };

  const setupReveals = () => {
    const elements = document.querySelectorAll(".reveal");
    if (!elements.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px" });

    elements.forEach((element) => observer.observe(element));
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const setupContactForm = () => {
    const form = document.querySelector("#contact-form");
    const phoneInput = document.querySelector("#phone");
    const status = document.querySelector("#form-status");
    if (!form) return;

    phoneInput?.addEventListener("input", () => {
      phoneInput.value = formatPhone(phoneInput.value);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const message = [
        "Olá! Enviei uma mensagem pelo site da My Phonne.",
        "",
        `Nome: ${data.get("name")}`,
        `Telefone: ${data.get("phone")}`,
        `Assunto: ${data.get("subject")}`,
        `Mensagem: ${data.get("message")}`
      ].join("\n");

      if (status) status.textContent = "Tudo certo! Abrindo o WhatsApp para enviar sua mensagem…";
      window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    });
  };

  let analyticsInitialized = false;

  const initializeAnalytics = () => {
    if (analyticsInitialized) return;
    analyticsInitialized = true;

    const googleId = config.analytics?.googleMeasurementId;
    if (googleId) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleId)}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", googleId, { anonymize_ip: true });
    }

    const pixelId = config.analytics?.metaPixelId;
    if (pixelId) {
      const fbq = function fbq() {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      window.fbq = window.fbq || fbq;
      window._fbq = window._fbq || window.fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
      window.fbq("init", pixelId);
      window.fbq("track", "PageView");
    }
  };

  const setupCookies = () => {
    const banner = document.querySelector("#cookie-banner");
    const accept = document.querySelector("#cookie-accept");
    const essential = document.querySelector("#cookie-essential");
    const settings = document.querySelector(".cookie-settings");
    if (!banner) return;

    const key = "myphonne-cookie-preference";
    const show = () => { banner.hidden = false; };
    const hide = () => { banner.hidden = true; };
    const stored = localStorage.getItem(key);

    if (stored === "all") initializeAnalytics();
    if (!stored) window.setTimeout(show, 650);

    accept?.addEventListener("click", () => {
      localStorage.setItem(key, "all");
      initializeAnalytics();
      hide();
    });

    essential?.addEventListener("click", () => {
      localStorage.setItem(key, "essential");
      hide();
    });

    settings?.addEventListener("click", () => {
      localStorage.removeItem(key);
      show();
    });
  };

  renderProducts();
  applyBusinessConfig();
  setupMenu();
  setupHeader();
  setupReveals();
  setupContactForm();
  setupCookies();
})();
