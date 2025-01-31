import { Client } from "../Client";
import { BizBud, Entity, EntityID, ReturnAtoms, ReturnForks, ReturnProps } from "../Biz";
import { Biz } from "../Biz";
import { Modal } from "../UI";

export abstract class KeyIdObject {
    private static __keyId = 0;
    readonly keyId: number;
    constructor() {
        this.keyId = ++KeyIdObject.__keyId;
    }
}

export interface BudsColl {
    [row: number]: BudValueColl;
}

export type BudCheckValue = number[];
export type BudCheckEditValue = { [item: number]: boolean; };
export type BudValue = string | number | BudCheckValue; // | BudCheckEditValue;

// bud=100, atom.no
// bud=101, atom.ex
export interface BudValueColl {
    [bud: number]: BudValue;
}

export interface AtomData {
    id: number;
    phrase: number;
    no: string;
    ex: string;
}

export interface SheetData {
    id: number;
    base: number;
    no: string;
    operator: number;
}

export interface AtomColl {
    [id: number]: {
        atom: AtomData;
        entityID: EntityID;
    }
}

export interface ForkColl {
    [id: number]: {
        seed: AtomData;
        entityID: EntityID;
        buds: BizBud[];
    }
}

export abstract class Store extends KeyIdObject {
}

export abstract class BizStore extends Store {
    readonly modal: Modal;
    readonly biz: Biz;
    readonly client: Client;
    //    readonly uq: UqExt;
    constructor(modal: Modal, biz: Biz) {
        super();
        this.modal = modal;
        this.biz = biz;
        this.client = biz.client;
        //        this.uq = biz.uq;
    }
}
/*
interface CacheProp {
    id: number;
    phrase: number;
    value: any;
}
interface CacheAtom {
    id: number;
    base: number;
    no: string;
    ex: string;
}
interface CacheFork {
    id: number;
    atom: number;
}
*/
export abstract class EntityStore<E extends Entity = Entity> extends BizStore {
    readonly entity: E;
    readonly budsColl: BudsColl = {};
    readonly bizAtomColl: AtomColl = {};
    readonly bizForkColl: ForkColl = {};
    readonly sheetsColl: { [id: number]: SheetData } = {};

    constructor(modal: Modal, entity: E) {
        const { biz } = entity;
        super(modal, biz);
        this.entity = entity;
    }

    getCacheAtom(id: number) { return this.bizAtomColl[id]; }
    getCacheFork(id: number) { return this.bizForkColl[id]; }
    getCacheBudProps(id: number) { return this.budsColl[id]; }
    getCacheBudValue(id: number, bud: BizBud) { return this.budsColl[id][bud.id]; }
    getCacheAtomOrForkBudProps(id: number) {
        let budValueColl: BudValueColl;
        let bizAtom = this.bizAtomColl[id];
        let entityID: EntityID;
        if (bizAtom === undefined) {
            let bizFork = this.bizForkColl[id];
            if (bizFork === undefined) return null;
            entityID = bizFork.entityID;
            const { seed } = bizFork;
            if (seed === undefined) return null;
            budValueColl = this.budsColl[bizFork.seed.id];
        }
        else {
            entityID = bizAtom.entityID;
            budValueColl = this.budsColl[id];
        }
        return { budValueColl, entityID };
    }
    setCacheFork(id: number, base: number, buds: BizBud[]) {
        let pAtom = this.getCacheAtom(base);
        let atom: AtomData;
        let entityID: EntityID;
        if (pAtom !== undefined) {
            atom = pAtom.atom;
            entityID = pAtom.entityID;
        }
        this.bizForkColl[id] = {
            seed: atom,
            entityID,
            buds,
        }
    }
    cacheIdAndBuds(props: ReturnProps[],
        atoms: ReturnAtoms[],
        forks: ReturnForks[],
    ) {
        props.sort((a, b) => {
            const { id: aId, bud: aPhrase } = a;
            const { id: bId, bud: bPhrase } = b;
            let c0 = aId - bId;
            if (c0 !== 0) return c0;
            return aPhrase - bPhrase;
        });
        this.budValuesFromProps(props);
        this.addBizAtoms(atoms);
        this.addBizForks(forks, props);
    }

    private addBizAtoms(bizAtoms: ReturnAtoms[]) {
        for (let atom of bizAtoms) {
            this.cacheAtom(atom);
        }
    }

    cacheAtom(atom: ReturnAtoms) {
        const { id, phrase } = atom;
        let entityID = this.biz.entities[phrase] as EntityID;
        this.bizAtomColl[id] = {
            atom,
            entityID,
        };
    }

    mergeStoreColl(store: EntityStore) {
        const { bizAtomColl, bizForkColl, budsColl } = store;
        for (let i in bizAtomColl) {
            this.bizAtomColl[i] = bizAtomColl[i];
        }
        for (let i in bizForkColl) {
            this.bizForkColl[i] = bizForkColl[i];
        }
        for (let i in budsColl) {
            this.budsColl[i] = budsColl[i];
        }
    }

    public addBizForks(bizForks: ReturnForks[], props: ReturnProps[]) {
        for (let bizFork of bizForks) {
            const { id, seed } = bizFork;
            const pAtom = this.bizAtomColl[seed];
            let atom: AtomData;
            let entityID: EntityID;
            if (pAtom !== undefined) {
                atom = pAtom.atom;
                entityID = pAtom.entityID;
            }
            this.bizForkColl[id] = {
                seed: atom,
                entityID,
                buds: [],
            }
        }
        for (let { id, bud, value } of props) {
            let bizFork = this.bizForkColl[id];
            if (bizFork === undefined) continue;
            let bizBud = this.biz.budFromId(bud);
            if (bud === undefined) {
                // debugger;
                continue;
            }
            bizFork.buds.push(bizBud);
            let coll = this.budsColl[id];
            if (coll === undefined) {
                coll = {};
                this.budsColl[id] = coll;
            }
            coll[bud] = value;
        }
    }

    entityFromId(id: number): EntityID {
        let fork = this.bizForkColl[id];
        if (fork !== undefined) {
            return fork.entityID?.fork;
        }
        let atomColl = this.bizAtomColl[id];
        if (atomColl !== undefined) {
            return atomColl.entityID;
        }
        return;
    }

    private budValuesFromProps(props: ReturnProps[]) {
        for (let { id, bud, value } of props) {
            if (bud === 0) {
                const [base, no, operator] = value;
                this.sheetsColl[id] = { id, base, no, operator };
                continue;
            }
            let budValues = this.budsColl[id];
            if (budValues === undefined) {
                this.budsColl[id] = budValues = {};
            }
            if (Array.isArray(value) === false) {
                budValues[bud] = value;
                continue;
            }
            switch (value.length) {
                default:
                case 0: debugger; break;
                case 1: budValues[bud] = value[0]; break;
                case 2:
                    let v1 = value[1];
                    let checks = budValues[bud] as BudCheckValue;
                    if (checks === undefined) {
                        budValues[bud] = checks = [v1];
                    }
                    else {
                        // 可能重复，去重。具体为什么会重复，随后再找原因
                        if (checks.findIndex(v => v === v1) < 0) {
                            checks.push(v1);
                        }
                        else {
                            console.error('budValuesFromProps duplicate ', v1);
                            // debugger;
                        }
                    }
                    break;
            }
        }
    }
}
/*
interface PropData {
    id: number;
    phrase: number;
    value: any;
    //    owner: number;
}
*/
function budValuesFromProps(props: ReturnProps[]) {
    const budsColl: BudsColl = {};
    for (let { id, bud, value } of props) {
        let budValues = budsColl[id];
        if (budValues === undefined) {
            budsColl[id] = budValues = {};
        }
        if (Array.isArray(value) === false) {
            budValues[bud] = value;
        }
        else {
            switch (value.length) {
                default:
                case 0: debugger; break;
                case 1: budValues[bud] = value[0]; break;
                case 2:
                    let v1 = value[1];
                    let checks = budValues[bud] as BudCheckValue;
                    if (checks === undefined) {
                        budValues[bud] = checks = [v1];
                    }
                    else {
                        // 可能重复，去重。具体为什么会重复，随后再找原因
                        if (checks.findIndex(v => v === v1) < 0) {
                            checks.push(v1);
                        }
                        else {
                            console.error('budValuesFromProps duplicate ', v1);
                            // debugger;
                        }
                    }
                    break;
            }
        }
    }
    return budsColl;
}
