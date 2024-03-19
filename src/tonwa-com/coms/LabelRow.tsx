import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface ContainerProps {
    children: ReactNode;
}
type ContainerType = (props: ContainerProps) => JSX.Element;

// const defaultLeftSize = 3;
// const 
const defaultLabelClassName = ' py-1 tonwa-bg-gray-1 border-end text-secondary '; // small 
const defaultMidClassName = ' border-end ';
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
    labelSize?: 0 | 1 | 2 | 3;
    labelAlign?: 'start' | 'center' | 'end';
    labelClassName?: string;
    LabelContainer?: ContainerType;

    midClassName?: string;
    MidContainer?: ContainerType;

    RightContainer?: ContainerType;
    to?: string;                        // url
    vAlign?: 'top' | 'center' | 'bottom';
}
export interface LabelRowProps extends LabelRowPropsBase {
    children: ReactNode;
}

const cnRowStart = ' row mx-0 gx-0 ';
const cnCol = [
    ['', '', ''],
    [cnRowStart, ' col-3 col-sm-2 ', ' col-9 col-sm-10 '],
    [cnRowStart, ' col-4 col-sm-3 ', ' col-8 col-sm-9 '],
    [cnRowStart, ' col-5 ', ' col-7 '],
];

export function LabelRow({ className, labelSize, labelAlign, labelClassName, LabelContainer, midClassName, MidContainer, RightContainer, vAlign, to, children }: LabelRowProps) {
    labelSize = labelSize ?? 1;
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
    let midEnd: number;
    let right: any;
    if (len > 2) {
        right = <>
            <div className="flex-fill" />
            <RightContainer>{arr[len - 1]}</RightContainer>
        </>;
        midEnd = len - 1;
    }
    else {
        midEnd = 2;
    }
    let [cnRow, cnColLabel, cnColContent] = cnCol[labelSize];
    let midArr: any[] = arr.slice(1, midEnd);
    let cn = cnRow + (className ?? 'bg-white');
    let content = <div className={cn}>
        <div className={cnColLabel + ` d-flex pe-2 text-nowrap text-truncate ${vAlignClassName} ${cnLabelAlign} ${labelClassName}`}>
            <LabelContainer>{arr[0]}</LabelContainer>
        </div>
        <div className={cnColContent + ` gx-0 d-flex ${vAlignClassName} ${midClassName}`}>
            <MidContainer>{midArr.map((v, index) => <React.Fragment key={index}>{v}</React.Fragment>)}</MidContainer>
            {right}
        </div>
    </div>;
    if (to) {
        return <Link to={to}>{content}</Link>;
    }
    else {
        return content;
    }
}
