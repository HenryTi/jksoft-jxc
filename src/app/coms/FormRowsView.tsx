import { HTMLInputTypeAttribute, ReactNode } from "react";
import { UseFormRegisterReturn, FieldErrorsImpl, RegisterOptions, UseFormRegister } from "react-hook-form";

export interface BandProps {
    label?: string | JSX.Element;
    labelClassName?: string;
    labelSize?: number;
    children: ReactNode;
}

export interface BandInputProps {
    label?: string | JSX.Element;
    labelClassName?: string;
    type: HTMLInputTypeAttribute,
    inputProps: UseFormRegisterReturn,
    errors?: Partial<FieldErrorsImpl<{
        [x: string]: any;
    }>>;
    defaultValue?: string;
    right?: string | JSX.Element;
}

function registerOptions(type: HTMLInputTypeAttribute, options: RegisterOptions): RegisterOptions {
    switch (type) {
        default: return options;
        case 'number':
            return Object.assign({}, options, { valueAsNumber: true });
    }
}

export function BandInput(props: BandInputProps) {
    const { label, inputProps, errors, type, defaultValue, labelClassName, right } = props;
    const { name } = inputProps;
    let error = errors[name];
    let cnInput = 'form-control ';
    if (error) cnInput += 'is-invalid';
    let vInput = <input {...inputProps} className={cnInput} type={type} defaultValue={defaultValue} />;
    if (right !== undefined && !error) {
        vInput = <div className="input-group">
            {vInput}
            <span className="input-group-text">{right}</span>
        </div>
    }
    return <Band label={label} labelClassName={labelClassName}>
        {vInput}
        {error && <div className="invalid-feedback mt-1">
            {error.message?.toString()}
        </div>}
    </Band>
}

export function Band({ label, labelClassName, children }: BandProps) {
    labelClassName = labelClassName ?? 'form-label col-sm-2 col-3 text-end';
    return <div className={'mb-3 row'}>
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

export interface FormSubmit extends FormLabel {
    label?: string;
    type: 'submit';
    className?: string;
}

export type FormRow = FormInput | FormBand | FormSubmit | FormRadios | FormSelect;

interface FormProps {
    register: UseFormRegister<any>;
    errors?: Partial<FieldErrorsImpl<{
        [x: string]: any;
    }>>;
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

function FormRowView({ row, register, errors, labelClassName }: FormRowViewProps) {
    const { label, inputs } = row as FormBand;
    if (inputs !== undefined) {
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
                    let newOptions = registerOptions(type, options);
                    <input className="form-check-input me-1" type={type} readOnly={readOnly} {...register(name, newOptions)} />
                    { label ?? name }
                }
            })
        }</Band>
    }

    const { radios } = row as FormRadios;
    if (radios !== undefined) {
        const { name, default: defaultValue, readOnly } = row as FormRadios;
        return <Band label={label}>
            {
                radios.map((v, index) => {
                    const { label, value } = v;
                    return <label key={index} className="form-check-label me-3">
                        <input className="form-check-input me-1"
                            defaultChecked={value === defaultValue}
                            readOnly={readOnly}
                            value={value}
                            type="radio" {...register(name)} />
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

    const { name, type, options, readOnly, right } = row as FormInput;
    switch (type) {
        default:
            let newOptions = registerOptions(type, options);
            return <BandInput label={label} type={type} errors={errors}
                labelClassName={labelClassName}
                inputProps={register(name, newOptions)} defaultValue={options?.value}
                right={right} />;
        case 'submit':
            return <Band>
                <input type="submit" disabled={options?.disabled}
                    readOnly={readOnly}
                    className={(row as FormSubmit).className ?? 'btn btn-primary'}
                    value={(label as string) ?? '提交'} />
            </Band>;
    }
}
