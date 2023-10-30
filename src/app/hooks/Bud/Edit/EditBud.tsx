import { EditBudAtom } from "./EditBudAtom";
import { EditBudRadio } from "./EditBudRadio";
import { EditBudCheck } from "./EditBudCheck";
import { EditBudString, EditBudInt, EditBudDec, EditBudDate } from "./EditBudValue";
import { EditBudIntOf } from "./EditBudIntOf";
import { EnumBudType } from "app/Biz";
import { EditBudProps, EditBudTemplateProps } from "./model";
import { InlineEdit, LabelRowEdit as LabelRowEditHere } from "./LabelRowEdit";

export function EditBudLabelRow(editProps: EditBudProps) {
    const ValueEdit = LabelRowEditHere
    return EditBud({ ...editProps, ViewValueEdit: ValueEdit });
}

export function EditBudInline(editProps: EditBudProps) {
    const ValueEdit = InlineEdit;
    return EditBud({ ...editProps, ViewValueEdit: ValueEdit });
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

