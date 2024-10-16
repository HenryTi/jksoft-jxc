import { theme } from "tonwa-com";
import { FA, Sep } from "tonwa-com";

export function PickRow({ children, label, cn, iconPrefix, cnAngle, cnLabel, message }: {
    children: React.ReactNode;
    label?: string;
    cn?: string; iconPrefix?: string; cnAngle?: string; cnLabel?: string;
    message?: string | JSX.Element;
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
    let vContent: any;
    if (message === undefined) {
        vContent = children;
    }
    else {
        let vMessage: any;
        if (typeof message === 'string') {
            vMessage = <div className="text-danger small">{message}</div>;
        }
        else {
            vMessage = message;
        }
        vContent = <>
            <div>{children}</div>
            {vMessage}
        </>;
    }
    return <>
        <div className={theme.bootstrapContainer}>
            <div className="row">
                <div className={cnLabelContainer}>
                    {vLabel}
                </div>
                <div className={' col ' + (cn ?? '')}>
                    {vContent}
                </div>
            </div>
        </div>
        <Sep />
    </>;
}
