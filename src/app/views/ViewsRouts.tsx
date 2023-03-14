import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Page, PageTabsLayout, PageSpinner } from 'tonwa-app';
import { AppLogin, AppRegister } from '../tool';
import { pathMe, routeMe, TabMe } from './Me';
import { routePrivacy } from 'app/tool';
import { pathJXC, routeJCX, TabJXC } from './JCX';

export function ViewsRoutes() {
    const homeLayout = <PageTabsLayout tabs={[
        { to: '/' + pathJXC, caption: '首页', icon: 'home' },
        { to: '/' + pathMe, caption: '我的', icon: 'user' },
    ]} />;

    return <Suspense fallback={<PageSpinner />}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={homeLayout}>
                    <Route index element={<TabJXC />} />
                    <Route path={pathJXC + '/*'} element={<TabJXC />} />
                    <Route path={pathMe + '/*'} element={<TabMe />} />
                </Route>
                {routeMe}
                {routeJCX}
                <Route path="/test" element={<Page header="Test">test</Page>} />
                <Route path="/login/*" element={<AppLogin />} />
                <Route path="/register" element={<AppRegister />} />
                {routePrivacy}
            </Routes>
        </BrowserRouter>
    </Suspense>;
}
