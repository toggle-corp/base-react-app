import { lazy } from 'react';
import { wrap } from '#app/private-utils/routes';

const routeSettings = {
    dashboard: wrap({
        path: '/',
        title: 'Dashboard',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/MessagePage')),
        componentProps: {
            content: 'Dashboard',
        },
        visibility: 'is-authenticated',
    }),
    about: wrap({
        path: '/about/',
        title: 'About',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/MessagePage')),
        componentProps: {
            content: 'About',
        },
        visibility: 'is-authenticated',
    }),
    signIn: wrap({
        path: '/login/',
        title: 'Login',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/MessagePage')),
        componentProps: {
            content: 'Login',
        },
        visibility: 'is-not-authenticated',
    }),
    signUp: wrap({
        path: '/register/',
        title: 'Register',
        navbarVisibility: false,
        component: lazy(() => import('#app/components/MessagePage')),
        componentProps: {
            content: 'Register',
        },
        visibility: 'is-not-authenticated',
    }),
    forgetPassword: wrap({
        path: '/forgot-password/',
        title: 'Forgot Password',
        navbarVisibility: false,
        component: lazy(() => import('#app/components/MessagePage')),
        componentProps: {
            content: 'Forgot Password',
        },
        visibility: 'is-not-authenticated',
    }),
    resetPassword: wrap({
        path: '/reset-password/:userId/:resetToken/',
        title: 'Reset Password',
        navbarVisibility: false,
        component: lazy(() => import('#app/components/MessagePage')),
        componentProps: {
            content: 'Reset Password',
        },
        visibility: 'is-not-authenticated',
    }),
    project: wrap({
        path: '/projects/:projectid(\\d+)/',
        title: 'Project',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/MessagePage')),
        visibility: 'is-authenticated',
        componentProps: {
            content: 'Project',
        },
        // checkPermissions: (permissions) => permissions.entry?.change,
    }),

    fourHundredFour: wrap({
        path: '*',
        title: '404',
        component: lazy(() => import('#app/components/MessagePage')),
        componentProps: {},
        visibility: 'is-anything',
        navbarVisibility: true,
    }),
};

export default routeSettings;
