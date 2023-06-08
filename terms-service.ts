import { BehaviorSubject } from "rxjs";
import * as XLSX from "xlsx";

import { Term, Classification } from "./types.js";

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

const termsSubject = new BehaviorSubject<Term[]>(terms);

const termsBuffer = await (await fetch("./terms.xlsx")).arrayBuffer();
const workBook = XLSX.read(termsBuffer);

export const x = 23;