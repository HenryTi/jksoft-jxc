import { EditBudAtom } from "./EditBudAtom";
import { EditBudRadio } from "./EditBudRadio";
import { EditBudCheck } from "./EditBudCheck";
import { EditBudString, EditBudInt, EditBudDec, EditBudDate } from "./EditBudValue";
import { BinPick, BizBud, EnumBudType } from "tonwa";
import { EditBudProps, EditBudTemplateProps } from "./model";
import { LabelRowEdit } from "./LabelRowEdit";
import { atom } from "jotai";
import { setAtomValue } from "tonwa-com";
import { InlineEdit } from "./InlineEdit";
import { EditBudOnPick } from "./EditBudOnPick";
import { FormContext } from "app/coms";

export function EditBudLabelRow(editProps: EditBudProps) {
    const ValueEdit = LabelRowEdit
    return EditBud({ ...editProps, ViewValueEdit: ValueEdit });
}

export class BudEditing {
    readonly budsEditing: FormContext;
    readonly bizBud: BizBud;
    readonly required: boolean;
    error = atom<string>(undefined as string);

    constructor(budsEditing: FormContext, bizBud: BizBud, required: boolean = undefined) {
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

    getPick(): BinPick { return this.budsEditing?.getPick(this.bizBud); }

    setBudValue(value: any) {
        this.budsEditing.setBudValue(this.bizBud, value);
    }
}

export function EditBudInline(editProps: EditBudProps) {
    const ValueEdit = InlineEdit;
    return EditBud({ ...editProps, ViewValueEdit: ValueEdit });
}

function EditBud(editProps: EditBudTemplateProps) {
    const { budEditing } = editProps;
    const { bizBud: { budDataType } } = budEditing;
    const pick = budEditing.getPick();
    if (pick !== undefined) {
        return <EditBudOnPick {...editProps} pick={pick} />;
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

