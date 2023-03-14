import React, { useRef } from 'react';
import { BandContext, VBandContext } from './BandContext';
import { FA } from '../coms';
import { useBandContainer } from './BandContainer';
import { OptionItem } from '../defines';
import { useAtomValue } from 'jotai';

export enum BandContentType {
    check,      // checkbox
    com,        // component
};

interface BandBaseProps {
    label?: string | JSX.Element;
    labelSize?: number;
    toEdit?: string;
    sep?: number | JSX.Element;
    contentType?: BandContentType;
    rightIcon?: JSX.Element;
    contentContainerClassName?: string;
}

export interface BandProps extends BandBaseProps {
    BandTemplate?: (props: BandTemplateProps) => JSX.Element;
}

export interface BandTemplateProps extends BandBaseProps {
    errors: readonly { readonly name: string; readonly error: string }[];
    memos: string[];
    children: React.ReactNode;
    content: React.ReactNode;
}

export function BandFieldError({ error }: { error: string; }) {
    return <div className="px-2 py-1 small">
        <FA name="exclamation-circle" className="me-2 text-danger" />
        <span className="text-info">{error}</span>
    </div>;
}

export function BandFieldErrors({ errors }: { errors: readonly { readonly name: string; readonly error: string }[] }) {
    if (!errors) return null;
    if (errors.length === 0) return null;
    let arr: string[] = [];
    for (let err of errors) {
        let { error } = err;
        let p = arr.findIndex(v => v === error);
        if (p < 0) arr.push(error);
    }
    return <>
        {arr.map((v, index) => <BandFieldError key={index} error={v} />)}
    </>;
}

export function BandMemo({ memo }: { memo: string | JSX.Element; }) {
    if (typeof (memo) === 'string') {
        return <div className="px-2 py-1 small text-muted">
            <FA name="caret-right" className="me-2" />
            {memo}
        </div>;
    }
    return memo as JSX.Element;
}

export function BandMemos({ memos }: { memos: (string | JSX.Element)[] }) {
    if (!memos) return null;
    return <>{
        memos.map((v, index) => <BandMemo key={index} memo={v} />)
    }</>;
}

function buildMemosFromChildren(children: React.ReactNode) {
    let memos: string[] = [];
    function each(cs: React.ReactNode) {
        React.Children.forEach(cs, c => {
            if (!c) return;
            if (React.isValidElement(c) === false) return;
            let e = c as JSX.Element;
            let { props } = e;
            if (props) {
                let { memo } = props;
                if (memo && typeof memo === 'string') memos.push(memo);
                each(props.children);
            }
        })
    }
    each(children);
    if (memos.length === 0) return;
    return memos;
}

function buildDetailChildren(children: React.ReactNode): [React.ReactNode[], boolean] {
    let readOnly: boolean = true;
    function each(cs: React.ReactNode): React.ReactNode[] {
        let ret: React.ReactNode[] = [];
        React.Children.forEach(cs, c => {
            if ((c as any).type === React.Fragment) {
                debugger;
            }
            if (React.isValidElement(c) === false) {
                ret.push(c);
                return;
            }
            let e = c as JSX.Element;
            let { props } = e;
            if (props) {
                let { key } = e;
                let { name, options } = props;
                if (!(props.readOnly === true)) readOnly = false;
                if (name) {
                    ret.push(<Value key={key} name={name} options={options} />);
                    return;
                }
            }
            if (cs === c) return; // 这里应该不可能的，child 居然 = parent
            ret.push(React.createElement(e.type, props, ...each(e)));
            return;
        });
        return ret;
    };
    return [each(children), readOnly];
}

function Value({ name, options }: { name: string; options?: OptionItem[]; }) {
    let bandContainer = useBandContainer();
    let { defaultNone } = bandContainer;
    let val = bandContainer.getValue(name);
    if (options) {
        if (val) {
            let option = options.find(v => v.value === val);
            if (option) {
                val = option.label;
            }
        }
    }
    return <div className='py-2'>{val ?? defaultNone}</div>;
}

export function Band(props: BandProps & { children: React.ReactNode; }) {
    let { label, labelSize, children, BandTemplate, sep, contentType, toEdit, rightIcon, contentContainerClassName } = props;
    let content = children;
    let bandContainer = useBandContainer();
    labelSize = bandContainer.props.labelSize;
    let memos: string[] | undefined = buildMemosFromChildren(children);
    let { current: band } = useRef(new BandContext(bandContainer, memos));
    let errors = useAtomValue(band.errors);
    if (!bandContainer) {
        return <div>Error: {'<Band /> can only be in <Form />'}</div>;
    }
    BandTemplate = BandTemplate ?? bandContainer.BandTemplate;
    switch (contentType) {
        case BandContentType.com:
            break;
        default:
            if (bandContainer.isDetail === true) {
                switch (contentType) {
                    case BandContentType.check:
                        children = <div className='py-2'>{children}</div>
                        break;
                    default:
                        let [newChildren, readOnly] = buildDetailChildren(children);
                        children = <>{newChildren}</>;
                        if (readOnly === true)
                            band.readOnly = true;
                        else if (bandContainer.readOnly === true) {
                            band.readOnly = true;
                        }
                        break;
                }
            }
            break;
    }
    return <VBandContext.Provider value={band}>
        <BandTemplate label={label} labelSize={labelSize}
            errors={errors} memos={band.memos}
            content={content} sep={sep} contentType={contentType}
            toEdit={toEdit} rightIcon={rightIcon}
            contentContainerClassName={contentContainerClassName}>
            {children}
        </BandTemplate>
    </VBandContext.Provider>;
}

export function BandCom(props: BandProps & { children: React.ReactNode; }) {
    return <Band {...props} contentType={BandContentType.com}>
        {props.children}
    </Band>;
}
