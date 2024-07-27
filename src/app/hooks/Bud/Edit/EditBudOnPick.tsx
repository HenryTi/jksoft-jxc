import { BudID } from "app/Biz";
import { EditBudTemplateProps } from "./model";
import { ViewAtomId } from "../../BizAtom";
import { useState } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewSpecId } from "app/coms/ViewSpecId";

export function EditBudOnPick(props: EditBudTemplateProps & { onPick: () => number | Promise<number>; }) {
    const { id, onPick, readOnly, labelSize, flag, value: initValue, budEditing, ViewValueEdit: ValueEdit, onChanged } = props;
    const { budsEditing, bizBud } = budEditing;
    const [value, setValue] = useState<number>(initValue as number);
    const { caption, name, budDataType } = bizBud;
    const { entityID } = budDataType as BudID;
    const label = caption ?? name;
    async function onEditClick() {
        let atomId: number = await onPick();
        if (atomId === undefined) return;
        if (id !== undefined) {
            await budsEditing.uq.SaveBudValue.submit({
                phraseId: bizBud.id,
                id,
                int: atomId,
                dec: undefined as number,
                str: undefined as string,
            });
        }
        setValue(atomId);
        onChanged?.(bizBud, atomId);
    }
    let vContent: any;
    switch (entityID.bizPhraseType) {
        default: debugger; break;
        case BizPhraseType.atom: vContent = <ViewAtomId id={value} />; break;
        case BizPhraseType.fork: vContent = <ViewSpecId id={value} />; break;
    }
    return <ValueEdit label={label}
        readOnly={readOnly}
        flag={flag}
        labelSize={labelSize}
        onEditClick={onEditClick}
        {...budEditing}
    >
        {vContent}
    </ValueEdit>;
}
