import { lazy } from 'react';
import { wrap } from '#app/private-utils/routes';

interface CommonProps {
    className?: string;
}

const getRouteSettings = (commonProps?: CommonProps) => ({
    dashboard: wrap({
        path: '/',
        title: 'Dashboard',
        navbarVisibility: true,
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            content: 'Dashboard',
            ...commonProps,
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
            ...commonProps,
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
            ...commonProps,
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
            ...commonProps,
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
            ...commonProps,
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
            ...commonProps,
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
            ...commonProps,
        },
        // checkPermissions: (permissions) => permissions.entry?.change,
    }),

    fourHundredFour: wrap({
        path: '*',
        title: '404',
        component: lazy(() => import('#app/components/PreloadMessage')),
        componentProps: {
            ...commonProps,
        },
        visibility: 'is-anything',
        navbarVisibility: true,
    }),
});

export default getRouteSettings;
