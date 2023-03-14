import { Band, BandProps } from '../band';
import { FieldProps } from './field';
import { CharInput } from "./CharInput";

interface PasswordProps extends FieldProps {
    placeholder?: string;
    maxLength?: number;
}

export function Password(props: PasswordProps) {
    let { placeholder, maxLength } = props;
    return <CharInput placeholder={placeholder} maxLength={maxLength} {...props} type="password" />;
}

export function BandPassword(props: BandProps & PasswordProps) {
    return <Band {...props}>
        <Password {...props} />
    </Band>;
}
