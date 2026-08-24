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
      LANGUAGE_LABEL: "Language",
      CONTROLS_LABEL: "Document controls",
      OPEN_FILE: "Open file",
      GRAYSCALE_ADD: "Grayscale",
      GRAYSCALE_REMOVE: "Remove grayscale",
      WATERMARK_INPUT_LABEL: "Watermark text",
      WATERMARK_WEIGHT_LABEL: "Watermark weight",
      WATERMARK_ADD: "Add watermark",
      WATERMARK_REMOVE: "Remove watermark",
      CLEAR_REDACTIONS: "Clear redactions",
      SAVE_DOWNLOAD: "Save and download",
      INITIAL_STATUS: "Select an image or PDF, then drag black rectangles over the data you want to hide.",
      EMPTY_DOCUMENT: "No document loaded.",
      HOW_TO_USE: "How to use it",
      STEP_ONE: "Upload a JPG, PNG, WebP, or PDF.",
      STEP_TWO: "Turn on grayscale and/or enter custom watermark text, then enable the wave pattern.",
      STEP_THREE: "Drag over IDs, numbers, signatures, addresses, or other data to create black redactions.",
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
      LANGUAGE_LABEL: "Idioma",
      CONTROLS_LABEL: "Controles del documento",
      OPEN_FILE: "Abrir archivo",
      GRAYSCALE_ADD: "Escala de grises",
      GRAYSCALE_REMOVE: "Quitar escala de grises",
      WATERMARK_INPUT_LABEL: "Texto de la marca de agua",
      WATERMARK_WEIGHT_LABEL: "Grosor de la marca",
      WATERMARK_ADD: "Añadir marca de agua",
      WATERMARK_REMOVE: "Quitar marca de agua",
      CLEAR_REDACTIONS: "Borrar tachados",
      SAVE_DOWNLOAD: "Guardar y descargar",
      INITIAL_STATUS: "Selecciona una imagen o PDF. Después, arrastra rectángulos negros sobre los datos que quieras ocultar.",
      EMPTY_DOCUMENT: "No hay ningún documento cargado.",
      HOW_TO_USE: "Cómo usarlo",
      STEP_ONE: "Sube un JPG, PNG, WebP o PDF.",
      STEP_TWO: "Activa la escala de grises y/o escribe una marca de agua personalizada y activa el patrón ondulado.",
      STEP_THREE: "Arrastra sobre DNI, números, firmas, direcciones u otros datos para crear tachados negros.",
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
    watermark: document.querySelector("#watermark"),
    watermarkText: document.querySelector("#wm"),
    watermarkWeight: document.querySelector("#wm-weight"),
    watermarkWeightValue: document.querySelector("#wm-weight-value")
  };

  const state = {
    grayscale: true,
    kind: null,
    language: "en",
    originalFile: null,
    pages: [],
    processing: false,
    status: {key: "INITIAL_STATUS", params: {}},
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
  }

  function updateToggleLabels() {
    elements.gray.textContent = translate(state.grayscale ? "GRAYSCALE_REMOVE" : "GRAYSCALE_ADD");
    elements.gray.setAttribute("aria-pressed", String(state.grayscale));
    elements.watermark.textContent = translate(state.watermark ? "WATERMARK_REMOVE" : "WATERMARK_ADD");
    elements.watermark.setAttribute("aria-pressed", String(state.watermark));
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

    const wrapper = document.createElement("div");
    wrapper.className = "page";

    const overlay = document.createElement("div");
    overlay.className = "overlay";

    const page = {canvas, overlay, rects: [], wrapper};
    wrapper.classList.toggle("grayscale", state.grayscale);
    wrapper.append(canvas, overlay);
    elements.pages.append(wrapper);
    state.pages.push(page);

    enableRedactionDrawing(page);
  }

  function enableRedactionDrawing(page) {
    let start = null;
    let temporaryRedaction = null;

    page.overlay.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;

      const bounds = page.overlay.getBoundingClientRect();
      start = getPointerPosition(event, bounds);
      temporaryRedaction = document.createElement("div");
      temporaryRedaction.className = "redaction";
      page.overlay.append(temporaryRedaction);
      page.overlay.setPointerCapture(event.pointerId);
    });

    page.overlay.addEventListener("pointermove", (event) => {
      if (!start) return;
      const bounds = page.overlay.getBoundingClientRect();
      updateRedactionStyle(temporaryRedaction, start, getPointerPosition(event, bounds), bounds);
    });

    page.overlay.addEventListener("pointerup", (event) => {
      if (!start) return;
      const bounds = page.overlay.getBoundingClientRect();
      const end = getPointerPosition(event, bounds);
      const rect = getNormalizedRect(start, end, bounds);

      if (rect.width > 0.005 && rect.height > 0.005) {
        page.rects.push(rect);
        setRelativeRedactionStyle(temporaryRedaction, rect);
      } else {
        temporaryRedaction.remove();
      }

      start = null;
      temporaryRedaction = null;
    });

    page.overlay.addEventListener("pointercancel", () => {
      temporaryRedaction?.remove();
      start = null;
      temporaryRedaction = null;
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

  function updateRedactionStyle(element, start, end) {
    Object.assign(element.style, {
      left: `${Math.min(start.x, end.x)}px`,
      top: `${Math.min(start.y, end.y)}px`,
      width: `${Math.abs(end.x - start.x)}px`,
      height: `${Math.abs(end.y - start.y)}px`
    });
  }

  function setRelativeRedactionStyle(element, rect) {
    Object.assign(element.style, {
      left: `${rect.x * 100}%`,
      top: `${rect.y * 100}%`,
      width: `${rect.width * 100}%`,
      height: `${rect.height * 100}%`
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

  updateWatermarkWeight();
  applyLanguage(getInitialLanguage());
})();
