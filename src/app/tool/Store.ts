import { Biz, BizBud, Entity } from "app/Biz";
import { BudCheckValue, BudValue } from "tonwa-app";
import { Atom, ReturnGetPendProps, ReturnGetSheetAtoms, ReturnGetSheetProps, ReturnGetSheetSpecs, UqExt } from "uqs/UqDefault";

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

export interface AtomColl {
    [id: number]: Atom;
}

export interface SpecColl {
    [id: number]: {
        atom: Atom;
        buds: BizBud[];
    }
}

export abstract class Store<E extends Entity> extends KeyIdObject {
    readonly biz: Biz;
    readonly uq: UqExt;
    readonly entity: E;
    readonly budsColl: BudsColl = {};
    readonly bizAtomColl: AtomColl = {};
    readonly bizSpecColl: SpecColl = {};

    constructor(entity: E) {
        super();
        const { biz } = entity;
        this.biz = biz;
        this.uq = biz.uq;
        this.entity = entity;
    }

    protected cacheIdAndBuds(props: ReturnGetSheetProps[],
        atoms: ReturnGetSheetAtoms[],
        specs: ReturnGetSheetSpecs[],
    ) {
        const budsColl = budValuesFromProps(props);
        Object.assign(this.budsColl, budsColl);
        this.addBizAtoms(atoms);
        this.addBizSpecs(specs, props);
    }

    private addBizAtoms(bizAtoms: Atom[]) {
        for (let atom of bizAtoms) {
            const { id } = atom;
            this.bizAtomColl[id] = atom;
            this.uq.idCacheAdd(atom);
        }
    }

    private addBizSpecs(bizSpecs: { spec: number; atom: number; }[], props: ReturnGetPendProps[]) {
        for (let bizSpec of bizSpecs) {
            const { spec, atom } = bizSpec;
            this.bizSpecColl[spec] = {
                atom: this.bizAtomColl[atom],
                buds: [],
            }
        }
        for (let { id, phrase, value } of props) {
            let bizSpec = this.bizSpecColl[id];
            if (bizSpec === undefined) continue;
            let bud = this.biz.budFromId(phrase);
            if (bud === undefined) debugger;
            bizSpec.buds.push(bud);
        }
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
