import { ChangeEvent, useState } from "react";
import { BudCheckEditValue, BudCheckValue, BudValue, Page, useModal } from "tonwa-app";
import { RadioAsync } from "tonwa-com";
import { ViewBudEmpty } from "../tool";
import { EntityOptions, OptionsItem } from "app/Biz";

export type RadioUIType = 'pop' | 'dropdown' | 'radio';

interface Props {
    radioUI: RadioUIType;
    options: EntityOptions;
    value: BudValue;
    onCheckChanged(item: number | string): Promise<void>;
}
export function OptionsRadioAsync({ radioUI, options, value: initValue, onCheckChanged }: Props) {
    const modal = useModal();
    let noBorder: boolean;
    let { name, items, caption } = options;
    const initCheckValue: BudCheckEditValue = {};
    if (initValue === undefined) {
        // initCheckValue[items[0].id] = true;
        let a = 1;
    }
    else if (Array.isArray(initValue) === true) {
        for (let v of initValue as BudCheckValue) {
            initCheckValue[v] = true;
        }
    }
    else {
        initCheckValue[initValue as number] = true;;
    }
    const [value, setValue] = useState(initCheckValue);
    let checks: BudCheckEditValue = value;
    let radios: [item: number, caption: string, value: string | number, defaultCheck: boolean,][] = []
    let checked = false, checkedItem: OptionsItem;
    for (let item of items) {
        let { id: itemId, caption, name, value } = item;
        let c: boolean = checks[itemId];
        if (c === true) {
            checked = true;
            checkedItem = item;
        }
        radios.push([itemId, caption ?? name, value, c]);
    }

    let cnRadio: string;
    let onEditClick = async function () {
        function onReturn() {
            modal.close();
        }
        await modal.open(<Page header={caption}>
            <div className="d-flex flex-wrap px-3 py-1">
                <Radio />
            </div>
            <div className="p-3 border-top">
                <button className="btn btn-primary" onClick={onReturn}>返回</button>
            </div>
        </Page>);
    }

    switch (radioUI) {
        case 'pop':
            return <Pop />;
        case 'dropdown':
            onEditClick = null;
            noBorder = true;
            return <Dropdown />;
        case 'radio':
            onEditClick = null;
            return <Radio />;
    }

    function Radio() {
        return <RadioAsync name={name} items={radios}
            onCheckChanged={onCheckChanged}
            classNameRadio={cnRadio}
        />
    }

    function Pop() {
        cnRadio = ' w-25 my-2 ';
        let vItem: number;
        if (typeof value === 'object') {
            for (let i in value) {
                vItem = Number(i);
            }
        }
        else {
            vItem = value as number;
        }
        let optionItem = items.find(v => v.id === vItem);
        if (optionItem === undefined) {
            return <ViewBudEmpty />;
        }
        const { caption } = optionItem;
        return <>{caption}</>;
    }

    function Dropdown() {
        async function onSelectChange(evt: ChangeEvent<HTMLSelectElement>) {
            let item = evt.currentTarget.value;
            await onCheckChanged(item);
        }
        let defaultValue: any;
        let viewOptions = radios.map((v, index) => {
            let [item, caption, value, defaultCheck] = v;
            if (defaultCheck === true) defaultValue = item;
            return <option key={index} value={item}>{caption}</option>;
        });
        return <select onChange={onSelectChange} defaultValue={defaultValue} className="form-select" >
            <option value={0}>/</option>
            {viewOptions}
        </select>;
    }
}
