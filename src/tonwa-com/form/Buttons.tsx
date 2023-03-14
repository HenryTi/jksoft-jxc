import React, { useEffect, useRef } from 'react';
import { useBandContainer } from '../band';
import { ButtonAsync, FA } from '../coms';
import { EnumString, resStrings } from '../res';
import { checkRule, FieldItem } from '../fields';
import { useForm } from './FormContext';
import { atom, useAtom, useAtomValue } from 'jotai';

export interface ButtonProps {
    name?: string;
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
}

class SubmitItem implements FieldItem {
    readonly name: string;
    constructor(name: string, disabled: boolean) {
        this.name = name;
    }
    reset(): void {
    }
}

//const submitProxy = proxy({ readOnly: false, disabled: false });

export function Submit({ name, className, children, onSubmit, disabled }: ButtonProps & { onSubmit: (data: any) => Promise<[name: string, err: string][] | string[] | string | void>; }) {
    let form = useForm();
    let [errorResponse, setErrorResponse] = useAtom(form.errorResponse);
    let bandContainer = useBandContainer();
    let { fields, fieldStates } = bandContainer;
    let { current: atomState } = useRef(atom({ readOnly: false, disabled }));
    let fieldState = useAtomValue(name ? fieldStates[name] : atomState);
    className = className ?? 'btn btn-primary';
    children = children ?? <><FA name='share-square-o' /> {resStrings[EnumString.string_submit]}</>;
    useEffect(() => {
        if (name) {
            fields[name] = new SubmitItem(name, disabled);
            Object.assign(fieldStates[name], { readOnly: undefined, disabled });
        }
    }, [fields, fieldStates, name, disabled]);
    async function onClick(evt: React.MouseEvent) {
        evt.preventDefault();
        let { props } = form;
        let { rule } = props;
        let values = form.getValues();
        let errors: string[] = [];
        for (let i in values) {
            checkRule(values[i], rule);
        }
        if (errors.length > 0) {
            setErrorResponse({
                errors,
                hasError: true
            });
        }
        else {
            let ret = await onSubmit(form.getValues());
            if (ret) {
                switch (typeof ret) {
                    default:
                        if (Array.isArray(ret) === true) {
                            for (let item of ret) {
                                if (!item) {
                                    form.clearAllErrors();
                                }
                                else if (Array.isArray(item) === true) {
                                    let [name, err] = item as [name: string, err: string];
                                    form.setError(name, err);
                                }
                                else {
                                    form.setError(undefined, ret as any as string);
                                }
                            }
                        }
                        break;
                    case 'string':
                        form.setError(undefined, ret);
                        break;
                }
            }
            else {
                form.clearAllErrors();
            }
        }
    }
    return <ButtonAsync onClick={onClick}
        disabled={(fieldState.disabled ?? false) || errorResponse.hasError}
        className={className}
    >
        {children}
    </ButtonAsync>;
}

export function Clear({ className, children }: ButtonProps) {
    let form = useForm();
    function onClick(evt: React.MouseEvent) {
        evt.preventDefault();
        form.clearValues();
    }
    return <button onClick={onClick} className={className}>
        {children}
    </button>;
}

export function ClearErrorsButton({ className, children }: ButtonProps) {
    let form = useForm();
    let { hasError } = useAtomValue(form.errorResponse);
    function onClick(evt: React.MouseEvent) {
        evt.preventDefault();
        form.clearAllErrors();
    }
    return <button onClick={onClick} disabled={!hasError} className={className}>
        {children}
    </button>;
}
