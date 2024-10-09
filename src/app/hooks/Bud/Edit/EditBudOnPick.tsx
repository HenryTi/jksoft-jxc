import { BinPick, BudID } from "app/Biz";
import { EditBudTemplateProps } from "./model";
import { ViewAtomId } from "../../BizAtom";
import { useState } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewSpecId } from "app/coms/ViewSpecId";
import { BinBudsEditing, doBinPick } from "app/hooks/Sheet/store";

export function EditBudOnPick(props: EditBudTemplateProps & { pick: BinPick; }) {
    const { id, pick, readOnly, labelSize, flag, value: initValue, budEditing, ViewValueEdit: ValueEdit, onChanged } = props;
    const { budsEditing, bizBud } = budEditing;
    const [value, setValue] = useState<number>(initValue as number);
    const { caption, budDataType } = bizBud;
    const { entityID } = budDataType as BudID;
    const label = caption;
    async function onEditClick() {
        // let retPick = await onPick();
        let retPick = await doBinPick(budsEditing as BinBudsEditing, pick);
        if (retPick === null || retPick === undefined) return;
        let atomId = retPick as any;
        if (typeof retPick === 'object') {
            atomId = (retPick as any).id;
        }
        if (atomId === undefined) return;
        if (id !== undefined) {
            await entityID.uq.SaveBudValue.submit({
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
