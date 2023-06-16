import { Observable, BehaviorSubject, combineLatest, map, Subject, withLatestFrom, take } from "rxjs";
import * as XLSX from "xlsx";
import { CellAddress } from "xlsx";

import { Term, Language, Classification } from "./types.js";

const ENGLISH_COLUMN = "B";
const HEBREW_COLUMN = "C";
const HEBREW_HINT_FIRST_COLUMN_NUMBER = 3;
const ENGLIGH_HINT_FIRST_COLUMN_NUMBER = 14;

const downloadSubject = new Subject<void>();
const hintSubject = new Subject<{ hintNum: number, hint: string }>();
const workbookSubject = new Subject<XLSX.WorkBook>();
const classificationSubject = new Subject<Classification>();
const keywordsSheetSubject = new Subject<XLSX.WorkSheet>();
const lineIndexSubject = new BehaviorSubject<number>(0);

export const currLanguageSubject = new BehaviorSubject<Language>("he");
export const currTerm$: Observable<Term> = combineLatest([lineIndexSubject, currLanguageSubject, keywordsSheetSubject]).pipe(map(([index, language, keywordsSheet]) => {
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
    lineIndexSubject.next(lineIndexSubject.value + 1);
}

export function prevLine() {
    lineIndexSubject.next(Math.max(lineIndexSubject.value - 1, 0));
}

export function switchLanguage() {
    currLanguageSubject.next(currLanguageSubject.value === "he" ? "en" : "he");
}

function reactToClassificationChanges() {
    const indexAndKeywords$ = combineLatest([lineIndexSubject, keywordsSheetSubject]);
    
    classificationSubject.pipe(withLatestFrom(indexAndKeywords$)).subscribe(([classification, [index, keywordsSheet]]) => {
        let cell = keywordsSheet[`AF${index+ 2}`];
    
        if (!cell) {
            XLSX.utils.sheet_add_aoa(keywordsSheet, [[classification]], { origin: `AF${index+ 2}` });
        } else {
            cell.v = classification;
        }
    });
}

export function setClassification(classification: Classification) {
    classificationSubject.next(classification);
}

function reactToDownloadFile() {
    downloadSubject.pipe(withLatestFrom(workbookSubject)).subscribe(([_, workbook]) => XLSX.writeFile(workbook, "result.xlsx"))
}

export function downloadFile() {
    downloadSubject.next();
}

export function goToRow(row: number) {
    lineIndexSubject.next(Math.max(row - 2, 0));
}

export function loadFile(file: File) {
    const reader = new FileReader();

    reader.onload = function (e) {
        var data = e.target?.result;

        if (!data) {
            return;
        }

        const workbook = XLSX.read(data);

        workbookSubject.next(workbook);
        keywordsSheetSubject.next(workbook.Sheets["all_kw_GFH"]);
    };

    reader.readAsArrayBuffer(file);
}

function reactToHintChanges() {
    const otherValues$ = combineLatest([lineIndexSubject, currLanguageSubject, keywordsSheetSubject]);
    
    hintSubject.pipe(withLatestFrom(otherValues$)).subscribe(([hintInfo, [index, lang, keywordsSheet]]) => {
        const columnNum = (lang === "he" ? HEBREW_HINT_FIRST_COLUMN_NUMBER : ENGLIGH_HINT_FIRST_COLUMN_NUMBER) + hintInfo.hintNum - 1;
        const cellAdress: CellAddress = { c: columnNum, r: index + 1 };
        const hint = hintInfo.hint;
    
        let cell = keywordsSheet[XLSX.utils.encode_cell(cellAdress)];
    
        if (!cell) {
            XLSX.utils.sheet_add_aoa(keywordsSheet, [[hint]], { origin: cellAdress });
        } else {
            cell.v = hint;
        }
    });
}

export function updateHint(hintNum: number, hint: string) {
    hintSubject.next({ hintNum, hint });
}

reactToClassificationChanges();
reactToHintChanges();
reactToDownloadFile();