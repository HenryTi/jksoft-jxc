import { BudAtom } from "app/Biz";
import { EditBudTemplateProps } from "./model";
import { useUqApp } from "app/UqApp";
import { ViewAtomId, useSelectAtom } from "../../BizAtom";
import { useState } from "react";

export function EditBudAtom(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const { id, readonly, plus, value: initValue, bizBud, ViewValueEdit: ValueEdit } = props;
    const [value, setValue] = useState<number>(initValue as number);
    const { caption, name, budDataType } = bizBud;
    const { bizAtom } = budDataType as BudAtom;
    const label = caption ?? name;
    const selectAtom = useSelectAtom();
    async function onEditClick() {
        let ret = await selectAtom(bizAtom);
        if (ret === undefined) return;
        let atomId = ret.id;
        await uq.SaveBudValue.submit({
            phraseId: bizBud.id,
            id,
            int: atomId,
            dec: undefined as number,
            str: undefined as string,
        });
        setValue(atomId);
    }
    return <ValueEdit label={label}
        readonly={readonly}
        plus={plus}
        onEditClick={onEditClick}
    >
        <ViewAtomId id={value} />
    </ValueEdit>;
}
