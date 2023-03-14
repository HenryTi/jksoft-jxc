import { useLocation } from "react-router-dom";
import { Login, Logout, Register } from "tonwa-app";
import { LoginTop } from "./LoginTop";
import { PrivacyLink } from './PrivacyLink';

export function AppLogin() {
    const { state } = useLocation();
    return <Login url={state} loginTop={<LoginTop />} privacy={<PrivacyLink />} withBack={false} />;
}

export function AppRegister() {
    return <Register loginTop={<LoginTop />} privacy={<PrivacyLink />} />;
}

export function AppLogout() {
    let onLogout = async () => {
        //alert('logout');
    }
    let resetAll = () => {
        // alert('reset all');
    }
    return <Logout onLogout={onLogout} resetAll={resetAll} />;
}
