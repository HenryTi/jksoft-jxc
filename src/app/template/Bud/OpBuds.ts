import { BizBud } from "../../Biz/BizBud";
import { Entity } from "../../Biz/Entity";
// import { EntityAtom } from "./EntityAtom";

export class OpBuds {
    readonly entity: Entity;
    bizBuds: BizBud[];
    // budType: BudType;            // budNames必须全是prop，或者全是assign
    constructor(entity: Entity, budNames: string[]) {
        this.entity = entity;
        this.bizBudsFromNames(budNames);
    }

    // name: or phrase
    getBizBud(name: string): BizBud {
        let bud = this.entity.propColl[name];
        if (bud !== undefined) return bud;
        bud = this.entity.assignColl[name];
        if (bud !== undefined) return bud;
        throw new Error('unknown budType of OpBuds');
    }

    private bizBudsFromNames(budNames: string[]): BizBud[] {
        if (budNames === undefined) return;
        let { props, assigns } = this.entity;
        let bizProps: BizBud[] = [];
        let errPropNames: string[] = [];
        for (let budName of budNames) {
            let bud = this.bizBudFromName(props, budName);
            if (bud === undefined) errPropNames.push(budName);
            else bizProps.push(bud);
        }
        let bizBuds: BizBud[] = [];
        let errAssignNames: string[] = [];
        for (let budName of budNames) {
            let bud = this.bizBudFromName(assigns, budName);
            if (bud === undefined) errAssignNames.push(budName);
            else bizBuds.push(bud);
        }
        if (bizProps.length > 0) {
            this.bizBuds = bizProps;
            if (errPropNames.length > 0) {
                throw new Error(`${this.entity.name} has not bud ${errPropNames.join(',')}`);
            }
        }
        else {
            this.bizBuds = bizBuds;
            if (errAssignNames.length > 0) {
                throw new Error(`${this.entity.name} has not bud ${errAssignNames.join(',')}`);
            }
        }
        if (this.bizBuds.length !== budNames.length) {
            throw new Error(`bud ${budNames.join(',')} must be all PROP or ASSIGN`);
        }
    }
    private bizBudFromName(bizBuds: BizBud[], name: string): BizBud {
        let ln = name.toLowerCase();
        for (let bud of bizBuds) {
            let { name: vn } = bud;
            if (vn === ln) return bud;
            let phrase = `${this.entity.phrase}.${vn}`;
            if (phrase === ln) return bud;
        }
        return undefined;
    }

    protected SaveBud(param: {
        phrase: string; id: number; int: number; dec: number; str: string;
    }): Promise<void> {
        return this.entity.uq.SaveBud.submit({ ...param });
    }

    async save(bizBud: BizBud, id: number, budValue: any) {
        let phrase = `${this.entity.phrase}.${bizBud.name}`;
        let int: number, dec: number, str: string;
        switch (bizBud.budDataType.type) {
            case 'int': int = budValue; break;
            case 'dec': dec = budValue; break;
            case 'char': str = budValue; break;
        }
        let param = {
            phrase, id, int, dec, str
        };
        await this.SaveBud(param);
    }
}
