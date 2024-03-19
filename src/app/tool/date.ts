import moment from "moment";

const date19700101 = Date.parse('1970-1-1');
const milliseconds = 1000 * 60 * 60 * 24;

// 2024-02-25: 重大bug。这里不应该有后面的+1
export function getDays(date: string) {
    return Math.floor((Date.parse(date) - date19700101) / milliseconds); // + 1;
}
export function fromDays(days: number) {
    return new Date(date19700101 + days * milliseconds);
}
export function contentFromDays(days: number) {
    if (days === undefined) return undefined;
    let date = fromDays(days);
    //let ret = date.toISOString();
    //let p = ret.indexOf('T');
    //return ret.substring(0, p);
    /*
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let ret = `${year}-${month}-${day}`;
    return ret;
    */
    let ret = moment(date).format('YYYY-MM-DD');
    return ret;
}
