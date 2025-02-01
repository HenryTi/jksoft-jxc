import { ChangeEvent, useState } from "react";
import { RadioAsync } from "tonwa-com";
import { BudCheckEditValue, BudCheckValue, BudValue, Page, useModal } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { EditBudTemplateProps } from "./model";
import { BizBud, BudRadio, OptionsItem } from "../../../Biz";
import { ViewBudEmpty } from "../../../View";

export function EditBudRadio(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { id, readOnly, labelSize, flag, value: initValue, budEditing, ViewValueEdit: ValueEdit, onChanged } = props;
    const { bizBud, error } = budEditing;
    const { budDataType, caption, name, ui } = bizBud;
    let { options: { items } } = budDataType as BudRadio;
    let noBorder: boolean;
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
    if (checked === false) {
        // (radios[0])[3] = true;
    }

    let label = caption;
    let cnRadio: string;
    let onEditClick = async function () {
        function onReturn() {
            modal.close();
        }
        await modal.open(<Page header={label}>
            <div className="d-flex flex-wrap px-3 py-1">
                <Radio />
            </div>
            <div className="p-3 border-top">
                <button className="btn btn-primary" onClick={onReturn}>返回</button>
            </div>
        </Page>);
    }

    function buildContent() {
        if (readOnly === true) {
            if (checkedItem === undefined) {
                return '/';
            }
            const { caption, name } = checkedItem;
            return caption ?? name;
        }
        if (ui !== undefined) {
            switch (ui.edit) {
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
        }
        onEditClick = null;
        noBorder = true;
        return <Dropdown />;
    }
    let content = buildContent();

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
        return <select onChange={onSelectChange} defaultValue={defaultValue} className="form-select form-select-sm " >
            <option value={0}>/</option>
            {viewOptions}
        </select>;
    }

    async function onCheckChanged(item: number | string) {
        const { id: budPhrase } = bizBud;
        const optionsItemPhrase = item as number;
        if (id !== undefined && id !== 0) {
            await uq.SaveBudRadio.submit({
                budPhrase,
                id,
                optionsItemPhrase,
            });
        }
        //let checkItemArr: number[] = [];
        //for (let i in checks) checkItemArr.push(Number(i));
        onChanged?.(bizBud, [optionsItemPhrase]);
        setValue({ [optionsItemPhrase]: true });
    }
    return <ValueEdit label={caption}
        flag={flag}
        labelSize={labelSize}
        readOnly={readOnly}
        onEditClick={onEditClick}
        noBorder={noBorder}
        {...budEditing}
    >
        {content}
    </ValueEdit>;
}

export function ViewBudRadio({ bizBud, value: initValue }: {
    bizBud: BizBud;
    value: BudValue;
}) {
    const { budDataType, caption, name, ui } = bizBud;
    let { options: { items } } = budDataType as BudRadio;
    let cnRadio: string;
    const initCheckValue: BudCheckEditValue = {};
    if (initValue === undefined) {
        initCheckValue[items[0].id] = true;
    }
    else {
        for (let v of initValue as BudCheckValue) {
            initCheckValue[v] = true;
        }
    }
    // const [value, setValue] = useState(initCheckValue);
    let checks: BudCheckEditValue = initCheckValue;
    let radios: [item: number, caption: string, value: string | number, defaultCheck: boolean,][] = []
    let hasChecked = false;
    for (let item of items) {
        let { id: itemId, caption, value } = item;
        let c: boolean = checks[itemId];
        if (c === true) {
            hasChecked = true;
        }
        radios.push([itemId, caption, value, c]);
    }
    if (hasChecked === false) {
        (radios[0])[3] = true;
    }

    async function onCheckChanged(item: number | string) {
        debugger;
        const { id: budPhrase } = bizBud;
        const optionsItemPhrase = item as number;
        // setValue({ [optionsItemPhrase]: true });
    }
    return <RadioAsync name={name} items={radios} onCheckChanged={onCheckChanged} classNameRadio={cnRadio} />
}