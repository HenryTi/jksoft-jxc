export interface INameValues {
    identifier(name: string): string | number;
    member(name0: string, name1: string): string | number;
}

export interface IValues {
    id: number;
    member(name1: string): string | number | { id?: number; };
}

export class NameValues implements INameValues {
    private readonly namedValues: { [name: string]: IValues | string | number } = {};
    /*
    constructor(values: any) {
        if (values === null || typeof values !== 'object') debugger;
        this.values = values;
    }
    */
    // simple object, has only data member
    addObj(name: string, obj: any) {
        this.namedValues[name] = new Values(obj);
    }

    addValues(name: string, values: IValues) {
        this.namedValues[name] = values;
    }

    identifier(name: string): string | number {
        let ret = this.namedValues[name];
        if (typeof ret === 'object') {
            return ret.id;
        }
        return ret;
    }
    member(name0: string, name1: string): string | number {
        let obj = this.namedValues[name0];
        if (typeof obj !== 'object') return;
        let ret = obj.member(name1);
        // let ret = obj[name1];
        if (typeof ret === 'object') return ret.id;
        return ret;
    }
}

class Values implements IValues {
    private readonly values: any;
    constructor(values: any) {
        this.values = values;
    }
    get id(): number { return this.values?.id }
    member(name1: string): string | number | { id?: number; } {
        return this.values?.[name1];
    }
}
