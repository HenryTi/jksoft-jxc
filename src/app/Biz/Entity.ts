import { BizProps } from "./BizProps";

export class Entity extends BizProps {
    get phrase() { return `${this.type}.${this.name}`; }
}
