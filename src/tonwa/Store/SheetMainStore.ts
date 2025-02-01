import { atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { EntityBin } from "../Biz";
import { StoreEntity } from "../Store";
import { Formulas } from "../Calc";
import { RearPickResultType, ReturnUseBinPicks } from "./PickResult";
import { ValRow } from "./ValRow";
// import { runBinPicks } from "../hooks/Sheet/binPick";
import { StoreSheet } from "./StoreSheet";

export class SheetMainStore extends StoreEntity<EntityBin> {
    readonly sheetStore: StoreSheet;
    // budsEditing: BinBudsEditing;
    // budEditings: BudEditing[];

    readonly _valRow = atom<ValRow>({ buds: {} } as ValRow);
    get valRow() { return getAtomValue(this._valRow) }
    no: string;

    constructor(sheetStore: StoreSheet) {
        const { main } = sheetStore.entity;
        super(sheetStore.modal, main);
        this.sheetStore = sheetStore;
    }

    init() {
        // this.budsEditing = new BinEditing(this.sheetStore, this.entity);
        // this.budEditings = this.budsEditing.createBudEditings();
    }

    async start() {
        const row = this.valRow;
        const { id } = row;
        if (id > 0) return;
        alert('runBinPicks');
        /*
        const pickResults = await runBinPicks(this.modal, this.sheetStore, this.entity, RearPickResultType.scalar);
        let ret = await this.startFromPickResults(pickResults);
        setAtomValue(this.sheetStore.atomLoaded, true);
        return ret;
        */
    }

    async startFromPickResults(pickResults: ReturnUseBinPicks) {
        if (pickResults === undefined) return;
        const row = this.valRow;
        const { i, x, buds: mainProps } = this.entity;
        const formulas: Formulas = [];
        function getFormulaText(text: string) {
            if (text === undefined) return;
            let parts = text.split('\n');
            return parts[0];
        }
        if (i !== undefined) {
            formulas.push(['i', getFormulaText(i.valueSet ?? 'i$pick'), undefined]);
        }
        if (x !== undefined) {
            formulas.push(['x', getFormulaText(x.valueSet ?? 'x$pick'), undefined]);
        }
        for (let mp of mainProps) {
            const { name, valueSet } = mp;
            if (valueSet === undefined) continue;
            formulas.push([name, getFormulaText(valueSet), undefined]);
        }
        let { editing, rearBinPick, rearResult } = pickResults;
        const { budsEditing } = editing;
        budsEditing.addFormulas(formulas);
        if (rearBinPick !== undefined) {
            if (rearResult !== undefined) {
                editing.setNamedValues(rearBinPick.name, rearResult[0]);
            }
        }
        if (i !== undefined) {
            row.i = editing.getValue('i') as number;
        }
        if (x !== undefined) {
            row.x = editing.getValue('x') as number;
        }
        for (let mp of mainProps) {
            let v = budsEditing.getValueNumber(mp.name);
            if (Number.isNaN(v) === true) {
                debugger;
                budsEditing.getValueNumber(mp.name);
            }
            row.buds[mp.id] = v;
        }
        setAtomValue(this._valRow, row);
        return await this.createIfNotExists();
    }

    private async createIfNotExists() {
        const row = this.valRow;
        let { id: sheetId, i, x } = row;
        if (sheetId > 0) {
            return {
                id: sheetId,
                no: this.no,
                i,
                x,
            };
        }
        let ret = await this.sheetStore.saveSheet(this.valRow);
        let { id, no } = ret;
        row.id = id;
        setAtomValue(this._valRow, { ...row });
        this.no = no;
        return Object.assign(ret, { i, ...row });
    }

    setValue(value: any) {
        const { no } = value;
        this.no = no;
        setAtomValue(this._valRow, value);
    }

    setId(id: number) {
        let row = this.valRow;
        setAtomValue(this._valRow, { ...row, id });
    }
    /*
        trigger() {
            let ok = true;
            const { buds } = this.valRow;
            for (let be of this.budEditings) {
                if (be.trigger(buds[be.bizBud.id]) === false) ok = false;
            }
            return ok;
        }
    */
}

