import { Band, BandProps } from '../band';
import { FieldProps } from './field';
import { CharInput } from "./CharInput";

interface StringProps extends FieldProps {
    placeholder?: string;
    maxLength?: number;
}

export function String(props: StringProps) {
    let { placeholder, maxLength } = props;
    return <CharInput placeholder={placeholder} maxLength={maxLength} {...props} />;
}

export function BandString(props: BandProps & StringProps) {
    return <Band {...props}>
        <String {...props} />
    </Band>;
}
