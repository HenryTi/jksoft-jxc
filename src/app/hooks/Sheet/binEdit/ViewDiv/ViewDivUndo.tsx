import { FA, setAtomValue, wait } from "tonwa-com";
import { ViewRow } from "./ViewRow";
import { ViewDivProps } from "./tool";
import { useCallback, useRef, useState } from "react";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";
import { atom, useAtomValue } from "jotai";
import { BinStore, ValDivBase } from "../../store";

export function ViewDivUndo(props: ViewDivProps) {
    const { binStore, valDiv } = props;
    const { current: undoStore } = useRef(new UndoStore(binStore, valDiv));
    /*
    const { atomDeleted } = valDiv;
    let [deleting, setDeleting] = useState(0);
    const refCanceled = useRef(false);
    const onRestore = async function () {
        setAtomValue(atomDeleted, false);
    };
    const onDelThoroughly = useCallback(async function onDelThoroughly() {
        // 延迟一段时间删除的代码，还蛮难写的，以后再说
        let delay = 200;
        for (let i = delay; i >= 0; i--) {
            await wait(10);
            if (refCanceled.current === true) {
                refCanceled.current = false;
                setDeleting(0);
                return;
            }
            setDeleting(i);
        }
        await binStore.delValDiv(valDiv);
    }, []);

    function btn(onClick: () => void, icon: string, iconColor: string, caption: string, captionColor: string) {
        return <div className={'cursor-pointer px-2 ' + iconColor} onClick={onClick}>
            <FA className="me-1" name={icon} fixWidth={true} />
            <span className={captionColor}>{caption}</span>
        </div>
    }
    */


    const bottoms: DivRightButton[] = [
        {
            icon: 'undo',
            color: ' text-warning ',
            label: '恢复',
            // labelColor: 'text-info',
            onClick: undoStore.onRestore,
        },
        {
            icon: 'times',
            color: ' text-body-tertiary ',
            label: '清除',
            onClick: undoStore.onDelThoroughly
        },
    ];

    return <div className="d-flex border-bottom">
        <div className="flex-fill text-body-tetiary opacity-50 text-decoration-line-through">
            <ViewRow {...props} hidePivot={true} />
        </div>
        <ViewDivRightButtons tops={undefined} bottoms={bottoms} />
    </div>;
}

class UndoStore {
    private readonly binStore: BinStore;
    private readonly valDiv: ValDivBase;

    constructor(binStore: BinStore, valDiv: ValDivBase) {
        this.binStore = binStore;
        this.valDiv = valDiv;
    }
    onRestore = () => {
        setAtomValue(this.valDiv.atomDeleted, false);
    };
    onDelThoroughly = async () => {
        await this.binStore.delValDiv(this.valDiv);
    };
}
