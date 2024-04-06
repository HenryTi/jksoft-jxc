import { useAtomValue } from "jotai";
import { theme, FA, setAtomValue } from "tonwa-com";
import { useModal } from "tonwa-app";
import { BizBud } from "../../../../Biz";
import { ViewSpecBaseOnly, ViewSpecNoAtom } from "../../../View";
import { ViewBud, ViewBudUIType, budContent } from "../../../Bud";
import { RowColsSm } from "../../../tool";
import { BinEditing, DivEditing, DivStore, UseInputsProps, ValDiv } from "../../store";
import { useDivNew } from "../divNew";
import { BinOwnedBuds } from "../BinOwnedBuds";
import { useRowEdit } from "../useRowEdit";
import { PageEditDiv } from "./PageEditDiv";
import { ViewPendRow } from "../ViewPendRow";
import { ViewDivProps } from "./tool";
import { ViewRow } from "./ViewRow";

export function ViewDiv(props: ViewDivProps) {
    const modal = useModal();
    const { divStore, valDiv } = props;
    const { binDiv, atomDeleted, atomValRow, atomValDivs } = valDiv;
    const { entityBin } = binDiv;
    const divs = useAtomValue(atomValDivs);
    const valRow = useAtomValue(atomValRow);
    const deleted = useAtomValue(atomDeleted);
    const divInputs = useDivNew();
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
    }
    async function onEdit() {
        if (id < 0) {
            // 候选还没有输入行内容
            let pendRow = divStore.getPendRow(pend);
            const useInputsProps: UseInputsProps = {
                divStore,
                binDiv: divStore.binDiv,
                valDiv,
                pendRow,
                namedResults: {},
            }
            let retValDiv = await divInputs(useInputsProps, false);
            if (retValDiv === undefined) return;
            divStore.replaceValDiv(valDiv, retValDiv);
            return;
        }
        if (divs.length === 0) {
            // 无Div明细
            try {
                // let pendRow = await divStore.loadPendRow(pend);
                const editing = new DivEditing(divStore, undefined, binDiv, valDiv, valRow);
                let ret = await rowEdit(editing);
                if (ret !== true) return;
                /*
                let ret = await divInputs({
                    divStore,
                    pendRow,
                    namedResults: {},
                    binDiv,
                    valDiv,
                });
                */
                // if (ret === undefined) return;
                const { valRow: newValRow } = editing;
                await divStore.saveDetail(binDiv, newValRow);
                setAtomValue(atomValRow, newValRow);
                // setAtomValue(atomValDivs, [...divs, ret]);
                return;
            }
            catch (e) {
                console.error(e);
                alert('error');
            }
        }
        await modal.open(<PageEditDiv divStore={divStore} valDiv={valDiv} />);
    }
    async function onDelThoroughly() {
        await divStore.delValDiv(valDiv);
    }
    let cnBtnDiv = ' px-1 cursor-pointer text-primary ';
    let btnEdit: any, iconDel: string, colorDel: string, memoDel: any;
    if (deleted === true) {
        iconDel = 'undo';
        colorDel = 'text-secondary opacity-100 ';
        memoDel = '恢复';
    }
    else {
        iconDel = 'trash-o';
        colorDel = 'text-success';
        let iconEdit: string, colorEdit: string;
        if (divs.length === 0) {
            iconEdit = 'plus';
            colorEdit = ' text-primary ';
        }
        else {
            iconEdit = 'pencil-square-o';
            colorEdit = ' text-primary ';
        }
        btnEdit = <div className={cnBtnDiv + colorEdit} onClick={onEdit}>
            <FA name={iconEdit} fixWidth={true} size="lg" />
        </div>;
    }
    let btnDel = <>
        <div className={cnBtnDiv + colorDel} onClick={onDelSub}>
            <FA name={iconDel} fixWidth={true} />
            {memoDel && <span className="ms-1">{memoDel}</span>}
        </div>
    </>;

    if (deleted === true) {
        return <div className="d-flex">
            <div className="flex-fill text-body-tetiary opacity-50 text-decoration-line-through">
                <ViewRow {...props} />
            </div>
            <div className="w-min-6c text-end pt-2 me-2">
                {btnDel}
                <div className={cnBtnDiv + ' text-warning mt-2'} onClick={onDelThoroughly}>
                    <FA name="times" fixWidth={true} />
                    <span className="text-info ms-1">删除</span>
                </div>
            </div>
        </div>;
    }

    let buttons = <>{btnEdit}{btnDel}</>;
    if (id < 0) {
        let pendRow = divStore.getPendRow(pend);
        buttons = <>{buttons}<div className="me-n3" /></>;
        return <ViewPendRow divStore={divStore} pendRow={pendRow} viewButtons={buttons} />;
    }

    if (divs.length === 0) {
        return <ViewRow {...props} buttons={buttons} />;
    }
    return <>
        <ViewRow {...props} buttons={buttons} />
        {divs.map(v => <ViewDiv key={v.id} {...props} valDiv={v} />)}
    </>
}

