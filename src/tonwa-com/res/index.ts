import { env } from '../tools';
import { EnumString, LangFunc, StringsAndFuncs } from './defs';
import { en } from './en';
import { zh } from './zh';

const resLang: { [lang: string]: StringsAndFuncs } = {
    en,
    zh
}

export let resStrings: { [key in EnumString]: string } = en.strings;
export let resFuncs: LangFunc = en.funcs;
export * from './useT';
export * from './defs';
export * from './buildTFunc';

(function setLanguage() {
    let res = resLang[env.lang];
    if (res) {
        resStrings = res.strings;
        resFuncs = res.funcs;
    }
})();
