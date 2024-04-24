import { useAtomValue } from "jotai";
import { FA, setAtomValue } from "tonwa-com";
import { useModal } from "tonwa-app";
import { DivEditing, UseInputDivsProps, ValDivRoot } from "../../store";
import { useInputDivs } from "../divNew";
import { useRowEdit } from "../useRowEdit";
import { PageEditDiv } from "./PageEditDiv";
import { ViewPendRow } from "../ViewPendRow";
import { ViewDivProps } from "./tool";
import { ViewRow } from "./ViewRow";
import { ViewDivUndo } from "./ViewDivUndo";

export function ViewDiv(props: ViewDivProps) {
    const modal = useModal();
    const { divStore, valDiv, readonly } = props;
    const { binDiv, atomDeleted, atomValRow, atomValDivs } = valDiv;
    const { entityBin, level } = binDiv;
    const divs = useAtomValue(atomValDivs);
    const valRow = useAtomValue(atomValRow);
    const deleted = useAtomValue(atomDeleted);
    const inputDivs = useInputDivs();
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
            const useInputsProps: UseInputDivsProps = {
                divStore,
                binDiv: divStore.binDivRoot,
                valDiv: valDiv,
                pendRow,
                namedResults: {},
                skipInputs: false,
            }
            let retValDiv = await inputDivs(useInputsProps);
            if (retValDiv === undefined) return;
            if (retValDiv.parent !== undefined) {
                // retValDiv must be root
                debugger;
            }
            divStore.replaceValDiv(valDiv, retValDiv as ValDivRoot);
            return;
        }
        if (divs.length === 0) {
            // 无Div明细
            try {
                const editing = new DivEditing(divStore, undefined, binDiv, valDiv, valRow);
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
        await modal.open(<PageEditDiv divStore={divStore} valDiv={valDiv} />);
    }

    if (deleted === true) {
        return <ViewDivUndo divStore={divStore} valDiv={valDiv} />;
    }

    let buttons: any;
    if (readonly !== true && level === 0) {
        buttons = twoButtons(id, deleted, onDelSub, onEdit);
    }
    if (id < 0) {
        let pendRow = divStore.getPendRow(pend);
        return <div className="d-flex bg-white">
            <div className="d-flex flex-fill">
                <ViewPendRow divStore={divStore} pendRow={pendRow} />
            </div>
            <div className="d-flex w-min-4c mt-2 align-items-start">
                {buttons}<div className="me-n3" />
            </div>
        </div>;
    }

    if (divs.length === 0) {
        return <ViewRow {...props} buttons={buttons} />;
    }
    return <>
        <ViewRow {...props} buttons={buttons} />
        {divs.map(v => <ViewDiv key={v.id} {...props} valDiv={v} />)}
    </>;
}

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

