import { useRef, useState, JSX } from "react";
import { UseFormRegisterReturn, FieldError, UseFormClearErrors, UseFormSetValue } from "react-hook-form";
import { Page, useModal } from "tonwa-app";
import { FA, LabelRow, theme } from "tonwa-com";
import { Band, FormContext, FormFork } from "./FormRowsView";
import { BizBud, EntityAtom, EntityFork } from "../../Biz";
import { StoreEntity } from "../../Store";
import { FormBudsStore, ValuesBudsEditing } from "../../Control/ControlBuds/BinEditing";
import { budContent } from "../Bud";
import { ViewForkAtomBold, ViewForkAtomTitles } from "./ViewForkOfStore";
import { FormBudsEditing } from "./FormBudsEditing";

export function ViewFormForkObj({ row, label, error, inputProps, formContext, setValue, onChange }: {
    row: FormFork;
    label: string | JSX.Element;
    setValue: UseFormSetValue<any>;
    error: FieldError;
    clearErrors: UseFormClearErrors<any>;
    inputProps: UseFormRegisterReturn;
    onChange: (props: { name: string; value: string | object, type: 'text' }) => void;
    formContext: FormContext,
}) {
    const modal = useModal();
    const { name, baseBud, readOnly } = row;
    let defaultValue = formContext.getValue(name);
    const [forkObj, setForkObj] = useState(defaultValue);
    // if (defaultValue === undefined) return null;
    let cnInput = 'form-control form-control-sm ';
    if (readOnly !== true) {
        cnInput += ' cursor-pointer ';
    }
    else {
        cnInput += ' bg-body-secondary';
    }
    let vError: any = undefined;
    if (error) {
        cnInput += 'is-invalid'
        vError = <div className="invalid-feedback mt-1">
            {error.message?.toString()}
        </div>;
    }
    let fork: EntityFork;
    let baseId: number;
    let vContent: any;
    if (baseBud !== undefined && baseBud !== null) {
        baseId = formContext.getBudValue(baseBud);
        let entityAtom = formContext.getEntityFromId(baseId);
        if (entityAtom === undefined) return null;
        fork = (entityAtom as EntityAtom).fork;
        if (fork === undefined) return null;
    }
    else {
        if (forkObj === undefined) return null;
        fork = formContext.getEntity(forkObj.$) as EntityFork;
    }

    if (forkObj === undefined) {
        let { placeHolder } = row;
        if (!placeHolder) placeHolder = '点击输入';
        vContent = <div className={cnInput} onClick={onEdit}>
            <span className="text-black-50"><FA name="hand" /> {placeHolder}</span>
        </div>;
    }
    else {
        const { labelColor } = theme;
        function viewBuds(buds: BizBud[]) {
            return buds.map(v => {
                const { id, caption } = v;
                const value = forkObj[id];
                return <span key={id} className="text-nowrap me-3">
                    <small className={labelColor}>{caption}</small>: {budContent(v, value, formContext.store)}
                </span>;
            });
        }
        const { showKeys, showBuds } = fork;
        vContent = <div className={cnInput} onClick={readOnly === true || fork === undefined ? undefined : onEdit}>
            {viewBuds(showKeys)}
            {viewBuds(showBuds)}
            &nbsp;
            <input name={name} type="hidden" {...inputProps} />
        </div>;
    }
    async function onEdit() {
        let ret = await modal.open(<PageFork fork={fork} value={forkObj} baseId={baseId} store={formContext.store} />);
        if (ret === undefined) return;
        if (setValue !== undefined) {
            setValue(name, JSON.stringify(ret));
        }
        setForkObj(ret);
        onChange?.({ name, value: ret, type: 'text' });
    }
    return <Band label={label}>
        {vContent}
        {vError}
    </Band>
}

function PageFork({ fork, value, baseId, store }: { fork: EntityFork; value: object; baseId: number; store: StoreEntity; }) {
    const modal = useModal();
    const buds = [...fork.keys, ...fork.buds];
    const { current: formBudsStore } = useRef(new FormBudsStore(modal, new ValuesBudsEditing(fork.biz, buds)));
    const { budsEditing } = formBudsStore;
    budsEditing.setNamedValue('%base', baseId);
    budsEditing.initBudValues(value);
    async function onSubmit(data: any) {
        let ret = budsEditing.getResultObject();
        ret.$ = fork.id;
        ret.$base = baseId;
        modal.close(ret);
    }
    return <Page header={fork.caption}>
        <div className="px-3 pt-3">
            <Band>
                <span></span>
                <div>
                    <ViewForkAtomBold id={baseId} store={store} />
                    <ViewForkAtomTitles id={baseId} store={store} />
                </div>
            </Band>
        </div>
        <FormBudsEditing formBudsStore={formBudsStore} onSubmit={onSubmit} className="px-3 pb-3" />
    </Page>;
}
