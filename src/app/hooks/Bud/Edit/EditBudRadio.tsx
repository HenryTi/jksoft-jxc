import { BudRadio } from "app/Biz";
import { RadioAsync } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { EditBudTemplateProps } from "./model";
import { Page, useModal } from "tonwa-app";
import { useState } from "react";

export function EditBudRadio(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { id, readonly, value: initValue, bizBud, ViewValueEdit: ValueEdit } = props;
    const { budDataType, caption, name, ui } = bizBud;
    let { options: { items } } = budDataType as BudRadio;
    const [value, setValue] = useState(initValue);
    let checks: { [item: number]: boolean; } = initValue as { [item: string]: boolean; } ?? {};
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
            await modal.open(<Page header={label}>
                <div className="d-flex flex-wrap px-3 py-1">
                    <Radio />
                </div>
            </Page>);
        }
        let optionItem = items.find(v => v.id === value);
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
        await uq.SaveBudRadio.submit({
            budPhrase,
            id,
            optionsItemPhrase,
        });
        setValue(optionsItemPhrase);
    }
    return <ValueEdit label={caption ?? name}
        readonly={readonly}
        onEditClick={onEditClick}
    >
        {content}
    </ValueEdit>;
}
