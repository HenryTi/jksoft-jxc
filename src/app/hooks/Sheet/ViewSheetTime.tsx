import { EasyTime } from "tonwa-com";

const umPow = Math.pow(2, 20);
export function ViewSheetTime({ id }: { id: number; }) {
    return <span className="small text-secondary">
        <EasyTime date={(id / umPow) * 60} />
    </span>;
}
