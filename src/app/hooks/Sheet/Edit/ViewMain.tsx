import { SheetMain } from "./SheetStore";
import { Band } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "./ViewSheetTime";

export function ViewMain({ main }: { main: SheetMain }) {
    const { id, no, _i, entityMain, keyId } = main;
    const { i } = entityMain;
    const targetValue = useAtomValue(_i);
    return <div className="tonwa-bg-gray-3 py-3 container">
        <Band label={'单据编号'} className="mb-1">
            <b>{no}</b> &nbsp; &nbsp;
            <ViewSheetTime id={id} />
        </Band>
        {
            targetValue > 0 &&
            <Band label={i.caption} className="mb-1">
                <div className="">
                    <ViewSpec id={targetValue} />
                </div>
            </Band>
        }
    </div>;
}
