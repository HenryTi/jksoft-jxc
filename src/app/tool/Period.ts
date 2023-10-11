import { Atom, Getter, WritableAtom, atom } from "jotai";
import moment from "moment";
import { useState } from "react";
import { env, getAtomValue, setAtomValue } from "tonwa-com";

export enum EnumPeriod { day = 0, month = 1, week = 2, year = 3 }

const periodTypeKey = 'periodType';
const periodTypeDefault = EnumPeriod.day;
export function loadPeriod() {
    let pt = localStorage.getItem(periodTypeKey);
    if (pt === null) return EnumPeriod.day;
    let n = Number(pt);
    if (Number.isNaN(n) === true) return periodTypeDefault;
    if (n < EnumPeriod.day || n > EnumPeriod.year) return periodTypeDefault;
    return n as EnumPeriod;
}
function savePeriod(periodType: EnumPeriod) {
    localStorage.setItem(periodTypeKey, String(periodType));
}

export abstract class Period {
    protected readonly timezone: number;
    protected readonly siteBizMonth: number;
    protected readonly siteBizDate: number;
    protected readonly onChanged: (period: Period) => Promise<void>;
    constructor(timezone: number, siteBizMonth: number, siteBizDate: number, onChanged: (period: Period) => Promise<void>) {
        this.timezone = timezone;
        this.siteBizMonth = siteBizMonth;
        this.siteBizDate = siteBizDate;
        this.onChanged = onChanged;
        let date = this.newDate();
        this.state = atom({
            to: date,
            from: new Date(date),
            caption: null,
        });
        this.hasNext = atom((get) => {
            let date = this.newDate();
            return get(this.state).to <= date;
        });
        this.caption = atom((get) => this.getCaption(get));
        this.init();
        //this.canHasChild = true;
    }
    protected abstract getCaption(get: Getter): string;
    private newDate(): Date {
        let ret = new Date();
        ret.setHours(ret.getHours() - env.timeZone + this.timezone)
        ret.setHours(0, 0, 0, 0);
        return ret;
    }
    type: EnumPeriod;
    readonly state: WritableAtom<{
        from: Date;
        to: Date;
    }, any, any>;
    readonly hasNext: Atom<boolean>;
    readonly caption: Atom<string>;
    /*
    private canHasChild: boolean;
    private lysp: Period;
    get lastYearSamePeriod(): Period {
        if (this.canHasChild && !this.lysp) {
            this.lysp = createPeriod(this.type, this.timezone, this.siteBizMonth, this.siteBizDate, undefined);
            let { from, to } = getAtomValue(this.lysp.state);
            setAtomValue(this.lysp.state, {
                from: new Date(from.setFullYear(from.getFullYear() - 1)),
                to: new Date(to.setFullYear(to.getFullYear() - 1)),
            })
            //this.lysp.setCaption();
            this.lysp.canHasChild = false;
        }
        return this.lysp;
    }
    */
    getGrainSize(date: Date): string {
        return "";
    }
    abstract init(): void;
    protected abstract prevInternal(): void;
    protected abstract nextInternal(): void;

    prev(): void {
        this.prevInternal();
        //this.lastYearSamePeriod?.prevInternal();
        this.onChanged?.(this);
    }

    next(): void {
        this.nextInternal();
        //this.lastYearSamePeriod?.nextInternal();
        this.onChanged?.(this);
    }
}

const weekday = '日一二三四五六';
class DayPeriod extends Period {
    init(): void {
        this.type = EnumPeriod.day;
        let { from: fromDate, to: toDate } = getAtomValue(this.state);
        let from = new Date(fromDate);
        let to = new Date(toDate);
        to.setDate(fromDate.getDate() + 1);
        setAtomValue(this.state, {
            from,
            to,
        });
    }
    protected override prevInternal(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            to: new Date(to.setDate(to.getDate() - 1)),
            from: new Date(from.setDate(from.getDate() - 1)),
        });
    }
    protected override nextInternal(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            to: new Date(to.setDate(to.getDate() + 1)),
            from: new Date(from.setDate(from.getDate() + 1)),
        });
    }
    protected getCaption(get: Getter): string {
        let { from } = get(this.state);
        let year = new Date().getFullYear();
        let y = from.getFullYear();
        let m = from.getMonth();
        let d = from.getDate();
        let dw = from.getDay();
        return (y === year ? '' : `${y}年`) + `${m + 1}月${d}日 星期${weekday[dw]}`;
    }
}

class WeekPeriod extends Period {
    init(): void {
        let { to: toDate } = getAtomValue(this.state);
        this.type = EnumPeriod.week;
        let dayOfWeek = toDate.getDay();
        let dayOfMonth = toDate.getDate();
        let diff = dayOfMonth - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
        let to = new Date(toDate);
        let from = new Date(toDate.setDate(diff));
        // let toValue = new Date(to);
        to.setDate(toDate.getDate() + 7);
        setAtomValue(this.state, {
            from,
            to,
        });
    }
    protected override prevInternal(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setDate(from.getDate() - 7)),
            to: new Date(to.setDate(to.getDate() - 7)),
        });
    }
    protected override nextInternal(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setDate(from.getDate() + 7)),
            to: new Date(to.setDate(to.getDate() + 7)),
        });
    }
    protected getCaption(get: Getter): string {
        let { from, to } = get(this.state);
        let year = new Date().getFullYear();
        let yf = from.getFullYear();
        let mf = from.getMonth();
        let df = from.getDate();
        let toDate = new Date(to);
        toDate.setDate(to.getDate() - 1);
        let mt = toDate.getMonth();
        let dt = toDate.getDate();
        return (yf === year ? '' : `${yf}年`) + `${mf + 1}月${df}日 - `
            + (mt === mf ? '' : `${mt + 1}月`) + `${dt}日`;
    }
    getGrainSize(date: Date) {
        return moment(date).format("MM-DD");
    }
}

class MonthPeriod extends Period {
    init(): void {
        let { from: fromDate, to: toDate } = getAtomValue(this.state);
        this.type = EnumPeriod.month;
        let year = toDate.getFullYear();
        let month = toDate.getMonth();
        let date = toDate.getDate();
        if (date < this.siteBizDate) {
            month--;
            if (month < 0) { month = 11; year-- };
        }
        let from = new Date(year, month, this.siteBizDate);
        let to: Date = new Date(from);
        to.setMonth(month + 1);
        setAtomValue(this.state, {
            from,
            to,
        });
    }
    protected override prevInternal(): void {
        let { from: fromDate, to: toDate } = getAtomValue(this.state);
        let from = new Date(fromDate.setMonth(fromDate.getMonth() - 1));
        let to = new Date(toDate.setMonth(toDate.getMonth() - 1));
        setAtomValue(this.state, {
            from,
            to,
        });
    }
    protected override nextInternal(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setMonth(from.getMonth() + 1)),
            to: new Date(to.setMonth(to.getMonth() + 1)),
        });
    }
    protected getCaption(get: Getter): string {
        let { from, to } = get(this.state);
        let thisYear = new Date().getFullYear();
        let yf = from.getFullYear();
        let fm = from.getMonth();
        let tm = to.getMonth();
        let caption = `${thisYear === yf ? '' : yf + '年'}${fm + 1}月`;
        if (this.siteBizDate > 1) {
            caption += `${this.siteBizDate}日-${tm + 1}月${this.siteBizDate - 1}日`;
        }
        return caption;
    }
    getGrainSize(date: Date) {
        return moment(date).format("MM-DD");
    }
}

class YearPeriod extends Period {
    init(): void {
        let { from, to } = getAtomValue(this.state);
        this.type = EnumPeriod.year;
        let year = to.getFullYear();
        let month = to.getMonth();
        let date = to.getDate();
        if (month < this.siteBizMonth) {
            year--;
        } else if (date < this.siteBizDate) {
            month++;
            if (month > 11) year++;
        }
        month = this.siteBizMonth;
        let toValue: Date = new Date(from);
        toValue.setFullYear(to.getFullYear() + 1);
        setAtomValue(this.state, {
            from: new Date(year, month, this.siteBizDate),
            to: toValue,
        });
    }
    protected override prevInternal(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setFullYear(from.getFullYear() - 1)),
            to: new Date(to.setFullYear(to.getFullYear() - 1)),
        });
    }
    protected override nextInternal(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setFullYear(from.getFullYear() + 1)),
            to: new Date(to.setFullYear(to.getFullYear() + 1)),
        });
    }
    protected getCaption(get: Getter): string {
        let { from, to } = get(this.state);
        let fy = from.getFullYear();
        let ty = to.getFullYear();
        let caption: string;
        switch (this.siteBizMonth) {
            case 0:
                caption = `${fy}年`;
                break;
            case 11:
                caption = `${ty}年`;
                break;
            default:
                caption = `${fy}-${ty.toString().substring(2)}年`;
                break;
        }
        return caption;
    }
    getGrainSize(date: Date) {
        return moment(date).add(1, 'M').format("MM");
    }
}

function createPeriod(periodType: EnumPeriod, timezone: number, siteBizMonth: number, siteBizDate: number, onChanged: (period: Period) => Promise<void>): Period {
    let period: Period;
    switch (periodType) {
        case EnumPeriod.day: period = new DayPeriod(timezone, siteBizMonth, siteBizDate, onChanged); break;
        case EnumPeriod.week: period = new WeekPeriod(timezone, siteBizMonth, siteBizDate, onChanged); break;
        case EnumPeriod.month: period = new MonthPeriod(timezone, siteBizMonth, siteBizDate, onChanged); break;
        case EnumPeriod.year: period = new YearPeriod(timezone, siteBizMonth, siteBizDate, onChanged); break;
    }
    return period;
}

export function usePeriod(timezone: number, siteBizMonth: number, siteBizDate: number, onChanged: (period: Period) => Promise<void>): [Period, (periodType: EnumPeriod) => void] {
    let periodType: EnumPeriod = loadPeriod();
    const [period, setPeriod] = useState(createPeriod(periodType, timezone, siteBizDate, siteBizMonth, onChanged));
    function setNewPeriod(newPeriodType: EnumPeriod): void {
        let retPeriod = createPeriod(newPeriodType, timezone, siteBizDate, siteBizMonth, onChanged);
        setPeriod(retPeriod);
        savePeriod(newPeriodType);
        onChanged(retPeriod);
    }
    return [period, setNewPeriod];
}
