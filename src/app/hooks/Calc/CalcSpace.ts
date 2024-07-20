import { CalcIdObj } from "./Calc";

export class CalcSpace {
    private readonly roots: object[] = [];
    private readonly namedValues: { [name: string]: object | string | number } = {};
    addValues(name: string, values: object) {
        if (name === undefined) {
            this.roots.push(values);
            return;
        }
        this.namedValues[name] = values;
    }

    setValue(name: string, value: number) {
        this.namedValues[name] = value;
    }

    identifier(name: string): CalcIdObj {
        let ret = this.getObj(name);
        return ret;
    }

    member(name0: string, name1: string): CalcIdObj {
        let obj = this.getObj(name0); // this.namedValues[name0];
        if (obj === null || typeof obj !== 'object') return;
        let ret = (obj as any)[name1];
        return ret;
        /*
        if (typeof ret === 'object') return ret.id;
        return ret;
        */
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
}
