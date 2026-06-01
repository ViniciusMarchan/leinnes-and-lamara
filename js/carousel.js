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
const typingText = document.querySelector(".typing-text");
const messages = [
    "Feliz Aniversário!",
    "Eu te amo!",
    "Você é especial para mim"
];
let messageIndex = 0;
let characterIndex = 0;
let isDeleting = false;

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
    media.src = `images/carrossel/${fileName}`;

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
    return slide;
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
}

mediaFiles.concat(mediaFiles).forEach((fileName) => {
    track.appendChild(createSlide(fileName));
});

createFloatingHearts();
animateTitle();
