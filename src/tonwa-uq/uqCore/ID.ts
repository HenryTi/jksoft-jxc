import { Entity } from "./entity";
import { Field, Uq } from "./uqMan";

abstract class UqIBase extends Entity {
    permitRole: string;
    setPermitRole(role: string) {
        this.permitRole = role;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class UqID<M extends { id?: number }> extends UqIBase {
    get typeName() { return 'id' }
    create: boolean;
    update: boolean;
    owner: boolean;
    keys: Field[];
    async NO(): Promise<string> {
        let ret = await this.uqApi.post('id-no', { ID: this.name });
        return ret;
    };
    protected setKeys() {
        this.keys = this.schema.keys;
    }
    get isGlobal(): boolean {
        return this.schema.global;
    }
    getIdFromObj(value: any): number { return value['id']; }
    valueFromString(str: string): M {
        if (!str) return undefined;
        let ret: M = {} as M;
        this.unpackRow(ret, this.fields, str, 0, 12);
        return ret;
    }
    cacheTuids(defer: number): void { }
    async valueFromId(id: number): Promise<M> {
        let ret = await (this.uq as unknown as Uq).QueryID<M>({
            ID: this,
            id: [id]
        });
        return ret[0];
    }
    async loadValuesFromIds(divName: string, ids: number[]): Promise<M[]> {
        let ret = await (this.uq as unknown as Uq).QueryID<M>({
            IDX: [this],
            id: ids
        });
        return ret;
    }
    cacheTuidFieldValues(value: any): void { }
    unpackTuidIds(values: string[]): any[] { return; }
    unpackJoins(resultMain: any, resultJoins: any[][]): [[string, any], [string, any[]][]] {
        let main = {} as any;
        // let results: any[][] = await this.uqApi.post(`id/${this.name}/${id}`, undefined);
        main = this.unpackStr(resultMain?.value, this.fields, undefined);
        let retJoins: [string, any[]][] = []
        let p = 0;
        let joins: { ID: string; field: string; }[] = this.schema.joins;
        for (let join of joins) {
            let { ID: IDName, field: fieldName } = join;
            let IDJoin = this.uq.entities[IDName] as ID;
            let { fields } = IDJoin;
            let field = fields.find(v => v.name === fieldName);
            let result = resultJoins[p];
            retJoins.push([IDName, result.map(v => this.unpackStr(v.value, fields, field))]);
            ++p;
        }
        return [[this.name, main], retJoins];
    }

    private unpackStr(str: string, fields: Field[], exclude: Field) {
        let ret: any = {};
        let p = 0;
        let ch0 = 0, ch = 0, c = p, i = 0, len = str.length, fLen = fields.length;
        let sep = 12;
        const setFieldValue = () => {
            let f = fields[i];
            if (f === exclude) {
                ++i;
                f = fields[i];
            }
            let { name } = f;
            if (p > c) {
                let v = str.substring(c, p);
                ret[name] = this.to(ret, v, f);
            }
        }
        for (; p < len; p++) {
            ch0 = ch;
            ch = str.charCodeAt(p);
            if (ch === sep) {
                setFieldValue();
                c = p + 1;
                ++i;
                if (i >= fLen) break;
            }
        }
        setFieldValue();
        return ret;
    }
}

export class ID extends UqID<any> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class UqIDX<M> extends UqIBase {
    get typeName() { return 'idx' }
}

export class IDX extends UqIDX<any> {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class UqIX<M> extends UqIBase {
    get typeName() { return 'ix' }
}

export class IX extends UqIX<any> {
}

/* eslint-enable no-unused-vars */
