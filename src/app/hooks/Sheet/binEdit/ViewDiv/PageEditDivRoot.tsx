import { useAtomValue } from "jotai";
import { DivEditing, DivStore, ValDiv, ValDivBase, ValDivRoot, ValRow } from "../../store";
import { FA, getAtomValue, setAtomValue } from "tonwa-com";
import { useEditDivs } from "../divNew";
import { useRowEdit } from "../useRowEdit";
import { Page, useModal } from "tonwa-app";
import { ViewDivUndo } from "./ViewDivUndo";
import { ViewRow } from "./ViewRow";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";

// 编辑div任意层
export function PageEditDivRoot({ divStore, valDiv }: { divStore: DivStore; valDiv: ValDivBase; }) {
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
    const { atomValDivs, binDiv, atomDeleted } = valDiv;
    const { level, entityBin, subBinDiv: div } = binDiv;
    const { divLevels, pivot } = entityBin;
    const editDivs = useEditDivs();
    const divs = useAtomValue(atomValDivs);
    const rowEdit = useRowEdit();
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
            // let valDivNew = new ValDiv(valDiv, )
            let valDivNew = valDiv.createValDivSub(pendRow);
            let ret = await editDivs({
                divStore,
                pendRow,
                namedResults: {},
                valDiv: valDivNew,
                skipInputs: false,
            });
            if (ret !== true) return;
            if (isPivotKeyDuplicate(valDivNew) === true) {
                alert('Pivot key duplicate'); // 这个界面要改
                return;
            }
            valDiv.addValDiv(valDivNew, true);
            // setAtomValue(atomValDivs, [...divs, ret]);
            // valDiv.setValDivs([...divs, valDiv]);
        }
        viewDivs = <div className="ms-4 border-start">
            {
                divs.map(v => <EditDiv key={v.id} {...props} valDiv={v} />)
            }
            <div className={` ps-3 py-2 tonwa-bg-gray-${bg} ${borderTop} ${cdAddBottom} cursor-pointer text-primary`} onClick={onAddNew}>
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
    const btnDel: DivRightButton = { onClick: onDel, icon: 'trash-o', color: ' text-body-secondary ' }

    if (deleted === true) {
        return <ViewDivUndo divStore={divStore} valDiv={valDiv} />;
    }

    let tops: DivRightButton[], bottoms: DivRightButton[];
    if (level === divLevels) {
        async function onEdit() {
            const { atomValRow } = valDiv;
            const editing = new DivEditing(divStore, valDiv);
            let ret = await rowEdit(editing, valDiv);
            if (ret !== true) return;
            const { valRow: newValRow } = editing;
            if (isPivotKeyDuplicate(valDiv, newValRow) === true) {
                alert('Pivot key duplicate'); // 这个界面要改
                return;
            }
            await divStore.saveDetail(binDiv, newValRow);
            setAtomValue(atomValRow, newValRow);
        }
        tops = [{
            icon: 'pencil-square-o',
            color: 'text-primary',
            onClick: onEdit,
        }];
        bottoms = [btnDel];
    }
    else {
        bottoms = [{ ...btnDel, className: ' mb-2 ' }];
    }

    let viewDivRightButtons = <ViewDivRightButtons tops={tops} bottoms={bottoms} />;

    // 增加内容的时候，会用到pivot key duplicate
    function isPivotKeyDuplicate(valDiv: ValDivBase, valRow?: ValRow) {
        const { binDiv, parent } = valDiv;
        const { key } = binDiv;
        if (key === undefined) return false;
        const { id: keyId } = key;
        valRow = valRow ?? valDiv.valRow;
        const keyValue = valRow.buds[keyId];
        const { atomValDivs } = parent;
        const parentValDivs = getAtomValue(atomValDivs);
        for (let vd of parentValDivs) {
            if (vd === valDiv) continue;
            const { atomValRow } = vd;
            const vr = getAtomValue(atomValRow);
            if (keyValue === vr.buds[keyId]) return true;
        }
        return false;
    }

    return <div className={cnDivBottom}>
        <ViewRow {...props} buttons={viewDivRightButtons} hidePivot={true} />
        {viewDivs}
    </div>
}
