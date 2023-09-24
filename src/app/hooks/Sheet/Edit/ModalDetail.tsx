import { Page, PageModal, useModal } from "tonwa-app";

export function ModalDetail() {
    const { closeModal } = useModal();
    function onClick() {
        closeModal();
    }
    return <PageModal header="detail section input">
        <div className="p-3">
            <button className="btn btn-primary" onClick={onClick}>关闭</button>
        </div>
    </PageModal>
}
