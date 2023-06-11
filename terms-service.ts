import { Observable, BehaviorSubject, combineLatest, map, Subject } from "rxjs";
import * as XLSX from "xlsx";
import { CellAddress } from "xlsx";

import { Term, Language, Classification } from "./types.js";

const ENGLISH_COLUMN = "B";
const HEBREW_COLUMN = "C";
const HEBREW_HINT_FIRST_COLUMN_NUMBER = 3;
const ENGLIGH_HINT_FIRST_COLUMN_NUMBER = 14;

const keywordsSheetSubject = new Subject<XLSX.WorkSheet>();
const currIndexSubject = new BehaviorSubject<number>(0); // TODO SASHA: START FROM TWO

let workBook: XLSX.WorkBook;
let worksheet: XLSX.WorkSheet;

export const currLanguageSubject = new BehaviorSubject<Language>("he");
export const currTerm$: Observable<Term> = combineLatest([currIndexSubject, currLanguageSubject, keywordsSheetSubject]).pipe(map(([index, language, keywordsSheet]) => {
    const column = language == "he" ? HEBREW_COLUMN : ENGLISH_COLUMN
    const text = keywordsSheet[`${column}${index + 2}`].v;
    const existingClassification = keywordsSheet[`AF${index + 2}`]?.v || "";
    const hints: string[] = [];

    for (let hintNum = 1; hintNum < 8; hintNum++) {
        const columnNum = (language === "he" ? HEBREW_HINT_FIRST_COLUMN_NUMBER : ENGLIGH_HINT_FIRST_COLUMN_NUMBER) + hintNum - 1;
        const hint = keywordsSheet[XLSX.utils.encode_cell({ c: columnNum, r: index + 1 })]?.v || "";

        hints.push(hint);
    }
    
    return {
        text,
        classification: existingClassification,
        hints,
        hasNext: true,
        hasPrev: index > 0,
        row: index + 2
    };
}));

export function nextLine() {
    currIndexSubject.next(currIndexSubject.value + 1);
}

export function prevLine() {
    currIndexSubject.next(Math.max(currIndexSubject.value - 1, 0));
}

export function switchLanguage() {
    currLanguageSubject.next(currLanguageSubject.value === "he" ? "en" : "he");
}

export function setClassification(classification: Classification) {
    const index = currIndexSubject.value
    const keywordsSheet = worksheet;

    let cell = keywordsSheet[`AF${index+ 2}`];

    // TODO SASHA: MAKE THIS REACTIVE.
    if (!cell) {
        XLSX.utils.sheet_add_aoa(keywordsSheet, [[classification]], { origin: `AF${index+ 2}` });
    } else {
        cell.v = classification;
    }
}

export function downloadFile() {
    XLSX.writeFile(workBook, "result.xlsx");
}

export function goToRow(row: number) {
    currIndexSubject.next(Math.max(row - 2, 0));
}

export function loadFile(file: File) {
    const reader = new FileReader();

    reader.onload = function (e) {
        var data = e.target?.result;

        if (!data) {
            return;
        }

        workBook = XLSX.read(data);
        worksheet = workBook.Sheets["all_kw_GFH"];

        keywordsSheetSubject.next(worksheet);
    };

    reader.readAsArrayBuffer(file);
}

// TODO SASHA: MAKE THIS REACTIVE.
export function updateHint(hintNum: number, hint: string) {
    const index = currIndexSubject.value
    const lang = currLanguageSubject.value;
    const keywordsSheet = worksheet;

    const columnNum = (lang === "he" ? HEBREW_HINT_FIRST_COLUMN_NUMBER : ENGLIGH_HINT_FIRST_COLUMN_NUMBER) + hintNum - 1;
    const cellAdress: CellAddress = { c: columnNum, r: index + 1 };

    let cell = keywordsSheet[XLSX.utils.encode_cell(cellAdress)];

    if (!cell) {
        XLSX.utils.sheet_add_aoa(keywordsSheet, [[hint]], { origin: cellAdress });
    } else {
        cell.v = hint;
    }
}

