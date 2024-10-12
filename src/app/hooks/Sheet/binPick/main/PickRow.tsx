import { theme } from "tonwa-com";
import { FA, Sep } from "tonwa-com";

export function PickRow({ children, label, cn, iconPrefix, cnAngle, cnLabel }: {
    children: React.ReactNode;
    label?: string;
    cn?: string; iconPrefix?: string; cnAngle?: string; cnLabel?: string;
}) {
    let cnLabelContainer: string, vLabel: any;
    if (label === null) {
        cnLabelContainer = ' col-3 ';
    }
    else {
        cnLabelContainer = ' col-3 tonwa-bg-gray-1 d-flex align-items-center border-end py-3';
        vLabel = <>
            <FA name={iconPrefix} fixWidth={true} className={'me-2 ' + cnAngle} />
            <div className="flex-fill" />
            <span className={cnLabel}>{label}</span>
        </>;
    }
    return <>
        <div className={theme.bootstrapContainer}>
            <div className="row">
                <div className={cnLabelContainer}>
                    {vLabel}
                </div>
                <div className={' col ' + (cn ?? '')}>
                    {children}
                </div>
            </div>
        </div>
        <Sep />
    </>;
}
