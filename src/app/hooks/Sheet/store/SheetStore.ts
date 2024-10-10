import { WritableAtom, atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { EntitySheet, EntityBin, EntityPend, BinRow, Entity } from "app/Biz";
import { ReturnGetPendRetSheet } from "uqs/UqDefault";
import { RearPickResultType, ReturnUseBinPicks } from "./PickResult";
import { Formulas } from "app/hooks/Calc";
import { BudEditing } from "../../Bud";
import { getValRowPropArr, ValRow } from "./tool";
import { BinStore, SubmitState } from "./BinStore";
import { ValDivRoot } from "./ValDiv";
import { Modal } from "tonwa-app";
import { Console, EntityStore } from "app/tool";
import { arrFromJsonMid } from "app/hooks/tool";
import { BinEditing } from "./BinEditing";
import { runBinPicks } from "../binPick";
import { BudsEditing } from "app/hooks/BudsEditing";

export class SheetMainStore extends EntityStore<EntityBin> {
    readonly sheetStore: SheetStore;
    budsEditing: BudsEditing;
    budEditings: BudEditing[];

    readonly _valRow = atom<ValRow>({ buds: {} } as ValRow);
    get valRow() { return getAtomValue(this._valRow) }
    no: string;

    constructor(sheetStore: SheetStore) {
        const { main } = sheetStore.entity;
        super(sheetStore.modal, main);
        this.sheetStore = sheetStore;
    }

    init() {
        this.budsEditing = new BinEditing(this.sheetStore, this.entity);
        this.budEditings = this.budsEditing.createBudEditings();
    }

    async start() {
        const row = this.valRow;
        const { id } = row;
        if (id > 0) return;
        const pickResults = await runBinPicks(this.sheetStore, this.entity, RearPickResultType.scalar);
        let ret = await this.startFromPickResults(pickResults);
        setAtomValue(this.sheetStore.atomLoaded, true);
        return ret;
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
        editing.addFormulas(formulas);
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
            let v = editing.getValueNumber(mp.name);
            if (Number.isNaN(v) === true) {
                debugger;
                editing.getValueNumber(mp.name);
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

    trigger() {
        let ok = true;
        const { buds } = this.valRow;
        for (let be of this.budEditings) {
            if (be.trigger(buds[be.bizBud.id]) === false) ok = false;
        }
        return ok;
    }
}

export interface SheetRow extends ValRow {
    no: string;
}

export interface PendRow {
    pend: number;               // pend id
    origin: number;
    bin: number;
    sheet: number;
    detail: BinRow;
    value: number;
    mid: any[];
}

class Detail extends BinStore {
    readonly caption: string;
    constructor(sheetStore: SheetStore, entityBin: EntityBin, caption: string) {
        super(sheetStore, entityBin);
        this.caption = caption ?? entityBin.caption;
    }
}

// 多余的Detail，只能手工输入
export class ExDetail extends Detail {
}

export class SheetStore extends EntityStore<EntitySheet> {
    private readonly cachePendRows: { [id: number]: PendRow } = {};
    readonly sheetConsole: SheetConsole;
    readonly mainStore: SheetMainStore;
    readonly caption: string;
    readonly backIcon = 'file-text-o';
    readonly isPend: boolean;
    readonly isMainPend: boolean;
    readonly valDivsOnPend: { [pend: number]: WritableAtom<ValDivRoot, any, any> } = {};
    readonly binStore: BinStore;
    readonly atomLoaded = atom(false);
    readonly atomReaction = atom(undefined as any);
    readonly atomSubmitState: WritableAtom<SubmitState, any, any>;
    readonly atomError = atom(undefined as { [id: number]: { pend: number; overValue: number; } | { bin: number; message: string; } });
    readonly atomSum = atom(get => {
        return this.binStore.sum(get);
    });
    constructor(entitySheet: EntitySheet, sheetConsole: SheetConsole) {
        super(sheetConsole.modal, entitySheet);
        this.sheetConsole = sheetConsole;
        this.mainStore = new SheetMainStore(this);
        const { main, details } = this.entity;
        if (main.pend !== undefined) {
            this.isMainPend = true;
        }
        let detail = details[0];
        let len = details.length;
        if (len > 0) {
            const { bin } = details[0];
            this.isPend = bin.pend !== undefined;
        }
        this.caption = entitySheet.caption;
        if (detail !== undefined) {
            this.binStore = new BinStore(this, detail.bin);
        }
        this.atomSubmitState = atom((get) => {
            if (this.binStore === undefined) return SubmitState.enable;
            return get(this.binStore.atomSubmitState);
        }, null);
    }

    async load(sheetId: number) {
        let { main, details } = await this.loadBinData(sheetId);
        if (main === undefined) return;
        this.mainStore.setValue(main);
        if (this.binStore !== undefined) {
            this.binStore.load(details, false);
        }
        setAtomValue(this.atomLoaded, true);
    }

    async reloadBinProps(binId: number) {
        if (this.budsColl[binId] !== undefined) return;
        await this.loadBinData(binId);
    }

    get mainId() {
        return this.mainStore.valRow?.id;
    }

    // whole sheet or row detail
    async loadBinData(binId: number) {
        let { main, details, props, atoms: bizAtoms, specs } = await this.uq.GetSheet.query({ id: binId });
        this.cacheIdAndBuds(props, bizAtoms, specs);
        let mainRow = main[0];
        if (mainRow !== undefined) {
            (mainRow as any).buds = this.budsColl[binId] ?? {};
        }
        for (let row of details) {
            const { id } = row;
            (row as any).buds = this.budsColl[id] ?? {};
        }
        return { main: mainRow, details };
    }

    async loadPend(params: any, pendId: number) {
        let { pend: entityPend, rearPick } = this.entity.coreDetail;
        if (entityPend === undefined) debugger;
        let ret = await this.uqGetPend(entityPend, params, pendId);
        let { $page, retSheet, props: showBuds, atoms, specs } = ret;
        this.cacheIdAndBuds(showBuds, atoms, specs);
        let collSheet: { [id: number]: ReturnGetPendRetSheet } = {};
        for (let v of retSheet) {
            collSheet[v.id] = v;
        };
        let pendRows: PendRow[] = [];
        let { i: iBud, x: xBud } = entityPend;
        let hiddenBuds: Set<number> = (rearPick?.hiddenBuds) ?? new Set();
        for (let v of $page) {
            let { id, pend, pendValue, mid, sheet, i, x } = v;
            if (pendValue === undefined || pendValue <= 0) continue;
            if (iBud !== undefined) {
                this.valDivsOnPend[pend] = atom(undefined as ValDivRoot);
                let iSpec = this.bizForkColl[i];
                if (iSpec !== undefined) {
                    (v as any).iBase = iSpec.atom.id;
                }
            }
            if (xBud !== undefined) {
                let xSpec = this.bizForkColl[x];
                if (xSpec !== undefined) {
                    (v as any).xBase = xSpec.atom.id;
                }
            }
            let midArr = arrFromJsonMid(entityPend, mid, hiddenBuds);
            let pendRow: PendRow = {
                pend,
                detail: { ...v, buds: {}, owned: undefined },
                origin: id,
                bin: id,
                sheet,
                value: pendValue,
                mid: midArr,
            };
            pendRows.push(pendRow);
            this.cachePendRows[pend] = pendRow;
        }
        return pendRows;
    }

    getPendRow(pend: number) {
        return this.cachePendRows[pend];
    }

    async discard() {
        // 作废草稿单据
        let { valRow: { id } } = this.mainStore;
        if (id >= 0) {
            await this.uq.RemoveDraft.submit({ id });
            this.sheetConsole.removeFromCache(id);
            return id;
        }
    }
    async start() {
        let ret = await this.mainStore.start();
        if (ret !== undefined) return ret;
    }

    async uqGetPend(entityPend: EntityPend, params: any, pendId: number) {
        let ret = await this.uq.GetPend.page({ pendEntity: entityPend.id, params, pendId }, undefined, 100);
        return ret;
    }

    async saveSheet(valRow: ValRow) {
        let propArr = getValRowPropArr(valRow, this.mainStore.entity.buds);
        let { id: sheetId, i, x } = valRow;
        const { uq, entity: entitySheet } = this;
        let ret = await uq.SaveSheet.submit({
            phrase: entitySheet.id,
            no: undefined,
            i: i === 0 ? undefined : i,
            x: x === 0 ? undefined : x,
            value: undefined,
            price: undefined,
            amount: undefined,
            props: propArr,
        });
        let { id, no } = ret;
        return { id, no };
    }

    notifyRowChange() {
        this.sheetConsole.sheetRowCountChanged(this);
    }

    async setSheetAsDraft() {
        await this.uq.SetSheetPreToDraft.submit({ id: this.mainStore.valRow.id });
        setAtomValue(this.atomLoaded, true);
    }

    get mainProxy() {
        const { valRow, entity } = this.mainStore;
        return new Proxy(valRow, entity.proxyHandler());
    }

    get userProxy() {
        return new Proxy(this, new UserProxyHander(this.entity));
    }

    setSubmitError(checkPend: { pend: number; overValue: number; }[], checkBin: { bin: number; message: string; }[]) {
        let error: any = getAtomValue(this.atomError);
        if (error === undefined) error = {};
        for (let row of checkPend) {
            error[row.pend] = row;
        }
        for (let row of checkBin) {
            error[row.bin] = row;
        }
        setAtomValue(this.atomError, error);
    }

    async submit() {
        // let { checkPend, checkBin } = 
        let sheetId = this.mainStore.valRow.id;
        let ret = await this.uq.SubmitSheet.submitReturns({ id: sheetId });
        return ret;
    }

    async submitDebug() {
        // let { checkPend, checkBin } = 
        let sheetId = this.mainStore.valRow.id;
        let ret = await this.uq.SubmitSheetDebug.submitReturns({ id: sheetId });
        return ret;
    }
}

class UserProxyHander implements ProxyHandler<any> {
    private readonly entity: Entity;
    constructor(entity: Entity) {
        this.entity = entity;
    }
    get(target: any, p: string | symbol, receiver: any) {
        const { user, biz: { userDefaults } } = this.entity;
        let n = ':user.' + (p as string);
        let userBud = user.find(v => v.name === n);
        if (userBud === undefined) return;
        let v = userDefaults[userBud.id];
        if (Array.isArray(v) === true) v = v[0];
        return v;
    }
}

export abstract class SheetConsole extends Console {
    readonly entitySheet: EntitySheet;

    constructor(modal: Modal, entitySheet: EntitySheet) {
        super(entitySheet.uq, modal);
        this.entitySheet = entitySheet;
    }

    abstract close(): void;                      // 关闭当前页面
    abstract restart(): void;                    // 关闭并新开单
    abstract onSubmited(store: SheetStore): Promise<void>;        // 单据已提交
    abstract discard(sheetId: number): void;     // 废弃当前单据
    abstract onSheetAdded(store: SheetStore): Promise<void>;
    abstract sheetRowCountChanged(store: SheetStore): void;
    abstract removeFromCache(sheetId: number): void;
    abstract steps: SheetSteps;
    createSheetStore() {
        let ret = new SheetStore(this.entitySheet, this);
        ret.mainStore.init();
        return ret;
    }

    async loadUserDefaults(): Promise<boolean> {
        const { biz, user } = this.entitySheet;
        if (user === undefined) return true;
        if (user.length === 0) return true;
        await biz.loadUserDefaults();
        let { userDefaults } = biz;
        if (userDefaults === undefined) return false;
        for (let bud of user) {
            if (userDefaults[bud.id] === undefined) return false;
        }
        return true;
    }
}

export class SheetSteps {
    readonly steps: string[];
    readonly end: string;
    private _step: number;
    get step(): number { return this._step; }

    constructor(steps: string[], end: string) {
        this.steps = steps;
        this.end = end;
        this._step = 0;
    }

    next() {
        this._step++;
        if (this._step > this.steps.length) {
            debugger;
        }
    }

    prev() {
        this._step--;
        if (this._step < 0) {
            debugger;
        }
    }
}
