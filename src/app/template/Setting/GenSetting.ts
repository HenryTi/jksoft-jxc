import { BizItem, BizPropSetting } from "app/Biz";
import { Gen } from "app/tool";
import { ParamSaveSetting } from "uqs/UqDefault";

export abstract class GenSetting extends Gen {
    abstract get itemName(): string;
    abstract get settingNames(): string[];

    get bizItem(): BizItem {
        return this.biz.items[this.itemName]
    }

    get bizSettings(): BizPropSetting[] {
        let { settings, type, name } = this.bizItem;
        let ret: BizPropSetting[] = [];
        for (let settingName of this.settingNames) {
            let bizSetting = settings.get(settingName);
            if (bizSetting === undefined) {
                throw Error(`'${settingName}' is not a setting of ${type}.${name}`);
            }
            ret.push(bizSetting);
        }
        return ret;
    }

    get settingPhrases(): string {
        let { type, name } = this.bizItem;
        let arr = this.bizSettings.map(v => `${type}.${name}.${v.name}`);
        return arr.join('\t');
    }

    searchItems = async (param: any, pageStart: any, pageSize: number) => {
        let { key } = param;
        let ret = await this.bizItem.searchItemsWithSettings(key, this.settingPhrases, pageStart, pageSize);
        return ret;
    }

    async saveSetting(bizSetting: BizPropSetting, id: number, settingValue: any) {
        let phrase = `${this.bizItem.type}.${this.bizItem.name}.${bizSetting.name}`;
        let int: number, dec: number, str: string;
        switch (bizSetting.type) {
            case 'int': int = settingValue; break;
            case 'dec': dec = settingValue; break;
            case 'char': str = settingValue; break;
        }
        let param: ParamSaveSetting = {
            phrase, id, int, dec, str
        };
        await this.uq.SaveSetting.submit(param as ParamSaveSetting);
    }
}
