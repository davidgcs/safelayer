(() => {
  "use strict";

  const PDF_JS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
  const PDF_JS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";
  const PDF_LIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm";
  const WATERMARK_ANGLE = -28 * Math.PI / 180;
  const WATERMARK_FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

  const translations = {
    en: {
      PAGE_TITLE: "Safe Layer — Document sanitizer",
      META_DESCRIPTION: "Sanitize images and PDF documents locally in your browser.",
      APP_SUBTITLE: "Local sanitization of images and PDFs for safer document sharing.",
      LOCAL_BADGE: "Processed in your browser",
      GITHUB_KICKER: "Open source · Built by",
      GITHUB_PROFILE_LABEL: "View @davidgcs on GitHub",
      GITHUB_REPOSITORY_CTA: "See code",
      GITHUB_REPOSITORY_LABEL: "See the Safe Layer source code on GitHub",
      DARK_THEME: "Dark theme",
      LIGHT_THEME: "Light theme",
      DARK_THEME_LABEL: "Switch to dark theme",
      LIGHT_THEME_LABEL: "Switch to light theme",
      LANGUAGE_LABEL: "Language",
      CONTROLS_LABEL: "Document controls",
      OPEN_FILE: "Open file",
      GRAYSCALE_ADD: "Grayscale",
      GRAYSCALE_REMOVE: "Remove grayscale",
      WATERMARK_INPUT_LABEL: "Watermark text",
      WATERMARK_WEIGHT_LABEL: "Watermark weight",
      WATERMARK_ADD: "Add watermark",
      WATERMARK_REMOVE: "Remove watermark",
      PAGE_ACTIONS_LABEL: "Page {page} actions",
      ROTATE_LEFT: "Rotate left",
      ROTATE_RIGHT: "Rotate right",
      CROP_PAGE: "Crop page",
      CANCEL_CROP: "Cancel crop",
      APPLY_CROP: "Apply crop",
      CLEAR_REDACTIONS: "Clear redactions",
      SAVE_DOWNLOAD: "Save and download",
      INITIAL_STATUS: "Select an image or PDF, then drag black rectangles over the data you want to hide.",
      EMPTY_DOCUMENT: "No document loaded.",
      HOW_TO_USE: "How to use it",
      STEP_ONE: "Upload a JPG, PNG, WebP, or PDF.",
      STEP_TWO: "Select a page to rotate it, or choose Crop page and drag the area you want to keep.",
      STEP_THREE: "Set grayscale and watermark options, then drag over private data to create black redactions.",
      STEP_FOUR: "Select Save and download. The watermark will repeat across every page.",
      PRIVACY_LABEL: "Privacy:",
      PRIVACY_TEXT: "your file is processed in this browser and is not sent to a server by this version.",
      NOTE_LABEL: "Note:",
      NOTE_TEXT: "redactions are rasterized in exported PDFs, so covered data does not remain selectable text.",
      DEFAULT_WATERMARK: "copy",
      LOADING: "Loading…",
      PDF_ENGINE_ERROR: "The PDF engine could not be loaded. Check your connection.",
      UNSUPPORTED_FORMAT: "Unsupported file format.",
      DOCUMENT_LOADED: "Document loaded. Drag over the preview to redact data.",
      PAGE_SELECTED: "Page {page} selected. Rotate it, crop it, or drag to redact data.",
      CROP_INSTRUCTION: "Drag over the selected page to choose the area you want to keep.",
      CROP_READY: "Crop area selected. Drag its corner handles to resize it, then apply the crop.",
      CROP_APPLIED: "Crop applied to page {page}.",
      PAGE_ROTATED: "Page {page} rotated.",
      OPEN_ERROR: "Could not open the file: {detail}",
      OPEN_ERROR_EMPTY: "The file could not be opened.",
      FIRST_UPLOAD: "Load a file first.",
      GENERATING: "Generating file…",
      COMPLETE: "Done. A sanitized copy has been generated.",
      SAVE_ERROR: "Could not save the file: {detail}",
      IMAGE_ERROR: "The image could not be generated.",
      FILE_SUFFIX: "sanitized"
    },
    es: {
      PAGE_TITLE: "Safe Layer — Sanitizador de documentos",
      META_DESCRIPTION: "Sanitiza imágenes y documentos PDF de forma local en tu navegador.",
      APP_SUBTITLE: "Sanitización local de imágenes y PDF para compartir documentos con menor riesgo.",
      LOCAL_BADGE: "Procesamiento en tu navegador",
      GITHUB_KICKER: "Código abierto · Creado por",
      GITHUB_PROFILE_LABEL: "Ver @davidgcs en GitHub",
      GITHUB_REPOSITORY_CTA: "Ver código",
      GITHUB_REPOSITORY_LABEL: "Ver el código fuente de Safe Layer en GitHub",
      DARK_THEME: "Tema oscuro",
      LIGHT_THEME: "Tema claro",
      DARK_THEME_LABEL: "Cambiar al tema oscuro",
      LIGHT_THEME_LABEL: "Cambiar al tema claro",
      LANGUAGE_LABEL: "Idioma",
      CONTROLS_LABEL: "Controles del documento",
      OPEN_FILE: "Abrir archivo",
      GRAYSCALE_ADD: "Escala de grises",
      GRAYSCALE_REMOVE: "Quitar escala de grises",
      WATERMARK_INPUT_LABEL: "Texto de la marca de agua",
      WATERMARK_WEIGHT_LABEL: "Grosor de la marca",
      WATERMARK_ADD: "Añadir marca de agua",
      WATERMARK_REMOVE: "Quitar marca de agua",
      PAGE_ACTIONS_LABEL: "Acciones de la página {page}",
      ROTATE_LEFT: "Girar a la izquierda",
      ROTATE_RIGHT: "Girar a la derecha",
      CROP_PAGE: "Recortar página",
      CANCEL_CROP: "Cancelar recorte",
      APPLY_CROP: "Aplicar recorte",
      CLEAR_REDACTIONS: "Borrar tachados",
      SAVE_DOWNLOAD: "Guardar y descargar",
      INITIAL_STATUS: "Selecciona una imagen o PDF. Después, arrastra rectángulos negros sobre los datos que quieras ocultar.",
      EMPTY_DOCUMENT: "No hay ningún documento cargado.",
      HOW_TO_USE: "Cómo usarlo",
      STEP_ONE: "Sube un JPG, PNG, WebP o PDF.",
      STEP_TWO: "Selecciona una página para girarla, o pulsa Recortar página y arrastra el área que quieras conservar.",
      STEP_THREE: "Configura la escala de grises y la marca de agua; después arrastra sobre los datos privados para tacharlos.",
      STEP_FOUR: "Pulsa Guardar y descargar. La marca de agua se repetirá por todas las páginas.",
      PRIVACY_LABEL: "Privacidad:",
      PRIVACY_TEXT: "el archivo se procesa en este navegador y no se envía a un servidor en esta versión.",
      NOTE_LABEL: "Nota:",
      NOTE_TEXT: "los tachados se rasterizan en el PDF exportado, por lo que los datos cubiertos no quedan como texto seleccionable.",
      DEFAULT_WATERMARK: "copia",
      LOADING: "Cargando…",
      PDF_ENGINE_ERROR: "No se pudo cargar el motor PDF. Comprueba tu conexión.",
      UNSUPPORTED_FORMAT: "Formato de archivo no compatible.",
      DOCUMENT_LOADED: "Documento cargado. Arrastra sobre la vista previa para tachar datos.",
      PAGE_SELECTED: "Página {page} seleccionada. Puedes girarla, recortarla o arrastrar para tachar datos.",
      CROP_INSTRUCTION: "Arrastra sobre la página seleccionada para elegir el área que quieras conservar.",
      CROP_READY: "Área de recorte seleccionada. Arrastra las esquinas para ajustarla y aplica el recorte.",
      CROP_APPLIED: "Recorte aplicado a la página {page}.",
      PAGE_ROTATED: "Página {page} girada.",
      OPEN_ERROR: "No se pudo abrir el archivo: {detail}",
      OPEN_ERROR_EMPTY: "No se pudo abrir el archivo.",
      FIRST_UPLOAD: "Primero carga un archivo.",
      GENERATING: "Generando archivo…",
      COMPLETE: "Listo. Se ha generado una copia sanitizada.",
      SAVE_ERROR: "No se pudo guardar el archivo: {detail}",
      IMAGE_ERROR: "No se pudo generar la imagen.",
      FILE_SUFFIX: "sanitizado"
    }
  };

  const elements = {
    bar: document.querySelector("#bar"),
    clear: document.querySelector("#clear"),
    file: document.querySelector("#file"),
    gray: document.querySelector("#gray"),
    language: document.querySelector("#language"),
    metaDescription: document.querySelector("#meta-description"),
    pages: document.querySelector("#pages"),
    progress: document.querySelector("[role='progressbar']"),
    save: document.querySelector("#save"),
    status: document.querySelector("#status"),
    theme: document.querySelector("#theme"),
    themeLabel: document.querySelector("#theme-label"),
    watermark: document.querySelector("#watermark"),
    watermarkText: document.querySelector("#wm"),
    watermarkWeight: document.querySelector("#wm-weight"),
    watermarkWeightValue: document.querySelector("#wm-weight-value")
  };

  const state = {
    activePage: null,
    cropMode: false,
    cropPage: null,
    cropSelection: null,
    grayscale: true,
    kind: null,
    language: "en",
    originalFile: null,
    pages: [],
    processing: false,
    status: {key: "INITIAL_STATUS", params: {}},
    theme: "light",
    watermark: true,
    watermarkFrame: null
  };

  let pdfJsPromise = null;
  let pdfLibPromise = null;

  function translate(key, params = {}, language = state.language) {
    const template = translations[language]?.[key] ?? translations.en[key] ?? key;
    return Object.entries(params).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template
    );
  }

  function getInitialLanguage() {
    try {
      const saved = localStorage.getItem("safe-layer-language");
      if (saved && translations[saved]) return saved;
    } catch {
      // Some file:// contexts disable storage. Browser language remains a safe fallback.
    }
    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem("safe-layer-theme");
      if (saved === "dark" || saved === "light") return saved;
    } catch {
      // Theme persistence is optional.
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    state.theme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = state.theme;
    updateThemeControl();

    try {
      localStorage.setItem("safe-layer-theme", state.theme);
    } catch {
      // Theme persistence is optional.
    }
  }

  function updateThemeControl() {
    const isDark = state.theme === "dark";
    elements.theme.setAttribute("aria-checked", String(isDark));
    elements.theme.setAttribute("aria-label", translate(isDark ? "LIGHT_THEME_LABEL" : "DARK_THEME_LABEL"));
    elements.themeLabel.textContent = translate(isDark ? "LIGHT_THEME" : "DARK_THEME");
  }

  function toggleTheme() {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  }

  function applyLanguage(language) {
    const nextLanguage = translations[language] ? language : "en";
    const previousDefault = translate("DEFAULT_WATERMARK");
    const shouldTranslateWatermark =
      !elements.watermarkText.value.trim() || elements.watermarkText.value === previousDefault;

    state.language = nextLanguage;
    document.documentElement.lang = nextLanguage;
    document.title = translate("PAGE_TITLE");
    elements.metaDescription.content = translate("META_DESCRIPTION");
    elements.language.value = nextLanguage;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = translate(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    });

    if (shouldTranslateWatermark) {
      elements.watermarkText.value = translate("DEFAULT_WATERMARK");
    }

    updateToggleLabels();
    updateThemeControl();
    setStatus(state.status.key, state.status.params);

    try {
      localStorage.setItem("safe-layer-language", nextLanguage);
    } catch {
      // Language persistence is optional.
    }

    if (state.watermark) scheduleWatermarkRender();
  }

  function setStatus(key, params = {}) {
    state.status = {key, params};
    elements.status.textContent = translate(key, params);
  }

  function setProgress(value) {
    const percentage = Math.round(Math.max(0, Math.min(1, value)) * 100);
    elements.bar.style.width = `${percentage}%`;
    elements.progress.setAttribute("aria-valuenow", String(percentage));
  }

  function setBusy(isBusy) {
    state.processing = isBusy;
    elements.file.disabled = isBusy;
    elements.gray.disabled = isBusy;
    elements.watermarkText.disabled = isBusy;
    elements.watermarkWeight.disabled = isBusy;
    elements.watermark.disabled = isBusy;
    elements.clear.disabled = isBusy;
    elements.save.disabled = isBusy;
    updatePageActionStates();
  }

  function updateToggleLabels() {
    elements.gray.textContent = translate(state.grayscale ? "GRAYSCALE_REMOVE" : "GRAYSCALE_ADD");
    elements.gray.setAttribute("aria-pressed", String(state.grayscale));
    elements.watermark.textContent = translate(state.watermark ? "WATERMARK_REMOVE" : "WATERMARK_ADD");
    elements.watermark.setAttribute("aria-pressed", String(state.watermark));
    updatePageActionStates();
  }

  function updateWatermarkWeight() {
    elements.watermarkWeightValue.textContent = elements.watermarkWeight.value;
  }

  function showEmptyState(translationKey) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.dataset.i18n = translationKey;
    empty.textContent = translate(translationKey);
    elements.pages.replaceChildren(empty);
  }

  function resetDocument() {
    clearCropSelection();
    state.activePage = null;
    state.cropMode = false;
    state.cropPage = null;
    state.pages = [];
    state.grayscale = true;
    state.watermark = true;
    elements.pages.replaceChildren();
    updateToggleLabels();
  }

  async function getPdfJs() {
    if (!pdfJsPromise) {
      pdfJsPromise = import(PDF_JS_URL)
        .then((pdfjs) => {
          pdfjs.GlobalWorkerOptions.workerSrc = PDF_JS_WORKER_URL;
          return pdfjs;
        })
        .catch((error) => {
          pdfJsPromise = null;
          throw new Error(translate("PDF_ENGINE_ERROR"), {cause: error});
        });
    }
    return pdfJsPromise;
  }

  async function getPdfLib() {
    if (!pdfLibPromise) {
      pdfLibPromise = import(PDF_LIB_URL).catch((error) => {
        pdfLibPromise = null;
        throw error;
      });
    }
    return pdfLibPromise;
  }

  async function handleFileSelection(event) {
    const file = event.target.files[0];
    if (!file || state.processing) return;

    state.originalFile = file;
    resetDocument();
    setBusy(true);
    setStatus("LOADING");
    setProgress(0.05);

    try {
      if (file.type === "application/pdf") {
        state.kind = "pdf";
        await loadPdf(file);
      } else if (file.type.startsWith("image/")) {
        state.kind = "image";
        await loadImage(file);
      } else {
        throw new Error(translate("UNSUPPORTED_FORMAT"));
      }

      if (state.watermark) renderWatermarks();
      setProgress(1);
      setStatus("DOCUMENT_LOADED");
    } catch (error) {
      console.error(error);
      state.pages = [];
      showEmptyState("OPEN_ERROR_EMPTY");
      setProgress(0);
      setStatus("OPEN_ERROR", {detail: error.message});
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function loadPdf(file) {
    const pdfjs = await getPdfJs();
    const data = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({data}).promise;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const pdfPage = await pdf.getPage(pageNumber);
      const viewport = pdfPage.getViewport({scale: 1.6});
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await pdfPage.render({
        canvasContext: canvas.getContext("2d"),
        viewport
      }).promise;

      addPage(canvas);
      setProgress(0.05 + 0.85 * pageNumber / pdf.numPages);
    }
  }

  async function loadImage(file) {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = objectUrl;
      await image.decode();

      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      addPage(canvas);
      setProgress(0.9);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  function addPage(canvas) {
    canvas.className = "document-canvas";

    const shell = document.createElement("div");
    shell.className = "page-shell";

    const wrapper = document.createElement("div");
    wrapper.className = "page";

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const page = {canvas, overlay, rects: [], shell, wrapper};
    wrapper.classList.toggle("grayscale", state.grayscale);
    wrapper.append(canvas, overlay);
    state.pages.push(page);
    const actions = createPageActions(page, state.pages.length);
    shell.append(actions, wrapper);
    elements.pages.append(shell);

    if (!state.activePage) selectPage(page, false);

    enableRedactionDrawing(page);
  }

  function createPageActions(page, pageNumber) {
    const actions = document.createElement("div");
    actions.className = "page-actions";
    actions.setAttribute("aria-label", translate("PAGE_ACTIONS_LABEL", {page: pageNumber}));

    page.rotateLeftButton = createIconButton("ROTATE_LEFT", `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 7H4V2"/><path d="M4 7a8 8 0 1 1-1 8"/>
      </svg>
    `);
    page.rotateRightButton = createIconButton("ROTATE_RIGHT", `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 7h5V2"/><path d="M20 7a8 8 0 1 0 1 8"/>
      </svg>
    `);
    page.cropButton = createIconButton("CROP_PAGE", `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14"/>
      </svg>
    `);
    page.applyCropButton = createIconButton("APPLY_CROP", `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 12 4 4L19 6"/>
      </svg>
    `, "page-action--confirm");

    page.rotateLeftButton.addEventListener("click", () => rotatePage(page, "left"));
    page.rotateRightButton.addEventListener("click", () => rotatePage(page, "right"));
    page.cropButton.addEventListener("click", () => toggleCropMode(page));
    page.applyCropButton.addEventListener("click", () => applyCrop(page));
    actions.append(page.rotateLeftButton, page.rotateRightButton, page.cropButton, page.applyCropButton);
    page.actions = actions;
    updatePageActionStates();
    return actions;
  }

  function createIconButton(translationKey, icon, extraClass = "") {
    const button = document.createElement("button");
    button.className = `page-action ${extraClass}`.trim();
    button.type = "button";
    button.dataset.labelKey = translationKey;
    button.innerHTML = icon;
    return button;
  }

  function enableRedactionDrawing(page) {
    let start = null;
    let temporarySelection = null;
    let drawingCrop = false;

    page.overlay.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      if (state.cropMode && state.cropPage !== page) setCropMode(false);
      selectPage(page);
      const bounds = page.overlay.getBoundingClientRect();
      start = getPointerPosition(event, bounds);
      drawingCrop = state.cropMode && state.cropPage === page;
      if (drawingCrop) clearCropSelection();

      temporarySelection = document.createElement("div");
      temporarySelection.className = drawingCrop ? "crop-selection" : "redaction";
      page.overlay.append(temporarySelection);
      page.overlay.setPointerCapture(event.pointerId);
    });

    page.overlay.addEventListener("pointermove", (event) => {
      if (!start) return;
      const bounds = page.overlay.getBoundingClientRect();
      updateSelectionStyle(temporarySelection, start, getPointerPosition(event, bounds));
    });

    page.overlay.addEventListener("pointerup", (event) => {
      if (!start) return;
      const bounds = page.overlay.getBoundingClientRect();
      const end = getPointerPosition(event, bounds);
      const rect = getNormalizedRect(start, end, bounds);

      if (rect.width > 0.005 && rect.height > 0.005) {
        setRelativeSelectionStyle(temporarySelection, rect);
        if (drawingCrop) {
          state.cropSelection = {element: temporarySelection, page, rect};
          addCropResizeHandles(temporarySelection, page);
          updatePageActionStates();
          setStatus("CROP_READY");
        } else {
          page.rects.push(rect);
        }
      } else {
        temporarySelection.remove();
      }

      start = null;
      temporarySelection = null;
      drawingCrop = false;
    });

    page.overlay.addEventListener("pointercancel", () => {
      temporarySelection?.remove();
      start = null;
      temporarySelection = null;
      drawingCrop = false;
    });
  }

  function getPointerPosition(event, bounds) {
    return {
      x: Math.max(0, Math.min(bounds.width, event.clientX - bounds.left)),
      y: Math.max(0, Math.min(bounds.height, event.clientY - bounds.top))
    };
  }

  function getNormalizedRect(start, end, bounds) {
    return {
      x: Math.min(start.x, end.x) / bounds.width,
      y: Math.min(start.y, end.y) / bounds.height,
      width: Math.abs(end.x - start.x) / bounds.width,
      height: Math.abs(end.y - start.y) / bounds.height
    };
  }

  function updateSelectionStyle(element, start, end) {
    Object.assign(element.style, {
      left: `${Math.min(start.x, end.x)}px`,
      top: `${Math.min(start.y, end.y)}px`,
      width: `${Math.abs(end.x - start.x)}px`,
      height: `${Math.abs(end.y - start.y)}px`
    });
  }

  function setRelativeSelectionStyle(element, rect) {
    Object.assign(element.style, {
      left: `${rect.x * 100}%`,
      top: `${rect.y * 100}%`,
      width: `${rect.width * 100}%`,
      height: `${rect.height * 100}%`
    });
  }

  function addCropResizeHandles(selection, page) {
    ["nw", "ne", "se", "sw"].forEach((direction) => {
      const handle = document.createElement("span");
      handle.className = `crop-handle crop-handle--${direction}`;
      handle.dataset.direction = direction;
      handle.setAttribute("aria-hidden", "true");
      selection.append(handle);
      enableCropHandle(handle, selection, page);
    });
  }

  function enableCropHandle(handle, selection, page) {
    let initialRect = null;
    let bounds = null;

    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || state.cropSelection?.element !== selection) return;
      event.preventDefault();
      event.stopPropagation();
      bounds = page.overlay.getBoundingClientRect();
      initialRect = {...state.cropSelection.rect};
      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener("pointermove", (event) => {
      if (!initialRect) return;
      event.preventDefault();
      event.stopPropagation();

      const pointer = getPointerPosition(event, bounds);
      const x = pointer.x / bounds.width;
      const y = pointer.y / bounds.height;
      const minimumSize = 0.01;
      let left = initialRect.x;
      let top = initialRect.y;
      let right = initialRect.x + initialRect.width;
      let bottom = initialRect.y + initialRect.height;
      const direction = handle.dataset.direction;

      if (direction.includes("w")) left = Math.min(x, right - minimumSize);
      if (direction.includes("e")) right = Math.max(x, left + minimumSize);
      if (direction.includes("n")) top = Math.min(y, bottom - minimumSize);
      if (direction.includes("s")) bottom = Math.max(y, top + minimumSize);

      const rect = {
        x: Math.max(0, left),
        y: Math.max(0, top),
        width: Math.min(1, right) - Math.max(0, left),
        height: Math.min(1, bottom) - Math.max(0, top)
      };
      state.cropSelection.rect = rect;
      setRelativeSelectionStyle(selection, rect);
    });

    const finishResize = (event) => {
      if (!initialRect) return;
      event.stopPropagation();
      initialRect = null;
      bounds = null;
      setStatus("CROP_READY");
    };

    handle.addEventListener("pointerup", finishResize);
    handle.addEventListener("pointercancel", finishResize);
  }

  function selectPage(page, announce = true) {
    if (!page) return;
    state.activePage = page;
    state.pages.forEach((candidate) => {
      candidate.wrapper.classList.toggle("selected", candidate === page);
    });

    if (announce && !state.cropMode) {
      setStatus("PAGE_SELECTED", {page: state.pages.indexOf(page) + 1});
    }
  }

  function clearCropSelection() {
    state.cropSelection?.element.remove();
    state.cropSelection = null;
    updatePageActionStates();
  }

  function setCropMode(enabled, page = null) {
    state.cropMode = enabled;
    if (enabled) {
      clearCropSelection();
      state.cropPage = page;
      selectPage(page, false);
    } else {
      state.cropPage = null;
      clearCropSelection();
    }
    state.pages.forEach((candidate) => {
      candidate.overlay.classList.toggle("crop-mode", enabled && candidate === page);
    });
    updatePageActionStates();
  }

  function toggleCropMode(page) {
    const shouldEnable = !state.cropMode || state.cropPage !== page;
    setCropMode(shouldEnable, shouldEnable ? page : null);
    setStatus(state.cropMode ? "CROP_INSTRUCTION" : "DOCUMENT_LOADED");
  }

  function rotatePage(page, direction) {
    selectPage(page, false);
    setCropMode(false);
    const source = document.createElement("canvas");
    source.width = page.canvas.width;
    source.height = page.canvas.height;
    source.getContext("2d").drawImage(page.canvas, 0, 0);

    page.canvas.width = source.height;
    page.canvas.height = source.width;
    const context = page.canvas.getContext("2d");

    if (direction === "left") {
      context.translate(0, page.canvas.height);
      context.rotate(-Math.PI / 2);
      page.rects = page.rects.map((rect) => ({
        x: rect.y,
        y: 1 - rect.x - rect.width,
        width: rect.height,
        height: rect.width
      }));
    } else {
      context.translate(page.canvas.width, 0);
      context.rotate(Math.PI / 2);
      page.rects = page.rects.map((rect) => ({
        x: 1 - rect.y - rect.height,
        y: rect.x,
        width: rect.height,
        height: rect.width
      }));
    }

    context.drawImage(source, 0, 0);
    renderPageRedactions(page);
    renderWatermarks();
    setStatus("PAGE_ROTATED", {page: state.pages.indexOf(page) + 1});
  }

  function applyCrop(targetPage) {
    if (!state.cropSelection || state.cropSelection.page !== targetPage) return;

    const {page, rect} = state.cropSelection;
    const source = document.createElement("canvas");
    source.width = page.canvas.width;
    source.height = page.canvas.height;
    source.getContext("2d").drawImage(page.canvas, 0, 0);

    const x = Math.floor(rect.x * source.width);
    const y = Math.floor(rect.y * source.height);
    const width = Math.max(1, Math.min(source.width - x, Math.ceil(rect.width * source.width)));
    const height = Math.max(1, Math.min(source.height - y, Math.ceil(rect.height * source.height)));

    page.rects = page.rects
      .map((redaction) => intersectWithCrop(redaction, rect))
      .filter(Boolean);

    clearCropSelection();
    page.canvas.width = width;
    page.canvas.height = height;
    page.canvas.getContext("2d").drawImage(source, x, y, width, height, 0, 0, width, height);
    setCropMode(false);
    renderPageRedactions(page);
    renderWatermarks();
    selectPage(page, false);
    setStatus("CROP_APPLIED", {page: state.pages.indexOf(page) + 1});
  }

  function updatePageActionStates() {
    state.pages.forEach((page, index) => {
      if (!page.actions) return;
      page.actions.setAttribute("aria-label", translate("PAGE_ACTIONS_LABEL", {page: index + 1}));
      const isCropping = state.cropMode && state.cropPage === page;
      const hasCropSelection = state.cropSelection?.page === page;

      page.rotateLeftButton.disabled = state.processing;
      page.rotateRightButton.disabled = state.processing;
      page.cropButton.disabled = state.processing;
      page.applyCropButton.disabled = state.processing || !hasCropSelection;
      page.cropButton.setAttribute("aria-pressed", String(isCropping));

      [page.rotateLeftButton, page.rotateRightButton, page.applyCropButton].forEach((button) => {
        const label = translate(button.dataset.labelKey);
        button.setAttribute("aria-label", label);
        button.title = label;
      });

      const cropLabel = translate(isCropping ? "CANCEL_CROP" : "CROP_PAGE");
      page.cropButton.setAttribute("aria-label", cropLabel);
      page.cropButton.title = cropLabel;
    });
  }

  function intersectWithCrop(redaction, crop) {
    const left = Math.max(redaction.x, crop.x);
    const top = Math.max(redaction.y, crop.y);
    const right = Math.min(redaction.x + redaction.width, crop.x + crop.width);
    const bottom = Math.min(redaction.y + redaction.height, crop.y + crop.height);
    if (right <= left || bottom <= top) return null;

    return {
      x: (left - crop.x) / crop.width,
      y: (top - crop.y) / crop.height,
      width: (right - left) / crop.width,
      height: (bottom - top) / crop.height
    };
  }

  function renderPageRedactions(page) {
    page.overlay.querySelectorAll(".redaction").forEach((redaction) => redaction.remove());
    page.rects.forEach((rect) => {
      const redaction = document.createElement("div");
      redaction.className = "redaction";
      setRelativeSelectionStyle(redaction, rect);
      page.overlay.append(redaction);
    });
  }

  function toggleGrayscale() {
    state.grayscale = !state.grayscale;
    state.pages.forEach(({wrapper}) => wrapper.classList.toggle("grayscale", state.grayscale));
    updateToggleLabels();
    if (state.watermark) scheduleWatermarkRender();
  }

  function toggleWatermark() {
    state.watermark = !state.watermark;
    updateToggleLabels();
    renderWatermarks();
  }

  function clearRedactions() {
    state.pages.forEach((page) => {
      page.rects = [];
      page.overlay.querySelectorAll(".redaction").forEach((redaction) => redaction.remove());
    });
  }

  function getWatermarkText() {
    return elements.watermarkText.value.trim() || translate("DEFAULT_WATERMARK");
  }

  function scheduleWatermarkRender() {
    if (state.watermarkFrame !== null) cancelAnimationFrame(state.watermarkFrame);
    state.watermarkFrame = requestAnimationFrame(() => {
      state.watermarkFrame = null;
      renderWatermarks();
    });
  }

  function renderWatermarks() {
    state.pages.forEach((page) => {
      page.wrapper.querySelector(".watermark-preview")?.remove();
      if (!state.watermark) return;

      const preview = document.createElement("canvas");
      preview.className = "watermark-preview";
      preview.width = page.canvas.width;
      preview.height = page.canvas.height;
      drawWatermarkPattern(preview.getContext("2d"), preview.width, preview.height);
      page.wrapper.insertBefore(preview, page.overlay);
    });
  }

  function drawWatermarkPattern(context, width, height) {
    const text = getWatermarkText();
    const fontWeight = Number(elements.watermarkWeight.value) || 800;
    const fontSize = Math.max(28, Math.min(72, width / 18));
    const letterSpacing = Math.max(0.5, fontSize * 0.015);
    const amplitude = fontSize * 0.42;
    const wavelength = Math.max(220, fontSize * 7.5);
    const phraseGap = Math.max(120, fontSize * 2.25);
    const rowStep = fontSize * 2.75;
    const diagonal = Math.ceil(Math.hypot(width, height));

    context.save();
    context.translate(width / 2, height / 2);
    context.rotate(WATERMARK_ANGLE);
    context.font = `${fontWeight} ${fontSize}px ${WATERMARK_FONT}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = state.grayscale ? "rgba(110, 110, 110, 0.3)" : "rgba(180, 35, 24, 0.3)";

    const glyphs = Array.from(text, (character) => ({
      character,
      width: context.measureText(character).width
    }));
    const phraseWidth = glyphs.reduce((total, glyph) => total + glyph.width, 0)
      + letterSpacing * Math.max(0, glyphs.length - 1);
    const phraseStep = Math.max(1, phraseWidth + phraseGap);

    let row = 0;
    for (let y = -diagonal; y <= diagonal; y += rowStep, row += 1) {
      const rowOffset = row % 2 === 0 ? 0 : phraseStep / 2;
      for (
        let x = -diagonal * 1.5 - phraseStep;
        x <= diagonal * 1.5 + phraseStep;
        x += phraseStep
      ) {
        drawTextOnWave(context, glyphs, x + rowOffset, y, {
          amplitude,
          letterSpacing,
          wavelength
        });
      }
    }

    context.restore();
  }

  function drawTextOnWave(context, glyphs, startX, baselineY, options) {
    const {amplitude, letterSpacing, wavelength} = options;
    const radiansPerPixel = 2 * Math.PI / wavelength;
    let cursor = startX;

    glyphs.forEach((glyph, index) => {
      const centerX = cursor + glyph.width / 2;
      const phase = centerX * radiansPerPixel;
      const y = baselineY + amplitude * Math.sin(phase);
      const slope = amplitude * radiansPerPixel * Math.cos(phase);

      context.save();
      context.translate(centerX, y);
      context.rotate(Math.atan(slope));
      context.fillText(glyph.character, 0, 0);
      context.restore();

      cursor += glyph.width;
      if (index < glyphs.length - 1) cursor += letterSpacing;
    });
  }

  function createSanitizedCanvas(page) {
    const output = document.createElement("canvas");
    output.width = page.canvas.width;
    output.height = page.canvas.height;
    const context = output.getContext("2d", {willReadFrequently: state.grayscale});

    context.fillStyle = "#fff";
    context.fillRect(0, 0, output.width, output.height);
    context.drawImage(page.canvas, 0, 0);

    if (state.grayscale) applyGrayscale(context, output.width, output.height);

    context.fillStyle = "#000";
    page.rects.forEach((rect) => {
      context.fillRect(
        Math.round(rect.x * output.width),
        Math.round(rect.y * output.height),
        Math.round(rect.width * output.width),
        Math.round(rect.height * output.height)
      );
    });

    if (state.watermark) drawWatermarkPattern(context, output.width, output.height);
    return output;
  }

  function applyGrayscale(context, width, height) {
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    for (let index = 0; index < pixels.length; index += 4) {
      const luminance = Math.round(
        0.2126 * pixels[index]
        + 0.7152 * pixels[index + 1]
        + 0.0722 * pixels[index + 2]
      );
      pixels[index] = luminance;
      pixels[index + 1] = luminance;
      pixels[index + 2] = luminance;
    }

    context.putImageData(imageData, 0, 0);
  }

  async function saveDocument() {
    if (!state.pages.length) {
      setStatus("FIRST_UPLOAD");
      return;
    }

    setBusy(true);
    setStatus("GENERATING");
    setProgress(0.05);

    try {
      if (state.kind === "image") {
        await saveImage();
      } else {
        await savePdf();
      }
      setProgress(1);
      setStatus("COMPLETE");
    } catch (error) {
      console.error(error);
      setStatus("SAVE_ERROR", {detail: error.message});
    } finally {
      setBusy(false);
    }
  }

  async function saveImage() {
    const canvas = createSanitizedCanvas(state.pages[0]);
    const mimeType = getOutputMimeType(state.originalFile.type);
    const blob = await canvasToBlob(canvas, mimeType, 0.95);
    download(blob, `${baseName(state.originalFile.name)}-${translate("FILE_SUFFIX")}.${extensionFor(mimeType)}`);
  }

  async function savePdf() {
    const {PDFDocument} = await getPdfLib();
    const document = await PDFDocument.create();

    for (let index = 0; index < state.pages.length; index += 1) {
      const canvas = createSanitizedCanvas(state.pages[index]);
      const jpeg = await canvasToBlob(canvas, "image/jpeg", 0.92);
      const image = await document.embedJpg(await jpeg.arrayBuffer());
      const page = document.addPage([canvas.width, canvas.height]);
      page.drawImage(image, {x: 0, y: 0, width: canvas.width, height: canvas.height});
      setProgress((index + 1) / state.pages.length);
    }

    const bytes = await document.save();
    const name = `${baseName(state.originalFile.name)}-${translate("FILE_SUFFIX")}.pdf`;
    download(new Blob([bytes], {type: "application/pdf"}), name);
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error(translate("IMAGE_ERROR")));
      }, type, quality);
    });
  }

  function getOutputMimeType(inputType) {
    if (inputType === "image/png" || inputType === "image/webp") return inputType;
    return "image/jpeg";
  }

  function baseName(name) {
    return name.replace(/\.[^.]+$/, "");
  }

  function extensionFor(mimeType) {
    if (mimeType === "image/png") return "png";
    if (mimeType === "image/webp") return "webp";
    return "jpg";
  }

  function download(blob, name) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  elements.file.addEventListener("change", handleFileSelection);
  elements.gray.addEventListener("click", toggleGrayscale);
  elements.watermark.addEventListener("click", toggleWatermark);
  elements.watermarkText.addEventListener("input", () => {
    if (state.watermark) scheduleWatermarkRender();
  });
  elements.watermarkWeight.addEventListener("input", () => {
    updateWatermarkWeight();
    if (state.watermark) scheduleWatermarkRender();
  });
  elements.clear.addEventListener("click", clearRedactions);
  elements.save.addEventListener("click", saveDocument);
  elements.language.addEventListener("change", (event) => applyLanguage(event.target.value));
  elements.theme.addEventListener("click", toggleTheme);

  updateWatermarkWeight();
  applyTheme(getInitialTheme());
  applyLanguage(getInitialLanguage());
})();
