import { BudRadio } from "app/Biz";
import { RadioAsync } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { EditBudTemplateProps } from "./model";
import { BudCheckEditValue, BudCheckValue } from "tonwa-app";

export function EditBudIntOf(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const { id, readonly, plus, value: initValue, budEditing, ViewValueEdit: ValueEdit } = props;
    const { bizBud, error } = budEditing;
    const { budDataType, caption, name } = bizBud;
    let { options: { items } } = budDataType as BudRadio;

    const initCheckValue: BudCheckEditValue = {};
    for (let v of initValue as BudCheckValue) {
        initCheckValue[v] = true;
    }
    let checks: { [item: number]: boolean; } = initCheckValue;
    let radios: [item: string | number, caption: string, value: string | number, defaultCheck: boolean,][] = []
    let hasChecked = false;
    for (let item of items) {
        let { id, name, caption, value } = item;
        let c: boolean = checks[id];
        if (c === true) {
            hasChecked = true;
        }
        radios.push([id, caption ?? name, value, c]);
    }
    if (hasChecked === false) {
        (radios[0])[3] = true;
    }
    async function onCheckChanged(item: string | number) {
        const { id: phraseId } = bizBud;
        const value = items.find(v => v.id === item).value;
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
        {...budEditing}
    >
        <RadioAsync name={name} items={radios} onCheckChanged={onCheckChanged} />
    </ValueEdit>;
}
