import { BudRadio } from "app/Biz";
import { RadioAsync } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { EditBudTemplateProps } from "./model";
import { BudCheckEditValue, BudCheckValue, Page, useModal } from "tonwa-app";
import { useState } from "react";

export function EditBudRadio(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { id, readonly, plus, value: initValue, budEditing, ViewValueEdit: ValueEdit } = props;
    const { bizBud, error } = budEditing;
    const { budDataType, caption, name, ui } = bizBud;
    let { options: { items } } = budDataType as BudRadio;
    const initCheckValue: BudCheckEditValue = {};
    if (initValue === undefined) {
        initCheckValue[items[0].id] = true;
    }
    else {
        for (let v of initValue as BudCheckValue) {
            initCheckValue[v] = true;
        }
    }
    const [value, setValue] = useState(initCheckValue);
    let checks: BudCheckEditValue = initCheckValue;
    let radios: [item: number, caption: string, value: string | number, defaultCheck: boolean,][] = []
    let hasChecked = false;
    for (let item of items) {
        let { id: itemId, name, caption, value } = item;
        let c: boolean = checks[itemId];
        if (c === true) {
            hasChecked = true;
        }
        radios.push([itemId, caption ?? name, value, c]);
    }
    if (hasChecked === false) {
        (radios[0])[3] = true;
    }

    let onEditClick: () => void;
    let content: any;
    let label = caption ?? name;
    let cnRadio: string;
    if (ui.edit === 'pop') {
        cnRadio = ' w-25 my-2 ';
        onEditClick = async function () {
            function onReturn() {
                modal.close();
            }
            await modal.open(<Page header={label}>
                <div className="d-flex flex-wrap px-3 py-1">
                    <Radio />
                </div>
                <div className="p-3 border-top">
                    <button className="btn btn-primary" onClick={onReturn}>返回</button>;
                </div>
            </Page>);
        }
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
            content = <small className="text-secondary">/</small>;
        }
        else {
            const { caption, name } = optionItem;
            content = caption ?? name;
        }
    }
    else {
        onEditClick = null;
        content = <Radio />;
    }

    function Radio() {
        return <RadioAsync name={name} items={radios} onCheckChanged={onCheckChanged} classNameRadio={cnRadio} />
    }

    async function onCheckChanged(item: number | string) {
        const { id: budPhrase } = bizBud;
        const optionsItemPhrase = item as number;
        if (id !== undefined) {
            await uq.SaveBudRadio.submit({
                budPhrase,
                id,
                optionsItemPhrase,
            });
        }
        setValue({ [optionsItemPhrase]: true });
    }
    return <ValueEdit label={caption ?? name}
        plus={plus}
        readonly={readonly}
        onEditClick={onEditClick}
        {...budEditing}
    >
        {content}
    </ValueEdit>;
}
