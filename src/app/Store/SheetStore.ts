import { WritableAtom, atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { EntitySheet, EntityBin, EntityPend, BinRow, Entity, EnumDetailOperate, BizBud, EntityStore, ReturnProps, ReturnAtoms, ReturnForks } from "tonwa";
import { ReturnGetPendRetSheet } from "uqs/UqDefault";
import { RearPickResultType, ReturnUseBinPicks } from "./PickResult";
import { Formulas } from "app/hooks/Calc";
import { BudEditing } from "../hooks/Bud";
import { getValRowPropArr, ValRow } from "./ValRow";
import { BinStore, BinStorePendDirect, SubmitState } from "./BinStore";
import { ValDivRoot } from "./ValDiv";
import { Modal } from "tonwa-app";
import { Console } from "app/tool";
import { arrFromJsonMid } from "app/hooks/tool";
import { SheetMainStore } from "./SheetMainStore";

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
/*
class Detail extends BinStore {
    readonly caption: string;
    constructor(sheetStore: SheetStore, entityBin: EntityBin, caption: string, operate: EnumDetailOperate) {
        super(sheetStore, entityBin, operate);
        this.caption = caption ?? entityBin.caption;
    }
}

// 多余的Detail，只能手工输入
export class ExDetail extends Detail {
}
*/
export class SheetStore extends EntityStore<EntitySheet> {
    private readonly cachePendRows: { [id: number]: PendRow } = {};
    readonly sheetConsole: SheetConsole;
    readonly mainStore: SheetMainStore;
    readonly binStore: BinStore;
    readonly caption: string;
    readonly backIcon = 'file-text-o';
    readonly isPend: boolean;
    readonly isMainPend: boolean;
    readonly valDivsOnPend: { [pend: number]: WritableAtom<ValDivRoot, any, any> } = {};
    readonly atomLoaded = atom(false);
    readonly atomReaction = atom(undefined as any);
    readonly atomSubmitState: WritableAtom<SubmitState, any, any>;
    readonly atomError = atom(undefined as { [id: number]: { pend: number; overValue: number; } | { bin: number; message: string; } });
    readonly atomSum = atom(get => {
        return this.binStore.sum(get);
    });
    constructor(sheetConsole: SheetConsole) {
        const { entitySheet } = sheetConsole;
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
            let binStore: BinStore;
            switch (detail.operate) {
                default: binStore = new BinStore(this, detail.bin, detail.operate); break;
                case EnumDetailOperate.direct: binStore = new BinStorePendDirect(this, detail.bin, detail.operate); break;
            }
            this.binStore = binStore;
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
            this.binStore.setValRowArrayToRoot(details);//, false);
        }
        setAtomValue(this.atomLoaded, true);
    }

    get mainId() {
        return this.mainStore.valRow?.id;
    }

    // whole sheet or row detail
    async loadBinData(binId: number) {
        let { main, details, props, atoms: bizAtoms, forks } =
            //await this.uq.GetSheet.query({ id: binId });
            await this.client.GetSheet(binId);
        this.cacheIdAndBuds(props, bizAtoms, forks);
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
        //let ret = await this.uq.GetPend.page({ pendEntity: entityPend.id, params, pendId }, undefined, 100);
        let ret = await this.client.GetPend({ pendEntity: entityPend.id, params, pendId }, undefined, 100);
        let { $page, retSheet, props: showBuds, atoms, forks } = ret;
        this.cacheIdAndBuds(showBuds, atoms, forks);
        let collSheet: { [id: number]: ReturnGetPendRetSheet } = {};
        for (let v of retSheet) {
            collSheet[v.id] = v;
        };
        let pendRows: PendRow[] = [];
        let { i: iBud, x: xBud } = entityPend;
        let hiddenBuds: Set<number> = (rearPick?.hiddenBuds) ?? new Set();
        for (let v of $page) {
            let { id, pend, pendValue, mid, sheet, i, x } = v;
            if (pendValue === undefined) continue;
            if (iBud !== undefined) {
                this.valDivsOnPend[pend] = atom(undefined as ValDivRoot);
                let iFork = this.bizForkColl[i];
                if (iFork !== undefined) {
                    (v as any).iBase = iFork.seed.id;
                }
            }
            if (xBud !== undefined) {
                let xFork = this.bizForkColl[x];
                if (xFork !== undefined) {
                    (v as any).xBase = xFork.seed.id;
                }
            }
            let midArr = arrFromJsonMid(entityPend, mid, hiddenBuds);
            let pendRow: PendRow = {
                pend,
                detail: { ...v, buds: {}, /*owned: undefined */ },
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
            //await this.uq.RemoveDraft.submit({ id });
            this.client.RemoveDraft(id);
            this.sheetConsole.removeFromCache(id);
            return id;
        }
    }
    async start() {
        let ret = await this.mainStore.start();
        if (ret !== undefined) return ret;
    }

    async saveSheet(valRow: ValRow) {
        let propArr = getValRowPropArr(valRow, this.mainStore.entity.buds);
        let { id: sheetId, i, x } = valRow;
        const { entity: entitySheet } = this;
        let ret = await this.client.SaveSheet({
            phrase: entitySheet.id,
            mainPhrase: entitySheet.main?.id,
            no: undefined,
            i: i === 0 ? undefined : i,
            x: x === 0 ? undefined : x,
            value: undefined,
            price: undefined,
            amount: undefined,
            props: propArr,
        });
        return ret;
        // let { id, no } = ret;
        // return { id, no };
    }

    notifyRowChange() {
        this.sheetConsole.sheetRowCountChanged(this);
    }

    async setSheetAsDraft() {
        this.client.SetSheetPreToDraft(this.mainStore.valRow.id);
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
        let sheetId = this.mainStore.valRow.id;
        let ret = await this.client.SubmitSheet(sheetId);
        return ret;
    }

    async submitDebug() {
        // let { checkPend, checkBin } = 
        let sheetId = this.mainStore.valRow.id;
        // let ret = await this.uq.SubmitSheetDebug.submitReturns({ id: sheetId });
        let ret = await this.client.SubmitSheetDebug(sheetId);
        return ret;
    }

    async onPicked(results: ReturnUseBinPicks) {
        const { sheetConsole, mainStore } = this;
        let ret = await mainStore.startFromPickResults(results);
        if (ret === undefined) {
            if (this.mainId === undefined) {
                // 还没有创建单据
                if (sheetConsole.steps === undefined) {
                    setTimeout(() => {
                        sheetConsole.close();
                    }, 100);
                }
            }
            return; // 已有单据，不需要pick. 或者没有创建新单据
        }
        sheetConsole.onSheetAdded(this);
    }
}

class UserProxyHander implements ProxyHandler<any> {
    private readonly entity: Entity;
    constructor(entity: Entity) {
        this.entity = entity;
    }
    get(target: any, p: string | symbol, receiver: any) {
        const { userBuds } = this.entity;
        let budName = Entity.userPrefix + '.' + (p as string);
        let userBud = userBuds.find(v => v.name === budName);
        if (userBud === undefined) return;
        return getUserBudValue(this.entity, userBud);
    }
}

export function getUserBudValue(entity: Entity, bud: BizBud) {
    const { biz } = entity;
    const { userDefaults: { buds } } = biz;
    let v = buds[bud.id];
    if (v === undefined) {
        let budName = bud.name;
        let console = biz.bizConsole;
        let consoleUserBud = console.userBuds.find(v => v.name === budName);
        if (consoleUserBud === undefined) return;
        v = buds[consoleUserBud.id];
    }
    if (Array.isArray(v) === true) v = v[0];
    return v;
}

// 操作某种单据的控制台
export abstract class SheetConsole extends Console {
    readonly entitySheet: EntitySheet;

    constructor(modal: Modal, entitySheet: EntitySheet) {
        super(/*entitySheet.uq, */modal);
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
        let ret = new SheetStore(this);
        // ret.cacheIdAndBuds(this.props, this.atoms, this.forks);
        ret.mainStore.init();
        return ret;
    }

    async loadUserDefaults(sheetStore: SheetStore): Promise<boolean> {
        const { biz, userBuds: user } = this.entitySheet;
        if (user === undefined) return true;
        if (user.length === 0) return true;
        await biz.loadUserDefaults();
        let { userDefaults } = biz;
        if (userDefaults === undefined) return false;
        const { buds, props, atoms, forks } = userDefaults;
        sheetStore.cacheIdAndBuds(props, atoms, forks);
        for (let bud of user) {
            if (buds[bud.id] === undefined) return false;
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
