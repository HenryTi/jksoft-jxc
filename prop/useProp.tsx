import { useUqApp } from "app/UqApp";

export interface UsePropReturn {
    loadIDPropId: (IDName: string) => Promise<number>;
    loadIDProps: (IDName: string) => Promise<{ id: number, items: { id: number; }[] }[]>;
    setRadioItem: (propId: number, item: { id: number, name: string, caption: string }) => Promise<void>;
}

export function useProp(): UsePropReturn {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    let caption = '属性';
    let IDPropIds: { [IDName: string]: number } = {};

    async function loadIDPropId(IDName: string): Promise<number> {
        let propId = IDPropIds[IDName];
        if (propId !== undefined) return propId;
        /*
        let { Prop } = this.uq;
        let [ret] = await this.uq.KeyID({ ID: Prop, key: { owner: 0, name: IDName } });
        if (ret === undefined) {
            alert(`${IDName} is not ID`);
            return;
        }
        let { id } = ret as any;
        this.IDPropIds[IDName] = id as number;
        return id as number;
        */
    }

    async function saveIxIDProp(IDName: string, data: any/*Prop*/) {
        /*
        let id = await this.loadIDPropId(IDName);
        let { Prop, IxProp } = this.uq;
        let ret = await this.uq.ActIX({ IX: IxProp, ID: Prop, values: [{ ix: id, xi: { ...data, owner: id } }] });
        return ret;
        */
    }

    async function loadIDProps(IDName: string): Promise<{ id: number, items: { id: number; }[] }[]> {
        let { IxBud } = uq;
        let propTypeId = await loadIDPropId(IDName);
        let [props, propItems] = await Promise.all([
            uq.IX({ IX: IxBud, ix: propTypeId }),
            uq.IX({ IX: IxBud, IX1: IxBud, ix: propTypeId }),
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

    async function setRadioItem(propId: number, item: { id: number, name: string, caption: string }) {
        /*
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
        */
    }

    return {
        loadIDPropId,
        loadIDProps,
        setRadioItem,
    };
}
