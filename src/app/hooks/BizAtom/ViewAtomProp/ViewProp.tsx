import { LabelRowEdit, OpenModal, PickProps, useModal } from "tonwa-app";
import { ViewPropProps } from "../useBizAtom";
import { UqApp, useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { BizBud, BudAtom, BudID, BudRadio } from "app/Biz";
import { useState } from "react";
import { EditBudValue } from "./EditBudValue";
import { pickValueForBudAtom } from "./ViewPropAtom";
import { pickValueForBudID } from "./ViewPropID";
import { pickValueForBudRadio } from "./ViewPropRadio";

interface OpProps {
    saveProp: (newValue: string | number) => Promise<void>;
    pickValue?: (props: PickProps) => Promise<string | number>;
}

function ViewProp({ label, name, readonly, value: initValue, saveProp, id, pickValue, ValueTemplate }: ViewPropProps & OpProps) {
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
        value={value} readonly={readonly}
        onValueChanged={onValueChanged}
        pickValue={pickValue}
        ValueTemplate={ValueTemplate} />
}

export function ViewPropMain(props: ViewPropProps) {
    const { id, name, savePropMain } = props;
    async function saveProp(newValue: string | number) {
        await savePropMain(id, name, newValue);
    }
    return <ViewProp {...props} saveProp={saveProp} />
}

export function ViewAtomProp(veiwProps: ViewPropProps & { bizBud: BizBud; }) {
    const uqApp = useUqApp();
    let { id, pickValue, ValueTemplate, bizBud, savePropEx } = veiwProps;
    async function saveProp(newValue: string | number) {
        await savePropEx(id, bizBud, newValue);
    }
    if (ValueTemplate === undefined) {
        let { pickValue: sysPickValue, ValueTemplate: SysValueTemplate } = pickValueFromBudType(uqApp, bizBud);
        pickValue = sysPickValue;
        ValueTemplate = SysValueTemplate;
    }
    return <ViewProp {...veiwProps} saveProp={saveProp} pickValue={pickValue} ValueTemplate={ValueTemplate} />
}

function pickValueFromBudType(uqApp: UqApp, bizBud: BizBud): EditBudValue {
    let { name, budDataType } = bizBud;
    switch (budDataType.type) {
        default: return {} as EditBudValue;
        case 'radio': return pickValueForBudRadio(uqApp, name, budDataType as BudRadio);
        case 'ID':
        case 'id': return pickValueForBudID(uqApp, budDataType as BudID);
        case 'atom': return pickValueForBudAtom(uqApp, budDataType as BudAtom);
    }
}
