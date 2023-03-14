import * as React from 'react';
import { env } from '../tools';
import { ComAsync } from './ComAsync';

export interface SearchBoxProps {
    className?: string;
    label?: string;
    initKey?: string;
    placeholder?: string;
    buttonText?: string;
    maxLength?: number;
    size?: 'sm' | 'md' | 'lg';
    inputClassName?: string;
    onSearch: (key: string) => Promise<void>;
    onFocus?: () => void;
    allowEmptySearch?: boolean;
}

export function SearchBox(props: SearchBoxProps) {
    let { className, inputClassName, onFocus,
        label, placeholder, buttonText, maxLength, size } = props;

    const [isWaiting, setIsWaiting] = React.useState(false);
    let input = React.useRef(null as HTMLInputElement);
    let button = React.useRef(null as HTMLButtonElement);
    let key: string = null;

    function onChange(evt: React.ChangeEvent<any>) {
        key = evt.target.value;
        if (key !== undefined) {
            key = key.trim();
            if (key === '') key = undefined;
        }
        if (props.allowEmptySearch === true) {
        }
        else {
            button.current.disabled = key === undefined || key.length === 0;
        }
    }
    async function onSubmit(evt: React.FormEvent<any>) {
        evt.preventDefault();
        if (key === null) key = props.initKey || '';
        if (props.allowEmptySearch !== true) {
            if (!key) return;
            if (input.current) input.current.disabled = true;
            if (button.current) button.current.disabled = true;
        }
        setIsWaiting(true);
        await props.onSearch(key);
        if (input.current) input.current.disabled = false;
        if (button.current) button.current.disabled = false;
        setIsWaiting(false);
    }

    let inputSize: string;
    switch (size) {
        default:
        case 'sm': inputSize = 'input-group-sm'; break;
        case 'md': inputSize = 'input-group-md'; break;
        case 'lg': inputSize = 'input-group-lg'; break;
    }
    let autoComplete: string;
    if (env.isMobile === true) autoComplete = 'off';
    return <form className={className} onSubmit={onSubmit} autoComplete={autoComplete}>
        <div className={"input-group " + inputSize}>
            {label && <div className="input-group-addon align-self-center me-2">{label}</div>}
            <input ref={input} onChange={onChange}
                type="text"
                name="key"
                onFocus={onFocus}
                className={'form-control ' + (inputClassName ?? 'border-primary')}
                placeholder={placeholder}
                defaultValue={props.initKey}
                maxLength={maxLength} />
            <div className="input-group-append">
                <button ref={button} className="btn btn-primary position-relative"
                    type="submit"
                    disabled={props.allowEmptySearch !== true}>
                    <i className='fa fa-search' />
                    {buttonText}
                    <ComAsync isWaiting={isWaiting} />
                </button>
            </div>
        </div>
    </form>;
}
