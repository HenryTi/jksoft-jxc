import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { useAtomValue } from "jotai";
import { PendProps, ViewPendRow } from "./ViewPendRow";

export function ViewPendRowEdit(props: PendProps) {
    const { pendRow, binStore } = props;
    let { pend: pendId } = pendRow;
    let atomValDiv = binStore.valDivsOnPend[pendId];
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

    function ViewItem({ icon, color, onSelectChanged }: { icon: string; color: string; onSelectChanged: () => void }) {
        return <div className="d-flex cursor-pointer" onClick={onSelectChanged}>
            <div className="z-0 position-relative px-2 py-3 text-center align-self-end text-info me-n3">
                <FA name={icon} fixWidth={true} size="lg" className={color + ' mx-1 '} />
            </div>
            <ViewPendRow binStore={binStore} pendRow={pendRow} showPendValue={true} />
        </div>;
    }

    function ViewNoDiv() {
        async function onAddNew() {
            binStore.addNewPendRow(pendId);
        }
        return <ViewItem icon="square-o" color="text-body-tertiary" onSelectChanged={onAddNew} />
    }

    function ViewWithDiv() {
        const { atomDeleted } = valDiv;
        const valRow = useAtomValue(valDiv.getAtomValRow());
        const deleted = useAtomValue(atomDeleted);
        const { id } = valRow;
        function onDelThoroughly() {
            binStore.deletePendThoroughly(valRow);
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
