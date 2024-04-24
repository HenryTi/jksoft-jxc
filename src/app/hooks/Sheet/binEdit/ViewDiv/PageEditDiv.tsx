import { useAtomValue } from "jotai";
import { DivEditing, DivStore, ValDiv, ValDivBase, ValRow } from "../../store";
import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { useInputDivs } from "../divNew";
import { useRowEdit } from "../useRowEdit";
import { Page, useModal } from "tonwa-app";
import { ViewDivUndo } from "./ViewDivUndo";
import { ViewRow } from "./ViewRow";

export function PageEditDiv({ divStore, valDiv }: { divStore: DivStore; valDiv: ValDivBase; }) {
    const { sheetStore } = divStore;
    const { entitySheet, main } = sheetStore;
    return <Page header={`${(entitySheet.caption ?? entitySheet.name)} - ${main.no}`}>
        <EditDiv divStore={divStore} valDiv={valDiv} />
    </Page>
}

interface EditDivProps {
    divStore: DivStore;
    valDiv: ValDivBase;
}

function EditDiv(props: EditDivProps) {
    const modal = useModal();
    const { divStore, valDiv } = props;
    const { atomValDivs, binDiv, atomDeleted, atomValRow } = valDiv;
    const { level, entityBin, subBinDiv: div } = binDiv;
    const { divLevels, pivot } = entityBin;
    const inputDivs = useInputDivs();
    const valRow = useAtomValue(atomValRow);
    const divs = useAtomValue(atomValDivs);
    const deleted = useAtomValue(atomDeleted);
    let bg = divLevels - level - 1;
    let borderTop = ''; // bg > 0 ? 'border-top' : '';
    let cdAddBottom: string;
    let cnDivBottom: string;
    if (div === undefined || div === pivot) {
        cnDivBottom = ' border-bottom ';
        cdAddBottom = '';
    }
    else {
        cnDivBottom = level === 0 ? ' mb-2 ' : ' mb-2 border-bottom ';
        cdAddBottom = ' border-bottom ';
    }
    let viewDivs: any;
    if (divs.length > 0) {
        async function onAddNew() {
            const { atomValRow } = valDiv;
            const valRow = getAtomValue(atomValRow);
            let pendRow = await divStore.loadPendRow(valRow.pend);
            let ret = await inputDivs({
                divStore,
                pendRow,
                namedResults: {},
                binDiv: div,
                valDiv,
                skipInputs: true,
            });
            if (ret === undefined) return;
            setAtomValue(atomValDivs, [...divs, ret]);
        }
        viewDivs = <div className="ms-4 border-start">
            {
                divs.map(v => <EditDiv key={v.id} {...props} valDiv={v} />)
            }
            <div className={` ps-3 py-2 tonwa-bg-gray-${bg} ${borderTop} ${cdAddBottom} cursor-pointer text-success`} onClick={onAddNew}>
                <FA name="plus" size="lg" className="me-2" /> {div?.ui?.caption}
            </div>
        </div>;
    }
    async function onDel() {
        setAtomValue(atomDeleted, !deleted);
        const { sheetStore } = divStore;
        sheetStore.notifyRowChange();
        if (level === 0) {
            modal.close();
            return;
        }
    }
    function btn(onClick: () => void, icon: string, iconColor: string, caption: string, captionColor: string) {
        return <div className={'cursor-pointer px-2 ' + iconColor} onClick={onClick}>
            <FA className="me-1" name={icon} fixWidth={true} />
            <span className={captionColor}>{caption}</span>
        </div>
    }

    function btnDel(icon: string, caption?: string) {
        return btn(onDel, icon, ' text-body-secondary ', caption, '');
    }

    if (deleted === true) {
        return <ViewDivUndo divStore={divStore} valDiv={valDiv} />;
    }

    let buttons: any;
    if (level === divLevels) {
        function Buttons() {
            const rowEdit = useRowEdit();
            async function onEdit() {
                const { atomValRow } = valDiv;
                const editing = new DivEditing(divStore, undefined, binDiv, valDiv, valRow);
                let ret = await rowEdit(editing, valDiv);
                if (ret !== true) return;
                const { valRow: newValRow } = editing;
                if (isPivotKeyDuplicate(newValRow) === true) {
                    alert('Pivot key duplicate');
                    return;
                }
                await divStore.saveDetail(binDiv, newValRow);
                setAtomValue(atomValRow, newValRow);

                function isPivotKeyDuplicate(valRow: ValRow) {
                    const { key } = binDiv;
                    if (key === undefined) return false;
                    const { id: keyId } = key;
                    const keyValue = valRow.buds[keyId];
                    const valDivParent = divStore.getParentValDiv(valDiv);
                    const { atomValDivs } = valDivParent;
                    const valDivs = getAtomValue(atomValDivs);
                    for (let vd of valDivs) {
                        if (vd === valDiv) continue;
                        const { atomValRow } = vd;
                        const vr = getAtomValue(atomValRow);
                        if (keyValue === vr.buds[keyId]) return true;
                    }
                    return false;
                }
            }
            return <>
                <div className="d-flex flex-column align-items-end w-min-2c">
                    <div className="cursor-pointer px-2 py-1 mt-n2" onClick={onEdit}>
                        <FA className="text-primary" name="pencil-square-o" size="lg" />
                    </div>
                    <div className="flex-fill" />
                    {btnDel('trash-o')}
                </div>
            </>;
        }
        buttons = <Buttons />;
    }
    else {
        buttons = btnDel('trash-o');
    }

    return <div className={cnDivBottom}>
        <ViewRow {...props} buttons={buttons} hidePivot={true} />
        {viewDivs}
    </div>
}
