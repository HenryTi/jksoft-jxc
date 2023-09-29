import { Entity } from "./Entity";

export interface OptionsItem {
    id: number;
    name: string;
    caption: string;
    value: string | number;
    phrase: string;
}

export class EntityOptions extends Entity {
    readonly items: OptionsItem[] = [];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'items': this.fromItems(val); break;
        }
    }

    protected fromItems(items: any[]) {
        this.items.push(...items.map(
            v => {
                return {
                    ...v,
                    phrase: `${this.phrase}.${v.name}`,
                }
            }
        ));
    }
}
