import { buildTFunc } from "tonwa-com";
import { en } from "./en";
import { ResApp } from "./enum";
import { zh } from "./zh";

export const appT = buildTFunc<ResApp>({
    en,
    zh,
});
export * from './enum';
