export function capitalCase(s: string): string {
    let arr = s.split(/[-._]/);
    return arr.map(v => firstCharUppercase(v)).join('_');
}

export function camelCase(s: string): string {
    let arr = s.split(/[-._]/);
    let len = arr.length;
    arr[0] = firstCharLowercase(arr[0]);
    for (let i = 1; i < len; i++) {
        arr[1] = firstCharUppercase(arr[1]);
    }
    return arr.join('_');
}

const aCode = 'a'.charCodeAt(0);
const zCode = 'z'.charCodeAt(0);
function firstCharUppercase(s: string) {
    if (!s) return '';
    let c = s.charCodeAt(0);
    if (c >= aCode && c <= zCode) {
        return String.fromCharCode(c - 0x20) + s.substr(1);
    }
    return s;
}
const ACode = 'A'.charCodeAt(0);
const ZCode = 'Z'.charCodeAt(0);
function firstCharLowercase(s: string) {
    if (!s) return '';
    let c = s.charCodeAt(0);
    if (c >= ACode && c <= ZCode) {
        return String.fromCharCode(c + 0x20) + s.substr(1);
    }
    return s;
}
