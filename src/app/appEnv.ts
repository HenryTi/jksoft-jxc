import { AppEnv } from "tonwa-app";
import { from62 } from "tonwa-com";

const defaultUnitName = '百灵威';
const defaultUnit = 24;

export const appEnv: AppEnv = (function () {
    let testing: boolean; // = isTesting();
    let unit: number;

    let pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s: any) { return decodeURIComponent(s.replace(pl, " ")); };
    let query: string = undefined;
    if (window) {
        let win = window;
        query = win.location.search.substring(1);
    }
    let params: { [key: string]: string } = {};
    for (; ;) {
        if (!query) break;
        let match = search.exec(query);
        if (!match) break;
        params[decode(match[1])] = decode(match[2]);
    }
    let sUnit = params['u'] || params['unit'];
    if (sUnit) {
        let p = sUnit.indexOf('-');
        if (p >= 0) {
            let tc = sUnit.charCodeAt(p + 1);
            const tt = 'tT';
            testing = tc === tt.charCodeAt(0) || tc === tt.charCodeAt(1);
            sUnit = sUnit.substring(0, p);
        }
        else {
            testing = false;
        }
        if (sUnit[0] === '0') {
            unit = Number(sUnit);
        }
        else {
            unit = from62(sUnit);
        }
        if (isNaN(unit) === true) unit = undefined;
    }
    else {
        // 下面都是为了兼容以前的操作。
        // 整个url上，只要有test作为独立的字符串出现，就是testing
        testing = /(\btest\b)/i.test(document.location.href);
        let unitName: string;
        let el = document.getElementById('unit');
        if (el) {
            unitName = el.innerText;
        }
        else {
            el = document.getElementById('unit.json');
            if (el) {
                let json = el.innerHTML;
                if (json) {
                    let res = JSON.parse(json);
                    unitName = res?.unit;
                }
            }
        }
        if (!unitName) {
            // unitName = env.REACT_APP_UNIT;
        }

        if (unitName) {
            unit = Number.parseInt(unitName);
            if (Number.isInteger(unit) === false) {
                if (unitName === defaultUnitName) {
                    unit = defaultUnit;
                }
            }
        }
        else {
            unitName = defaultUnitName;
            unit = defaultUnit;
        }
        if (!unit) unit = 0;
    }
    let isDevelopment = import.meta.env.DEV;
    return { isDevelopment, testing, unit };
}());
