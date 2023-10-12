import { RegisterOptions } from "react-hook-form";
import { LabelRowEdit, PickProps, UqAppBase } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useState } from "react";
import { EditBudAtom } from "./EditBudAtom";
import { EditBudRadio } from "./EditBudRadio";
// import { EditBudProps, ViewBudProps } from "../model";
import { pickValue } from "./PagePickValue";
import { EditBudCheck } from "./EditBudCheck";
import { EditBudString, EditBudInt, EditBudDec, EditBudDate } from "./EditBudValue";
import { EditBudIntOf } from "./EditBudIntOf";
import { EnumBudType } from "app/Biz";
import { EditBudProps, EditBudTemplateProps, ViewBudProps } from "./model";
import { InlineEdit, LabelRowEdit as LabelRowEditHere } from "./LabelRowEdit";

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

export function EditBudLabelRow(editProps: EditBudProps) {
    const ValueEdit = LabelRowEditHere
    return EditBud({ ...editProps, ValueEdit });
}

export function EditBudInline(editProps: EditBudProps) {
    const ValueEdit = InlineEdit;
    return EditBud({ ...editProps, ValueEdit });
}

function EditBud(editProps: EditBudTemplateProps) {
    const { bizBud } = editProps;
    const { type } = bizBud.budDataType;
    switch (type) {
        default:
            return <>unknown bud type {type} {EnumBudType[type]} </>;
        case EnumBudType.int:
            return <EditBudInt {...editProps} />;
        case EnumBudType.char:
        case EnumBudType.str:
            return <EditBudString {...editProps} />;
        case EnumBudType.dec:
            return <EditBudDec {...editProps} />;
        case EnumBudType.radio:
            return <EditBudRadio {...editProps} />;
        case EnumBudType.check:
            return <EditBudCheck{...editProps} />;
        case EnumBudType.intof:
            return <EditBudIntOf{...editProps} />;
        case EnumBudType.atom:
            return <EditBudAtom {...editProps} />;
        case EnumBudType.date:
            return <EditBudDate {...editProps} />;
    }
}

