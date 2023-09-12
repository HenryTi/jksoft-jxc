import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { PageNextProps } from "./types";

export function NextTop(props: PageNextProps) {
    let { name, caption: propCaption, type } = props;
    return <>
        <div className="m-3 d-flex align-items-center">
            <small className="text-muted w-4c text-end me-3">名称</small><b>{name}</b>
        </div>
        <div className="mb-3 mx-3 d-flex align-items-center">
            <small className="text-muted w-4c text-end me-3">标题</small>
            <div>{propCaption ?? <small className="text-muted">(无)</small>}</div>
        </div>
    </>;
}

export function NextRight() {
    const { closeModal } = useModal();
    function onRemove() {
        closeModal(null);
    }
    return <button className="btn btn-sm btn-primary me-2" onClick={onRemove}>
        <FA name="trash" /> 删除
    </button>;
}
