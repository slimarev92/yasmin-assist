import { Classification } from "./types";
import "./style.css";
import { nextLine, prevLine, currTerm$, currLanguageSubject, switchLanguage, setClassification, downloadFile, goToRow, loadFile, updateHint } from "./terms-service";
import { combineLatest, fromEvent } from "rxjs";

function setUpHints() {
    for (let i = 1; i < 8; i++) {
        const input = document.getElementById(`hint${i}`) as HTMLInputElement;

        fromEvent(input, "input", value => {
            updateHint(i, input.value) 
        }).subscribe();
        currTerm$.subscribe(term => {
            input.value = term.hints[i - 1];
        });
    }
}

const channel = new BroadcastChannel("google");

const nextButton = document.getElementById("next") as HTMLButtonElement;
const currTermDisplay = document.getElementById("curr-term") as HTMLDialogElement;
const prevButton = document.getElementById("prev") as HTMLButtonElement;
const languageButton = document.getElementById("language") as HTMLButtonElement;
const downloadButton = document.getElementById("download") as HTMLButtonElement;
const uploadButton = document.getElementById("upload-btn") as HTMLButtonElement;
const uploadInput = document.getElementById("upload") as HTMLInputElement;
const wikiIframe = document.querySelector("iframe#wiki") as HTMLIFrameElement;
const select = document.querySelector("select") as HTMLSelectElement;
const rowNumInput = document.getElementById("row-num") as HTMLInputElement;
const goToRowButton = document.getElementById("go-to-row") as HTMLButtonElement;

nextButton.addEventListener("click", () => {
    nextLine();
});

prevButton.addEventListener("click", () => {
    prevLine();
});

languageButton.addEventListener("click", () => {
    switchLanguage();
});

combineLatest([currTerm$, currLanguageSubject]).subscribe(([currTerm, currLanguage]) => {
    const currText = currTerm.text;

    channel.postMessage(currText);
    currTermDisplay.innerText = currText;
    currTermDisplay.title = currText;

    document.querySelectorAll("option").forEach(el => {
        el.selected = el.innerText === currTerm.classification;
    });

    wikiIframe.src = `https://${currLanguage}.wikipedia.org/w/index.php?search=${currText}`;

    prevButton.disabled = !currTerm.hasPrev;
    nextButton.disabled = !currTerm.hasNext;
    rowNumInput.value = currTerm.row + "";
});

currLanguageSubject.subscribe(lang => {
    languageButton.innerText = lang;
    languageButton.dir = lang === "en" ? "ltr" : "rtl";
});

fromEvent(select, "input").subscribe(e => {
    setClassification(select.value as Classification);
});

downloadButton.addEventListener("click", () => {
    downloadFile();
});

goToRowButton.addEventListener("click", () => {
    goToRow(+rowNumInput.value);
});

uploadButton.addEventListener("click", () => uploadInput.click());

uploadInput.addEventListener("input", () => {
    const file = uploadInput.files?.[0];

    file && loadFile(file);
});

setUpHints();