import { useState } from "react";
import { BinPick, BizPhraseType, BudID } from "../../../Biz";
import { EditBudTemplateProps } from "./model";

export function EditBudOnPick(props: EditBudTemplateProps & { pick: BinPick; }) {
    const { id, pick, readOnly, labelSize, flag, value: initValue, formBudsStore, budEditing, ViewValueEdit: ValueEdit, onChanged } = props;
    const { budsEditing, bizBud } = budEditing;
    const [value, setValue] = useState<number>(initValue as number);
    const { caption, budDataType } = bizBud;
    const { entityID } = budDataType as BudID;
    const label = caption;
    async function onEditClick() {
        let retPick: any; // = await doBinPick(formBudsStore, pick);
        if (retPick === null || retPick === undefined) return;
        let atomId = retPick as any;
        if (typeof retPick === 'object') {
            atomId = (retPick as any).id;
        }
        if (atomId === undefined) return;
        if (id !== undefined) {
            await entityID.biz.client.SaveBudValue({
                id: bizBud.id,
                phraseId: id,
                int: atomId,
                dec: undefined as number,
                str: undefined as string,
            });
        }
        setValue(atomId);
        onChanged?.(bizBud, atomId);
    }
    let vContent: any;
    if (entityID === undefined) {
        vContent = value; // 'entityID===undefined';
    }
    else {
        switch (entityID.bizPhraseType) {
            default: debugger; break;
            /*
            case BizPhraseType.atom: vContent = <ViewAtomId id={value} />; break;
            case BizPhraseType.fork: vContent = <ViewForkId id={value} />; break;
            */
        }
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
