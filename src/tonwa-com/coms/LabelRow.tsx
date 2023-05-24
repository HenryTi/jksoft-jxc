import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface ContainerProps {
    children: ReactNode;
}
type ContainerType = (props: ContainerProps) => JSX.Element;

const defaultLeftSize = 3;
const defaultLabelClassName = ' py-1 tonwa-bg-gray-1 fw-bold col-form-label border-end';
const defaultMidClassName = ' ';
function DefaultLabelContainer({ children }: ContainerProps) {
    return <>
        {children}
    </>;
}
function DefaultMidContainer({ children }: ContainerProps) {
    return <>
        {children}
    </>;
}
function DefaultRightContainer({ children }: ContainerProps) {
    return <>
        {children}
    </>;
}

export interface LabelRowPropsBase {
    className?: string;
    labelSize?: number;
    labelAlign?: 'start' | 'center' | 'end';
    labelClassName?: string;
    LabelContainer?: ContainerType;

    midClassName?: string;
    MidContainer?: ContainerType;

    RightContainer?: ContainerType;
    to?: string;                        // url
    vAlign?: 'start' | 'center' | 'end';
}
export interface LabelRowProps extends LabelRowPropsBase {
    children: ReactNode;
}

export function LabelRow({ className, labelSize, labelAlign, labelClassName, LabelContainer, midClassName, MidContainer, RightContainer, vAlign, to, children }: LabelRowProps) {
    labelSize = labelSize ?? defaultLeftSize;
    let cnLabelAlign: string;
    if (LabelContainer) {
        cnLabelAlign = '';
    }
    else {
        cnLabelAlign = `justify-content-sm-${labelAlign ?? 'end'}`;
    }
    labelClassName = labelClassName ?? defaultLabelClassName;
    midClassName = midClassName ?? defaultMidClassName;
    let vAlignClassName: string = 'align-items-' + (vAlign ?? 'center');
    let arr = React.Children.toArray(children);
    let len = arr.length;
    if (len < 2) {
        return <div className="text-danger">children count must &gt; 2</div>;
    }
    LabelContainer = LabelContainer ?? DefaultLabelContainer;
    MidContainer = MidContainer ?? DefaultMidContainer;
    RightContainer = RightContainer ?? DefaultRightContainer;
    let midArr: any[] = arr.slice(1, len - 1 + 1);
    let right: any;
    if (len > 2) {
        right = <>
            <div className="flex-fill" />
            <RightContainer>{arr[len - 1]}</RightContainer>
        </>;
    }
    let cn = 'row mx-0 ' + (className ?? 'bg-white');
    let content = <>
        <div className={`col-sm-${labelSize} d-flex ${vAlignClassName} ${cnLabelAlign} ${labelClassName}`}>
            <LabelContainer>{arr[0]}</LabelContainer>
        </div>
        <div className={`col-sm-${12 - labelSize} gx-0 d-flex ${vAlignClassName} ${midClassName}`}>
            <MidContainer>{midArr.map((v, index) => <React.Fragment key={index}>{v}</React.Fragment>)}</MidContainer>
            {right}
        </div>
    </>;
    if (to) {
        return <Link className={cn} to={to}>{content}</Link>;
    }
    else {
        return <div className={cn}>{content}</div>;
    }
}
