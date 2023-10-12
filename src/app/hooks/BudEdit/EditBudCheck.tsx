import { CheckAsync } from "tonwa-com";
import { BudCheck, OptionsItem } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { EditBudTemplateProps } from "./model";

export function EditBudCheck(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const { id, readonly, value: initValue, bizBud, ValueEdit } = props;
    const { budDataType, caption, name } = bizBud;
    let { options: { items, phrase: optionsPhrase } } = budDataType as BudCheck;

    let cn = 'me-4 ';
    if (readonly === true) cn += 'text-light invisible ';
    async function onCheckChanged(item: OptionsItem, checked: boolean) {
        const { id: budPhrase } = bizBud;
        const optionsItemPhrase = item.id; // `${optionsPhrase}.${item.name}`;
        await uq.SaveBudCheck.submit({
            budPhrase,
            id,
            optionsItemPhrase,
            checked: checked === true ? 1 : 0,
        });
    }
    let checks: { [item: number]: boolean; } = initValue as { [item: number]: boolean; } ?? {};
    return <ValueEdit label={caption ?? name}
        readonly={readonly}
        onEditClick={null}
    >
        {items.map((v, index) => {
            let { id, name, caption, value } = v;
            async function onChange(name: string, checked: boolean) {
                await onCheckChanged(v, checked);
            }
            return <CheckAsync key={index} className="form-check-input"
                labelClassName={cn}
                onCheckChanged={onChange}
                disabled={readonly}
                value={value}
                defaultChecked={checks[id]}>
                {caption ?? name}
            </CheckAsync>;
        })}
    </ValueEdit>;
}
