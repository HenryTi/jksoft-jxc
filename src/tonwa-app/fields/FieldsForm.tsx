import { Form } from "tonwa-com";
import { createBandsFromFields, FieldsBandsProps } from "./FieldsBands";

interface Props extends FieldsBandsProps {
    className?: string;
    values?: any;
    children?: React.ReactNode;
}
export function FieldsForm(props: Props) {
    let { className, values, children } = props;
    return <Form className={className} values={values}>
        {createBandsFromFields(props)}
        {children}
    </Form>;
}
