import { EditBudAtom } from "./EditBudAtom";
import { EditBudRadio } from "./EditBudRadio";
import { EditBudCheck } from "./EditBudCheck";
import { EditBudString, EditBudInt, EditBudDec, EditBudDate } from "./EditBudValue";
import { EditBudIntOf } from "./EditBudIntOf";
import { BizBud, EnumBudType } from "app/Biz";
import { EditBudProps, EditBudTemplateProps, IBudEditing } from "./model";
import { LabelRowEdit as LabelRowEditHere } from "./LabelRowEdit";
import { atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { InlineEdit } from "./InlineEdit";

export function EditBudLabelRow(editProps: EditBudProps) {
    const ValueEdit = LabelRowEditHere
    return EditBud({ ...editProps, ViewValueEdit: ValueEdit });
}

export class BudEditing implements IBudEditing {
    readonly bizBud: BizBud;
    readonly required: boolean;
    error = atom<string>(undefined as string);

    constructor(bizBud: BizBud) {
        this.bizBud = bizBud;
        this.required = this.bizBud.ui.required;
    }

    trigger(value: any) {
        let ok = true;
        if (this.required === true) {
            if (value === undefined) {
                setAtomValue(this.error, '必填项');
                ok = false;
            }
        }
        return ok;
    }
}

export function EditBudInline(editProps: EditBudProps) {
    const ValueEdit = InlineEdit;
    return EditBud({ ...editProps, ViewValueEdit: ValueEdit });
}

function EditBud(editProps: EditBudTemplateProps) {
    const { budEditing: { bizBud } } = editProps;
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

