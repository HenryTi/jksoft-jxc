interface BIProps {
    name: string;
    className?: string;
    iconClassName?: string;
    compact?: boolean;
}

export function BI({ name, className, iconClassName, compact }: BIProps) {
    let cn = 'd-inline-block ';
    if (compact !== true) {
        cn += 'text-center w-1-5c ';
    }
    if (className !== undefined) {
        cn += className;
    }
    return <div className={cn}>
        <b>
            <i className={`bi-${name} ` + (iconClassName ?? '')} />
        </b>
    </div>;
}