import { FormEvent, useRef } from 'react';
import { VBandContainerContext, Band, BandContainerProps, BandFieldErrors, BandMemos, BandTemplateProps } from '../band';
import { FormContext, VFormContext, useForm } from './FormContext';
import { BandFieldError } from '../band';
import { Rule } from '../fields';
import { useAtomValue } from 'jotai';

export interface FormProps extends BandContainerProps {
    rule?: Rule | Rule[];
}

function DefaultBandTemplate(props: BandTemplateProps) {
    let { label, labelSize, children, errors, memos, contentContainerClassName } = props;
    labelSize = labelSize ?? 2;
    let vLabel: any;
    let cnContent = `col-sm-${12 - labelSize} ${contentContainerClassName ?? ''}`;
    if (label) {
        vLabel = <label className={`col-sm-${labelSize} col-form-label text-sm-end`}><b>{label}</b></label>;
    }
    else {
        cnContent += ' offset-sm-2';
    }
    return <div className="mb-3 row bg-white">
        {vLabel}
        <div className={cnContent}>
            {children}
            <BandFieldErrors errors={errors} />
            <BandMemos memos={memos} />
        </div>
    </div>;
}
export function Form(props: FormProps) {
    let { className, children, BandTemplate } = props;
    BandTemplate = BandTemplate ?? DefaultBandTemplate;
    let { current: formContext } = useRef(new FormContext({ ...props, BandTemplate }));
    function onSubmit(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();
    }
    return <VFormContext.Provider value={formContext}>
        <VBandContainerContext.Provider value={formContext}>
            <form className={className} onSubmit={onSubmit}>
                {children}
            </form>
        </VBandContainerContext.Provider>
    </VFormContext.Provider>;
}

export function FormErrors() {
    let form = useForm();
    let { errors } = useAtomValue(form.errorResponse);
    if (!errors) return null;
    return <>
        {errors.map((v, index) => <BandFieldError key={index} error={v} />)}
    </>;
}

export function BandFormErrors() {
    let form = useForm();
    let { errors } = useAtomValue(form.errorResponse);
    if (!errors) return null;
    return <Band>
        {errors.map((v, index) => <BandFieldError key={index} error={v} />)}
    </Band>;
}
