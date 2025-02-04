import { dateFromMinuteId, EasyTime } from "tonwa-com";

// const umPow = Math.pow(2, 20);
export function ViewSheetTime({ id }: { id: number; }) {
    const d = dateFromMinuteId(id);
    return <span className="small text-secondary">
        <EasyTime date={d} />
    </span>;
}
