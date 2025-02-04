import { FA } from "tonwa-com";

export interface DivRightButton {
    icon: string;
    color?: string;
    onClick: () => void | Promise<void>;
    label?: string;
    // labelColor?: string;
    className?: string;
}

interface Props {
    className?: string;
    buttonClassName?: string;
    tops: DivRightButton[];
    bottoms: DivRightButton[];
}

export function ViewDivRightButtons({ className, buttonClassName, tops, bottoms }: Props) {
    if (tops === undefined) {
        if (bottoms === undefined) {
            tops = [{
                icon: undefined,
                onClick: undefined,
            }];
        }
        else {
            tops = [];
        }
    }
    buttonClassName = buttonClassName ?? ' px-2 ';
    return <div className={'d-flex flex-column align-items-center border-start ' + (className ?? ' py-2 ')}>
        <>{tops.map((v, index) => <DRB key={index} drb={v} className={buttonClassName} />)}</>
        <div className="flex-fill" />
        <>{bottoms?.map((v, index) => <DRB key={index} drb={v} className={buttonClassName} />)}</>
    </div>
}

function DRB({ drb, className: buttonClassName, size }: { drb: DivRightButton; className: string; size?: string; }) {
    const { icon, color, onClick, label, className } = drb;
    if (onClick !== undefined) buttonClassName += ' cursor-pointer ';
    buttonClassName += ' text-nowrap ';
    return <div className={buttonClassName + (className ?? '')} onClick={onClick} title={label}>
        <FA name={icon} className={color} fixWidth={true} size={size as any} />
    </div>;
    //{label && <span className={' ms-1 ' + (labelColor ?? '')}>{label}</span>}
}
