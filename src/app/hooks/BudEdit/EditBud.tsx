import { RegisterOptions } from "react-hook-form";
import { LabelRowEdit, PickProps, UqAppBase } from "tonwa-app";
import { UqApp, useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { BizBud, BudAtom, BudID, BudInt, BudRadio, BudString } from "app/Biz";
import { useState } from "react";
import { EditBudValue } from "./model";
import { usePickBudAtom } from "./pickBudAtom";
import { usePickBudID } from "./pickBudID";
import { pickBudRadio } from "./pickBudRadio";
import { ViewBudProps } from "../model";
import { pickBudString } from "./pickBudString";
import { pickBudInt } from "./pickBudInt";
import { pickValue } from "./pickValue";

interface OpProps {
    saveBud: (newValue: string | number) => Promise<void>;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
}

function ViewBud({ label, name, readonly, type, value: initValue, saveBud, id, pickValue: pickBudValue, ValueTemplate }: ViewBudProps & OpProps) {
    let uqApp = useUqApp();
    let [value, setValue] = useState(initValue);
    async function onValueChanged(value: string | number) {
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
        pickValue={pickBudValue ?? pickValue}
        ValueTemplate={ValueTemplate} />
}

export function EditAtomField(props: ViewBudProps) {
    const { id, name, saveField } = props;
    async function saveBudFunc(newValue: string | number) {
        await saveField(id, name, newValue);
    }
    return <ViewBud {...props} saveBud={saveBudFunc} />;
}

export function EditAtomBud(veiwProps: ViewBudProps & { bizBud: BizBud; }) {
    let { id, pickValue, ValueTemplate, bizBud, saveBud } = veiwProps;
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
}

export function usePickValueFromBud() {
    const pickBudID = usePickBudID();
    const pickBudAtom = usePickBudAtom();
    return function (bizBud: BizBud, options: RegisterOptions): EditBudValue {
        let { name, budDataType } = bizBud;
        switch (budDataType.type) {
            default: return {} as EditBudValue;
            case 'int': return pickBudInt(budDataType as BudInt, options);
            case 'str': return pickBudString(budDataType as BudString, options);
            case 'radio': return pickBudRadio(name, budDataType as BudRadio);
            case 'ID':
            case 'id': return pickBudID(budDataType as BudID, options);
            case 'atom': return pickBudAtom(budDataType as BudAtom, options);
        }
    }
}
