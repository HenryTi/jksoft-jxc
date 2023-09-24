import { Main } from "./SheetStore";
import { Band } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { useAtomValue } from "jotai";

export function ViewMain({ main }: { main: Main }) {
    const { _target, entityMain } = main;
    const { targetCaption } = entityMain;
    const targetValue = useAtomValue(_target);
    return <div className="tonwa-bg-gray-3 pt-3 container">
        <Band label={targetCaption}>
            <div className="">
                <ViewSpec id={targetValue} />
            </div>
        </Band>
    </div>;
}
