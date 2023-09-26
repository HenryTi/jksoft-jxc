import { Main } from "./SheetStore";
import { Band } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "./ViewSheetTime";

export function ViewMain({ main }: { main: Main }) {
    const { id, no, _target, entityMain, keyId } = main;
    const { targetCaption } = entityMain;
    const targetValue = useAtomValue(_target);
    return <div className="tonwa-bg-gray-3 py-3 container">
        <Band label={'单据编号'} className="mb-1">
            <b>{no}</b> &nbsp; &nbsp;
            <ViewSheetTime id={id} />
        </Band>
        {
            targetValue > 0 &&
            <Band label={targetCaption} className="mb-1">
                <div className="">
                    <ViewSpec id={targetValue} />
                </div>
            </Band>
        }
    </div>;
}
