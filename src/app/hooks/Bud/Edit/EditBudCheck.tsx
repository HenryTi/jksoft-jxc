import { CheckAsync, FA } from "tonwa-com";
import { BudCheck, OptionsItem } from "tonwa";
import { useUqApp } from "app/UqApp";
import { EditBudTemplateProps } from "./model";
import { BudCheckEditValue, BudCheckValue, Page, useModal } from "tonwa-app";
import { useState } from "react";
import { ViewBudEmpty } from "../../tool";

export function EditBudCheck(props: EditBudTemplateProps) {
    const { uq } = useUqApp();
    const modal = useModal();
    const { id, readOnly, labelSize, flag, value: initValue, budEditing, ViewValueEdit: ValueEdit, onChanged } = props;
    const { bizBud } = budEditing;
    const { budDataType, caption, ui } = bizBud;
    const { options: { items } } = budDataType as BudCheck;
    const initCheckValue: BudCheckEditValue = {};
    if (initValue !== undefined) {
        for (let v of initValue as BudCheckValue) {
            initCheckValue[v] = true;
        }
    }
    const [checks, setChecks] = useState(initCheckValue);
    let cn = 'me-4 ';
    if (readOnly === true) cn += 'text-light invisible ';
    async function onCheckChanged(item: OptionsItem, checked: boolean) {
        const { id: budPhrase } = bizBud;
        const optionsItemPhrase = item.id;
        if (id !== undefined) {
            await uq.SaveBudCheck.submit({
                budPhrase,
                id,
                optionsItemPhrase,
                checked: checked === true ? 1 : 0,
            });
        }
        checks[optionsItemPhrase] = checked;
        let valChecks = { ...checks };
        setChecks(valChecks);
        let checksArr: number[] = [];
        for (let i in valChecks) checksArr.push(Number(i));
        onChanged?.(bizBud, checksArr);
    }

    let onEditClick: () => void;
    let content: any;
    let label = caption;
    if (ui?.edit === 'pop') {
        cn += ' w-25 my-1';
        onEditClick = async function () {
            function onReturn() {
                modal.close();
            }
            await modal.open(<Page header={label}>
                <div className="d-flex flex-wrap m-3">
                    <Checks />
                </div>
                <div className="p-3 border-top">
                    <button className="btn btn-primary" onClick={onReturn}>返回</button>
                </div>
            </Page>);
        }
        let arr: string[] = [];
        for (let item of items) {
            let { id, name, caption } = item;
            if (checks[id] === true) arr.push(caption ?? name);
        }
        if (arr.length === 0) {
            content = <ViewBudEmpty />;
        }
        else {
            content = <div className="d-flex flex-wrap py-1">
                {arr.map(v => {
                    return <span key={v} className="me-4 my-1">
                        <FA name="check-circle" className="me-1 text-info small" />
                        {v}
                    </span>
                })}
            </div>
        }
    }
    else {
        onEditClick = null;
        content = <Checks />;
    }

    function Checks() {
        return <>{
            items.map((v, index) => {
                let { id, caption, value, name } = v;
                async function onChange(name: string, checked: boolean) {
                    await onCheckChanged(v, checked);
                }
                return <CheckAsync key={index}
                    className={cn}
                    onCheckChanged={onChange}
                    disabled={readOnly}
                    value={value}
                    defaultChecked={checks[id]}>
                    {caption ?? name}
                </CheckAsync>;
            })}
        </>;
    }

    return <ValueEdit label={caption}
        readOnly={readOnly}
        labelSize={labelSize}
        flag={flag}
        onEditClick={onEditClick}
        {...budEditing}
    >
        {content}
    </ValueEdit>;
}
