import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import UserInfo from '../components/UserInfo.vue';

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
        path: '/userinfo',
        name: 'UserInfo',
        component: UserInfo, 
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
