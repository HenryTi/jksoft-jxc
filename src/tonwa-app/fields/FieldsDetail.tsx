import { OnValuesChanged } from "tonwa-com";
import { PropEdit } from "../coms";
import { createBandsFromFields, FieldsBandsProps } from "./FieldsBands";

interface Props extends FieldsBandsProps {
    className?: string;
    values?: any;
    onValuesChanged?: OnValuesChanged;
    sep?: number | JSX.Element
    children?: React.ReactNode;
}
export function FieldsDetail(props: Props) {
    let { className, values, onValuesChanged, children, sep } = props;
    return <PropEdit className={className} values={values} onValuesChanged={onValuesChanged}>
        {createBandsFromFields(props, sep)}
        {children}
    </PropEdit>;
}
