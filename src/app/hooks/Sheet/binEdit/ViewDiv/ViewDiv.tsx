import { useAtomValue } from "jotai";
import { FA, setAtomValue } from "tonwa-com";
import { useModal } from "tonwa-app";
import { DivEditing, ValDivRoot } from "../../store";
import { UseEditDivsProps, useEditDivs } from "../divNew";
import { useRowEdit } from "../useRowEdit";
import { PageEditDivRoot } from "./PageEditDivRoot";
import { ViewPendRow } from "../ViewPendRow";
import { ViewDivProps } from "./tool";
import { ViewRow } from "./ViewRow";
import { ViewDivUndo } from "./ViewDivUndo";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";

export function ViewDiv(props: ViewDivProps) {
    const modal = useModal();
    const { divStore, valDiv, readonly } = props;
    const { binDiv, atomDeleted, atomValRow, atomValDivs } = valDiv;
    const { entityBin, level } = binDiv;
    const divs = useAtomValue(atomValDivs);
    const valRow = useAtomValue(atomValRow);
    const deleted = useAtomValue(atomDeleted);
    const editDivs = useEditDivs();
    const rowEdit = useRowEdit();
    if (entityBin.pivot === binDiv) return null;
    const { pend, id } = valRow;

    async function onDelSub() {
        if (id < 0) {
            // 候选还没有输入行内容
            divStore.removePend(pend);
            return;
        }
        setAtomValue(atomDeleted, !deleted);
        divStore.sheetStore.notifyRowChange();
    }
    async function onEdit() {
        if (id < 0) {
            // 候选还没有输入行内容
            let pendRow = divStore.getPendRow(pend);
            let valDivClone = valDiv.clone() as ValDivRoot;
            let { valRow } = valDivClone;
            valDivClone.id = undefined;
            valRow.id = undefined;
            valRow.origin = pendRow.origin;
            valRow.pend = pendRow.pend;
            valRow.pendValue = pendRow.value;
            valDivClone.setValRow(valRow);
            const useInputsProps: UseEditDivsProps = {
                divStore,
                // binDiv: divStore.binDivRoot,
                valDiv: valDivClone,
                pendRow,
                namedResults: {},
                skipInputs: false,
            }
            let retHasValue = await editDivs(useInputsProps);
            if (retHasValue !== true) return;
            divStore.replaceValDiv(valDiv, valDivClone);
            return;
        }
        if (divs.length === 0) {
            // 无Div明细, 叶div
            try {
                const editing = new DivEditing(divStore, valDiv);
                let ret = await rowEdit(editing, valDiv);
                if (ret !== true) return;
                const { valRow: newValRow } = editing;
                await divStore.saveDetail(binDiv, newValRow);
                setAtomValue(atomValRow, newValRow);
                return;
            }
            catch (e) {
                console.error(e);
                alert('error');
            }
        }
        await modal.open(<PageEditDivRoot divStore={divStore} valDiv={valDiv} />);
    }

    if (deleted === true) {
        return <ViewDivUndo divStore={divStore} valDiv={valDiv} />;
    }

    let buttons = divRightButtons(id, deleted, onDelSub, onEdit);
    let viewDivRightButtons: any;
    if (readonly !== true && level === 0) {
        let { tops, bottoms } = buttons;
        viewDivRightButtons = <ViewDivRightButtons tops={tops} bottoms={bottoms} />;
    }
    else {
        viewDivRightButtons = <ViewDivRightButtons tops={undefined} bottoms={undefined} />;
    }

    if (id < 0) {
        let pendRow = divStore.getPendRow(pend);
        return <div className="d-flex bg-white">
            <div className="d-flex flex-fill">
                <ViewPendRow divStore={divStore} pendRow={pendRow} />
            </div>
            {viewDivRightButtons}
        </div>;
        /*
        <div className="d-flex w-min-4c mt-2 align-items-start">
            {buttons}<div className="me-n3" />
        </div>
        */
    }

    let viewRow = <ViewRow {...props} buttons={viewDivRightButtons} />;
    if (divs.length === 0) {
        return viewRow;
    }
    return <>
        {viewRow}
        {divs.map(v => <ViewDiv key={v.id} {...props} valDiv={v} />)}
    </>;
}

function divRightButtons(id: number, deleted: boolean, onDel: () => void, onEdit: () => void)
    : { tops: DivRightButton[]; bottoms: DivRightButton[]; } {
    let tops: DivRightButton[], bottoms: DivRightButton[];
    // let cnBtnDiv = ' px-1 cursor-pointer text-primary ';
    let btnEdit: DivRightButton, iconDel: string, colorDel: string, memoDel: any;
    if (deleted === true) {
        iconDel = 'undo';
        colorDel = 'text-secondary ';
        memoDel = '恢复';
    }
    else {
        iconDel = 'trash-o';
        colorDel = 'text-secondary';
        let iconEdit: string, colorEdit: string;
        if (id < 0) {
            iconEdit = 'plus';
            colorEdit = ' text-danger ';
        }
        else {
            iconEdit = 'pencil-square-o';
            colorEdit = ' text-success ';
        }
        /*
        btnEdit = <div className={cnBtnDiv + colorEdit} onClick={onEdit}>
            <FA name={iconEdit} fixWidth={true} size="lg" />
        </div>;
        */
        tops = [{
            icon: iconEdit,
            color: colorEdit,
            onClick: onEdit,
        }];
    }
    let btnDel: DivRightButton = {
        icon: iconDel,
        color: colorDel,
        onClick: onDel,
        label: memoDel,
    };
    bottoms = [btnDel];
    /*<>
        <div className={cnBtnDiv + colorDel} onClick={onDel}>
            <FA name={iconDel} fixWidth={true} />
            {memoDel && <span className="ms-1">{memoDel}</span>}
        </div>
    </>;
    */
    // return <>{btnEdit}{btnDel}</>;
    return { tops, bottoms };
}

/*
function twoButtons(id: number, deleted: boolean, onDel: () => void, onEdit: () => void) {
    let cnBtnDiv = ' px-1 cursor-pointer text-primary ';
    let btnEdit: any, iconDel: string, colorDel: string, memoDel: any;
    if (deleted === true) {
        iconDel = 'undo';
        colorDel = 'text-secondary ';
        memoDel = '恢复';
    }
    else {
        iconDel = 'trash-o';
        colorDel = 'text-secondary';
        let iconEdit: string, colorEdit: string;
        if (id < 0) {
            iconEdit = 'plus';
            colorEdit = ' text-danger ';
        }
        else {
            iconEdit = 'pencil-square-o';
            colorEdit = ' text-success ';
        }
        btnEdit = <div className={cnBtnDiv + colorEdit} onClick={onEdit}>
            <FA name={iconEdit} fixWidth={true} size="lg" />
        </div>;
    }
    let btnDel = <>
        <div className={cnBtnDiv + colorDel} onClick={onDel}>
            <FA name={iconDel} fixWidth={true} />
            {memoDel && <span className="ms-1">{memoDel}</span>}
        </div>
    </>;
    return <>{btnEdit}{btnDel}</>;
}
*/
