const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
    });
  });
}

// Each entry: { src: "path/to/image.png", caption: "Your caption here" }
const galleries = {
  "api-response-formatter": [
    { src: "assets/api-response-formatter/1.png", caption: "Generating clean JSON from unstructured text" },
    { src: "assets/api-response-formatter/2.png", caption: "Generating clean JSON from unstructured json file" },
  ],
  "code-helper": [
    { src: "assets/code-helper/1.png", caption: "Analyzing code via command line" },
    { src: "assets/code-helper/2.png", caption: "Analyzing code from file" },
  ],
  "smart-study-assistant": [
    { src: "assets/smart-study-assistant/1.png", caption: "Generating quiz from notes" },
    { src: "assets/smart-study-assistant/2.png", caption: "Explaining concepts in beginner-friendly language via text input" },
    { src: "assets/smart-study-assistant/3.png", caption: "Summarizing from notes" },
    { src: "assets/smart-study-assistant/4.png", caption: "Summarized water cycle using CLI" },
  ],
};

function filenameFromPath(path) {
  const parts = String(path).split("/");
  return parts[parts.length - 1] || path;
}

// Render ONE thumbnail per [data-gallery] container; clicking opens full gallery
function renderGalleryThumbs() {
  document.querySelectorAll("[data-gallery]").forEach((el) => {
    const galleryKey = el.getAttribute("data-gallery");
    const images = galleries[galleryKey] || [];
    if (images.length === 0) return;
    el.innerHTML = "";

    // Only show the first image as the thumbnail
    const first = images[0];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "demo-thumb";
    button.setAttribute("aria-label", `Open ${galleryKey} gallery`);

    const img = document.createElement("img");
    img.src = first.src;
    img.alt = first.caption || `${galleryKey} screenshot`;
    button.appendChild(img);
    el.appendChild(button);

    // Clicking the thumbnail opens the modal starting at slide 0 for this gallery
    button.addEventListener("click", () => openGallery(galleryKey, 0));
  });
}

renderGalleryThumbs();

const galleryModal = document.getElementById("galleryModal");
const galleryImage = document.getElementById("galleryImage");
const galleryCaption = document.getElementById("galleryCaption");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const closeGalleryBtns = document.querySelectorAll("[data-close-gallery]");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomResetBtn = document.getElementById("zoomResetBtn");

let currentSlide = 0;
let currentZoom = 1;
let activeGalleryImages = []; // images for the currently open project

function applyZoom() {
  if (!galleryImage) return;
  galleryImage.style.transform = `scale(${currentZoom})`;
}

function setSlide(index) {
  if (!galleryImage || activeGalleryImages.length === 0) return;
  const normalized = (index + activeGalleryImages.length) % activeGalleryImages.length;
  currentSlide = normalized;
  const slide = activeGalleryImages[normalized];
  galleryImage.src = slide.src;
  galleryImage.alt = slide.caption || `Screenshot ${normalized + 1}`;
  if (galleryCaption) {
    const counter = `${normalized + 1} / ${activeGalleryImages.length}`;
    const text = slide.caption ? `${slide.caption}  ·  ${counter}` : counter;
    galleryCaption.textContent = text;
  }
  currentZoom = 1;
  applyZoom();
}

function openGallery(galleryKey, startIndex) {
  if (!galleryModal) return;
  activeGalleryImages = galleries[galleryKey] || [];
  if (activeGalleryImages.length === 0) return;
  setSlide(startIndex);
  galleryModal.classList.add("open");
  galleryModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeGallery() {
  if (!galleryModal) return;
  galleryModal.classList.remove("open");
  galleryModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Wire up inline thumbnails in HTML (api-formatter and code-helper demo-thumbs)
document.querySelectorAll(".demo-thumb[data-gallery-key]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-gallery-key");
    openGallery(key, 0);
  });
});

if (galleryPrev) {
  galleryPrev.addEventListener("click", () => setSlide(currentSlide - 1));
}

if (galleryNext) {
  galleryNext.addEventListener("click", () => setSlide(currentSlide + 1));
}

closeGalleryBtns.forEach((btn) => {
  btn.addEventListener("click", closeGallery);
});

if (zoomInBtn) {
  zoomInBtn.addEventListener("click", () => {
    currentZoom = Math.min(3, Number((currentZoom + 0.2).toFixed(2)));
    applyZoom();
  });
}

if (zoomOutBtn) {
  zoomOutBtn.addEventListener("click", () => {
    currentZoom = Math.max(0.6, Number((currentZoom - 0.2).toFixed(2)));
    applyZoom();
  });
}

if (zoomResetBtn) {
  zoomResetBtn.addEventListener("click", () => {
    currentZoom = 1;
    applyZoom();
  });
}

document.addEventListener("keydown", (event) => {
  if (!galleryModal || !galleryModal.classList.contains("open")) return;
  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowLeft") setSlide(currentSlide - 1);
  if (event.key === "ArrowRight") setSlide(currentSlide + 1);
});
