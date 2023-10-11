import { SheetMain } from "./SheetStore";
import { Band } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "./ViewSheetTime";
import { BizBud } from "app/Biz";

export function ViewMain({ main }: { main: SheetMain }) {
    const { no, entityMain, _binRow } = main;
    const { i: budI, x: budX } = entityMain;
    const { id, i, x } = useAtomValue(_binRow);

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        const { caption, name } = bud;
        return <Band label={caption ?? name} className="mb-1">
            <div className="">
                <ViewSpec id={value} />
            </div>
        </Band>
    }

    return <div className="tonwa-bg-gray-3 py-3 container">
        <Band label={'单据编号'} className="mb-1">
            <b>{no}</b> &nbsp; &nbsp;
            <ViewSheetTime id={id} />
        </Band>
        <ViewIdField bud={budI} value={i} />
        <ViewIdField bud={budX} value={x} />
    </div>;
}
