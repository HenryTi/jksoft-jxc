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
