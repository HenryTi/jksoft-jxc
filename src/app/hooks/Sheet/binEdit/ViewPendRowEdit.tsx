import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { useAtomValue } from "jotai";
import { useInputs } from "../inputs";
import { DivEditProps, DivEditing, UseInputsProps, ValDiv } from "../store";
import { useModal } from "tonwa-app";
import { ValRow, mergeValRow } from "../tool";

export interface ViewPendRowEditProps extends DivEditProps {
    pendContent: any;
}

export function ViewPendRowEdit({ pendRow, pendContent, divStore }: ViewPendRowEditProps) {
    const modal = useModal();
    const inputs = useInputs();
    let { pend: pendId } = pendRow;
    let atomValDiv = divStore.pendColl[pendId];
    let valDiv = useAtomValue(atomValDiv);
    async function onEdit() {
        setAtomValue(valDiv.atomDeleted, false);
        modal.close();
    }
    if (valDiv !== undefined) {
        function Doing() {
            const { atomSum } = valDiv;
            const value = useAtomValue(atomSum);
            return <div>
                <div className="d-flex">
                    <ViewCheck icon="check-square" iconColor="text-primary" onClick={onEdit} />
                    <div>
                        <div className="pe-3">
                            {pendContent}
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="pb-3 text-primary flex-grow-1">
                                选中处理
                            </div>
                            <div className="text-secondary small">处理数</div>
                            <div className="mx-3 w-min-4c text-end fs-larger fw-bold text-primary">{value ?? 0}</div>
                        </div>
                    </div>
                </div>
            </div>;
        }
        return <Doing />;
    }
    else {
        async function onAddNew() {
            let valRow: ValRow = { id: -pendId, buds: {}, owned: {}, pend: pendId };
            let retValDiv = new ValDiv(divStore.binDiv, valRow);
            divStore.valDivs.addValDiv(retValDiv);
            setAtomValue(atomValDiv, retValDiv);
            /*
            const useInputsProps: UseInputsProps = {
                divStore,
                binDiv: divStore.binDiv,
                valDiv,
                pendRow,
                namedResults: {},
            }
            let retValDiv = await inputs(useInputsProps, false);
            if (retValDiv === undefined) return;
            divStore.valDivs.addValDiv(retValDiv);
            setAtomValue(atomValDiv, retValDiv);
            */
        }
        return <div className="d-flex pe-3">
            <ViewCheck icon="check" iconColor="text-info" onClick={onAddNew} />
            {pendContent}
        </div>;
    }
}

function ViewCheck({ icon, iconColor, onClick }: { icon: string; iconColor: string; onClick: () => void; }) {
    return <div className="z-0 position-relative cursor-pointer px-2 py-3 text-center align-self-end text-info" onClick={onClick}>
        <FA name={icon} fixWidth={true} size="lg" className={iconColor + ' mx-1 '} />
    </div>
}
