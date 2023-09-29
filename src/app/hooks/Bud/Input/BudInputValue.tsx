
import { EditBudProps } from "../../model";
import { useModal } from "tonwa-app";
import { useState } from "react";
import { LabelRowInput } from "./LabelRowInput";
import { useUqApp } from "app/UqApp";
import { PagePickValue } from "./PagePickValue";

type ConvertToBudValue = (value: any) => { int: number; dec: number; str: string; };

function BudInputValue(props: EditBudProps & { type: string; convertToBudValue: ConvertToBudValue }) {
    const { uq } = useUqApp();
    const { openModal } = useModal();
    const { id, readonly, value: initValue, bizBud, type, convertToBudValue, options } = props;
    const [value, setValue] = useState<string | number>(initValue as string | number);
    const { caption, name } = bizBud;
    const label = caption ?? name;
    async function onEditClick() {
        let ret = await openModal<number>(<PagePickValue label={label} value={value as number} type={type} options={options} />);
        let budValue = convertToBudValue(ret);
        await uq.SaveBudValue.submit({
            phraseId: bizBud.id,
            id,
            ...budValue
        });
        setValue(ret);
    }
    return <LabelRowInput label={label}
        readonly={readonly}
        onEditClick={onEditClick}
    >
        {value}
    </LabelRowInput>;
}

export function BudInputString(props: EditBudProps) {
    function convertToBudValue(value: any) {
        return {
            int: undefined as number,
            dec: undefined as number,
            str: value,
        }
    }
    return <BudInputValue {...props} type="text" convertToBudValue={convertToBudValue} />;
}

export function BudInputInt(props: EditBudProps) {
    function convertToBudValue(value: any) {
        return {
            int: value,
            dec: undefined as number,
            str: undefined as string,
        }
    }
    return <BudInputValue {...props} type="number" convertToBudValue={convertToBudValue} />;
}

export function BudInputDec(props: EditBudProps) {
    function convertToBudValue(value: any) {
        return {
            int: undefined as number,
            dec: value,
            str: undefined as string,
        }
    }
    return <BudInputValue {...props} type="number" convertToBudValue={convertToBudValue} />;
}
