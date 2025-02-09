import { atom } from "jotai";
import { PendProxyHandler, ValRow } from "../../Store/ValRow";
import { BinInputAtom, BinInputFork, BinPick, BinRow, BizPhraseType, EntityBin } from "../../Biz";
import { ControlEntity } from "..";
import { PendRow, PickResult, RearPickResultType, ReturnUseBinPicks } from "../../Store";
import { BinBudsEditing, BinEditing, DivEditing, FormBudsStore } from "../ControlBuds/BinEditing";
import { ControlSheetEdit } from "./ControlSheetEdit";
import { ControlSheet } from "./ControlSheet";
// import { PageEditDivRoot } from "./PageEditDivRoot";
import { getAtomValue, setAtomValue } from "../../tools";
import { ValDivBase, ValDivRoot } from "../../Store/ValDiv";
import { ControlBinPicks } from "../ControlBuds";
import { JSX } from "react";
import { inputFork } from "./inputFork";
import { inputAtom } from "./inputAtom";

export abstract class ControlDetail<C extends ControlSheet = any> extends ControlEntity<EntityBin> {
    readonly controlSheet: C;
    constructor(controlSheet: C, entityBin: EntityBin) {
        super(controlSheet.controlBiz, entityBin);
        this.controlSheet = controlSheet;
    }
}

export abstract class ControlDetailEdit extends ControlDetail<ControlSheetEdit> {
    // readonly atomError = atom<any>(undefined);

    onAddRow = async () => {
        await this.detailNewLoop();
    }

    abstract createControlPinPicks(entityBin: EntityBin, initBinRow?: BinRow): ControlBinPicks;

    private async detailNewLoop(/*sheetStore*/): Promise<void> {
        // const { modal, binStore } = sheetStore;
        for (; ;) {
            let ret = await this.detailNew(/*sheetStore*/);
            if (ret !== 1) break;
            /*
            const binEditing = new BinEditing(sheetStore, binStore.entity);
            binEditing.addNamedParams(ret.editing.valueSpace);
            let retEdit = await rowEdit(modal, binEditing, undefined);
            if (retEdit !== true) break;
            */
            // if (await modal.open(<PageConfirm header="输入明细" auth={false} message="继续输入明细吗？" yes="继续" no="不继续" />) !== true) {
            //    break;
            //}
        }
    }

    async detailNew(): Promise<number> {
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
                    let ret = await this.editRow(binEditing, undefined);
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
            let ret = await this.editRow(binEditing, undefined);
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
        this.controlSheet.notifyRowChange();
        return valRows.length;
    }

    private async editRow(binEditing: BinEditing, valDiv: ValDivBase) {
        const { entityBin } = binEditing;
        const { i: budI, x: budX } = entityBin;
        const { atomParams } = budI;
        if (atomParams !== undefined) {
            const { caption } = budI;
            await this.openModal(this.PageInputRow(binEditing, valDiv));
        }

        let ret = await this.openModal(this.PageInputRow(binEditing, valDiv));
        return ret;
    }

    protected abstract PageInputRow(binEditing: BinEditing, valDiv: ValDivBase): JSX.Element;

    async editDivs(valDiv: ValDivBase, pendRow: PendRow) {
        // let { binStore, pendRow, valDiv } = props;
        const { binStore } = this.controlSheet;
        let { entity: entityBin, sheetStore } = binStore;
        let { rearPick, pend: entityPend } = entityBin;
        let pendResult = new Proxy(pendRow, new PendProxyHandler(entityPend));
        let valRows: ValRow[] = [];
        for (; ;) {
            let divEditing = new DivEditing(binStore, valDiv);
            if (rearPick !== undefined) {
                divEditing.setNamedValues(rearPick.name, pendResult);
            }
            divEditing.setPendResult(pendResult);
            divEditing.calcAll();
            let valRow = await this.runInputDiv(divEditing, pendRow);
            if (valRow === undefined) {
                // 删去已经输入的行
                binStore.deleteValRows(valRows);
                return;
            }
            valRows.push(valRow);
            let { binDiv } = valDiv;
            // 无下级，退出
            if (binDiv.subBinDiv === undefined) {
                // 仅仅表示有值
                // return true;
                break;
            }
            let valDivNew = valDiv.createValDivSub(pendRow);
            valDiv.addValDiv(valDivNew, true);
            valDiv = valDivNew;
        }
        this.controlSheet.notifyRowChange();
        return true;
    }

    private async runInputDiv(divEditing: DivEditing, pendRow: PendRow) {
        const { binStore } = this.controlSheet;
        const { modal } = binStore;
        const { valDiv } = divEditing;
        let { binDiv, valRow } = valDiv;
        let retInputs = await this.runInputs(/*props, */divEditing, pendRow);
        if (retInputs === false) return;

        valDiv.mergeValRow(divEditing.values);
        // if (skipInputs !== true) {
        if (divEditing.isInputNeeded() === true) {
            //if (await modal.open(<ModalInputRow binEditing={divEditing} valDiv={valDiv} />) !== true) {
            if (await modal.open(this.PageInputRow(divEditing, valDiv)) !== true) {
                return;
            }
            valDiv.mergeValRow(divEditing.values);
        }
        // }
        valRow = valDiv.valRow;
        await binStore.saveDetails(binDiv, [valRow]);
        valDiv.setValRow(valRow);
        valDiv.setIXBaseFromInput(divEditing);
        return valRow;
    }

    private async runInputs(editing: DivEditing, pendRow: PendRow) {
        const { valDiv } = editing;
        const { binDiv } = valDiv;
        const { inputs } = binDiv;
        if (inputs === undefined) {
            return;
        }
        // let { skipInputs } = props;
        // if (skipInputs == true) {
        //     return;
        // }
        for (let input of inputs) {
            const { bizPhraseType } = input;
            let retInput: any = undefined;
            switch (bizPhraseType) {
                default:
                case BizPhraseType.fork:
                    retInput = await inputFork({
                        pendRow,
                        editing,
                        binInput: input as BinInputFork,
                    });
                    break;
                case BizPhraseType.atom:
                    retInput = await inputAtom({
                        pendRow,
                        editing,
                        binInput: input as BinInputAtom,
                    });
                    break;
            }
            if (retInput === undefined) {
                return false;
            }
            editing.setNamedValue(input.name, retInput);
        }
        editing.calcAll();
        return true;
    }

    async runBinPicks() {
        const { storeSheet } = this.controlSheet;
        const { binPicks } = this.entity;
        const controlBinPicks = this.createControlPinPicks(this.entity);
        let ret = await controlBinPicks.pick();
        return ret;
    }

    async runBinPicks1() {
        const { controlSheet, entity: entityBin } = this;
        const { storeSheet } = controlSheet;
        const { binPicks, rearPick } = entityBin;
        if (binPicks === undefined) return;
        let editing = new FormBudsStore(this.modal, new BinBudsEditing(storeSheet, entityBin, []));
        let rearPickResultType: RearPickResultType = RearPickResultType.array;
        for (const binPick of binPicks) {
            await this.doBinPick(editing, binPick);
        }

        let ret: ReturnUseBinPicks = {
            editing,
            rearBinPick: rearPick,           // endmost pick
            rearResult: undefined,
            rearPickResultType,
        };

        const { binStore } = storeSheet;
        let rearPickResult = await editing.runBinPickRear(binStore, rearPick, rearPickResultType);
        if (rearPickResult === undefined) return undefined;

        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];

        ret.rearResult = rearResult;
        return ret;
    }

    private async doBinPick(editing: FormBudsStore, binPick: BinPick) {

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
        /*
        const useInputsProps: UseEditDivsProps = {
            binStore: binStore,
            valDiv: valDivClone,
            pendRow,
            skipInputs: false,
        }
        */
        let retHasValue = await this.editDivs(valDivClone, pendRow);
        if (retHasValue !== true) return;
        binStore.replaceValDiv(valDiv, valDivClone);
    }

    async onDivDelSub() {
        const { storeSheet, binStore } = this.controlSheet;
        // setAtomValue(atomDeleted, !deleted);
        this.controlSheet.notifyRowChange();
    }

    async onDivEdit(valDiv: ValDivBase) {
        const { storeSheet, binStore } = this.controlSheet;
        const { binDiv } = valDiv;
        const divs = getAtomValue(valDiv.atomValDivs);
        if (divs.length === 0) {
            // 无Div明细, 叶div
            try {
                const editing = new DivEditing(binStore, valDiv);
                let ret = await this.editRow(editing, valDiv);
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

    protected abstract PageEditDivRoot(valDiv: ValDivBase): JSX.Element;

    async onLeafEdit(valDiv: ValDivBase) {
        const { binStore } = this.controlSheet;
        const { binDiv } = valDiv;
        const editing = new DivEditing(binStore, valDiv);
        let ret = await this.editRow(editing, valDiv);
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
        let ret = await this.editDivs(valDivNew, pendRow);
        if (ret !== true) return;
        if (valDivNew.isPivotKeyDuplicate() === true) {
            alert('Pivot key duplicate'); // 这个界面要改
            return;
        }
        valDiv.addValDiv(valDivNew, true);
    }
}
