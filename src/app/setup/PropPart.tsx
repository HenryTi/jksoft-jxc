import { Part } from "../tool";
import { Prop, PropDataType } from "uqs/UqDefault";

export class PropPart extends Part {
    readonly caption = '属性';
    readonly IDPropIds: { [IDName: string]: number } = {};

    async loadIDPropId(IDName: string): Promise<number> {
        let propId = this.IDPropIds[IDName];
        if (propId !== undefined) return propId;
        let { Prop } = this.uq;
        let [ret] = await this.uq.KeyID({ ID: Prop, key: { owner: 0, name: IDName } });
        if (ret === undefined) {
            alert(`${IDName} is not ID`);
            return;
        }
        let { id } = ret as any;
        this.IDPropIds[IDName] = id as number;
        return id as number;
    }

    async saveIxIDProp(IDName: string, data: Prop) {
        let id = await this.loadIDPropId(IDName);
        let { Prop, IxProp } = this.uq;
        let ret = await this.uq.ActIX({ IX: IxProp, ID: Prop, values: [{ ix: id, xi: { ...data, owner: id } }] });
        return ret;
    }

    async loadIDProps(IDName: string): Promise<{ id: number, items: { id: number; }[] }[]> {
        let { IxProp } = this.uq;
        let propTypeId = await this.loadIDPropId(IDName);
        let [props, propItems] = await Promise.all([
            this.uq.IX({ IX: IxProp, ix: propTypeId }),
            this.uq.IX({ IX: IxProp, IX1: IxProp, ix: propTypeId }),
        ]);

        let ret: { id: number, items: { id: number }[] }[] = [];
        for (let { ix, xi } of props) {
            let items: { id: number }[] = [];
            for (let { ix: ixProp, xi: xiItem } of propItems) {
                if (ixProp !== xi) continue;
                items.push({ id: xiItem });
            }
            if (items.length === 0) items = undefined;
            ret.push({ id: xi, items });
        }
        return ret;
    }

    async setRadioItem(propId: number, item: { id: number, name: string, caption: string }) {
        let { Prop, IxProp } = this.uq;
        let [ret] = await this.uq.ActIX({
            IX: IxProp,
            ID: Prop,
            values: [{
                ix: propId,
                xi: { ...item, owner: propId, type: PropDataType.item }
            }]
        });
        return ret;
    }
}
