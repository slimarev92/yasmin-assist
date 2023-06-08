export type Language = "he" | "en";
export type Classification = "אנשים" | "מקומות" | "כללי";

export type Term = {
    he: string,
    en: string,
    classification: Classification,
    hints: string[]
};