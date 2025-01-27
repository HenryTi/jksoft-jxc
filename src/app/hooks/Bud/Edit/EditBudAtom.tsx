import { BudID } from "app/Biz";
import { EditBudTemplateProps } from "./model";
import { useUqApp } from "app/UqApp";
import { ViewAtomId } from "../../BizAtom";
import { useState } from "react";
// import { useIDSelect } from "../../BizPick";
import { BizPhraseType } from "uqs/UqDefault";
import { ViewForkId } from "app/coms/ViewForkId";
import { pickBudID } from "app/hooks/BizPick/pickBudID";
import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";

export function EditBudAtom(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const { id, readOnly, labelSize, flag, value: initValue, budEditing, ViewValueEdit: ValueEdit, onChanged } = props;
    const { bizBud, error } = budEditing;
    const [value, setValue] = useState<number>(initValue as number);
    const { caption, budDataType, atomParams } = bizBud;
    const { entityID } = budDataType as BudID;
    const label = caption;
    const modal = useModal();
    // const IDSelect = useIDSelect();
    async function onEditClick() {
        if (entityID === undefined) {
            alert('查询字段，必须声明Atom类型');
            return;
        }
        let params: any = {};
        if (atomParams !== undefined) {
            for (let i in atomParams) {
                params[i] = budEditing.calcValue(atomParams[i]);
            }
        }
        // let ret = await IDSelect(entityID, params);
        let ret = await pickBudID(modal, budEditing);
        if (ret === undefined) return;
        let atomId = ret === null ? undefined : ret.id;
        if (id !== undefined) {
            await uq.SaveBudValue.submit({
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
    if (entityID !== undefined) {
        switch (entityID.bizPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom: vContent = <ViewAtomId id={value} />; break;
            case BizPhraseType.fork: vContent = <ViewForkId id={value} />; break;
        }
    }
    else {
        vContent = <span className="text-danger">
            <FA name="exclamation-circle" className="me-1" />
            未定义类型
        </span>;
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
