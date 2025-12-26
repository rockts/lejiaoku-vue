import { RouteRecordRaw } from 'vue-router';
import Home from '@/app/components/Home.vue';
import About from '@/app/components/About.vue';
import UserAgreement from '@/app/components/UserAgreement.vue';
import PrivacyPolicy from '@/app/components/PrivacyPolicy.vue';
import ContributorResponsibilities from '@/app/components/ContributorResponsibilities.vue';
import LoginPage from '@/app/components/LoginPage.vue';

/**
 * 定义路由
 */
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/about',
        name: 'About',
        component: About,
    },
    {
        path: '/legal/user-agreement',
        name: 'UserAgreement',
        component: UserAgreement,
    },
    {
        path: '/legal/privacy-policy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy,
    },
    {
        path: '/legal/contributor-responsibilities',
        name: 'ContributorResponsibilities',
        component: ContributorResponsibilities,
    },
];

/**
 * 默认导出
 */
export default routes;
