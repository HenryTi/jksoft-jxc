import { BizBud, Entity, EntityID } from "../Biz";
import { Biz } from "../Biz";
import { Modal } from "../UI";

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

export type BudCheckValue = number[];
export type BudCheckEditValue = { [item: number]: boolean; };
export type BudValue = string | number | BudCheckValue; // | BudCheckEditValue;

// bud=100, atom.no
// bud=101, atom.ex
export interface BudValueColl {
    [bud: number]: BudValue;
}

export interface ID {
    id?: number;
}

export interface Atom extends ID {
    base: number;
    no?: string;
    ex: string;
}

export interface AtomColl {
    [id: number]: {
        atom: Atom;
        entityID: EntityID;
    }
}

export interface ForkColl {
    [id: number]: {
        atom: Atom;
        entityID: EntityID;
        buds: BizBud[];
    }
}

export abstract class Store extends KeyIdObject {
}

export abstract class BizStore extends Store {
    readonly modal: Modal;
    readonly biz: Biz;
    //    readonly uq: UqExt;
    constructor(modal: Modal, biz: Biz) {
        super();
        this.modal = modal;
        this.biz = biz;
        //        this.uq = biz.uq;
    }
}

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
export abstract class EntityStore<E extends Entity = Entity> extends BizStore {
    readonly entity: E;
    readonly budsColl: BudsColl = {};
    readonly bizAtomColl: AtomColl = {};
    readonly bizForkColl: ForkColl = {};

    constructor(modal: Modal, entity: E) {
        const { biz } = entity;
        super(modal, biz);
        this.entity = entity;
    }

    cacheIdAndBuds(props: CacheProp[],
        atoms: CacheAtom[],
        forks: CacheFork[],
    ) {
        props.sort((a, b) => {
            const { id: aId, phrase: aPhrase } = a;
            const { id: bId, phrase: bPhrase } = b;
            let c0 = aId - bId;
            if (c0 !== 0) return c0;
            return aPhrase - bPhrase;
        });
        const budsColl = budValuesFromProps(props);
        Object.assign(this.budsColl, budsColl);
        this.addBizAtoms(atoms);
        this.addBizSpecs(forks, props);
    }

    private addBizAtoms(bizAtoms: Atom[]) {
        for (let atom of bizAtoms) {
            this.mergeAtom(atom);
        }
    }

    mergeAtom(atom: Atom) {
        const { id, base } = atom;
        this.bizAtomColl[id] = {
            atom,
            entityID: this.biz.entities[base] as EntityID,
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

    public addBizSpecs(bizSpecs: { id: number; atom: number; }[], props: CacheProp[]) {
        for (let bizSpec of bizSpecs) {
            const { id, atom: atomId } = bizSpec;
            const pAtom = this.bizAtomColl[atomId];
            let atom: Atom;
            let entityID: EntityID;
            if (pAtom !== undefined) {
                atom = pAtom.atom;
                entityID = pAtom.entityID;
            }
            this.bizForkColl[id] = {
                atom,
                entityID,
                buds: [],
            }
        }
        for (let { id, phrase, value } of props) {
            let bizSpec = this.bizForkColl[id];
            if (bizSpec === undefined) continue;
            let bud = this.biz.budFromId(phrase);
            if (bud === undefined) {
                // debugger;
                continue;
            }
            bizSpec.buds.push(bud);
            let coll = this.budsColl[id];
            if (coll === undefined) {
                coll = {};
                this.budsColl[id] = coll;
            }
            coll[phrase] = value;
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
    phrase: number;
    value: any;
    //    owner: number;
}

function budValuesFromProps(props: PropData[]) {
    const budsColl: BudsColl = {};
    for (let { id, phrase, value } of props) {
        let budValues = budsColl[id];
        if (budValues === undefined) {
            budsColl[id] = budValues = {};
        }
        if (Array.isArray(value) === false) {
            budValues[phrase] = value;
        }
        else {
            switch (value.length) {
                default:
                case 0: debugger; break;
                case 1: budValues[phrase] = value[0]; break;
                case 2:
                    let v1 = value[1];
                    let checks = budValues[phrase] as BudCheckValue;
                    if (checks === undefined) {
                        budValues[phrase] = checks = [v1];
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
