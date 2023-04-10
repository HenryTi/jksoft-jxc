import { BizAssign, BizAtom, OpAtomAssigns } from "app/Biz";
import { GenBizEntity } from "app/tool";

export abstract class GenAssign extends GenBizEntity {
    readonly bizEntityType = 'atom';
    get bizAtom(): BizAtom { return this.biz.atoms[this.bizEntityName]; }
    protected abstract get phrases(): string[];

    private _opAtomAssigns: OpAtomAssigns;
    get opAtomAssigns() {
        if (this._opAtomAssigns === undefined) {
            this._opAtomAssigns = new OpAtomAssigns(this.bizAtom, this.phrases);
        }
        return this._opAtomAssigns;
    };

    get bizAssigns(): BizAssign[] {
        return this.opAtomAssigns.bizBuds;
    }

    saveAssign(bizAssign: BizAssign, id: number, value: any) {
        return this.opAtomAssigns.save(bizAssign, id, value);
    }

    get searchAtoms() {
        return this.opAtomAssigns.search;
    }
}
