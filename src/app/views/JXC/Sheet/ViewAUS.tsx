import { Atom, AtomSpec, AtomUom } from "uqs/UqDefault";
import { IDView } from "tonwa-app";
import { Band } from "app/coms";
import { FA } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { ViewAtom } from "app/views";
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

// id: AtomSpec id
export function ViewUom({ id }: { id: number; }) {
    const { uq } = useUqApp();
    function Template({ value: { atomUom } }: { value: AtomSpec; }) {
        function TemplateAtomUom({ value: { uom } }: { value: AtomUom; }) {
            function TemplateUom({ value }: { value: Atom }) {
                return <>{value.ex}</>;
            }
            if (!uom) {
                return <span className="text-danger"><FA name="times-circle" /> 无计量单位</span>;
            }
            return <IDView id={uom} uq={uq} Template={TemplateUom} />;
        }
        return <IDView id={atomUom} uq={uq} Template={TemplateAtomUom} />;
    }
    return <IDView id={id} uq={uq} Template={Template} />;
}

function useViewSpec(id: number, hasLabel: boolean) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    function Template({ value: { atomUom, spec } }: { value: AtomSpec; }) {
        if (spec === undefined) return null;
        function TemplateAtomUom({ value: { atom } }: { value: AtomUom; }) {
            function TemplateAtom({ value }: { value: Atom; }) {
                let { $phrase } = value as any;
                const gSpec = uqApp.specFromAtom($phrase);
                function TemplateSpec({ value }: { value: Spec; }) {
                    return <gSpec.View value={value} />;
                }
                let content = <IDView id={spec} uq={uq} Template={TemplateSpec} />;
                if (hasLabel === true) {
                    return <div className="container">
                        <Band label={gSpec.caption}>
                            {content}
                        </Band>
                    </div>;
                }
                return content;
            }
            return <IDView id={atom} uq={uq} Template={TemplateAtom} />;
        }
        return <IDView id={atomUom} uq={uq} Template={TemplateAtomUom} />;
    }
    return <IDView id={id} uq={uq} Template={Template} />;
}

export function ViewSpec({ id }: { id: number; }) {
    let ret = useViewSpec(id, false);
    return ret;
}

export function ViewSpecWithLabel({ id }: { id: number; }) {
    let ret = useViewSpec(id, true);
    return ret;
}

export function ViewAtomSpec({ id, className }: { id: number; className?: string; }) {
    return <>
        <div className={className}>
            <ViewAUSAtom id={id} />
        </div>
        <div className={className}>
            <ViewSpec id={id} />
        </div>
    </>;
}
