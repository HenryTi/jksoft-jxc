import { Page, useModal } from "tonwa-app";

export function ModalInputPend() {
    const { closeModal } = useModal();
    function onClick() {
        closeModal('待处理 xxx yyy');
    }
    return <Page header="待处理">
        <div className="p-3">
            <button className="btn btn-primary" onClick={onClick}>输入</button>
        </div>
    </Page>
}
