import { Classification, Language, Term } from "./types";
import "./style.css";

const terms: Term[] = [
    {
        he: "אברהם ברלין",
        en: "avi berlin",
        classification: "אנשים",
        hints: []
    },
    {
        he: "ג'יי ג'יי אברמס",
        en: "jj abrams",
        classification: "אנשים",
        hints: []
    },
    {
        he: "מארי קירי",
        en: "Marie curie",
        classification: "אנשים",
        hints: []
    }
];

let currIndex = -1;
let hasNext = true;
let hasPrev = false;
let currLanguage: Language = "en";

const channel = new BroadcastChannel("google");

const nextButton = document.getElementById("next") as HTMLButtonElement;
const currTerm = document.getElementById("curr-term") as HTMLDialogElement;
const prevButton = document.getElementById("prev") as HTMLButtonElement;
const languageButton = document.getElementById("language") as HTMLButtonElement;
const wikiIframe = document.querySelector("iframe#wiki") as HTMLIFrameElement;
const select = document.querySelector("select") as HTMLSelectElement;

function onChange() {
    hasNext = currIndex < terms.length - 1;
    hasPrev = currIndex > 0;

    prevButton.disabled = !hasPrev;
    nextButton.disabled = !hasNext;

    const currValue = terms[currIndex][currLanguage];

    channel.postMessage(currValue);
    currTerm.innerText = currValue;

    document.querySelectorAll("option").forEach(el => {
        el.selected = el.innerText === terms[currIndex].classification;
    });

    wikiIframe.src = `https://${currLanguage}.wikipedia.org/w/index.php?search=${currValue}`;

    document.querySelectorAll(".hint").forEach(hint => {
        (hint as HTMLInputElement).value = terms[currIndex].hints[+hint.id.charAt(4) - 1] || "";
    });
}


nextButton.addEventListener("click", () => {
    currIndex = Math.min(currIndex + 1, terms.length - 1);
});

prevButton.addEventListener("click", () => {
    currIndex = Math.max(currIndex - 1, 0);
});

languageButton.addEventListener("click", () => {
    currLanguage = currLanguage === "he" ? "en" : "he";

    languageButton.innerText = currLanguage;
});

select.addEventListener("change", () => {
    terms[currIndex].classification = select.value as Classification;
});

setTimeout(() => {
    nextButton.click();

    document.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => onChange()));

    languageButton.click();
}, 400);

document.querySelectorAll(".hint").forEach(hint => {
    hint.addEventListener("input", () => {
        terms[currIndex].hints[+hint.id.charAt(4) - 1] = (hint as HTMLInputElement).value || "";
    });
});