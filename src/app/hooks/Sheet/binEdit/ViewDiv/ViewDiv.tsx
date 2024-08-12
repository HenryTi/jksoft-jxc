import { useAtomValue } from "jotai";
import { setAtomValue } from "tonwa-com";
import { useModal } from "tonwa-app";
import { DivEditing, ValDivRoot } from "../../store";
import { editDivs, UseEditDivsProps } from "../divEdit";
import { PageEditDivRoot } from "./PageEditDivRoot";
import { ViewPendRow } from "../ViewPendRow";
import { ViewDivProps } from "./tool";
import { ViewRow } from "./ViewRow";
import { ViewDivUndo } from "./ViewDivUndo";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";
import { rowEdit } from "../divEdit";

export function ViewDiv(props: ViewDivProps) {
    const modal = useModal();
    const { divStore, valDiv, readonly } = props;
    const { binDiv, atomDeleted } = valDiv;
    const { entityBin, level } = binDiv;
    const divs = useAtomValue(valDiv.getAtomValDivs());
    const valRow = useAtomValue(valDiv.getAtomValRow());
    const deleted = useAtomValue(atomDeleted);
    if (entityBin.pivot === binDiv) {
        // pivot直接在末尾级stem显示value list
        return null;
    }
    const { pend, id } = valRow;
    const { sheetStore } = divStore;

    async function onDelSub() {
        if (id < 0) {
            // 候选还没有输入行内容
            divStore.removePend(pend);
            return;
        }
        setAtomValue(atomDeleted, !deleted);
        sheetStore.notifyRowChange();
    }
    async function onEdit() {
        if (id < 0) {
            // 候选还没有输入行内容
            let pendRow = sheetStore.getPendRow(pend);
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
                valDiv: valDivClone,
                pendRow,
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
                let ret = await rowEdit(modal, editing, valDiv);
                if (ret !== true) return;
                const { values: newValRow } = editing;
                await divStore.saveDetail(binDiv, newValRow);
                // setAtomValue(atomValRow, newValRow);
                valDiv.setValRow(newValRow);
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
    if (readonly !== true) {
        if (level === 0) {
            let { tops, bottoms } = buttons;
            viewDivRightButtons = <ViewDivRightButtons tops={tops} bottoms={bottoms} />;
        }
        else {
            viewDivRightButtons = <ViewDivRightButtons tops={undefined} bottoms={undefined} />;
        }
    }

    if (id < 0) {
        let pendRow = sheetStore.getPendRow(pend);
        return <div className="d-flex bg-white">
            <div className="d-flex flex-fill">
                <ViewPendRow divStore={divStore} pendRow={pendRow} />
            </div>
            {viewDivRightButtons}
        </div>;
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
    let iconDel: string, colorDel: string, memoDel: any;
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
    return { tops, bottoms };
}
