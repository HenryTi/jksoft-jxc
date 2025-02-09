import { Biz, EntityOptions } from "tonwa";
import { CalcIdObj } from "./Calc";

export type PickResult = { [prop: string]: number | string | object };

export enum RearPickResultType {
    scalar,
    array,
}

type NamedValue = { [name: string]: string | number; };

interface NamedValues { [name: string]: NamedValue | string | number }

export class ValueSpace {
    private readonly biz: Biz;
    private readonly roots: NamedValue[] = [];
    readonly namedValues: NamedValues = {};

    constructor(biz: Biz) {
        this.biz = biz;
    }

    addValues(name: string, values: NamedValue) {
        if (name === undefined) {
            this.roots.push(values);
            return;
        }
        this.namedValues[name] = values;
    }

    getValue(name: string) {
        let obj = this.getObj(name);
        return obj;
    }

    setValue(name: string, value: any) {
        this.namedValues[name] = value;
    }

    identifier(name: string): CalcIdObj {
        let ret = this.getObj(name);
        return ret;
    }

    member(name0: string, name1: string): CalcIdObj {
        let obj = this.getObj(name0);
        if (obj === null || typeof obj !== 'object') {
            return this.getOptionsItem(name0, name1);
        }
        let ret = (obj as any)[name1];
        return ret;
    }

    private getObj(name: string): any {
        let ret = this.namedValues[name];
        if (ret !== undefined) return ret;
        let len = this.roots.length - 1;
        for (let i = len; i >= 0; i--) {
            let values = this.roots[i];
            ret = (values as any)[name];
            if (ret !== undefined) return ret;
        }
    }

    private getOptionsItem(name0: string, name1: string) {
        let n = name0.substring(1);
        let options = this.biz.entities[n] as EntityOptions;
        if (options === undefined) return;
        let ret = options.items.find(v => v.name === name1);
        return ret?.id;
    }
}
