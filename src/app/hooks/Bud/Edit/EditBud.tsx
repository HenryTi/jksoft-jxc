import { EditBudAtom } from "./EditBudAtom";
import { EditBudRadio } from "./EditBudRadio";
import { EditBudCheck } from "./EditBudCheck";
import { EditBudString, EditBudInt, EditBudDec, EditBudDate } from "./EditBudValue";
import { BizBud, EnumBudType } from "app/Biz";
import { EditBudProps, EditBudTemplateProps } from "./model";
import { LabelRowEdit } from "./LabelRowEdit";
import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";
import { InlineEdit } from "./InlineEdit";
import { BudsEditing } from "app/hooks/BudsEditing";
import { EditBudOnPick } from "./EditBudOnPick";

export function EditBudLabelRow(editProps: EditBudProps) {
    const ValueEdit = LabelRowEdit
    return EditBud({ ...editProps, ViewValueEdit: ValueEdit });
}

export class BudEditing {
    private readonly budsEditing: BudsEditing;
    readonly bizBud: BizBud;
    readonly required: boolean;
    error = atom<string>(undefined as string);

    constructor(budsEditing: BudsEditing, bizBud: BizBud, required: boolean = undefined) {
        this.budsEditing = budsEditing;
        this.bizBud = bizBud;
        this.required = required === undefined ?
            this.bizBud.ui?.required
            : required;
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

    calcValue(formula: string) {
        return this.budsEditing.calcValue(formula);
    }

    getOnPick() {
        return this.budsEditing.getOnPick(this.bizBud);
    }
}

export function EditBudInline(editProps: EditBudProps) {
    const ValueEdit = InlineEdit;
    return EditBud({ ...editProps, ViewValueEdit: ValueEdit });
}

function EditBud(editProps: EditBudTemplateProps) {
    const { budEditing } = editProps;
    const { bizBud: { budDataType } } = budEditing;
    const onPick = budEditing.getOnPick();
    if (onPick !== undefined) {
        return <EditBudOnPick {...editProps} onPick={onPick} />;
    }
    const { type } = budDataType;
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
        case EnumBudType.atom:
            return <EditBudAtom {...editProps} />;
        case EnumBudType.date:
            return <EditBudDate {...editProps} />;
    }
}

