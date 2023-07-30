export const cnAmount = ' w-min-6c text-end ms-2';
export const weekday = '日一二三四五六';
const numberFormat0 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numberFormat1 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numberFormat2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numberFormats = [numberFormat0, numberFormat1, numberFormat2];

export function numToStr(value: number, fixed?: number): string {
    let nf = numberFormats[fixed];
    if (nf === undefined) {
        nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: fixed, maximumFractionDigits: fixed });
    }
    return nf.format(value ?? 0);
}

function numToParts(value: number, fixed?: number): string[] {
    let nf = numberFormats[fixed];
    if (nf === undefined) {
        nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: fixed, maximumFractionDigits: fixed });
    }
    let s = nf.format(value ?? 0);
    return s.split('.');
}

export function renderNum(value: number, unit?: string, fixed?: number, b?: boolean): JSX.Element {
    let vUnit: any;
    if (unit !== undefined) vUnit = <small><small className="text-muted">{unit}</small></small>;
    if (fixed === undefined) fixed = 2;
    let parts = numToParts(value, fixed);
    let int = parts[0];
    let vInt = b === false ? <>{int}</> : <b>{int}</b>;
    let dec = parts[1];
    let vDec: any;
    if (dec !== undefined) {
        vDec = <span className="small text-muted"><small> .{dec}</small></span>;
    }
    return <span>{vInt}{vDec} {vUnit}</span>
}

export function dateString(date: Date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (y === new Date().getFullYear()) {
        return `${m}月${d}日`;
    }
    else {
        return `${y}年${m}月${d}日`;
    }
}
