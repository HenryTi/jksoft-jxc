export function capitalCase(s: string): string {
    let Part = s.split(/[-._]/);
    return Part.map(v => firstCharUppercase(v)).join('_');
}

export function camelCase(s: string): string {
    let Part = s.split(/[-._]/);
    let len = Part.length;
    Part[0] = firstCharLowercase(Part[0]);
    for (let i = 1; i < len; i++) {
        Part[1] = firstCharUppercase(Part[1]);
    }
    return Part.join('_');
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
