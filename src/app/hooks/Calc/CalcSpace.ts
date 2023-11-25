export class CalcSpace {
    private readonly namedValues: { [name: string]: object | string | number } = {};
    addValues(name: string, values: object) {
        if (name === undefined) {
            Object.assign(this.namedValues, values);
            return;
        }
        this.namedValues[name] = values;
    }

    setValue(name: string, value: number) {
        this.namedValues[name] = value;
    }

    identifier(name: string): string | number {
        let ret = this.namedValues[name];
        if (typeof ret === 'object') {
            return (ret as any).id;
        }
        return ret;
    }
    member(name0: string, name1: string): string | number {
        let obj = this.namedValues[name0];
        if (typeof obj !== 'object') return;
        let ret = (obj as any)[name1];
        // let ret = obj[name1];
        if (typeof ret === 'object') return ret.id;
        return ret;
    }
}
