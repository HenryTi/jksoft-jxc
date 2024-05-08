import { useParams } from "react-router-dom";
import { WritableAtom, atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { EntitySheet, EntityBin, Biz, EntityPend, BinRow, BizBud, Entity } from "app/Biz";
import { ParamSaveDetail, UqExt, Atom as BizAtom, ReturnGetPendRetSheet } from "uqs/UqDefault";
import { PickFunc, PickStates, RearPickResultType, ReturnUseBinPicks } from "./NamedResults";
import { Calc, Formulas } from "app/hooks/Calc";
import { AtomColl, BudsColl, budValuesFromProps } from "../../tool";
import { BudEditing } from "../../Bud";
import { ValRow, arrFromJsonMid } from "./tool";
import { DivStore, SubmitState } from "./DivStore";
import { useUqApp } from "app/UqApp";
//import { SheetConsole } from "./SheetConsole";
import { ValDivRoot } from "./ValDiv";
import { Modal } from "tonwa-app";

abstract class KeyIdObject {
    private static __keyId = 0;
    readonly keyId: number;
    constructor() {
        this.keyId = ++KeyIdObject.__keyId;
    }
}

abstract class BinStore extends KeyIdObject {
    readonly sheetStore: SheetStore;
    readonly entityBin: EntityBin;
    constructor(sheetStore: SheetStore, entityBin: EntityBin) {
        super();
        this.sheetStore = sheetStore;
        this.entityBin = entityBin;
    }
}

export class SheetMain extends BinStore {
    readonly budEditings: BudEditing[];
    readonly _valRow = atom<ValRow>({ buds: {} } as ValRow);
    get valRow() { return getAtomValue(this._valRow) }
    no: string;

    constructor(sheetStore: SheetStore) {
        const { main } = sheetStore.entitySheet;
        super(sheetStore, main);
        this.budEditings = main.buds.map(v => new BudEditing(v));
    }

    // return: true: new sheet created
    async start(pick: PickFunc) {
        const row = this.valRow;
        const { id } = row;
        if (id > 0) return;
        const pickResults = await pick(this.sheetStore, this.entityBin, RearPickResultType.scalar);
        let ret = await this.startFromPickResults(pickResults);
        setAtomValue(this.sheetStore.atomLoaded, true);
        return ret;
    }

    async startFromPickResults(pickResults: ReturnUseBinPicks) {
        if (pickResults === undefined) return;
        const row = this.valRow;
        const { i, x, buds: mainProps } = this.entityBin;
        const formulas: Formulas = [];
        function getFormulaText(text: string) {
            if (text === undefined) return;
            let parts = text.split('\n');
            return parts[0];
        }
        if (i !== undefined) {
            formulas.push(['i', getFormulaText(i.valueSet ?? 'i$pick')]);
        }
        if (x !== undefined) {
            formulas.push(['x', getFormulaText(x.valueSet ?? 'x$pick')]);
        }
        for (let mp of mainProps) {
            formulas.push([mp.name, getFormulaText(mp.valueSet)]);
        }
        let { namedResults, rearBinPick: lastBinPick, rearResult: lastResult } = pickResults;
        const calc = new Calc(formulas, namedResults);
        calc.addValues(lastBinPick.name, lastResult[0]);
        // const { results: calcResults } = calc;
        if (i !== undefined) {
            row.i = calc.getValue('i') as number; // as number;
        }
        if (x !== undefined) {
            row.x = calc.getValue('x') as number; // calcResults.x as number;
        }
        for (let mp of mainProps) {
            let v = calc.getValue(mp.name);
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

export class SheetStore extends KeyIdObject {
    readonly uq: UqExt;
    readonly biz: Biz;
    readonly entitySheet: EntitySheet;
    readonly sheetConsole: SheetConsole;
    readonly main: SheetMain;
    readonly caption: string;
    readonly backIcon = 'file-text-o';
    readonly isPend: boolean;
    readonly budsColl: BudsColl = {};
    readonly bizAtomColl: AtomColl = {};
    readonly valDivsOnPend: { [pend: number]: WritableAtom<ValDivRoot, any, any> } = {};
    readonly divStore: DivStore;
    readonly atomLoaded = atom(false);
    readonly atomReaction = atom(undefined as any);
    readonly atomSubmitState: WritableAtom<SubmitState, any, any>;

    constructor(entitySheet: EntitySheet, sheetConsole: SheetConsole) {
        super();
        const { biz } = entitySheet;
        const { uq } = biz;
        this.uq = uq;
        this.biz = biz;
        this.entitySheet = entitySheet;
        this.sheetConsole = sheetConsole;
        this.main = new SheetMain(this);
        const { details } = this.entitySheet;
        let detail = details[0];
        let len = details.length;
        if (len > 0) {
            const { bin } = details[0];
            this.isPend = bin.pend !== undefined;
        }
        this.caption = entitySheet.caption ?? entitySheet.name;
        if (detail !== undefined) {
            this.divStore = new DivStore(this, detail.bin);
        }
        sheetConsole.picks = new PickStates(
            {
                'user': this.userProxy,
                '%user': this.userProxy,
                '%sheet': this.mainProxy
            },
            undefined,
            0
        );
        this.atomSubmitState = atom((get) => {
            if (this.divStore === undefined) return SubmitState.enable;
            return get(this.divStore.atomSubmitState);
        }, null);
    }

    async load(sheetId: number) {
        let { main, details } = await this.loadBinData(sheetId);
        if (main === undefined) return;
        this.main.setValue(main);
        this.divStore.load(details, false);
        setAtomValue(this.atomLoaded, true);
    }

    async reloadBinProps(binId: number) {
        await this.loadBinData(binId);
    }

    hasId() {
        return this.main.valRow?.id !== undefined;
    }

    // whole sheet or row detail
    async loadBinData(binId: number) {
        let { main, details, props, atoms: bizAtoms } = await this.uq.GetSheet.query({ id: binId });
        const budsColl = budValuesFromProps(props);
        Object.assign(this.budsColl, budsColl);
        this.addBizAtoms(bizAtoms);
        let mainRow = main[0];
        if (mainRow !== undefined) {
            (mainRow as any).buds = budsColl[binId] ?? {};
        }
        for (let row of details) {
            const { id } = row;
            (row as any).buds = budsColl[id] ?? {};
        }
        return { main: mainRow, details };
    }

    async loadPend(params: any, pendId: number) {
        let { pend: entityPend, rearPick } = this.entitySheet.coreDetail;
        if (entityPend === undefined) debugger;
        let ret = await this.uqGetPend(entityPend, params, pendId);
        let { $page, retSheet, props: showBuds, atoms } = ret;
        const ownerColl = budValuesFromProps(showBuds);
        Object.assign(this.budsColl, ownerColl);
        this.addBizAtoms(atoms);
        let collSheet: { [id: number]: ReturnGetPendRetSheet } = {};
        for (let v of retSheet) {
            collSheet[v.id] = v;
        };
        let pendRows: PendRow[] = [];
        let hiddenBuds: Set<number> = (rearPick?.hiddenBuds) ?? new Set();
        for (let v of $page) {
            let { id, pend, pendValue, mid, cols } = v;
            if (pendValue === undefined || pendValue <= 0) continue;
            this.valDivsOnPend[pend] = atom(undefined as ValDivRoot);
            let midArr = arrFromJsonMid(entityPend, mid, hiddenBuds);
            let pendRow: PendRow = {
                pend,
                detail: { ...v, buds: {}, owned: undefined },
                origin: id,
                value: pendValue,
                mid: midArr,
            };
            pendRows.push(pendRow);
        }
        return pendRows;
    }

    private addBizAtoms(bizAtoms: BizAtom[]) {
        for (let atom of bizAtoms) {
            this.bizAtomColl[atom.id] = atom;
            this.uq.idCacheAdd(atom);
        }
    }

    async discard() {
        // 作废草稿单据
        let { valRow: { id } } = this.main;
        if (id >= 0) {
            await this.uq.RemoveDraft.submit({ id });
            return id;
        }
    }
    async start(pick: PickFunc) {
        let ret = await this.main.start(pick);
        if (ret !== undefined) return ret;
    }

    async saveProp(id: number, bud: number, int: number, dec: number, str: string) {
        await this.uq.SaveBudValue.submit({ phraseId: bud, id, int, dec, str });
    }

    async uqGetPend(entityPend: EntityPend, params: any, pendId: number) {
        let ret = await this.uq.GetPend.page({ pendEntity: entityPend.id, params, pendId }, undefined, 100);
        return ret;
    }

    async delDetail(id: number) {
        await this.uq.DeleteBin.submit({ id });
    }

    private getPropArr(valRow: ValRow, buds: BizBud[]) {
        const { buds: budsValues } = valRow;
        let propArr: [number, string | number, number][] = [];
        for (let bud of buds) {
            let { id, budDataType } = bud;
            let value = (budsValues as any)[id];
            if (value === undefined) continue;
            propArr.push([id, value, budDataType.type]);
        }
        return propArr;
    }

    async saveSheet(valRow: ValRow) {
        let propArr = this.getPropArr(valRow, this.main.entityBin.buds);
        let { id: sheetId, i, x } = valRow;
        const { uq, entitySheet } = this;
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

    async saveDetail(entityBin: EntityBin, buds: BizBud[], valRow: ValRow) {
        let { id, i, x, value, price, amount, pend, origin } = valRow;
        let propArr = this.getPropArr(valRow, buds);
        let param: ParamSaveDetail = {
            base: this.main.valRow.id,
            phrase: entityBin.id,
            id,
            i,
            x,
            value,
            price,
            amount,
            origin,
            pend,
            props: propArr,
        };
        let retSaveDetail = await this.uq.SaveDetail.submitReturns(param);
        id = retSaveDetail.ret[0].id;
        return id;
    }

    notifyRowChange() {
        this.sheetConsole.sheetRowCountChanged(this);
    }

    async setSheetAsDraft() {
        await this.uq.SetSheetPreToDraft.submit({ id: this.main.valRow.id });
        setAtomValue(this.atomLoaded, true);
    }

    get mainProxy() {
        const { valRow, entityBin } = this.main;
        return new Proxy(valRow, entityBin.proxyHandler());
    }

    get userProxy() {
        return new Proxy(this, new UserProxyHander(this.entitySheet));
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

export function useSheetEntity() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    return entitySheet;
}

export abstract class SheetConsole {
    protected readonly modal: Modal;
    readonly entitySheet: EntitySheet;

    constructor(modal: Modal, entitySheet: EntitySheet) {
        this.modal = modal;
        this.entitySheet = entitySheet;
    }

    abstract close(): void;                      // 关闭当前页面
    abstract restart(): void;                    // 关闭并新开单
    abstract onSubmited(store: SheetStore): Promise<void>;        // 单据已提交
    abstract discard(sheetId: number): void;     // 废弃当前单据
    abstract onSheetAdded(store: SheetStore/*sheetId: number, no: string*/): Promise<void>;
    abstract sheetRowCountChanged(store: SheetStore): void;
    abstract removeFromCache(sheetId: number): void;
    abstract steps: SheetSteps;
    createSheetStore() {
        return new SheetStore(this.entitySheet, this);
    }

    picks: PickStates;
}

export interface SheetSteps {
    steps: string[];
    step: number;
    end: string;
}
