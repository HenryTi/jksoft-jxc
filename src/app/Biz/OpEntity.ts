import { BizProp, BizAssign, BizBud } from "./BizBud";
import { Entity } from "./Entity";
import { EntityAtom } from "./EntityAtom";

export abstract class OpEntity<A extends Entity> {
    readonly entity: Entity;
    readonly bizBuds: BizBud[];
    constructor(entity: Entity, budNames: string[]) {
        this.entity = entity;
        this.bizBuds = this.bizBudsFromPhrases(budNames);
    }

    protected abstract getBizBuds(): Map<string, BizBud>;

    private bizBudsFromPhrases(budNames: string[]): BizBud[] {
        if (budNames === undefined) return;
        let atoms = this.getBizBuds();
        return budNames.map(v => this.bizBudFromName(atoms, v));
    }
    private bizBudFromName = (atoms: Map<string, BizBud>, name: string) => {
        for (let [, value] of atoms) {
            if (value.name === name) return value;
        }
        console.error(`'${name}' is not defined in '${this.entity.name}'`);
    }

    protected abstract SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; buds: any[] }>;
    protected abstract SaveBud(param: {
        phrase: string; id: number; int: number; dec: number; str: string;
    }): Promise<void>;

    search = async (param: any, pageStart: any, pageSize: number) => {
        const searchParam = {
            atom: this.entity.phrase,
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
        let bizAtomes = this.getBizBuds();
        for (let row of buds) {
            let { id, phrase } = row;
            let bizAtom = bizAtomes.get(phrase);
            let entity = coll[id];
            entity.buds[bizAtom.name] = row.value;
        }
        return ret;
    }

    async save(bizAtom: A, id: number, atomValue: any) {
        let phrase = `${this.entity.phrase}.${bizAtom.name}`;
        let int: number, dec: number, str: string;
        switch (bizAtom.type) {
            case 'int': int = atomValue; break;
            case 'dec': dec = atomValue; break;
            case 'char': str = atomValue; break;
        }
        let param = {
            phrase, id, int, dec, str
        };
        await this.SaveBud(param);
    }
}

export class OpAtomProps extends OpEntity<EntityAtom> {
    protected getBizBuds(): Map<string, BizProp> { return this.entity.props; }
    protected SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; buds: any[] }> {
        return this.entity.uq.SearchAtomProps.page(param, pageStart, pageSize);
    }
    protected SaveBud(param: {
        phrase: string; id: number; int: number; dec: number; str: string;
    }): Promise<void> {
        return this.entity.uq.SaveProp.submit(param);
    }
}

export class OpAtomAssigns extends OpEntity<EntityAtom> {
    protected getBizBuds(): Map<string, BizAssign> { return this.entity.assigns; }
    protected SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; buds: any[] }> {
        return this.entity.uq.SearchAtomAssigns.page(param, pageStart, pageSize);
    }
    protected SaveBud(param: {
        phrase: string; id: number; int: number; dec: number; str: string;
    }): Promise<void> {
        return this.entity.uq.SaveAssign.submit(param);
    }
}
