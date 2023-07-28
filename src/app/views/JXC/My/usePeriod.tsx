import { useUqApp } from "app/UqApp";
import { EnumPeriod } from "./Period";

interface UsePeriodReturn {
    prev: () => Promise<void>;
    next: () => Promise<void>;
    setPeriod: (period: EnumPeriod) => void;
    period: EnumPeriod;
    caption: string;
}

export function usePeriod(): UsePeriodReturn {
    const uqApp = useUqApp();
    let period = EnumPeriod.week;
    let caption = '周';
    async function prev() {

    }
    async function next() {

    }
    function setPeriod() {
        alert('set period');
    }
    return {
        prev,
        next,
        setPeriod,
        period,
        caption,
    };
}
