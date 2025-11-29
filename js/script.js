// ============================================================
// CONFIGURAÇÕES
// ============================================================

const track = document.querySelector(".carousel-track");
const gap = 40; // gap entre as imagens
const transitionSpeed = 500; // velocidade da animação
let index = 1; // começa no primeiro item real

// Pega os itens reais (antes de clonar)
const originalItems = Array.from(track.querySelectorAll(".carousel-item"));
if (originalItems.length === 0) {
    throw new Error("Não encontrou '.carousel-item' dentro de '.carousel-track'");
}

// ============================================================
// CLONES (início e fim) — usados para looping infinito
// ============================================================

const firstClone = originalItems[0].cloneNode(true);
const lastClone = originalItems[originalItems.length - 1].cloneNode(true);

track.appendChild(firstClone);        // clone do primeiro vai para o final
track.insertBefore(lastClone, track.firstChild); // clone do último vai para o início

let items = Array.from(track.children); // todos os itens, incluindo clones

// ============================================================
// FUNÇÃO PARA CALCULAR A LARGURA REAL + GAP
// ============================================================

function getItemWidth() {
    const sample = track.querySelector(".carousel-item");
    return sample.offsetWidth + gap;
}

// ============================================================
// FUNÇÕES DE MOVIMENTO
// ============================================================

function goToIndex(i, withTransition = true) {
    if (!withTransition) {
        track.style.transition = "none";
    } else {
        track.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
    }

    const x = getItemWidth() * i;
    track.style.transform = `translateX(-${x}px)`;
}

function moveTo(i) {
    index = i;
    goToIndex(index, true);
}

// ============================================================
// BOTÕES NEXT / PREV (SE EXISTIREM)
// ============================================================

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        index++;
        moveTo(index);
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        index--;
        moveTo(index);
    });
}

// ============================================================
// LOOPING INFINITO — TELEPORTE NOS CLONES
// ============================================================

track.addEventListener("transitionend", () => {
    items = Array.from(track.children);

    // clone do primeiro (no fim)
    if (items[index] === firstClone) {
        track.style.transition = "none";
        index = 1; // primeiro item real
        goToIndex(index, false);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                track.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
            });
        });
    }

    // clone do último (no começo)
    if (items[index] === lastClone) {
        track.style.transition = "none";
        index = items.length - 2; // último item real
        goToIndex(index, false);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                track.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
            });
        });
    }
});

// ============================================================
// RESPONSIVIDADE — REAJUSTA A POSIÇÃO AO REDIMENSIONAR
// ============================================================

window.addEventListener("resize", () => {
    goToIndex(index, false);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            track.style.transition = `transform ${transitionSpeed}ms ease-in-out`;
        });
    });
});

// ============================================================
// INICIALIZAÇÃO
// ============================================================

window.addEventListener("load", () => {
    items = Array.from(track.children);
    goToIndex(index, false);
});

// ============================================================
// AUTOPLAY — PASSA AUTOMATICAMENTE A CADA 3 SEGUNDOS
// ============================================================

const autoPlayMs = 5000;

let autoplayId = setInterval(() => {
    if (nextBtn) nextBtn.click();
}, autoPlayMs);

// Para autoplay quando passar o mouse por cima
track.addEventListener("mouseenter", () => {
    clearInterval(autoplayId);
});

// Retoma autoplay quando tirar o mouse
track.addEventListener("mouseleave", () => {
    autoplayId = setInterval(() => {
        if (nextBtn) nextBtn.click();
    }, autoPlayMs);
});
