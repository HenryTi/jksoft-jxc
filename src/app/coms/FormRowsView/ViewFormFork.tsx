import { EntityAtom, EntityFork } from "app/Biz";
import {
    UseFormRegisterReturn, FieldError, UseFormClearErrors, UseFormSetValue,
    useForm
} from "react-hook-form";
import { Band, FormContext, FormFork, FormRow, FormRowsView } from "./FormRowsView";
import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { ValuesBudsEditing } from "app/hooks";

export function ViewFormFork({ row, label, error, inputProps, formContext }: {
    row: FormFork;
    label: string | JSX.Element;
    setValue: UseFormSetValue<any>;
    error: FieldError;
    clearErrors: UseFormClearErrors<any>;
    inputProps: UseFormRegisterReturn;
    onChange: (props: { name: string; value: string, type: 'number' }) => void;
    formContext: FormContext
}) {
    const modal = useModal();
    const { name, baseBud, readOnly } = row;
    let cnInput = 'form-control ';
    if (readOnly !== true) {
        cnInput += ' cursor-pointer ';
    }
    let vError: any = undefined;
    if (error) {
        cnInput += 'is-invalid'
        vError = <div className="invalid-feedback mt-1">
            {error.message?.toString()}
        </div>;
    }
    let vContent: any;
    let atomId = formContext.getBudValue(baseBud);
    let entityAtom = formContext.getEntityFromId(atomId);
    if (entityAtom === undefined) return null;
    let { fork } = entityAtom as EntityAtom;
    if (fork === undefined) return null;
    vContent = <>baseBud: {baseBud.id} formType: {fork.name}</>
    async function onEdit() {
        let ret = await modal.open(<PageFork fork={fork} />);
        alert(JSON.stringify(ret));
    }
    return <Band label={label}>
        <div className={cnInput} onClick={onEdit}>
            {vContent} &nbsp;
            <input name={name} type="hidden" {...inputProps} />
        </div>
        {vError}
    </Band>
}

function PageFork({ fork }: { fork: EntityFork; }) {
    const modal = useModal();
    const buds = [...fork.keys, ...fork.buds];
    const budsEditing = new ValuesBudsEditing(modal, fork.biz, buds);
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    let rows: FormRow[] = [
        ...budsEditing.buildFormRows(),
        { type: 'submit', label: '提交' },
    ];
    async function onSubmit(data: any) {
        modal.close(data);
    }
    return <Page header={fork.caption}>
        <form onSubmit={handleSubmit(onSubmit)} className={theme.bootstrapContainer + ' my-3 pe-5 '}>
            <FormRowsView rows={rows} {...{ register, errors }} context={budsEditing} />
        </form>
    </Page>;
}
