import { RegisterOptions } from "react-hook-form";
import { LabelRowEdit, PickProps, UqAppBase } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useState } from "react";
import { EditBudAtom } from "./EditBudAtom";
import { EditBudRadio } from "./EditBudRadio";
import { EditBudProps, ViewBudProps } from "../model";
import { pickValue } from "./PagePickValue";
import { EditBudCheck } from "./EditBudCheck";
import { EditBudString, EditBudInt } from "./EditBudValue";

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

export function EditBud(editProps: EditBudProps) {
    const { bizBud } = editProps;
    switch (bizBud.budDataType.type) {
        default: return <>unkown bud type {bizBud.budDataType.type}</>;
        case 'int': return <EditBudInt {...editProps} />;
        case 'str': return <EditBudString {...editProps} />;
        case 'radio': return <EditBudRadio {...editProps} />;
        case 'check': return <EditBudCheck{...editProps} />;
        case 'atom': return <EditBudAtom {...editProps} />;
    }
    /*
    let { id, pickValue, ValueTemplate, saveBud } = veiwProps;
    const pickValueFromBud = usePickValueFromBud();
    async function saveBudFunc(newValue: string | number) {
        await saveBud(id, bizBud, newValue);
    }
    if (ValueTemplate === undefined) {
        let { pickValue: sysPickValue, ValueTemplate: SysValueTemplate } = pickValueFromBud(bizBud, undefined);
        pickValue = sysPickValue;
        ValueTemplate = SysValueTemplate;
    }
    return <ViewBud {...veiwProps} saveBud={saveBudFunc} pickValue={pickValue} ValueTemplate={ValueTemplate} />
    */
}
