import { FA, LabelRow } from "tonwa-com";

export interface EditProps {
    label: string | JSX.Element;
    children: React.ReactNode;
    onEditClick: () => void;
    readonly?: boolean;
}

export function LabelRowInput(props: EditProps) {
    let { label, children, onEditClick, readonly } = props;
    let right: any = <span className="p-3">&nbsp;</span>;
    if (onEditClick !== null) {
        if (readonly !== true) {
            right = <div onClick={onEditClick} className="cursor-pointer p-3"><FA name="pencil" className="text-info" /></div>;
        }
    }
    return <LabelRow {...props}>
        {label}
        <div className="ms-3 position-relative">{children}</div>
        {right}
    </LabelRow>;
}
