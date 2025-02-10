import { Client } from "../Client";
import { Biz, BizBud, Entity, EntityAtom, EntityFork, EntityID, ReturnAtoms, ReturnForks, ReturnProps } from "../Biz";
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

export interface BinData {
    id: number;
    origin: number;
    i: number;
    x: number;
    value: number;
    amount: number;
    price: number;
}

class IDAtom {
    readonly entityID: EntityAtom;
    protected _atom: AtomData;
    constructor(entityID: EntityAtom, atomData: AtomData) {
        this.entityID = entityID;
        this._atom = atomData;
    }
    get id(): number { return this._atom.id; }
    get seedId(): number { return undefined; }
    get atom(): AtomData { return this._atom; }
}

class IDFork extends IDAtom {
    readonly entityFork: EntityFork;
    readonly forkId: number;
    seed: IDFork;
    constructor(entityFork: EntityFork, forkId: number) {
        super(entityFork.entityAtom, undefined);
        this.forkId = forkId;
        this.entityFork = entityFork;
    }
    get id(): number { return this.forkId; }
    get seedId(): number {
        return this.seed === undefined ? this.atom.id : this.seed.forkId;
    }
    setSeed(seed: IDFork | IDAtom) {
        const { entityFork } = seed as IDFork;
        if (entityFork !== undefined) this.seed = seed as IDFork;
        else {
            if (seed.entityID !== this.entityID) debugger;
            this._atom = seed.atom;
        }
    }
    setSeedFork(seed: IDFork) {
        this.seed = seed;
    }
    setSeedAtom(seed: IDAtom) {
        if (seed.entityID !== this.entityID) debugger;
        this._atom = seed.atom;
    }
    get atom(): AtomData {
        if (this._atom !== undefined) return this._atom;
        for (let p = this.seed; p !== undefined; p = p.seed) {
            const { atom } = p;
            if (atom !== undefined) {
                return this._atom = atom;
            }
            const { entityFork } = p;
            if (entityFork === undefined) {
                debugger;
                return; // this._atom = p.atom;
            }
        }
    }
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

export abstract class StoreBase extends Store {
    readonly modal: Modal;
    readonly biz: Biz;
    readonly client: Client;
    readonly budsColl: BudsColl = {};
    // readonly bizAtomColl: AtomColl = {};
    // readonly bizForkColl: ForkColl = {};
    readonly bizIDColl: { [id: number]: IDAtom | IDFork } = {}
    readonly sheetsColl: { [id: number]: SheetData } = {};

    constructor(modal: Modal, biz: Biz) {
        super();
        this.modal = modal;
        this.biz = biz;
        this.client = biz.client;
        //        this.uq = biz.uq;
    }

    getCacheAtom(id: number) { return this.bizIDColl[id] as IDAtom; }
    getCacheFork(id: number) { return this.bizIDColl[id] as IDFork; }
    getCacheBudProps(id: number) { return this.budsColl[id]; }
    getCacheBudValue(id: number, bud: BizBud) { return this.budsColl[id]?.[bud.id]; }
    getCacheIDBudProps(id: number) {
        let bizID = this.bizIDColl[id] as IDFork;
        const { entityFork, entityID, atom } = bizID;
        let budValueColl: BudValueColl = (entityFork === undefined) ? this.budsColl[atom.id]
            : this.budsColl[bizID.seedId];
        /*
        let entityID: EntityID;
        if (bizID === undefined) debugger;
        if (true) {
            let bizFork = this.bizForkColl[id];
            if (bizFork === undefined) return null;
            entityID = bizFork.entityID;
            const { seed } = bizFork;
            if (seed === undefined) return null;
            budValueColl = this.budsColl[bizFork.seed.id];
        }
        else {
            entityID = bizID.entityID;
            budValueColl = this.budsColl[id];
        }
        */
        return { budValueColl, entityID };
    }
    setCacheFork(id: number, base: number, buds: BizBud[]) {
        // 输入fork之后，马上cache。这个应该不需要了。
        /*
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
        */
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
        this.addBizAtoms(atoms);
        this.addBizForks(forks);
        this.addBizProps(props);
    }

    private addBizAtoms(bizAtoms: ReturnAtoms[]) {
        for (let atom of bizAtoms) {
            this.cacheAtom(atom);
        }
    }

    cacheAtom(atom: ReturnAtoms) {
        const { id, phrase } = atom;
        let entityID = this.biz.entities[phrase] as EntityID;
        /*
        this.bizAtomColl[id] = {
            atom,
            entityID,
        };
        */
        this.bizIDColl[id] = new IDAtom(entityID, atom);
    }

    mergeStoreColl(store: StoreEntity) {
        const { /*bizAtomColl, bizForkColl,*/ bizIDColl, budsColl } = store;
        /*
        for (let i in bizAtomColl) {
            this.bizAtomColl[i] = bizAtomColl[i];
        }
        for (let i in bizForkColl) {
            this.bizForkColl[i] = bizForkColl[i];
        }
        */
        for (let i in bizIDColl) {
            this.bizIDColl[i] = bizIDColl[i];
        }
        for (let i in budsColl) {
            this.budsColl[i] = budsColl[i];
        }
    }

    public addBizForks(bizForks: ReturnForks[]/*, props: ReturnProps[]*/) {
        for (let bizFork of bizForks) {
            const { id, phrase } = bizFork;
            const entityFork = this.biz.entityFromId(phrase) as EntityFork;
            if (entityFork === undefined) debugger;
            /*
            this.bizForkColl[id] = {
                seed: undefined, // atom,
                entityID: undefined, //,
                buds: [],
            }
            */
            this.bizIDColl[id] = new IDFork(entityFork, id);
        }
        for (let bizFork of bizForks) {
            const { id, seed } = bizFork;
            let IDSeed = this.bizIDColl[seed];
            if (IDSeed === undefined) debugger;
            let IDFork = this.bizIDColl[id] as IDFork;
            IDFork.setSeed(IDSeed);
            /*
            const pAtom = this.bizAtomColl[seed];
            let atom: AtomData;
            let entityID: EntityID;
            if (pAtom !== undefined) {
                atom = pAtom.atom;
                entityID = pAtom.entityID;
            }
            */
        }

        /*
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
        */
    }

    entityFromId(id: number): EntityID {
        let IDValue = this.bizIDColl[id];
        if (IDValue === undefined) return;
        const { entityFork } = IDValue as IDFork;
        if (entityFork !== undefined) return entityFork;
        return IDValue.entityID;
        /*
        let fork = this.bizForkColl[id];
        if (fork !== undefined) {
            return fork.entityID?.fork;
        }
        let atomColl = this.bizAtomColl[id];
        if (atomColl !== undefined) {
            return atomColl.entityID;
        }
        return;
        */
    }

    addBizProps(props: ReturnProps[]) {
        for (let { id, bud, value } of props) {
            if (bud === 0) {
                const [base, no, operator] = value;
                this.sheetsColl[id] = { id, base, no, operator };
                continue;
            }
            let coll = this.budsColl[id];
            if (coll === undefined) {
                this.budsColl[id] = coll = {};
            }
            if (Array.isArray(value) === false) {
                coll[bud] = value;
                /*
                let bizFork = this.bizForkColl[id];
                if (bizFork === undefined) continue;
                let bizBud = this.biz.budFromId(bud);
                if (bizBud === undefined) {
                    // debugger;
                    continue;
                }
                bizFork.buds.push(bizBud);
                */
                continue;
            }
            else {
                coll[bud] = value;
            }
            /*
            switch (value.length) {
                default:
                case 0: debugger; break;
                case 1: coll[bud] = value[0]; break;
                case 2:
                    let v1 = value[1];
                    let checks = coll[bud] as BudCheckValue;
                    if (checks === undefined) {
                        coll[bud] = checks = [v1];
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
            */
        }
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

export abstract class StoreEntity<E extends Entity = Entity> extends StoreBase {
    readonly entity: E;
    constructor(modal: Modal, entity: E) {
        super(modal, entity.biz);
        this.entity = entity;
    }
}

// 这里是将就老版本
export class StoreBiz extends StoreBase {
    async loadUserDefaults(): Promise<boolean> {
        await this.biz.loadUserDefaults();
        let { userDefaults } = this.biz;
        if (userDefaults === undefined) return false;
        const { buds, props, atoms, forks } = userDefaults;
        this.cacheIdAndBuds(props, atoms, forks);
        return true;
    }
}

export abstract class StoreEntityNew<E extends Entity = Entity> extends StoreBase {
    readonly storeBiz: StoreBiz;
    readonly entity: E;

    constructor(storeBiz: StoreBiz, entity: E) {
        const { modal, biz } = storeBiz;
        super(modal, biz);
        this.storeBiz = storeBiz;
        this.entity = entity;
    }
    /*
    async loadUserDefaults(): Promise<boolean> {
        const { userBuds: user } = this.entity;
        if (user === undefined) return true;
        if (user.length === 0) return true;
        await this.storeBiz.loadUserDefaults();
        let { userDefaults } = this.biz;
        const { buds } = userDefaults;
        for (let bud of user) {
            if (buds[bud.id] === undefined) return false;
        }
    }
    */
}
