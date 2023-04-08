import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Page, PageTabsLayout, PageSpinner } from 'tonwa-app';
import { pathMe, routeMe, TabMe } from './Me';
import { pathJXC, routeJCX, TabJXC } from './JXC';
import { pathSetup, routeSetup, TabSetup } from 'app/setup';
import { useUqApp } from 'app/UqApp';
import { getAtomValue } from 'tonwa-com';
import { AppLogin, AppRegister, routePrivacy } from 'app/brand';

export function ViewsRoutes() {
    let uqApp = useUqApp();
    let homeLayout = <PageTabsLayout tabs={[
        { to: '/' + pathJXC, caption: '首页', icon: 'home' },
        { to: '/' + pathSetup, caption: '设置', icon: 'wrench' },
        { to: '/' + pathMe, caption: '我的', icon: 'user' },
    ]} />;

    let { user, unit } = uqApp;
    let u = getAtomValue(user);
    if (u !== undefined && unit === 0) {
        homeLayout = <div>
            <div className='m-3'>
                没有授权。请联系管理员
            </div>
        </div>;
    }

    return <Suspense fallback={<PageSpinner />}>
        <BrowserRouter basename='jksoft-jxc'>
            <Routes>
                <Route path="/" element={homeLayout}>
                    <Route index element={<TabJXC />} />
                    <Route path={pathJXC + '/*'} element={<TabJXC />} />
                    <Route path={pathSetup + '/*'} element={<TabSetup />} />
                    <Route path={pathMe + '/*'} element={<TabMe />} />
                </Route>
                {routeMe}
                {routeJCX(uqApp)}
                {routeSetup}
                <Route path="/test" element={<Page header="Test">test</Page>} />
                <Route path="/login/*" element={<AppLogin />} />
                <Route path="/register" element={<AppRegister />} />
                {routePrivacy}
            </Routes>
        </BrowserRouter>
    </Suspense>;
}
