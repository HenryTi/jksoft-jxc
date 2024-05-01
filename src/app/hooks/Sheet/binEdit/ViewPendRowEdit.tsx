import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { useAtomValue } from "jotai";
import { ValDiv, ValDivRoot, ValRow } from "../store";
// import { ValRow } from "../tool";
import { PendProps, ViewPendRow } from "./ViewPendRow";

export function ViewPendRowEdit(props: PendProps) {
    const { pendRow, divStore } = props;
    let { pend: pendId } = pendRow;
    let atomValDiv = divStore.valDivsOnPend[pendId];
    let valDiv = useAtomValue(atomValDiv);
    if (valDiv === undefined) {
        return ViewNoDiv();
    }
    else {
        let deleted = getAtomValue(valDiv.atomDeleted);
        if (deleted === true) {
            return <ViewNoDiv />;
        }
        else {
            return <ViewWithDiv />;
        }
    }

    function ViewItem({ icon, color, onSelectChanged }: { icon: string; color: string; onSelectChanged: () => Promise<void> | void }) {
        return <div className="d-flex">
            <div className="z-0 position-relative cursor-pointer px-2 py-3 text-center align-self-end text-info me-n3" onClick={onSelectChanged}>
                <FA name={icon} fixWidth={true} size="lg" className={color + ' mx-1 '} />
            </div>
            <ViewPendRow divStore={divStore} pendRow={pendRow} showPendValue={true} />
        </div>;
    }

    function ViewNoDiv() {
        async function onAddNew() {
            let valRow: ValRow = { id: -pendId, buds: {}, owned: {}, pend: pendId };
            let retValDiv = new ValDivRoot(divStore.binDivRoot, valRow);
            divStore.valDivsRoot.addValDiv(retValDiv, true);
            divStore.cachePendRow(pendRow);
            setAtomValue(atomValDiv, retValDiv);
        }
        return <ViewItem icon="square-o" color="text-body-tertiary" onSelectChanged={onAddNew} />
    }

    function ViewWithDiv() {
        const { atomDeleted, atomValRow } = valDiv;
        const valRow = useAtomValue(atomValRow);
        const deleted = useAtomValue(atomDeleted);
        const { id } = valRow;
        function onDelThoroughly() {
            divStore.valDivsRoot.removePend(-id);
            setAtomValue(atomValDiv, undefined);
        }
        function onNothing() {
        }
        if (deleted === true) {
            return <ViewNoDiv />;
        }
        if (id > 0) {
            return <ViewItem icon="check-square" color="text-primary" onSelectChanged={onNothing} />;
        }
        return <ViewItem icon="check-square" color="text-body-tertiary" onSelectChanged={onDelThoroughly} />;
    }
}
