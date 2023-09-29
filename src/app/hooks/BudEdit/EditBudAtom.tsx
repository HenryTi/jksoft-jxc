import { IDView, PickProps, UqAppBase, useModal } from "tonwa-app";
import { BudAtom } from "app/Biz";
import { EnumAtom } from "uqs/UqDefault";
import { EditBudValue } from "./model";
import { RegisterOptions } from "react-hook-form";
import { useUqApp } from "app/UqApp";
import { ViewAtomId, useSelectAtom } from "../BizAtom";

import { EditBudProps } from "../model";
import { LabelRowEdit } from "./LabelRowEdit";
import { useState } from "react";

export function EditBudAtom(props: EditBudProps) {
    const { uq } = useUqApp();
    const { id, readonly, value: initValue, bizBud, options } = props;
    const [value, setValue] = useState<number>(initValue as number);
    const { caption, name, budDataType } = bizBud;
    const { bizAtom } = budDataType as BudAtom;
    const label = caption ?? name;
    const selectAtom = useSelectAtom();
    async function onEditClick() {
        let ret = await selectAtom(bizAtom.name); // openModal<number>(<PageSel label={label} value={value as number} type={type} options={options} />);
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
    return <LabelRowEdit label={label}
        readonly={readonly}
        onEditClick={onEditClick}
    >
        <ViewAtomId id={value} />
    </LabelRowEdit>;
}
