import { BudRadio } from "app/Biz";
import { RadioAsync } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { EditBudTemplateProps } from "./model";
import { BudCheckEditValue, BudCheckValue } from "tonwa-app";

export function EditBudIntOf(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const { id, readonly, plus, value: initValue, bizBud, ViewValueEdit: ValueEdit } = props;
    const { budDataType, caption, name } = bizBud;
    let { options: { items, phrase: optionsPhrase } } = budDataType as BudRadio;

    const initCheckValue: BudCheckEditValue = {};
    for (let v of initValue as BudCheckValue) {
        initCheckValue[v] = true;
    }
    let checks: { [item: string]: boolean; } = initCheckValue;
    let radios: [item: string | number, caption: string, value: string | number, defaultCheck: boolean,][] = []
    let hasChecked = false;
    for (let item of items) {
        let { name, caption, value, phrase } = item;
        let c: boolean = checks[phrase];
        if (c === true) {
            hasChecked = true;
        }
        radios.push([phrase, caption ?? name, value, c]);
    }
    if (hasChecked === false) {
        (radios[0])[3] = true;
    }
    async function onCheckChanged(item: string | number) {
        const { id: phraseId } = bizBud;
        const value = items.find(v => v.phrase === item).value;
        await uq.SaveBudValue.submit({
            phraseId,
            id,
            int: value as number,
            dec: undefined as number,
            str: undefined as string,
        });
    }
    return <ValueEdit label={caption ?? name}
        readonly={readonly}
        plus={plus}
        onEditClick={null}
    >
        <RadioAsync name={name} items={radios} onCheckChanged={onCheckChanged} />
    </ValueEdit>;
}
