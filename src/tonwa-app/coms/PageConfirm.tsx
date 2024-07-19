import { useModal } from "tonwa-app/UqAppBase";
import { Page } from "./page";
import { ViewMessage } from "./ViewMessage";

interface PageConfirmProps {
    auth?: boolean;
    header: string;
    message: string | JSX.Element;
    yes: string;
    no?: string;
};

export function PageConfirm({ auth, header, message, yes, no }: PageConfirmProps) {
    const modal = useModal();
    return <Page auth={auth} header={header}>
        <ViewMessage message={message}>
            <button className="btn btn-primary me-3" onClick={() => modal.close(true)}>{yes}</button>
            {no && <button className="btn btn-outline-primary" onClick={() => modal.close(false)}>{no}</button>}
        </ViewMessage>
    </Page>;
}
