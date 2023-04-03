import { Entity } from "./Entity";

export class EntityItem extends Entity {
    async searchItemsWithSettings(key: string, settingsPhrase: string, pageStart: any, pageSize: number): Promise<any[]> {
        const searchParam = {
            item: this.phrase,
            key,
            names: settingsPhrase,
        }
        let result = await this.uq.SearchItemSettings.page(searchParam, pageStart, pageSize);
        //return this.uq.SearchItemSettings;
        let { $page: ret, props } = result;
        let coll: { [id: number]: any } = {};
        for (let row of ret) {
            coll[row.id] = row;
            (row as any).settings = {};
        }
        for (let row of props) {
            let { id, prop, propName } = row;
            let name = this.getBizSettingName(propName);
            let item = coll[id];
            let { settings } = item;
            settings[name] = row.value;
        }
        return ret;
    }

    private getBizSettingName(propFullName: string): string {
        let p = propFullName.lastIndexOf('.');
        let name = propFullName.substring(p + 1);
        return name;
    }

    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'states': this.fromStates(val); break;
        }
    }

    protected fromStates(states: any[]) {

    }
}

