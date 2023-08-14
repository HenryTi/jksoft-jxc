import { buildTFunc } from "tonwa-com";
import { en } from "./en";
import { RoleTName } from "./RoleName";
import { zh } from "./zh";

export const roleT = buildTFunc<RoleTName>({
    en,
    zh,
});
