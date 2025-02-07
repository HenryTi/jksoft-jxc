import { BinRow, EntityBin } from "../../Biz";
import { ControlDetailEdit } from "../../Control";
import { BinEditing } from "../../Control/ControlBuds/BinEditing";
import { PageEditDivRoot } from "./PageEditDivRoot";
import { ValDivBase } from "../../Store/ValDiv";
import { JSX } from "react";
import { PageInputRow } from "./PageInputRow";
import { TControlBinPicks } from "./TControlBinPicks";

/*
export class ControlDetail<C extends ControlSheet = any> extends ControlEntity<EntityBin> {
    readonly controlSheet: C;
    constructor(controlSheet: C, entityBin: EntityBin) {
        super(controlSheet.controlBiz, entityBin);
        this.controlSheet = controlSheet;
    }
}
*/
export class TControlDetailEdit extends ControlDetailEdit {
    protected override PageEditDivRoot(valDiv: ValDivBase): JSX.Element {
        return <PageEditDivRoot control={this} valDiv={valDiv} />;
    }
    /*
    readonly atomError = atom<any>(undefined);

    onAddRow = async () => {
        await this.detailNewLoop();
    }
    */
    override createControlPinPicks(entityBin: EntityBin, initBinRow?: BinRow) {
        return new TControlBinPicks(this.controlBiz, this.controlSheet.storeSheet, entityBin, initBinRow);
    }

    protected override PageInputRow(binEditing: BinEditing, valDiv: ValDivBase): JSX.Element {
        return <PageInputRow binEditing={binEditing} valDiv={valDiv} />;
    }

    /*
    private async detailNewLoop(): Promise<void> {
        // const { modal, binStore } = sheetStore;
        for (; ;) {
            let ret = await this.detailNew();
            if (ret !== 1) break;
        }
    }

    private async detailNew(): Promise<number> {
        const { storeSheet } = this.controlSheet;
        const { modal, binStore } = storeSheet;
        if (binStore === undefined) {
            alert('Pick Pend on main not implemented');
            return 0;
        }
        const { entity: entityBin, binDivRoot } = binStore;
        //let ret = await runBinPicks(modal, storeSheet, entityBin);
        let ret = await this.runBinPicks();
        if (ret === undefined) return 0;
        let { editing, rearBinPick, rearResult, rearPickResultType } = ret;
        if (rearBinPick.fromPhraseType === BizPhraseType.pend) {
            // 中断输入循环
            return 2;
        }
        const { valueSpace } = editing.budsEditing;
        const valRows: ValRow[] = [];
        binStore.setWaiting(true);
        if (rearPickResultType === RearPickResultType.array) {
            // 直接选入行集，待修改
            for (let rowProps of rearResult as PickResult[]) {
                let binEditing = new BinEditing(storeSheet, entityBin);
                const pickName = rearBinPick.name;
                switch (pickName) {
                    default:
                        valueSpace.setValue(pickName, rowProps);
                        binEditing.addNamedParams(valueSpace);
                        break;
                    case 'i$pick':
                        binEditing.setNamedValue('i', (rowProps as any).id, undefined);
                        break;
                    case 'x$pick':
                        binEditing.setNamedValue('x', (rowProps as any).id, undefined);
                        break;
                }
                if (rearResult.length === 1) {
                    // let ret = await rowEdit(modal, binEditing, undefined);
                    let ret = await this.editRow(undefined);
                }

                let { values: valRow } = binEditing;
                if (valRow.value === undefined) {
                    const defaultValue = 1;
                    binEditing.setNamedValue('value', defaultValue, undefined);
                }
                const { origin, pend, pendValue } = rowProps;
                valRow.origin = origin as number;
                valRow.pend = pend as number;
                valRow.pendValue = pendValue as number;
                if (valRow.id !== undefined) debugger;
                if (binStore.hasPickBound(valRow) === false) {
                    valRows.push(valRow);
                }
            }
        }
        else {
            // 直接跳出输入界面，开始编辑
            const binEditing = new BinEditing(storeSheet, entityBin);
            binEditing.addNamedParams(valueSpace);
            // let ret = await rowEdit(modal, binEditing, undefined);
            let ret = await this.editRow(undefined);
            if (ret === true) {
                const { values: valRow } = binEditing;
                if (valRow.id !== undefined) debugger;
                valRows.push(valRow);
            }
        }

        if (valRows.length > 0) {
            await binStore.saveDetails(binDivRoot, valRows);
            binStore.setValRowArrayToRoot(valRows);
        }

        binStore.setWaiting(false);
        storeSheet.notifyRowChange();
        return valRows.length;
    }

    private async editRow(valDiv: ValDivBase) {
        return false;
    }

    async editDivs(valDiv: ValDivBase) {
        return true;
    }

    async runBinPicks() {
        return undefined as any;
    }

    async onDelSub(valDiv: ValDivBase, pend: number) {
        // 候选还没有输入行内容
        this.controlSheet.binStore.removePend(pend);
    }

    async onPendEdit(valDiv: ValDivBase, pend: number) {
        // 候选还没有输入行内容
        const { storeSheet, binStore } = this.controlSheet;
        let pendRow = storeSheet.getPendRow(pend);
        let valDivClone = valDiv.clone() as ValDivRoot;
        let { valRow } = valDivClone;
        valDivClone.id = undefined;
        valRow.id = undefined;
        valRow.origin = pendRow.origin;
        valRow.pend = pendRow.pend;
        valRow.pendValue = pendRow.value;
        valDivClone.setValRow(valRow);
        let retHasValue = await this.editDivs(valDivClone);
        if (retHasValue !== true) return;
        binStore.replaceValDiv(valDiv, valDivClone);
    }

    async onDivDelSub() {
        const { storeSheet, binStore } = this.controlSheet;
        // setAtomValue(atomDeleted, !deleted);
        storeSheet.notifyRowChange();
    }

    async onDivEdit(valDiv: ValDivBase) {
        const { storeSheet, binStore } = this.controlSheet;
        const { binDiv } = valDiv;
        const divs = getAtomValue(valDiv.atomValDivs);
        if (divs.length === 0) {
            // 无Div明细, 叶div
            try {
                const editing = new DivEditing(binStore, valDiv);
                let ret = await this.editRow(valDiv);
                if (ret !== true) return;
                const { values: newValRow } = editing;
                await binStore.saveDetails(binDiv, [newValRow]);
                valDiv.setValRow(newValRow);
                return;
            }
            catch (e) {
                console.error(e);
                alert('error');
            }
        }
        await this.openModal(this.PageEditDivRoot(valDiv));
    }

    protected PageEditDivRoot(valDiv: ValDivBase) {
        return <PageEditDivRoot control={this} valDiv={valDiv} />;
    }

    async onLeafEdit(valDiv: ValDivBase) {
        const { binStore } = this.controlSheet;
        const { binDiv } = valDiv;
        const editing = new DivEditing(binStore, valDiv);
        let ret = await this.editRow(valDiv);
        if (ret !== true) return;
        const { values: newValRow } = editing;
        if (valDiv.isPivotKeyDuplicate(newValRow) === true) {
            alert('Pivot key duplicate'); // 这个界面要改
            return;
        }
        await this.controlSheet.binStore.saveDetails(binDiv, [newValRow]);
        valDiv.setValRow(newValRow);
    }

    onAddNew = async (valDiv: ValDivBase) => {
        const { binStore } = this.controlSheet;
        const { valRow } = valDiv;
        let pendRow = await binStore.loadPendRow(valRow.pend);
        let valDivNew = valDiv.createValDivSub(pendRow);
        let ret = await this.editDivs(valDivNew);
        if (ret !== true) return;
        if (valDivNew.isPivotKeyDuplicate() === true) {
            alert('Pivot key duplicate'); // 这个界面要改
            return;
        }
        valDiv.addValDiv(valDivNew, true);
    }
    */
}
