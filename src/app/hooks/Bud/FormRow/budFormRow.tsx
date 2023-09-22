import { BizBud, BudAtom, EnumBudType } from "app/Biz";
import { EnumAtom } from "uqs/UqDefault";

export function budFormRow(bud: BizBud) {
    const { name, budDataType, caption, defaultValue } = bud;
    switch (budDataType.type) {
        default:
            return { name, label: caption ?? name, type: 'string', options: { value: defaultValue, maxLength: 200, } };
        case EnumBudType.int:
            return { name, label: caption ?? name, type: 'number', options: { value: defaultValue, maxLength: 200, } };
        case EnumBudType.dec:
            return { name, label: caption ?? name, type: 'number', options: { value: defaultValue, maxLength: 200, } };
        case EnumBudType.char:
        case EnumBudType.str:
            return { name, label: caption ?? name, type: 'string', options: { value: defaultValue, maxLength: 200, } };
        case EnumBudType.date:
            return { name, label: caption ?? name, type: 'date', options: { value: defaultValue, maxLength: 200, } };
        case EnumBudType.atom:
            return { name, label: caption ?? name, atom: (budDataType as BudAtom).bizAtom.name as EnumAtom };
    }
}
