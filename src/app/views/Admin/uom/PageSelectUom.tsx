import { BudRadio } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { Page, useModal } from "tonwa-app";
import { FA, List, useEffectOnce } from "tonwa-com";
import { Uom, UomType } from "./model";
import { useState } from "react";

const PhraseDiscription = 'atom.uom.discription';
const PhraseType = 'atom.uom.type';

export function PageSelectUom() {
    const { uq } = useUqApp();
    const { openModal, closeModal } = useModal();
    const [uomType, setUomType] = useState<UomType>();
    const [uoms, setUoms] = useState<Uom[]>();
    useEffectOnce(() => {
        (async () => {
            let { $page, budsStr, budsInt } = await uq.SearchAtomBuds.page(
                {
                    key: undefined,
                    phrase: 'atom.uom',
                    budNames: [PhraseDiscription, PhraseType].join('\t')
                },
                undefined, 10000
            );
            let coll: { [id: number]: Uom } = {};
            let uoms: Uom[] = [];
            for (let row of $page) {
                let { id, no, ex } = row;
                let uom: Uom = {
                    id, no, ex, type: 1, discription: undefined,
                }
                coll[id] = uom;
                uoms.push(uom);
            }
            for (let row of budsStr) {
                let { id, phrase, bud, value } = row;
                if (phrase !== PhraseDiscription) continue;
                let uom = coll[id];
                if (uom === undefined) continue;
                uom.discription = value;
            }
            for (let row of budsInt) {
                let { id, phrase, bud, value } = row;
                if (phrase !== PhraseType) continue;
                let uom = coll[id];
                if (uom === undefined) continue;
                uom.type = value;
            }
            let ret = await openModal<UomType>(<PageSelectType />);
            if (ret === undefined) {
                closeModal();
                return;
            }
            let { value: type } = ret;
            setUoms(uoms.filter(v => v.type === type));
            setUomType(ret);
        })();
    });
    function onSelected(item: Uom) {
        closeModal(item);
    }
    function ViewUom({ value }: { value: Uom; }) {
        return <div className="px-3 py-2">
            {JSON.stringify(value)}
        </div>
    }
    if (uomType === undefined) return null;
    let { caption, name, value } = uomType;
    if (!caption) caption = name;
    const none = <div className="px-3 py-2 text-black-50 ">
        <FA name="exclamation-circle" className="text-danger me-2" />
        请先定义{caption}基本单位
    </div>;
    return <Page header={`${caption} - 基本单位`}>
        <div className="px-3 py-2">
            <div>caption: {caption}</div>
            <div>name: {name}</div>
            <div>value: {value}</div>
        </div>
        <List items={uoms} ViewItem={ViewUom} onItemClick={onSelected} none={none} />
    </Page>;
}

function PageSelectType() {
    const { biz, uq } = useUqApp();
    const { closeModal } = useModal();
    useEffectOnce(() => {
        (async () => {
        })();
    });
    let bizUom = biz.entities['uom'];
    let bud = bizUom.buds['type'];
    let budItems = bud.budDataType as BudRadio;
    function ViewBaseUnit({ value }: { value: any[] }) {
        const [name, caption] = value;
        return <div className="px-3 py-2">
            {caption ?? name}
        </div>;
    }
    async function onSelectUom([name, caption, value]: [string, string, string | number]) {
        closeModal({ name, caption, value });
    }
    return <Page header="选择类型">
        <List items={budItems.items} ViewItem={ViewBaseUnit} onItemClick={onSelectUom} />
    </Page>;
}
