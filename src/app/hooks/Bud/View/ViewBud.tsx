import { BizBud, EnumBudType } from "app/Biz";
import { ViewAtomId } from "app/hooks";

export function ViewBud({ bud, value }: { bud: BizBud; value: any; }) {
    if (bud === undefined) return <>{value}</>;
    switch (bud.budDataType.type) {
        default:
        case EnumBudType.dec:
        case EnumBudType.none:
        case EnumBudType.int:
        case EnumBudType.char:
        case EnumBudType.str:
            return <>{value}</>;

        case EnumBudType.atom: return atom(bud, value);
        case EnumBudType.radio: return radio(bud, value);
        case EnumBudType.check: return check(bud, value);
        case EnumBudType.intof: return intof(bud, value);
        case EnumBudType.pick: return pick(bud, value);
        case EnumBudType.ID: return ID(bud, value);
        case EnumBudType.date: return date(bud, value);
        case EnumBudType.datetime: return datetime(bud, value);
    }
}

function atom(bud: BizBud, value: any) {
    return <ViewAtomId id={value} />;
}

function radio(bud: BizBud, value: any) {
    return <>radio: {value}</>;
}

function check(bud: BizBud, value: any) {
    return <>check: {value}</>;
}

function intof(bud: BizBud, value: any) {
    return <>intof: {value}</>;
}

function pick(bud: BizBud, value: any) {
    return <>pick: {value}</>;
}

function date(bud: BizBud, value: any) {
    return <>date: {value}</>;
}

function datetime(bud: BizBud, value: any) {
    return <>datetime: {value}</>;
}

function ID(bud: BizBud, value: any) {
    return <>ID: {value}</>;
}
