import React, { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Page, PageTabsLayout, PageSpinner } from 'tonwa-app';
import { pathMe, routeMe, TabMe } from './Me';
import { pathHome, routeJCX, TabJXC } from './JXC';
import { useUqApp } from 'app/UqApp';
import { AppLogin, AppRegister, routePrivacy } from 'app/brand';
import { useAtomValue } from 'jotai';
import { PageNoSite, routeAdmin } from './Admin';
import { routeSiteAdmin } from './Admin/site';
import { useSiteRole } from './Site/useSiteRole';
import { TabBiz } from './JXC/TabBiz';

function RoutesContainer({ children }: { children: React.ReactNode; }) {
    let uqApp = useUqApp();
    const { pathBase, pathLogin } = uqApp;
    return <Suspense fallback={<PageSpinner header="..." />}>
        <BrowserRouter basename={pathBase}>
            <Routes>
                {children}
                <Route path={`${pathLogin}/*`} element={<AppLogin />} />
                <Route path="/register" element={<AppRegister />} />
                {routePrivacy}
            </Routes>
        </BrowserRouter>
    </Suspense>;
}



export function ViewsRoutes() {
    let uqApp = useUqApp();
    let { user: atomUser, atomSiteLogined, pathLogin } = uqApp;
    let user = useAtomValue(atomUser);
    let siteLogined = useAtomValue(atomSiteLogined);
    let { userSite } = useSiteRole();

    if (userSite === undefined) {
        return <RoutesContainer>
            <Route path="/" element={<Navigate replace={true} to={pathLogin} />} />
        </RoutesContainer>;
    }

    let homeLayout: JSX.Element;
    if (siteLogined !== true) {
        homeLayout = <PageSpinner />;
        return <RoutesContainer>
            <Route path="/" element={homeLayout} />
        </RoutesContainer>;
    }
    if (user === undefined) {
        homeLayout = <PageNoSite />;
    }
    else {
        const home = { to: '/' + pathHome, caption: '首页', icon: 'home' };
        const me = { to: '/' + pathMe, caption: '我的', icon: 'user' };
        const designBiz = { to: '/biz', caption: '业务', icon: 'user' };
        const { isAdmin } = userSite;
        //let isAdmin = true;
        let tabs = isAdmin === true ?
            [home, designBiz, me]
            :
            [home, me];
        homeLayout = <PageTabsLayout tabs={tabs} />;
    }

    return <RoutesContainer>
        <Route path="/" element={homeLayout}>
            <Route index element={<TabJXC />} />
            <Route path={pathHome + '/*'} element={<TabJXC />} />
            <Route path={'biz' + '/*'} element={<TabBiz />} />
            <Route path={pathMe + '/*'} element={<TabMe />} />
        </Route>
        {routeMe}
        {routeJCX(uqApp)}
        {routeAdmin(uqApp)}
        {routeSiteAdmin}
        <Route path="/test" element={<Page header="Test">test</Page>} />
    </RoutesContainer>;
}
