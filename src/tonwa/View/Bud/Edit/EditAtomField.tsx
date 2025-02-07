import { useState } from "react";
import { RegisterOptions } from "react-hook-form";
import { LabelRowEdit, PickProps, UqAppBase } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { pickValue } from "./PagePickValue";
import { ViewBudProps } from "./model";

interface OpProps {
    saveBud: (newValue: string | number) => Promise<void>;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
}

function ViewBud({ label, name, labelSize
    , readonly, type, bold
    , value: initValue, saveBud, id
    , pickValue: pickBudValue, ValueTemplate }: ViewBudProps & OpProps) {
    let uqApp = useUqApp();
    let [value, setValue] = useState(initValue);
    async function onValueChanged(value: string | number, checked: boolean) {
        await saveBud(value);
        /*
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            let item = data.getItem<{ id: number }>(v => v.id === id) as any;
            if (item) item[name] = value;
        }
        */
        setValue(value);
    }
    return <LabelRowEdit label={label} labelSize={labelSize}
        value={value} readonly={readonly} type={type} bold={bold}
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
