import { BizBud, BudAtom, EnumBudType } from "app/Biz";
import { FormRow } from "app/coms";

export function budFormRow(bud: BizBud, required: boolean = false): FormRow {
    const { name, budDataType, caption, valueSet } = bud;
    const options = {
        required,
        value: valueSet,
    }
    switch (budDataType.type) {
        default:
        case EnumBudType.char:
        case EnumBudType.str:
            return { name, label: caption ?? name, type: 'string', options: { ...options, maxLength: 200, } };
        case EnumBudType.int:
            return { name, label: caption ?? name, type: 'number', options };
        case EnumBudType.dec:
            return { name, label: caption ?? name, type: 'number', options };
        case EnumBudType.date:
            return { name, label: caption ?? name, type: 'date', options };
        case EnumBudType.atom:
            return { name, label: caption ?? name, atom: undefined as any, entityAtom: (budDataType as BudAtom).bizAtom };
    }
}
