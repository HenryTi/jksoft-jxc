import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { BinDetail, BinRow, PendRow, Row, Section, SheetStore } from "../SheetStore";
import { Atom, atom, useAtomValue } from "jotai";
import { InputProps, usePendInputs } from "../pendInput";
import { PendBandEditProps } from "../tool";
import { useRowEdit } from "./rowEdit";
import { BinEditing, ValDiv, ValRow } from "../BinEditing";
import { Page, useModal } from "tonwa-app";

export interface ViewPendBandEditProps extends PendBandEditProps {
    pendContent: any;
}

let rowId = 1;
export function ViewPendBandEdit({ pendRow, pendContent, binStore, namedResults }: ViewPendBandEditProps) {
    const modal = useModal();
    // const { entityBin } = sheetStore.detail;
    // const {binStore} = sheetStore;
    const { entityBin } = binStore;
    const pendInputs = usePendInputs(entityBin);
    const rowEdit = useRowEdit();
    let { pend: pendId, origin, value } = pendRow;
    let _valDiv = binStore.pendColl[pendId];
    let valDiv = useAtomValue(_valDiv);
    const inputProps: InputProps<any> = {
        namedResults,
        binStore,
        pendRow,
        binInput: undefined,
    }
    /*
    async function onEdit() {
        let retPendInputs = await pendInputs(inputProps);
        if (retPendInputs === undefined) return;
        let binRow: BinRow = undefined;
        const binEditing = new BinEditing(entityBin, binRow);
        binEditing.setNamedParams(retPendInputs);
        let retRowEdit = await rowEdit(binEditing);
        if (retRowEdit === undefined) return;
        sheetStore.addPendRow(pendId, { props: { id: rowId++ } } as any);
    }
    */
    const onEdit = onAddNew;
    async function onAddNew() {
        let retPendInputs = await pendInputs(inputProps);
        if (retPendInputs === undefined) {
            let valRow: ValRow = { id: rowId++, parent: undefined, pend: pendId, a: 1, b: 2 }
            // binStore.setValRow(valRow);
            binStore.load([
                /*
                { id: 1, parent: undefined, pend: pendId, a: 1, b: 2 },
                { id: 2, parent: 1, pend: pendId, a: 1, b: 2 },
                { id: 3, parent: 2, pend: pendId, a: 1, b: 2 },
                */
                { id: 4, parent: undefined, pend: pendId, a: 1, b: 2 },
                { id: 5, parent: 4, pend: pendId, a: 1, b: 2 },
                { id: 6, parent: 5, pend: pendId, a: 1, b: 2 },
                { id: 7, parent: 5, pend: pendId, a: 1, b: 2 },
            ]);
            return;
        }
        let binRow: BinRow = undefined;
        const binEditing = new BinEditing(entityBin, binRow);
        binEditing.setNamedParams(retPendInputs);
        let retRowEdit = await rowEdit(binEditing);
        if (retRowEdit === undefined) return;
        let binDetail: BinDetail = {
            ...(binEditing.binRow),
            origin: origin,             // origin detail id
            pendFrom: pendId,
            pendValue: value,
        }
        binStore.sheetStore.addBinDetail(binDetail);
    }
    if (valDiv !== undefined) {
        return <div>
            <div className="d-flex">
                <ViewCheck icon="check-square" iconColor="text-primary" onClick={onEdit} />
                <div>
                    <div className="pe-3">
                        {pendContent}
                    </div>
                    <div className="">
                        yes, checked
                    </div>
                </div>
            </div>
        </div>;
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

function ViewDivPend({ value }: { value: ValDiv; }) {

}

function ViewDiv({ value }: { value: ValDiv; }) {
    return <div>
        View Div
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
