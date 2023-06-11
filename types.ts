export type Language = "he" | "en";
export type Classification = "אנשים" | "מקומות" | "כללי" | "";

export type Term = {
    text: string,
    classification: Classification,
    hints: string[],
    hasNext: boolean,
    hasPrev: boolean,
    row: number
};