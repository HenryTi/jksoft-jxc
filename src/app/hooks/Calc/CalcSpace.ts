export class CalcSpace {
    private readonly roots: object[] = [];
    private readonly namedValues: { [name: string]: object | string | number } = {};
    addValues(name: string, values: object) {
        if (name === undefined) {
            this.roots.push(values);
            // Object.assign(this.namedValues, values);
            return;
        }
        this.namedValues[name] = values;
    }

    setValue(name: string, value: number) {
        this.namedValues[name] = value;
    }

    identifier(name: string): string | number {
        let ret = this.getObj(name);
        if (ret === undefined) return;
        if (typeof ret === 'object') {
            return (ret as any).id;
        }
        return ret;
    }

    member(name0: string, name1: string): string | number {
        let obj = this.getObj(name0); // this.namedValues[name0];
        if (typeof obj !== 'object') return;
        let ret = (obj as any)[name1];
        // let ret = obj[name1];
        if (typeof ret === 'object') return ret.id;
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
}
