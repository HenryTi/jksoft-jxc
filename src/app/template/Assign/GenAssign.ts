import { BizAssign, OpAtomAssigns } from "app/Biz";
import { Gen } from "app/tool";

export abstract class GenAssign extends Gen {
    abstract get atomName(): string;
    protected abstract get phrases(): string[];

    get bizAtom() {
        return this.biz.atoms[this.atomName];
    }

    private _opAtomAssigns: OpAtomAssigns;
    get opAtomAssigns() {
        if (this._opAtomAssigns === undefined) {
            this._opAtomAssigns = new OpAtomAssigns(this.bizAtom, this.phrases);
        }
        return this._opAtomAssigns;
    };

    get bizAssigns(): BizAssign[] {
        return this.opAtomAssigns.bizEntities;
    }

    saveAssign(bizAssign: BizAssign, id: number, value: any) {
        return this.opAtomAssigns.save(bizAssign, id, value);
    }

    get searchAtoms() {
        return this.opAtomAssigns.search;
    }
}
