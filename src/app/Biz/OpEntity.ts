import { BizAtom, BizProp, BizAssign } from "./BizAtom";
import { Entity } from "./Entity";

export abstract class OpEntity<A extends BizAtom> {
    readonly entity: Entity;
    readonly bizAtoms: A[];
    constructor(entity: Entity, atomNames: string[]) {
        this.entity = entity;
        this.bizAtoms = this.bizAtomsFromPhrases(atomNames);
    }

    protected abstract getBizAtoms(): Map<string, A>;

    private bizAtomsFromPhrases(atomNames: string[]): A[] {
        if (atomNames === undefined) return;
        let atoms = this.getBizAtoms();
        return atomNames.map(v => this.bizAtomFromName(atoms, v));
    }
    private bizAtomFromName = (atoms: Map<string, A>, name: string) => {
        for (let [, value] of atoms) {
            if (value.name === name) return value;
        }
        console.error(`'${name}' is not defined in '${this.entity.name}'`);
    }

    protected abstract SearchEntityAtoms(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; buds: any[] }>;
    protected abstract SaveAtom(param: {
        phrase: string; id: number; int: number; dec: number; str: string;
    }): Promise<void>;

    search = async (param: any, pageStart: any, pageSize: number) => {
        const searchParam = {
            atom: this.entity.phrase,
            names: this.bizAtoms?.map(v => v.phrase).join('\t'),
            ...param
        }
        let result = await this.SearchEntityAtoms(searchParam, pageStart, pageSize);
        let { $page: ret, buds } = result;
        let coll: { [id: number]: any } = {};
        for (let row of ret) {
            coll[row.id] = row;
            (row as any).atoms = {};
        }
        let bizAtomes = this.getBizAtoms();
        for (let row of buds) {
            let { id, phrase } = row;
            let bizAtom = bizAtomes.get(phrase);
            let entity = coll[id];
            entity.atoms[bizAtom.name] = row.value;
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
        await this.SaveAtom(param);
    }
}

export class OpAtomProps extends OpEntity<BizProp> {
    protected getBizAtoms(): Map<string, BizProp> { return this.entity.props; }
    protected SearchEntityAtoms(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; buds: any[] }> {
        return this.entity.uq.SearchAtomProps.page(param, pageStart, pageSize);
    }
    protected SaveAtom(param: {
        phrase: string; id: number; int: number; dec: number; str: string;
    }): Promise<void> {
        return this.entity.uq.SaveProp.submit(param);
    }
}

export class OpAtomAssigns extends OpEntity<BizAssign> {
    protected getBizAtoms(): Map<string, BizAssign> { return this.entity.assigns; }
    protected SearchEntityAtoms(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; buds: any[] }> {
        return this.entity.uq.SearchAtomAssigns.page(param, pageStart, pageSize);
    }
    protected SaveAtom(param: {
        phrase: string; id: number; int: number; dec: number; str: string;
    }): Promise<void> {
        return this.entity.uq.SaveAssign.submit(param);
    }
}
