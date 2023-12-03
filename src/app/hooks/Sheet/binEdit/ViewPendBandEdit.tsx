import { FA, getAtomValue } from "tonwa-com";
import { BinDetail, BinRow, PendRow, Row, Section, SheetStore } from "../SheetStore";
import { Atom, useAtomValue } from "jotai";
import { InputProps, usePendInputs } from "../pendInput";
import { PendBandEditProps } from "../tool";
import { useRowEdit } from "./rowEdit";
import { BinEditing } from "../BinEditing";
import { Page, useModal } from "tonwa-app";

export interface ViewPendBandEditProps extends PendBandEditProps {
    pendContent: any;
}

let rowId = 1;
export function ViewPendBandEdit({ pendRow, pendContent, sheetStore, namedResults }: ViewPendBandEditProps) {
    const modal = useModal();
    const { entityBin } = sheetStore.detail;
    const pendInputs = usePendInputs(entityBin);
    const rowEdit = useRowEdit();
    let { pend: pendId, origin, value } = pendRow;
    let _sections = sheetStore.pendColl[pendId];
    let sections = useAtomValue(_sections);
    const inputProps: InputProps<any> = {
        namedResults,
        sheetStore,
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
        if (retPendInputs === undefined) return;
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
        sheetStore.addBinDetail(binDetail);
    }
    if (sections !== undefined && sections.length > 0) {
        return <div>
            <ViewSections sections={sections} onEdit={onEdit} pendContent={pendContent} />
        </div>;
    }
    else {
        return <div className="d-flex pe-3">
            <div className="cursor-pointer px-3 py-3 text-center align-self-end text-info" onClick={onAddNew}>
                <FA name="check" fixWidth={true} />
            </div>
            {pendContent}
        </div>;
    }
}

interface PendSectionProps {
    onEdit: () => Promise<void>;
    pendContent: any;
}
function ViewSections({ sections, onEdit, pendContent }: PendSectionProps & { sections: Section[]; }) {
    return <div>
        <div className="d-flex">
            <div className="cursor-pointer p-3 text-info align-self-end" onClick={onEdit}>
                <FA name="plus" fixWidth={true} />
            </div>
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
