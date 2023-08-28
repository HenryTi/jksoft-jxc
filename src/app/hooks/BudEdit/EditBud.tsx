import { RegisterOptions } from "react-hook-form";
import { LabelRowEdit, PickProps, UqAppBase } from "tonwa-app";
import { UqApp, useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { BizBud, BudAtom, BudID, BudInt, BudRadio, BudString } from "app/Biz";
import { useState } from "react";
import { EditBudValue } from "./model";
import { pickBudAtom } from "./pickBudAtom";
import { pickBudID } from "./pickBudID";
import { pickBudRadio } from "./pickBudRadio";
import { ViewPropProps } from "../model";
import { pickBudString } from "./pickBudString";
import { pickBudInt } from "./pickBudInt";
import { pickValue } from "./pickValue";

interface OpProps {
    saveProp: (newValue: string | number) => Promise<void>;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
}

function ViewBud({ label, name, readonly, type, value: initValue, saveProp, id, pickValue: pickBudValue, ValueTemplate }: ViewPropProps & OpProps) {
    let uqApp = useUqApp();
    let [value, setValue] = useState(initValue);
    async function onValueChanged(value: string | number) {
        await saveProp(value);
        let data = uqApp.pageCache.getData<PageMoreCacheData>();
        if (data) {
            let item = data.getItem<{ id: number }>(v => v.id === id) as any;
            if (item) item[name] = value;
        }
        setValue(value);
    }
    return <LabelRowEdit label={label}
        value={value} readonly={readonly} type={type}
        onValueChanged={onValueChanged}
        pickValue={pickBudValue ?? pickValue}
        ValueTemplate={ValueTemplate} />
}

export function EditAtomField(props: ViewPropProps) {
    const { id, name, saveField: savePropMain } = props;
    async function saveProp(newValue: string | number) {
        await savePropMain(id, name, newValue);
    }
    return <ViewBud {...props} saveProp={saveProp} />;
}

export function EditAtomBud(veiwProps: ViewPropProps & { bizBud: BizBud; }) {
    const uqApp = useUqApp();
    let { id, pickValue, ValueTemplate, bizBud, saveBud: savePropEx } = veiwProps;
    async function saveProp(newValue: string | number) {
        await savePropEx(id, bizBud, newValue);
    }
    if (ValueTemplate === undefined) {
        let { pickValue: sysPickValue, ValueTemplate: SysValueTemplate } = pickValueFromBud(uqApp, bizBud, undefined);
        pickValue = sysPickValue;
        ValueTemplate = SysValueTemplate;
    }
    return <ViewBud {...veiwProps} saveProp={saveProp} pickValue={pickValue} ValueTemplate={ValueTemplate} />
}

export function pickValueFromBud(uqApp: UqApp, bizBud: BizBud, options: RegisterOptions): EditBudValue {
    let { name, budDataType } = bizBud;
    switch (budDataType.type) {
        default: return {} as EditBudValue;
        case 'int': return pickBudInt(uqApp, budDataType as BudInt, options);
        case 'str': return pickBudString(uqApp, budDataType as BudString, options);
        case 'radio': return pickBudRadio(uqApp, name, budDataType as BudRadio);
        case 'ID':
        case 'id': return pickBudID(uqApp, budDataType as BudID, options);
        case 'atom': return pickBudAtom(uqApp, budDataType as BudAtom, options);
    }
}
