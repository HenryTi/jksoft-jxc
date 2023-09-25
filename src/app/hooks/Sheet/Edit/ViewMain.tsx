import { Main } from "./SheetStore";
import { Band } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { useAtomValue } from "jotai";

export function ViewMain({ main }: { main: Main }) {
    const { no, _target, entityMain, keyId } = main;
    const { targetCaption } = entityMain;
    const targetValue = useAtomValue(_target);
    console.log('render ViewMain', keyId, no, targetValue);
    return <div className="tonwa-bg-gray-3 py-3 container">
        <Band label={'单据编号'} className="mb-1">
            <b>{no}</b>
        </Band>
        <Band label={targetCaption} className="mb-1">
            <div className="">
                <ViewSpec id={targetValue} />
            </div>
        </Band>
    </div>;
}
