import React, { Suspense, JSX } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Page, PageTabsLayout, PageSpinner } from 'tonwa-app';
import { pathMe, routeMe, TabMe } from './Me';
import { pathHome, routeApp, TabHome } from './Biz';
import { useUqApp } from 'app/UqApp';
import { AppLogin, AppRegister, routePrivacy } from 'app/brand';
import { useAtomValue } from 'jotai';
import { PageNoSite, routeAdmin } from './Admin';
import { routeSiteAdmin } from './Admin/site';
import { useSiteRole } from './Site/useSiteRole';
// import { PageCode, TabCode } from './Biz/TabCode';
import { PageMySites } from './Site/PageMySites';
import { PageBiz } from './Admin/compile';
import { PageSheetDash } from 'tonwa/Pages';

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
        // home: to '/' show active
        const home = { to: '/', caption: '首页', icon: 'home' };
        const me = { to: '/' + pathMe, caption: '我的', icon: 'user' };
        homeLayout = <PageTabsLayout tabs={[home, me]} />;
    }

    return <RoutesContainer>
        <Route path="/" element={homeLayout}>
            <Route index element={<TabHome />} />
            <Route path={pathHome + '/*'} element={<TabHome />} />
            <Route path={'bizTab' + '/*'} element={<PageBiz back="none" />} />
            <Route path={pathMe + '/*'} element={<TabMe />} />
        </Route>
        <Route path={'biz' + '/*'} element={<PageBiz />} />
        {routeMe}
        {routeApp()}
        {routeAdmin(uqApp)}
        {routeSiteAdmin}
        <Route path={'sites'} element={<PageMySites />} />
        <Route path="/test" element={<Page header="Test">test</Page>} />
        <Route path="test-mvc-sheet/:sheet" element={<PageSheetDash />} />
    </RoutesContainer>;
}
