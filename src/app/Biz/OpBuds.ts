import { BudType } from "uqs/UqDefault";
import { BizBud } from "./BizBud";
import { Entity } from "./Entity";
// import { EntityAtom } from "./EntityAtom";

export class OpBuds {
    readonly entity: Entity;
    bizBuds: BizBud[];
    budType: BudType;            // budNames必须全是prop，或者全是assign
    constructor(entity: Entity, budNames: string[]) {
        this.entity = entity;
        this.bizBudsFromNames(budNames);
    }
    /*
    protected getBizBuds(): Map<string, BizBud> {
        switch (this.budType) {
            default: throw new Error('unknown budType of OpBuds');
            case BudType.prop: return this.entity.props;
            case BudType.assign: return this.entity.assigns;
        }
    }
    */

    // name: or phrase
    getBizBud(name: string): BizBud {
        let buds: Map<string, BizBud>;
        switch (this.budType) {
            default: throw new Error('unknown budType of OpBuds');
            case BudType.prop: buds = this.entity.props; break;
            case BudType.assign: buds = this.entity.assigns; break;
        }
        return buds.get(name);
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
            this.budType = BudType.prop;
            if (errPropNames.length > 0) {
                throw new Error(`${this.entity.name} has not bud ${errPropNames.join(',')}`);
            }
        }
        else {
            this.bizBuds = bizBuds;
            this.budType = BudType.assign;
            if (errAssignNames.length > 0) {
                throw new Error(`${this.entity.name} has not bud ${errAssignNames.join(',')}`);
            }
        }
        if (this.bizBuds.length !== budNames.length) {
            throw new Error(`bud ${budNames.join(',')} must be all PROP or ASSIGN`);
        }
    }
    private bizBudFromName(bizBuds: Map<string, BizBud>, name: string): BizBud {
        let ln = name.toLowerCase();
        for (let [, value] of bizBuds) {
            let { name: vn } = value;
            if (vn === ln) return value;
            let phrase = `${this.entity.phrase}.${vn}`;
            if (phrase === ln) return value;
        }
        return undefined;
    }

    // protected abstract SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; buds: any[] }>;
    protected SaveBud(param: {
        phrase: string; id: number; int: number; dec: number; str: string;
    }): Promise<void> {
        return this.entity.uq.SaveBud.submit({ ...param, budType: this.budType });
    }
    /*
    search = async (param: any, pageStart: any, pageSize: number) => {
        const searchParam = {
            phrase: this.entity.phrase,
            budType: this.budType,
            names: this.bizBuds?.map(v => v.phrase).join('\t'),
            ...param
        }
        let result = await this.SearchEntityBuds(searchParam, pageStart, pageSize);
        let { $page: ret, buds } = result;
        let coll: { [id: number]: any } = {};
        for (let row of ret) {
            coll[row.id] = row;
            (row as any).buds = {};
        }
        let bizBuds = this.getBizBuds();
        for (let row of buds) {
            let { id, phrase } = row;
            let bizBud = bizBuds.get(phrase);
            let entity = coll[id];
            entity.buds[bizBud.name] = row.value;
        }
        return ret;
    }
    */
    async save(bizBud: BizBud, id: number, budValue: any) {
        let phrase = `${this.entity.phrase}.${bizBud.name}`;
        let int: number, dec: number, str: string;
        switch (bizBud.budDataType.type) {
            case 'int': int = budValue; break;
            case 'dec': dec = budValue; break;
            case 'char': str = budValue; break;
        }
        let param = {
            phrase, budType: this.budType, id, int, dec, str
        };
        await this.SaveBud(param);
    }
}
/*
export class OpAtomBuds extends OpBuds<EntityAtom> {
    protected SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; buds: any[] }> {
        return this.entity.uq.SearchAtomBuds.page(param, pageStart, pageSize);
    }
}
*/