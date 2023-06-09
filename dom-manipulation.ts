import { Classification, Language, Term } from "./types";
import "./style.css";
import { nextLine, prevLine, currTerm$, currLanguageSubject, switchLanguage } from "./terms-service";
import { combineLatest, tap } from "rxjs";

let hasNext = true;
let hasPrev = false;

const channel = new BroadcastChannel("google");

const nextButton = document.getElementById("next") as HTMLButtonElement;
const currTermDisplay = document.getElementById("curr-term") as HTMLDialogElement;
const prevButton = document.getElementById("prev") as HTMLButtonElement;
const languageButton = document.getElementById("language") as HTMLButtonElement;
const wikiIframe = document.querySelector("iframe#wiki") as HTMLIFrameElement;
const select = document.querySelector("select") as HTMLSelectElement;

nextButton.addEventListener("click", () => {
    nextLine();
});

prevButton.addEventListener("click", () => {
    prevLine();
});

languageButton.addEventListener("click", () => {
    switchLanguage();
});

// select.addEventListener("change", () => {
//     terms[currIndex].classification = select.value as Classification;
// });

setTimeout(() => {
    combineLatest([currTerm$, currLanguageSubject]).subscribe(([currTerm, currLanguage]) => {
        const currText = currTerm.text;
    
        channel.postMessage(currText);
        currTermDisplay.innerText = currText;
    
        document.querySelectorAll("option").forEach(el => {
            el.selected = el.innerText === currTerm.classification;
        });
    
        wikiIframe.src = `https://${currLanguage}.wikipedia.org/w/index.php?search=${currText}`;
    });

    currLanguageSubject.subscribe(lang => {
        languageButton.innerText = lang;
        languageButton.dir = lang === "en" ? "ltr" : "rtl";
    });
}, 1100);



// document.querySelectorAll(".hint").forEach(hint => {
//     hint.addEventListener("input", () => {
//         terms[currIndex].hints[+hint.id.charAt(4) - 1] = (hint as HTMLInputElement).value || "";
//     });
// });