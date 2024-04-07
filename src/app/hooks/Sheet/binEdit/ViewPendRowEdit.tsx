import { FA, setAtomValue } from "tonwa-com";
import { useAtomValue } from "jotai";
import { DivEditProps, ValDiv } from "../store";
import { useModal } from "tonwa-app";
import { ValRow } from "../tool";

export interface ViewPendRowEditProps extends DivEditProps {
    pendContent: any;
}

export function ViewPendRowEdit({ pendRow, pendContent, divStore }: ViewPendRowEditProps) {
    const modal = useModal();
    let { pend: pendId } = pendRow;
    let atomValDiv = divStore.pendColl[pendId];
    let valDiv = useAtomValue(atomValDiv);
    async function onEdit() {
        setAtomValue(valDiv.atomDeleted, false);
    }
    function ViewItem({ icon, color, onSelectChanged }: { icon: string; color: string; onSelectChanged: () => Promise<void> | void }) {
        /*
        const { atomSum } = valDiv;
        const value = useAtomValue(atomSum);
        <div className="text-secondary small">处理数</div>
        <div className="mx-3 w-min-4c text-end fs-larger fw-bold text-primary">{value ?? 0}</div>
        */
        // "check-square", "text-primary";
        /*
        function ViewCheck({ icon, iconColor, onClick }: { icon: string; iconColor: string; onClick: () => void; }) {
            return <div className="z-0 position-relative cursor-pointer px-2 py-3 text-center align-self-end text-info" onClick={onClick}>
                <FA name={icon} fixWidth={true} size="lg" className={iconColor + ' mx-1 '} />
            </div>
        }
        */
        // <ViewCheck icon={icon} iconColor={color} onClick={onSelectChanged} />
        return <div className="d-flex">
            <div className="z-0 position-relative cursor-pointer px-2 py-3 text-center align-self-end text-info me-n3" onClick={onSelectChanged}>
                <FA name={icon} fixWidth={true} size="lg" className={color + ' mx-1 '} />
            </div>
            {pendContent}
        </div>;
    }
    async function onAddNew() {
        let valRow: ValRow = { id: -pendId, buds: {}, owned: {}, pend: pendId };
        let retValDiv = new ValDiv(divStore.binDiv, valRow);
        divStore.valDivs.addValDiv(retValDiv);
        setAtomValue(atomValDiv, retValDiv);
    }
    function onRestore() {
        setAtomValue(valDiv.atomDeleted, false);
    }
    function ViewItemUnselected({ onSelectChanged }: { onSelectChanged: () => Promise<void> | void; }) {
        return <ViewItem icon="square-o" color="text-body-tertiary" onSelectChanged={onSelectChanged} />;
    }
    function ItemDiv() {
        let deleted = useAtomValue(valDiv.atomDeleted);
        if (deleted === false) {
            return <ViewItem icon="check-square" color="text-primary" onSelectChanged={onEdit} />;
        }
        else {
            return <ViewItemUnselected onSelectChanged={onRestore} />;
        }
    }
    if (valDiv !== undefined) {
        return <ItemDiv />;
    }
    else {
        return <ViewItemUnselected onSelectChanged={onAddNew} />;
    }
}
