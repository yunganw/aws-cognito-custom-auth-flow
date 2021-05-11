import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import UserInfo from '../components/UserInfo.vue';
import Landing from '../views/Landing.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/hogwarts',
        name: 'Hogwarts',
        component: () =>
            import(/* webpackChunkName: "about" */ '../views/Hogwarts.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () =>
            import(/* webpackChunkName: "register" */ '../views/Register.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    },
    {
        path: '/landing',
        name: 'Landing',
        component: Landing, 
    },
    {
        path: '/userinfo',
        name: 'UserInfo',
        component: UserInfo, 
    },
    {
        path: '/forgotpassword',
        name: 'ForgotPassword',
        component: ForgotPassword,
    },
    {
        path: '/resetpassword',
        name: 'ResetPassword',
        component: ResetPassword,
    },
    {
        path: '/toasts',
        name: 'Toasts',
        component: () =>
            import(/* webpackChunkName: "toasts" */ '../views/Toasts.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
