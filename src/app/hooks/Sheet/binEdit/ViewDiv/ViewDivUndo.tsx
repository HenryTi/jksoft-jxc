import { setAtomValue } from "tonwa-com";
import { ViewRow } from "./ViewRow";
import { ViewDivProps } from "./tool";
import { useRef } from "react";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";
import { BinStore, ValDivBase } from "../../../../Store";

export function ViewDivUndo(props: ViewDivProps) {
    const { binStore, valDiv } = props;
    const { current: undoStore } = useRef(new UndoStore(binStore, valDiv));
    const bottoms: DivRightButton[] = [
        {
            icon: 'undo',
            color: ' text-warning ',
            label: '恢复',
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
