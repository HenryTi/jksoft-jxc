import { FA, setAtomValue } from "tonwa-com";
import { Row, Section } from "../store";
import { useAtomValue } from "jotai";
import { useInputs } from "../inputs";
import { DivEditProps, UseInputsProps } from "../store";
import { PendProxyHander } from "../tool";
import { useModal } from "tonwa-app";

export interface ViewPendRowEditProps extends DivEditProps {
    pendContent: any;
}

export function ViewPendRowEdit({ pendRow, pendContent, divStore }: ViewPendRowEditProps) {
    const modal = useModal();
    const { entityBin, namedResults } = divStore;
    const inputs = useInputs();
    let { pend: pendId } = pendRow;
    let _valDiv = divStore.pendColl[pendId];
    let valDiv = useAtomValue(_valDiv);
    async function onEdit() {
        modal.close();
    }
    const { rearPick, pend } = entityBin;
    async function onAddNew() {
        namedResults[rearPick.name] = new Proxy(pendRow, new PendProxyHander(pend));
        const useInputsProps: UseInputsProps = {
            divStore,
            binDiv: divStore.binDiv,
            valDiv,
            pendRow,
        }
        let retValDiv = await inputs(useInputsProps);
        if (retValDiv === undefined) return;
        divStore.valDivs.addValDiv(retValDiv);
        setAtomValue(_valDiv, retValDiv);
        return;
    }
    if (valDiv !== undefined) {
        function Doing() {
            const value = useAtomValue(valDiv.atomValue);
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
        return <div className="d-flex pe-3">
            <ViewCheck icon="check" iconColor="text-info" onClick={onAddNew} />
            {pendContent}
        </div>;
    }
}

function ViewCheck({ icon, iconColor, onClick }: { icon: string; iconColor: string; onClick: () => void; }) {
    return <div className="cursor-pointer px-2 py-3 text-center align-self-end text-info" onClick={onClick}>
        <FA name={icon} fixWidth={true} size="lg" className={iconColor + ' mx-1 '} />
    </div>
}

interface PendSectionProps {
    onEdit: () => Promise<void>;
    pendContent: any;
}
function ViewSections({ sections, onEdit, pendContent }: PendSectionProps & { sections: Section[]; }) {
    return <div>
        <div className="d-flex">
            <ViewCheck icon="check-square" iconColor="text-primary" onClick={onEdit} />
            <div>
                <div className="pe-3">
                    {pendContent}
                </div>
                <div className="">
                    {sections.map(v => <ViewSection key={v.keyId} section={v} />)}
                </div>
            </div>
        </div>
    </div>;
}

function ViewSection({ section }: { section: Section }) {
    const { _rows } = section;
    let rows = useAtomValue(_rows);
    return <div className="px-3 py-3 border-top">
        {rows.map(v => <ViewRow key={v.keyId} row={v} />)}
    </div>;
}

function ViewRow({ row }: { row: Row }) {
    const { props } = row;
    return <div>row: {JSON.stringify(props)}</div>;
}
