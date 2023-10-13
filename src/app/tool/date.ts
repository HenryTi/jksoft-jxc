const date19700101 = Date.parse('1970-1-1');
const milliseconds = 1000 * 60 * 60 * 24;
export function getDays(date: string) {
    return Math.floor((Date.parse(date) - date19700101) / milliseconds) + 1;
}
export function fromDays(days: number) {
    return new Date(date19700101 + days * milliseconds);
}
export function contenFromDays(days: number) {
    if (days === undefined) return undefined;
    let date = fromDays(days);
    let ret = date.toISOString();
    let p = ret.indexOf('T');
    return ret.substring(0, p);
}
