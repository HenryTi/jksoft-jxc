import { BizBud, BudAtom, EnumBudType } from "app/Biz";
import { EnumAtom } from "uqs/UqDefault";

export function budFormRow(bud: BizBud, required: boolean = false) {
    const { name, budDataType, caption, defaultValue } = bud;
    const options = {
        required,
        value: defaultValue,
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
            return { name, label: caption ?? name, atom: (budDataType as BudAtom).bizAtom.name as EnumAtom };
    }
}
