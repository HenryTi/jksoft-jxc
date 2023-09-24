import { Atom, AtomSpec, AtomUom } from "uqs/UqDefault";
import { IDView } from "tonwa-app";
import { Band } from "app/coms";
import { FA } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { ViewAtom } from "app/hooks";
import { Spec } from "app/tool";

export function ViewAUSAtom({ id }: { id: number; }) {
    const { uq } = useUqApp();
    function Template({ value }: { value: AtomSpec; }) {
        const { atomUom, spec } = value;
        function TemplateAtomUom({ value: { atom, uom } }: { value: AtomUom; }) {
            function TemplateAtom({ value }: { value: Atom }) {
                return <ViewAtom value={value} />;
            }
            return <IDView id={atom} uq={uq} Template={TemplateAtom} />;
        }
        return <IDView id={atomUom} uq={uq} Template={TemplateAtomUom} />;
    }
    return <IDView id={id} uq={uq} Template={Template} />;
}
