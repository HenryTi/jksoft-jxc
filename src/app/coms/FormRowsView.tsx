import { EntityAtomID } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { ViewSpec, useSelectAtom } from "app/hooks";
import { HTMLInputTypeAttribute, ReactNode, useState } from "react";
import {
    UseFormRegisterReturn, FieldErrorsImpl
    , RegisterOptions, UseFormRegister
    , FieldError, UseFormSetError, UseFormClearErrors, UseFormSetValue
} from "react-hook-form";
import { IDView } from "tonwa-app";
import { FA } from "tonwa-com";
import { EnumAtom } from "uqs/UqDefault";

export interface BandProps {
    label?: string | JSX.Element;
    labelClassName?: string;
    labelSize?: number;
    className?: string;
    children: ReactNode;
}

export interface BandInputProps {
    label?: string | JSX.Element;
    labelClassName?: string;
    type: HTMLInputTypeAttribute,
    step?: string;
    inputProps: UseFormRegisterReturn,
    errors?: Partial<FieldErrorsImpl<{
        [x: string]: any;
    }>>;
    defaultValue?: string;
    right?: string | JSX.Element;
}

function registerOptions(type: HTMLInputTypeAttribute, label: string | JSX.Element, options: RegisterOptions): RegisterOptions {
    if (options !== undefined) {
        let required: string;
        if (options.required === true) {
            required = '请输入';
            if (typeof label === 'string') required += label;
        }
        let min: any;
        const { min: vMin } = options;
        if (vMin !== undefined) {
            min = { value: vMin, message: `最小值 ${vMin}` };
        }
        let max: any;
        const { max: vMax } = options;
        if (vMax !== undefined) {
            max = { value: vMax, message: `最大值 ${vMax}` };
        }
        return { ...options, required, min, max };
    }
    switch (type) {
        default: return options;
        case 'number':
            return Object.assign({}, options, { valueAsNumber: true });
    }
}

export function BandInput(props: BandInputProps) {
    const { inputProps, errors, type, step, defaultValue, right, labelClassName } = props;
    let { label } = props;
    const { name } = inputProps;
    let error = errors[name];
    let cnInput = 'form-control ';
    if (error) cnInput += 'is-invalid';
    let vInput = <input {...inputProps} className={cnInput} type={type} step={step} defaultValue={defaultValue} />;
    if (right !== undefined && !error) {
        vInput = <div className="input-group">
            {vInput}
            <span className="input-group-text">{right}</span>
        </div>
    }
    if (type === 'hidden') label = null;
    return <Band label={label} labelClassName={labelClassName}>
        {vInput}
        {error && <div className="invalid-feedback mt-1 ms-2">
            {error.message?.toString()}
        </div>}
    </Band>
}

export function Band({ label, labelClassName, children, className }: BandProps) {
    labelClassName = labelClassName ?? 'form-label col-sm-2 col-3 text-end';
    return <div className={label === null ? 'd-none' : 'row ' + (className ?? 'mb-3')}>
        <label className={labelClassName}>{label}</label>
        <div className={'col'} >
            {children}
        </div>
    </ div>;
}

export interface BandInputsProps {
    label?: string;
    register: UseFormRegister<any>;
    inputs: FormInput[];
}
export function BandInputs({ inputs: checks, register, label }: BandInputsProps) {
    return <Band label={label}>
        {checks.map((v, index) => {
            const { name, label } = v;
            return <label key={index} className="form-check-label me-3">
                <input className="form-check-input me-1" type="checkbox" {...register(name)} />
                {label ?? name}
            </label>;
        })}
    </Band>
}

interface FormLabel {
    label?: string | JSX.Element;
    right?: string | JSX.Element;
}

interface FormLabelName extends FormLabel {
    name: string;
    placeHolder?: string;
    readOnly?: boolean;
}

export interface FormInput extends FormLabelName {
    type: HTMLInputTypeAttribute,
    options?: RegisterOptions,
    step?: string;
}

export interface FormBand extends FormLabel {
    inputs: FormInput[];
}

export interface FormRadios extends FormLabelName {
    default?: string | number;
    radios: { label: string; value: string | number }[];
    options?: RegisterOptions,
}

export interface FormSelect extends FormLabelName {
    multiple?: boolean;
    default?: string | number | boolean;
    items: { label: string; value: string | number }[];
    options?: RegisterOptions,
}

export interface FormAtom extends FormLabelName {
    default?: number;
    atom: EnumAtom;
    options?: RegisterOptions;
    entityAtom?: EntityAtomID;
}

export interface FormSubmit extends FormLabel {
    label?: string | JSX.Element;
    type: 'submit';
    className?: string;
}

export type FormRow = FormInput | FormBand | FormSubmit | FormRadios | FormSelect | FormAtom;

interface FormProps {
    register: UseFormRegister<any>;
    setValue?: UseFormSetValue<any>;
    errors?: Partial<FieldErrorsImpl<{
        [x: string]: any;
    }>>;
    setError?: UseFormSetError<any>;
    clearErrors?: UseFormClearErrors<any>;
    labelClassName?: string;
}

export interface FormRowsViewProps extends FormProps {
    rows: (FormRow)[];
}

export interface FormRowViewProps extends FormProps {
    row: FormRow;
}

export function FormRowsView(props: FormRowsViewProps) {
    let { rows } = props;
    return <>{rows.map((row, index) => <FormRowView key={index} row={row} {...props} />)}</>
}

function FormRowView({ row, register, errors, labelClassName, clearErrors, setValue }: FormRowViewProps) {
    const { label, inputs } = row as FormBand;
    if (register && inputs !== undefined) {
        return <Band label={label} labelClassName={labelClassName}>{
            inputs.map((v, index) => {
                const { label, name, type, options, readOnly } = v;
                if (type === 'checkbox') {
                    return <label key={index} className="form-check-label me-3">
                        <input className="form-check-input me-1"
                            type="checkbox" readOnly={readOnly} {...register(name)} />
                        {label ?? name}
                    </label>;
                }
                else {
                    let newOptions = registerOptions(type, label, options);
                    <input className="form-check-input me-1" type={type} readOnly={readOnly} {...register(name, newOptions)} />
                    { label ?? name }
                }
            })
        }</Band>
    }

    const { radios } = row as FormRadios;
    if (radios !== undefined) {
        const { name, default: defaultValue, readOnly, options } = row as FormRadios;
        return <Band label={label}>
            {
                radios.map((v, index) => {
                    const { label, value } = v;
                    return <label key={index} className="form-check-label me-3">
                        <input className="form-check-input me-1"
                            defaultChecked={value === defaultValue}
                            readOnly={readOnly}
                            value={value}
                            type="radio" {...register(name)}
                            onChange={options?.onChange}
                        />
                        {label ?? name}
                    </label>
                })
            }
        </Band>
    }

    const { items } = row as FormSelect;
    if (items !== undefined) {
        const { name, multiple, default: defaultValue, placeHolder, options, readOnly } = row as FormSelect;
        let error = errors[name];
        let cnInput = 'form-select ';
        if (error) cnInput += 'is-invalid';
        const n = '\n';
        if (options !== undefined) {
            if (options.required === true) {
                options.validate = v => {
                    let ret = v !== n;
                    console.error('select ' + v + ' ret ' + ret);
                    return ret;
                }
            }
        }
        return <Band label={label} labelClassName={labelClassName}>
            <select multiple={multiple} className={cnInput} {...register(name, options)}>
                {
                    defaultValue === undefined &&
                    <option selected={true} disabled={true} value={n}>
                        {placeHolder ?? '请选择' + label}
                    </option>
                }
                {items.map((v, index) => {
                    const { label, value } = v;
                    return <option key={index} value={value} selected={defaultValue === value}>{label}</option>
                })}
            </select>
            {
                error && <div className="invalid-feedback mt-1">
                    {error.message?.toString()}
                </div>
            }
        </Band>
    }

    const { entityAtom, atom, options } = row as FormAtom;
    if (entityAtom !== undefined) {
        return <Band label={label}>
            <ViewSpec id={options.value} />
        </Band>;
    }
    if (atom !== undefined) {
        let { name } = row as FormAtom;
        let error: FieldError = errors[name] as FieldError;
        return <ViewFormAtom row={row as FormAtom} label={label} error={error}
            inputProps={register(name, options)}
            setValue={setValue}
            clearErrors={clearErrors} />;
    }

    const { name, type, readOnly, right, step } = row as FormInput;
    switch (type) {
        default:
            const theLabel = options?.required === true ?
                <b className="text-primary">{label}</b> : label;
            let newOptions = registerOptions(type, label, options);
            return <BandInput label={theLabel} type={type} step={step}
                errors={errors}
                labelClassName={labelClassName}
                inputProps={register(name, newOptions)} defaultValue={options?.value}
                right={right} />;
        case 'submit':
            // readOnly={readOnly}
            return <Band>
                <div className="d-flex">
                    <div className="flex-fill">
                        <button type="submit" disabled={options?.disabled}
                            className={(row as FormSubmit).className ?? 'btn btn-primary'}
                        >
                            {(label as string) ?? '提交'}
                        </button>
                    </div>
                    {(row as FormSubmit).right}
                </div>
            </Band>;
    }
}

function ViewFormAtom({ row, label, error, inputProps, clearErrors, setValue }: {
    row: FormAtom; label: string | JSX.Element;
    setValue: UseFormSetValue<any>;
    error: FieldError;
    // setError: UseFormSetError<any>;
    clearErrors: UseFormClearErrors<any>;
    inputProps: UseFormRegisterReturn,
}) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const selectAtom = useSelectAtom();
    const { name, atom, default: defaultValue, readOnly } = row;
    const [id, setId] = useState<number>(defaultValue);
    async function onSelectAtom() {
        if (readOnly === true) return;
        clearErrors?.(name);
        let ret = await selectAtom(undefined/*atom*/);
        if (ret === undefined) return;
        const { id } = ret;
        setValue(name, id);
        setId(id);
    }
    function ViewAtom({ value }: { value: any }) {
        const { no, ex } = value;
        return <>{ex} &nbsp; <small className="text-muted">{no}</small></>;
    }
    let content: any;
    if (id === undefined && atom !== null) {
        let { placeHolder } = row;
        if (!placeHolder) placeHolder = '点击选择';
        content = <span className="text-black-50"><FA name="hand" /> {placeHolder}</span>;
    }
    else {
        content = <IDView uq={uq} id={id} Template={ViewAtom} />;
    }
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
    return <Band label={label}>
        <div className={cnInput} onClick={onSelectAtom}>
            {content} &nbsp;
            <input name={name} type="hidden" {...inputProps} />
        </div>
        {vError}
    </Band>
}
