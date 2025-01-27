import { EntityAtom, EntityFork, BizBud, Entity, BudID, BinPick, EnumBudType } from "app/Biz";
import { Atom, atom } from "jotai";
import { HTMLInputTypeAttribute, ReactNode, JSX } from "react";
import {
    UseFormRegisterReturn, FieldErrorsImpl,
    RegisterOptions, UseFormRegister,
    FieldError, UseFormSetError, UseFormClearErrors, UseFormSetValue
} from "react-hook-form";
import { BizPhraseType } from "uqs/UqDefault";
import { contentFromDays, EntityStore } from "app/tool";
import { ViewFormForkObj } from "./ViewFormForkObj";
import { ViewFormAtom } from "./ViewFormAtom";
import { ViewFormAtomFork } from "./ViewFormAtomFork";
import { ViewFormBin } from "./ViewFormBin";

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
    let cnInput = 'form-control form-control-sm ';
    if (error) cnInput += 'is-invalid';
    let vInput = <input defaultValue={defaultValue} {...inputProps} className={cnInput} type={type} step={step} />;
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
    labelClassName = labelClassName ?? 'form-label col-md-2 col-sm-3 col-4 text-end text-body-tertiary mt-1';
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
const cnCheckInput = ' form-check-label me-3 mb-2 w-min-8c ';
export function BandInputs({ inputs: checks, register, label }: BandInputsProps) {
    return <Band label={label}>
        {checks.map((v, index) => {
            const { name, label } = v;
            return <label key={index} className={cnCheckInput}>
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
    onPick?: () => (number | Promise<number>);
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
    bud: BizBud;
    options?: RegisterOptions;
}

export interface FormFork extends FormLabelName {
    default?: number;
    baseBud: BizBud;
}

export interface FormBin extends FormLabelName {
    default?: number;
    bud: BizBud;
}

export interface FormSubmit extends FormLabel {
    label?: string | JSX.Element;
    type: 'submit';
    className?: string;
}

export type FormRow = FormInput | FormBand | FormSubmit | FormRadios | FormSelect | FormAtom | FormFork;

export interface FormContext {
    getTrigger(name: string): Atom<number>;
    getParams(name: string): any;
    getValue(name: string): any;
    getBudValue(bud: BizBud): any;
    getEntityFromId(id: number): Entity;
    getEntity(entityId: number): Entity;
    setBudValue(bud: BizBud, value: any): void;
    store: EntityStore;
    calcValue(formula: string): number | string | object;
    // getOnPick(bud: BizBud): (() => number | Promise<number>);
    getPick(bud: BizBud): BinPick;
}

interface FormProps {
    register: UseFormRegister<any>;
    setValue?: UseFormSetValue<any>;
    errors?: Partial<FieldErrorsImpl<{
        [x: string]: any;
    }>>;
    setError?: UseFormSetError<any>;
    clearErrors?: UseFormClearErrors<any>;
    labelClassName?: string;
    context: FormContext;
}

export interface FormRowsViewProps extends FormProps {
    rows: (FormRow)[];
}

export interface FormRowViewProps extends FormProps {
    // params?: any;        // for FORK base only
    row: FormRow;
}

const emptyAtom = atom(0);
const emptyFormContext: FormContext = {
    getTrigger(name: string) { return emptyAtom; },
    getParams(name: string) { return undefined; },
    getValue(name: string) { return undefined; },
    getBudValue(bud: BizBud) { return undefined; },
    getEntityFromId(id: number): Entity { return undefined; },
    getEntity(entityId: number): Entity { return undefined; },
    setBudValue(bud: BizBud, value: any) { },
    store: undefined,
    calcValue(formula: string): number | string | object { return undefined; },
    // getOnPick(bud: BizBud): (() => number | Promise<number>) { return undefined; },
    getPick(bud: BizBud): BinPick { return undefined; }
}
export function FormRowsView(props: FormRowsViewProps) {
    let { rows, context } = props;
    return <>{rows.map((row, index) => <FormRowView key={index} row={row} {...props} context={context ?? emptyFormContext} />)}</>
}

function FormRowView({ row, register, errors, labelClassName, clearErrors, setValue, context }: FormRowViewProps) {
    const { label, inputs } = row as FormBand;
    if (register && inputs !== undefined) {
        return <Band label={label} labelClassName={labelClassName}>{
            inputs.map((v, index) => {
                const { label, name, type, options, readOnly } = v;
                if (type === 'checkbox') {
                    return <label key={index} className={cnCheckInput}>
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
        const { name, readOnly, options } = row as FormRadios;
        return <Band label={label}>
            {
                radios.map((v, index) => {
                    const { label, value } = v;
                    return <label key={index} className={cnCheckInput}>
                        <input className="form-check-input me-1"
                            defaultChecked={value === options?.value}
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
        const { name, multiple, placeHolder, options, readOnly } = row as FormSelect;
        let error = errors[name];
        let cnInput = 'form-select form-select-sm ';
        if (error) cnInput += 'is-invalid';
        const n = '\n';
        if (options !== undefined) {
            if (options.required === true) {
                options.validate = v => {
                    let ret = v !== n;
                    // console.error('select ' + v + ' ret ' + ret);
                    return ret;
                }
            }
        }
        return <Band label={label} labelClassName={labelClassName}>
            <select multiple={multiple} className={cnInput} {...register(name, options)} defaultValue={options.value}>
                {
                    options.value === undefined &&
                    <option value={n}>
                        {placeHolder ?? '请选择' + label}
                    </option>
                }
                {items.map((v, index) => {
                    const { label, value } = v;
                    return <option key={index} value={value}>{label}</option>
                })}
            </select>
            {
                error && <div className="invalid-feedback mt-1">
                    {error.message?.toString()}
                </div>
            }
        </Band>
    }

    const { bud, options } = row as FormAtom;
    if (bud !== undefined) {
        const { budDataType } = bud;
        if (budDataType.type === EnumBudType.bin) {
            return <ViewFormBin row={row as FormBin} label={label} formContext={context} />
        }

        const { entityID: entityAtom } = budDataType as BudID;
        let { name } = row as FormAtom;
        function onChange(target: { name: string; type: 'number'; value: string | object; }) {
            options?.onChange?.({ target });
        }
        let error: FieldError = errors[name] as FieldError;
        if (entityAtom.bizPhraseType === BizPhraseType.fork) {
            return <ViewFormAtomFork row={row as FormAtom} label={label} error={error}
                entity={entityAtom as EntityFork}
                inputProps={register(name, options)}
                setValue={setValue}
                clearErrors={clearErrors}
                onChange={onChange}
                formContext={context} />;
        }
        return <ViewFormAtom row={row as FormAtom} label={label} error={error}
            entityAtom={entityAtom as EntityAtom}
            inputProps={register(name, options)}
            setValue={setValue}
            clearErrors={clearErrors}
            onChange={onChange}
            formContext={context} />;
    }

    const { baseBud } = row as FormFork;
    if (baseBud !== undefined) {
        let { name } = row as FormFork;
        let error: FieldError = errors[name] as FieldError;
        function onChange(target: { name: string; type: 'text'; value: string | object; }) {
            options?.onChange?.({ target });
        }
        return <ViewFormForkObj row={row as FormFork} label={label} error={error}
            inputProps={register(name, options)}
            setValue={setValue}
            clearErrors={clearErrors}
            onChange={onChange}
            formContext={context} />;
    }

    const { name, type, readOnly, right, step } = row as FormInput;
    function bandLabel() {
        return options?.required === true ?
            <>{label} <span className="text-danger fs-larger">*</span></> : label;

    }
    function buildBandInput() {
        const theLabel = bandLabel();
        let newOptions = registerOptions(type, label, options);
        return <BandInput label={theLabel} type={type} step={step}
            errors={errors}
            labelClassName={labelClassName}
            inputProps={register(name, newOptions)} defaultValue={options?.value}
            right={right} />;
    }
    function buildBandDateInput() {
        let label = bandLabel();
        let error = errors[name];
        let cnInput = 'form-control form-control-sm ';
        if (error) cnInput += 'is-invalid';
        let newOptions = registerOptions(type, label, options);
        let defaultValue = contentFromDays(options?.value);
        newOptions.value = defaultValue;
        if (type === 'hidden') label = null;
        return <Band label={label} labelClassName={labelClassName}>
            <input {...register(name, newOptions)} className={cnInput} type={type} step={step} defaultValue={defaultValue} />
            {error && <div className="invalid-feedback mt-1 ms-2">
                {error.message?.toString()}
            </div>}
        </Band>
    }
    switch (type) {
        default:
            return buildBandInput();
        case 'date':
            return buildBandDateInput();
        case 'submit':
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
