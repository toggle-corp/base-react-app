import { lazy } from 'react';
import { wrap } from '#app/private-utils/routes';
import styles from './styles.css';

const routes = {
    dashboard: wrap({
        path: '/',
        title: 'Dashboard',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            content: 'Dashboard',
            className: styles.view,
        },
        visibility: 'is-authenticated',
    }),
    about: wrap({
        path: '/about/',
        title: 'About',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            content: 'About',
            className: styles.view,
        },
        visibility: 'is-authenticated',
    }),
    signIn: wrap({
        path: '/login/',
        title: 'Login',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            content: 'Login',
            className: styles.view,
        },
        visibility: 'is-not-authenticated',
    }),
    signUp: wrap({
        path: '/register/',
        title: 'Register',
        navbarVisibility: false,
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            content: 'Register',
            className: styles.view,
        },
        visibility: 'is-not-authenticated',
    }),
    forgetPassword: wrap({
        path: '/forgot-password/',
        title: 'Forgot Password',
        navbarVisibility: false,
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            content: 'Forgot Password',
            className: styles.view,
        },
        visibility: 'is-not-authenticated',
    }),
    resetPassword: wrap({
        path: '/reset-password/:userId/:resetToken/',
        title: 'Reset Password',
        navbarVisibility: false,
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            content: 'Reset Password',
            className: styles.view,
        },
        visibility: 'is-not-authenticated',
    }),
    project: wrap({
        path: '/projects/:projectid(\\d+)/',
        title: 'Project',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/PreloadMessage')),
        visibility: 'is-authenticated',
        componentProps: {
            content: 'Project',
            className: styles.view,
        },
        // checkPermissions: (permissions) => permissions.entry?.change,
    }),

    fourHundredFour: wrap({
        path: '*',
        title: '404',
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            className: styles.view,
        },
        visibility: 'is-anything',
        navbarVisibility: true,
    }),
};

export default routes;
