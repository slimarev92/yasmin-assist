import { BehaviorSubject, Observable, combineLatest, map } from "rxjs";
import * as XLSX from "xlsx";

import stylesheetUrl from "./terms.xlsx";

import { Term, Language } from "./types.js";

const ENGLISH_COLUMN = "B";
const HEBREW_COLUMN = "C";

const termsBuffer = await (await fetch(stylesheetUrl)).arrayBuffer();
const workBook = XLSX.read(termsBuffer);

const keywordsSheet = workBook.Sheets["all_kw_GFH"];

const currIndexSubject = new BehaviorSubject<number>(0);
export const currLanguageSubject = new BehaviorSubject<Language>("he");
export const currTerm$: Observable<Term> = combineLatest([currIndexSubject, currLanguageSubject]).pipe(map(([index, language]) => {
    const column = language == "he" ? HEBREW_COLUMN : ENGLISH_COLUMN
    const text = keywordsSheet[`${column}${index + 2}`].h;

    return {
        text,
        classification: "אנשים",
        hints: []
    };
}));

export function nextLine() {
    currIndexSubject.next(currIndexSubject.value + 1);
}

export function prevLine() {
    currIndexSubject.next(currIndexSubject.value - 1);
}

export function switchLanguage() {
    currLanguageSubject.next(currLanguageSubject.value === "he" ? "en" : "he");
}