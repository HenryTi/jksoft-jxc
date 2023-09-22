import { RegisterOptions } from "react-hook-form";
import { LabelRowEdit, PickProps, UqAppBase } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useState } from "react";
import { BudInputAtom } from "./BudInputAtom";
import { BudInputRadio } from "./BudInputRadio";
import { EditBudProps, ViewBudProps } from "../../model";
import { pickValue } from "./PagePickValue";
import { BudInputCheck } from "./BudInputCheck";
import { BudInputString, BudInputInt, BudInputDec } from "./BudInputValue";
import { BudInputIntOf } from "./BudInputIntOf";
import { EnumBudType } from "app/Biz";

interface OpProps {
    saveBud: (newValue: string | number) => Promise<void>;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
}

function ViewBud({ label, name, readonly, type, value: initValue, saveBud, id, pickValue: pickBudValue, ValueTemplate }: ViewBudProps & OpProps) {
    let uqApp = useUqApp();
    let [value, setValue] = useState(initValue);
    async function onValueChanged(value: string | number, checked: boolean) {
        await saveBud(value);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            let item = data.getItem<{ id: number }>(v => v.id === id) as any;
            if (item) item[name] = value;
        }
        setValue(value);
    }
    return <LabelRowEdit label={label}
        value={value} readonly={readonly} type={type}
        onValueChanged={onValueChanged}
        pickValue={pickBudValue === null ? null : pickBudValue ?? pickValue}
        ValueTemplate={ValueTemplate} />
}

export function EditAtomField(props: ViewBudProps) {
    const { id, name, saveField } = props;
    async function saveBudFunc(newValue: string | number) {
        await saveField(id, name, newValue);
    }
    return <ViewBud {...props} saveBud={saveBudFunc} />;
}

export function EditInput(editProps: EditBudProps) {
    const { bizBud } = editProps;
    const { type } = bizBud.budDataType;
    switch (type) {
        default: return <>unknown bud type {type} {EnumBudType[type]} </>;
        case EnumBudType.int: return <BudInputInt {...editProps} />;
        case EnumBudType.char:
        case EnumBudType.str: return <BudInputString {...editProps} />;
        case EnumBudType.dec: return <BudInputDec {...editProps} />;
        case EnumBudType.radio: return <BudInputRadio {...editProps} />;
        case EnumBudType.check: return <BudInputCheck{...editProps} />;
        case EnumBudType.intof: return <BudInputIntOf{...editProps} />;
        case EnumBudType.atom: return <BudInputAtom {...editProps} />;
    }
}
