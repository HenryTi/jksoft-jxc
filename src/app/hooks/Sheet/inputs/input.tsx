import { PendInput } from "app/Biz";
import { DivEditProps } from "../BinEditing";

export interface InputProps<T extends PendInput = any> extends DivEditProps {
    binInput: T;
}
