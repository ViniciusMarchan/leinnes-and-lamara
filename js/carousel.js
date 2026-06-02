const mediaFiles = [
    "IMG_20250706_014120120_HDR2.jpg",
    "IMG_20250713_203514441_AE.jpg",
    "IMG_20250713_203540477_AE.jpg",
    "IMG_20250722_003546080_HDR_PORTRAIT.jpg",
    "IMG_20250724_232215770_HDR_AE.jpg",
    "VID_20250725_191118_330.mp4",
    "VID_20250726_214851_468.mp4",
    "IMG_20250727_030334295_AE.jpg",
    "VID_20250824_120154_119.mp4",
    "IMG_20250826_122735789_AE.jpg",
    "IMG_20260101_004039696.jpg",
    "VID_20260105_174335_761.mp4",
    "IMG_20260327_063755465_HDR.jpg",
    "IMG_20260521_225430156_HDR.jpg",
    "VID_20260601_152414_324.mp4",
    "VID_20260601_152433_975.mp4",
    "VID_20260601_152445_846.mp4",
    "VID_20260601_152506_581.mp4",
    "VID_20260601_152542_582.mp4"
];

const track = document.querySelector(".carousel-track");
const slideWidth = 340;
const visibleSlides = 5;
const scrollSpeed = 26;
const mediaLoadQueue = [];
let nextMediaIndex = 0;
let trackOffset = 0;
let previousFrameTime = null;
let isLoadingMedia = false;
const typingText = document.querySelector(".typing-text");
const messages = [
    "Feliz Aniversário!",
    "Eu te amo!",
    "Você é especial para mim"
];
let messageIndex = 0;
let characterIndex = 0;
let isDeleting = false;
const floatingMessages = [
    "Meu lugar favorito \u00e9 ao seu lado.",
    "Seu sorriso deixa meus dias mais bonitos.",
    "Voc\u00ea faz meu cora\u00e7\u00e3o se sentir em casa.",
    "Minha felicidade tem muito de voc\u00ea.",
    "A vida ficou mais bonita desde que encontrei voc\u00ea.",
    "Eu escolheria voc\u00ea em todas as vidas.",
    "Voc\u00ea \u00e9 meu presente favorito da vida.",
    "Com voc\u00ea, todo momento vira lembran\u00e7a boa."
];

function animateTitle() {
    const currentMessage = messages[messageIndex];

    characterIndex += isDeleting ? -1 : 1;
    typingText.textContent = currentMessage.slice(0, characterIndex);

    if (!isDeleting && characterIndex === currentMessage.length) {
        isDeleting = true;
        setTimeout(animateTitle, 1800);
        return;
    }

    if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        messageIndex = (messageIndex + 1) % messages.length;
        setTimeout(animateTitle, 450);
        return;
    }

    setTimeout(animateTitle, isDeleting ? 45 : 90);
}

function createSlide(fileName) {
    const slide = document.createElement("div");
    const isVideo = fileName.toLowerCase().endsWith(".mp4");
    const media = document.createElement(isVideo ? "video" : "img");

    slide.className = "carousel-slide";

    if (isVideo) {
        media.autoplay = true;
        media.loop = true;
        media.muted = true;
        media.playsInline = true;
        media.preload = "metadata";
    } else {
        media.alt = "Nosso momento";
        media.loading = "lazy";
    }

    slide.appendChild(media);
    mediaLoadQueue.push({
        media,
        source: `images/carrossel/${fileName}`
    });
    loadNextMedia();
    return slide;
}

function loadNextMedia() {
    if (isLoadingMedia || mediaLoadQueue.length === 0) {
        return;
    }

    isLoadingMedia = true;
    const { media, source } = mediaLoadQueue.shift();
    const loadEvent = media.tagName === "VIDEO" ? "loadedmetadata" : "load";
    let loadTimeout = null;

    const finishLoading = () => {
        clearTimeout(loadTimeout);
        media.removeEventListener(loadEvent, finishLoading);
        media.removeEventListener("error", finishLoading);
        isLoadingMedia = false;
        loadNextMedia();
    };

    loadTimeout = setTimeout(finishLoading, 8000);
    media.addEventListener(loadEvent, finishLoading, { once: true });
    media.addEventListener("error", finishLoading, { once: true });
    media.src = source;
}

function appendNextSlide() {
    const fileName = mediaFiles[nextMediaIndex];

    track.appendChild(createSlide(fileName));
    nextMediaIndex = (nextMediaIndex + 1) % mediaFiles.length;
}

function removeFirstSlide() {
    const firstSlide = track.firstElementChild;
    const video = firstSlide.querySelector("video");

    if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
    }

    firstSlide.remove();
}

function animateGallery(frameTime) {
    if (previousFrameTime === null) {
        previousFrameTime = frameTime;
    }

    const elapsedSeconds = (frameTime - previousFrameTime) / 1000;

    previousFrameTime = frameTime;
    trackOffset -= scrollSpeed * elapsedSeconds;

    while (trackOffset <= -slideWidth) {
        trackOffset += slideWidth;
        removeFirstSlide();
        appendNextSlide();
    }

    track.style.transform = `translateX(${trackOffset}px)`;
    requestAnimationFrame(animateGallery);
}

function createFloatingHearts() {
    const background = document.querySelector(".floating-hearts");

    for (let index = 0; index < 24; index += 1) {
        const heart = document.createElement("span");

        heart.className = "floating-heart";
        heart.textContent = "\u2764";
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${14 + Math.random() * 24}px`;
        heart.style.animationDelay = `${Math.random() * -14}s`;
        heart.style.animationDuration = `${8 + Math.random() * 8}s`;
        background.appendChild(heart);
    }

    floatingMessages.forEach((message, index) => {
        const text = document.createElement("span");

        text.className = "floating-message";
        text.textContent = message;
        text.style.left = `${8 + Math.random() * 72}%`;
        text.style.animationDelay = `${index * -8}s`;
        text.style.animationDuration = `${42 + Math.random() * 8}s`;
        background.appendChild(text);
    });
}

for (let index = 0; index <= visibleSlides; index += 1) {
    appendNextSlide();
}

createFloatingHearts();
animateTitle();
requestAnimationFrame(animateGallery);
