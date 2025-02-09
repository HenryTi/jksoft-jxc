import { useNavigate } from "react-router-dom";
import { FA } from "tonwa-com";
import { PageBackProps } from "./PageProps";

export function ButtonPageBack(props: PageBackProps) {
    let { back, onBack } = props;
    /*
    function Back({ Back }: { Back: (p: { icon: string; }) => JSX.Element }) {
        switch (back) {
            default: return <BackContent icon={back} onClick={undefined} />;
            case 'back': return <Back icon='angle-left' />;
            case 'none': return <div className="py-2 ms-3">&nbsp;</div>;
            case 'close': return <Back icon='close' />;
        }
    }
    */
    function BackContent({ icon, onClick }: { icon: string; onClick: () => void; }) {
        return <div className={'px-3 py-2 cursor-pointer'} onClick={onClick}>
            <FA name={icon} />
        </div>;
    }

    function BackClick({ icon }: { icon: string }) {
        return <BackContent icon={icon} onClick={onBack} />;
    }
    function BackNav({ icon }: { icon: string }) {
        const navigate = useNavigate();
        function onClickBack() {
            navigate(-1);
        }
        return <BackContent icon={icon} onClick={onClickBack} />;
    }
    /*
    if (onBack || back === 'none') {
        return <Back Back={BackClick} />;
    }
    else {
        return <Back Back={BackNav} />;
    }
    */
    if (back === null) return null;
    if (back === undefined) {
        return <BackNav icon='angle-left' />;
        // <BackContent icon={back} onClick={undefined} />;
    }
    if (onBack) {
        return <BackClick icon={back} />;
    }
    switch (back) {
        default: return <div className={'px-3 py-2'}>
            <FA name={back} />
        </div>;
        case 'back': return <BackNav icon='angle-left' />;
        case 'none': return <div className="py-2 ms-3">&nbsp;</div>;
        case 'close': return <BackNav icon='close' />;
    }
}
