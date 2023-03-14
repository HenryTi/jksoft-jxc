import * as React from 'react';

export interface FAProps {
    name: string;
    className?: string;
    size?: 'lg' | '2x' | '3x' | '4x' | '5x';
    spin?: boolean;
    fixWidth?: boolean;
    border?: boolean;
    pull?: 'left' | 'right';
    pulse?: boolean;
    rotate?: 90 | 180 | 270;
    flip?: 'horizontal' | 'vertical';
    inverse?: boolean;
}

export function FA(props: FAProps) {
    let { name, className, size, spin, fixWidth, border, pull, pulse, rotate, flip, inverse } = props;
    let cn = 'fa';
    if (className) cn += ' ' + className;
    if (name) cn += ' fa-' + name;
    if (size) cn += ' fa-' + size;
    if (fixWidth) cn += ' fa-fw';
    if (border) cn += ' fa-border';
    if (pull) cn += ' fa-pull-' + pull;
    if (spin) cn += ' fa-spin';
    if (pulse) cn += ' fa-pulse';
    if (rotate) cn += ' fa-rotate-' + rotate;
    if (flip) cn += ' fa-flip-' + flip;
    if (inverse) cn += ' fa-inverse';
    return <i className={cn} />
}

export interface StackedFAProps {
    className?: string;
    size?: 'lg';
    children: React.ReactNode;
}
export function StackedFA(props: StackedFAProps) {
    let { className, size, children } = props;
    let cn = 'fa-stack ';
    if (className) cn += className + ' ';
    if (size) cn += ' fa-' + size + ' ';
    return <span className={cn}>
        {children}
    </span>;
}
