import { BudRadio } from "app/Biz";
import { RadioAsync } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { EditBudTemplateProps } from "./model";

export function EditBudRadio(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const { id, readonly, value: initValue, bizBud, ValueEdit } = props;
    const { budDataType, caption, name } = bizBud;
    let { options: { items, phrase: optionsPhrase } } = budDataType as BudRadio;

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
    async function onCheckChanged(item: number | string) {
        const { id: budPhrase } = bizBud;
        const optionsItemPhrase = item as number;
        await uq.SaveBudRadio.submit({
            budPhrase,
            id,
            optionsItemPhrase,
            // checked: checked === true ? 1 : 0,
        });
    }
    return <ValueEdit label={caption ?? name}
        readonly={readonly}
        onEditClick={null}
    >
        <RadioAsync name={name} items={radios} onCheckChanged={onCheckChanged} />
    </ValueEdit>;
}
