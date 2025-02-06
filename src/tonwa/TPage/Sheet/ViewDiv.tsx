import { useAtomValue } from "jotai";
// import { DivEditing, ValDivRoot } from "../../../../Store";
// import { editDivs, UseEditDivsProps } from "./divEdit";
import { ViewPendRow } from "./ViewPendRow";
import { ViewDivProps } from "./tool";
import { ViewRow } from "./ViewRow";
import { ViewDivUndo } from "./ViewDivUndo";
import { DivRightButton, ViewDivRightButtons } from "./ViewDivRightButtons";
import { TControlDetailEdit } from "./TControlDetailEdit";
// import { rowEdit } from "../divEdit";

export function ViewDiv(props: ViewDivProps) {
    const { control: control, valDiv, readonly } = props;
    const controlDetailEdit = control as TControlDetailEdit;
    const { binStore } = controlDetailEdit.controlSheet;
    const { binDiv, atomDeleted } = valDiv;
    const { entityBin, level } = binDiv;
    const divs = useAtomValue(valDiv.atomValDivs);
    const valRow = useAtomValue(valDiv.getAtomValRow());
    const deleted = useAtomValue(atomDeleted);
    if (entityBin.pivot === binDiv) {
        // pivot直接在末尾级stem显示value list
        return null;
    }
    if (deleted === true) return <ViewDivUndo control={control} valDiv={valDiv} />;

    const { pend, id } = valRow;
    const { sheetStore } = binStore;

    if (id < 0) return <ViewDivPendRow />;
    else return <ViewDivBinRow />;

    function ViewDivPendRow() {
        async function onDelSub() {
            await controlDetailEdit.onDelSub(valDiv, pend);
        }
        async function onEdit() {
            await controlDetailEdit.onPendEdit(valDiv, pend);
        }
        let buttons = divRightButtons(id, deleted, onDelSub, onEdit);
        let { tops, bottoms } = buttons;
        let viewDivRightButtons = <ViewDivRightButtons tops={tops} bottoms={bottoms} />;

        let pendRow = sheetStore.getPendRow(pend);
        return <div className="d-flex bg-white">
            <div className="d-flex flex-fill">
                <ViewPendRow binStore={binStore} pendRow={pendRow} />
            </div>
            {viewDivRightButtons}
        </div>;
    }

    function ViewDivBinRow() {
        async function onDelSub() {
            await controlDetailEdit.onDivDelSub();
        }
        async function onDivEdit() {
            await controlDetailEdit.onDivEdit(valDiv);
        }

        let buttons = divRightButtons(id, deleted, onDelSub, onDivEdit);
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

        let viewRow = <ViewRow {...props} buttons={viewDivRightButtons} />;
        if (divs.length === 0) {
            return viewRow;
        }
        return <>
            {viewRow}
            {divs.map(v => <ViewDiv key={v.id} {...props} valDiv={v} index={undefined} />)}
        </>;
    }
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
