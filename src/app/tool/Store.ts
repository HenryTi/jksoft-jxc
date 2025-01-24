import { Biz, BizBud, Entity, EntityFork, EntityID } from "app/Biz";
import { BudCheckValue, BudValue, Modal } from "tonwa-app";
import { Atom, ReturnGetPendProps, ReturnGetSheetAtoms, ReturnGetSheetProps, ReturnGetSheetForks, UqExt } from "uqs/UqDefault";

abstract class KeyIdObject {
    private static __keyId = 0;
    readonly keyId: number;
    constructor() {
        this.keyId = ++KeyIdObject.__keyId;
    }
}

export interface BudsColl {
    [row: number]: BudValueColl;
}

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
    readonly uq: UqExt;
    constructor(modal: Modal, biz: Biz) {
        super();
        this.modal = modal;
        this.biz = biz;
        this.uq = biz.uq;
    }
}

export abstract class EntityStore<E extends Entity = Entity> extends BizStore {
    readonly entity: E;
    protected readonly budsColl: BudsColl = {};
    private readonly bizAtomColl: AtomColl = {};
    protected readonly bizForkColl: ForkColl = {};

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

    cacheIdAndBuds(props: ReturnGetSheetProps[],
        atoms: ReturnGetSheetAtoms[],
        forks: ReturnGetSheetForks[],
    ) {
        props.sort((a, b) => {
            const { id: aId, bud: aBud } = a;
            const { id: bId, bud: bBud } = b;
            let c0 = aId - bId;
            if (c0 !== 0) return c0;
            return aBud - bBud;
        });
        const budsColl = budValuesFromProps(props);
        Object.assign(this.budsColl, budsColl);
        this.addBizAtoms(atoms);
        this.addBizForks(forks, props);
    }

    private addBizAtoms(bizAtoms: ReturnGetSheetAtoms[]) {
        for (let atom of bizAtoms) {
            this.cacheAtom(atom);
        }
    }

    cacheAtom(atom: ReturnGetSheetAtoms) {
        const { id, phrase } = atom;
        this.bizAtomColl[id] = {
            atom,
            entityID: this.biz.entities[phrase] as EntityID,
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

    public addBizForks(bizForks: { id: number; seed: number; phrase: number; }[], props: ReturnGetPendProps[]) {
        for (let bizSpec of bizForks) {
            const { id, seed } = bizSpec;
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
            let bizSpec = this.bizForkColl[id];
            if (bizSpec === undefined) continue;
            let bizBud = this.biz.budFromId(bud);
            if (bud === undefined) {
                // debugger;
                continue;
            }
            bizSpec.buds.push(bizBud);
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
}

interface PropData {
    id: number;
    bud: number;
    value: any;
    //    owner: number;
}

function budValuesFromProps(props: PropData[]) {
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
