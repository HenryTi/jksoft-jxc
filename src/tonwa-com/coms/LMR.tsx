import * as React from 'react';

interface Props {
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

export function LMR(props: Props) {
    let { className, children, onClick } = props;
    let cn = (className ?? '');
    if (onClick !== undefined) cn += ' cursor-pointer ';
    let arr = React.Children.toArray(children);
    let len = arr.length;
    if (len > 1) {
        arr.splice(len - 1, 0, <div className="flex-fill" />);
    }
    return <div className={'d-flex ' + cn} onClick={onClick}>
        {arr.map((v, index) => <React.Fragment key={index}>{v}</React.Fragment>)}
    </div>;
}
