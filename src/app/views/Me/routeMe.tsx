import { AppLogout } from "app/brand";
import { Route, Routes } from "react-router-dom";
import { PageChangePassword, UserQuit } from "tonwa-app";
import { PageAbout } from "./PageAbout";
import { PageEditMe } from "./PageEditMe";

export const pathMe = 'me';
export const pathEditMe = 'edit';

const pathIndex = '';
export const pathChangePassword = 'changePassword';
export const pathLogout = 'logout';
export const pathUserQuit = 'quit';
const pathAbout = 'about';

/*
export const routeMe = <>
    <Route path={pathEditMe} element={<OutletEditMe />} />
    <Route path={pathAbout} element={<PageAbout />} />
    <Route path={pathLogout} element={<AppLogout />} />
    <Route path={pathUserQuit} element={<UserQuit />} />
</>;
*/

export const routeMe = <Route path={pathMe + '/*'}>
    <Route path={pathEditMe + '/*'} element={<OutletEditMe />} />
    <Route path={pathAbout} element={<PageAbout />} />
</Route>;

export function OutletEditMe() {
    return <>
        <Routes>
            <Route path="*" element={<PageEditMe />} />
            <Route path={pathChangePassword} element={<PageChangePassword />} />
            <Route path={pathLogout} element={<AppLogout />} />
            <Route path={pathUserQuit} element={<UserQuit />} />
        </Routes>
    </>;
}
