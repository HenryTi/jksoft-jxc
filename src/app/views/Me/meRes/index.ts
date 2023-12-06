import { buildTFunc } from "tonwa-com";
import { en } from "./en";
import { zh } from "./zh";

export * from './defs';
export const meT = buildTFunc({
    en: en,
    zh: zh,
});
