import { Atom, Getter, WritableAtom, atom } from "jotai";
import moment from "moment";
import { useRef, useState } from "react";
import { env, getAtomValue, setAtomValue } from "tonwa-com";

export enum EnumPeriod { day = 0, month = 1, week = 2, year = 3 }
/*
export interface ItemPeriodSum extends ReturnGetObjectItemPeriodSumRet {
    id: number;
    object: number;
    post: Post;
    item: Item;
    value: number;
}

export interface PostPeriodSum {
    post: Post;
    itemColl: { [item in keyof typeof Item]: ItemPeriodSum };
    itemList: ItemPeriodSum[];
}
*/
export abstract class Period {
    protected readonly timezone: number;
    protected readonly unitBizMonth: number;
    protected readonly unitBizDate: number;
    constructor(timezone: number, unitBizMonth: number, unitBizDate: number) {
        this.timezone = timezone;
        this.unitBizMonth = unitBizMonth;
        this.unitBizDate = unitBizDate;
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
        this.canHasChild = true;
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

    private canHasChild: boolean;
    private lysp: Period;
    get lastYearSamePeriod(): Period {
        if (this.canHasChild && !this.lysp) {
            this.lysp = createPeriod(this.type, this.timezone, this.unitBizMonth, this.unitBizDate);
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
    getGrainSize(date: Date): string {
        return "";
    }
    abstract init(): void;
    abstract prev(): void;
    abstract next(): void;
}

const weekday = '日一二三四五六';
class DayPeriod extends Period {
    init(): void {
        this.type = EnumPeriod.day;
        let { from, to } = getAtomValue(this.state);
        to.setDate(from.getDate() + 1);
        setAtomValue(this.state, {
            from,
            to,
        })
    }
    prev(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            to: new Date(to.setDate(to.getDate() - 1)),
            from: new Date(from.setDate(from.getDate() - 1)),
        });
        this.lastYearSamePeriod?.prev();
    }
    next(): void {
        let { state } = this;
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            to: new Date(to.setDate(to.getDate() + 1)),
            from: new Date(from.setDate(from.getDate() + 1)),
        });
        this.lastYearSamePeriod?.next();
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
        let { to } = getAtomValue(this.state);
        this.type = EnumPeriod.week;
        let day = to.getDay();
        let diff = to.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        to.setDate(to.getDate() + 7);
        setAtomValue(this.state, {
            from: new Date(to.setDate(diff)),
            to,
        });
    }
    prev(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setDate(from.getDate() - 7)),
            to: new Date(to.setDate(to.getDate() - 7)),
        });
        this.lastYearSamePeriod?.prev();
    }
    next(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setDate(from.getDate() + 7)),
            to: new Date(to.setDate(to.getDate() + 7)),
        });
        this.lastYearSamePeriod?.next();
    }
    protected getCaption(get: Getter): string {
        let { from, to } = get(this.state);
        let year = new Date().getFullYear();
        let yf = from.getFullYear();
        let mf = from.getMonth();
        let df = from.getDate();
        let mt = to.getMonth();
        let dt = to.getDate();
        return (yf === year ? '' : `${yf}年`) + `${mf + 1}月${df}日 - `
            + (mt === mf ? '' : `${mt}月`) + `${dt}日`;
    }
    getGrainSize(date: Date) {
        return moment(date).format("MM-DD");
    }
}

class MonthPeriod extends Period {
    init(): void {
        let { from, to } = getAtomValue(this.state);
        this.type = EnumPeriod.month;
        let year = to.getFullYear();
        let month = to.getMonth();
        let date = to.getDate();
        if (date < this.unitBizDate) {
            month--;
            if (month < 0) { month = 11; year-- };
        }
        let toValue: Date = new Date(from);
        toValue.setMonth(to.getMonth() + 1);
        setAtomValue(this.state, {
            from: new Date(year, month, this.unitBizDate),
            to: toValue,
        });
    }
    prev(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setMonth(from.getMonth() - 1)),
            to: new Date(to.setMonth(to.getMonth() - 1)),
        });
        this.lastYearSamePeriod?.prev();
    }
    next(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setMonth(from.getMonth() + 1)),
            to: new Date(to.setMonth(to.getMonth() + 1)),
        });
        this.lastYearSamePeriod?.next();
    }
    protected getCaption(get: Getter): string {
        let { from, to } = get(this.state);
        let thisYear = new Date().getFullYear();
        let yf = from.getFullYear();
        let fm = from.getMonth();
        let tm = to.getMonth();
        let caption = `${thisYear === yf ? '' : yf + '年'}${fm + 1}月`;
        if (this.unitBizDate > 1) {
            caption += `${this.unitBizDate}日-${tm + 1}月${this.unitBizDate - 1}日`;
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
        if (month < this.unitBizMonth) {
            year--;
        } else if (date < this.unitBizDate) {
            month++;
            if (month > 11) year++;
        }
        month = this.unitBizMonth;
        let toValue: Date = new Date(from);
        toValue.setFullYear(to.getFullYear() + 1);
        setAtomValue(this.state, {
            from: new Date(year, month, this.unitBizDate),
            to: toValue,
        });
    }
    prev(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setFullYear(from.getFullYear() - 1)),
            to: new Date(to.setFullYear(to.getFullYear() - 1)),
        });
        this.lastYearSamePeriod?.prev();
    }
    next(): void {
        let { from, to } = getAtomValue(this.state);
        setAtomValue(this.state, {
            from: new Date(from.setFullYear(from.getFullYear() + 1)),
            to: new Date(to.setFullYear(to.getFullYear() + 1)),
        });
        this.lastYearSamePeriod?.next();
    }
    protected getCaption(get: Getter): string {
        let { from, to } = get(this.state);
        let fy = from.getFullYear();
        let ty = to.getFullYear();
        let caption: string;
        switch (this.unitBizMonth) {
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

function createPeriod(periodType: EnumPeriod, timezone: number, unitBizMonth: number, unitBizDate: number): Period {
    let period: Period;
    switch (periodType) {
        case EnumPeriod.day: period = new DayPeriod(timezone, unitBizMonth, unitBizDate); break;
        case EnumPeriod.week: period = new WeekPeriod(timezone, unitBizMonth, unitBizDate); break;
        case EnumPeriod.month: period = new MonthPeriod(timezone, unitBizMonth, unitBizDate); break;
        case EnumPeriod.year: period = new YearPeriod(timezone, unitBizMonth, unitBizDate); break;
    }
    return period;
}

export function usePeriod(periodType: EnumPeriod, timezone: number, unitBizMonth: number, unitBizDate: number): [Period, (periodType: EnumPeriod) => void] {
    const [period, setPeriod] = useState(createPeriod(periodType, timezone, unitBizDate, unitBizMonth));
    function setNewPeriod(newPeriodType: EnumPeriod) {
        setPeriod(createPeriod(newPeriodType, timezone, unitBizDate, unitBizMonth));
    }
    return [period, setNewPeriod];
}
