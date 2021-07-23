import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { Router } from 'react-router-dom';
import { init, ErrorBoundary, setUser as setUserOnSentry } from '@sentry/react';
import { isNotDefined, unique } from '@togglecorp/fujs';
import { AlertContainer, AlertContext, AlertOptions } from '@the-deep/deep-ui';
import { ApolloClient, ApolloProvider } from '@apollo/client';

import '@the-deep/deep-ui/build/index.css';

import Init from '#base/public-components/Init';
import PreloadMessage from '#base/components/PreloadMessage';
import browserHistory from '#base/configs/history';
import sentryConfig from '#base/configs/sentry';
import { UserContext, UserContextInterface } from '#base/context/UserContext';
import AuthPopup from '#base/private-components/AuthPopup';
import { sync } from '#base/private-hooks/useAuthSync';
import Navbar from '#base/public-components/Navbar';
import Routes from '#base/public-components/Routes';
import { User } from '#base/public-types/user';
import apolloConfig from '#base/public-configs/apollo';

import styles from './styles.css';

// TODO:
// 1. Apollo provider
// 2. check anti click jacking
// 3. generalize permissions

function transformUser(user: User | undefined) {
    if (isNotDefined(user)) {
        return null;
    }

    return {
        ...user,
        id: String(user.id),
    };
}

if (sentryConfig) {
    init(sentryConfig);
}

const apolloClient = new ApolloClient(apolloConfig);

function Base() {
    const [user, setUser] = useState<User | undefined>();
    const [ready, setReady] = useState(false);

    const [navbarState, setNavbarState] = useState(false);

    const authenticated = !!user;

    const setUserWithSentry: typeof setUser = useCallback(
        (u) => {
            if (typeof u === 'function') {
                setUser((oldUser) => {
                    const newUser = u(oldUser);

                    const sanitizedUser = transformUser(newUser);
                    sync(!!sanitizedUser, sanitizedUser?.id);
                    setUserOnSentry(sanitizedUser);

                    return newUser;
                });
            } else {
                const sanitizedUser = transformUser(u);
                sync(!!sanitizedUser, sanitizedUser?.id);
                setUserOnSentry(sanitizedUser);
                setUser(u);
            }
        },
        [setUser],
    );

    const userContext: UserContextInterface = useMemo(
        () => ({
            authenticated,
            user,
            setUser: setUserWithSentry,
            ready,
            setReady,
            navbarState,
            setNavbarState,
        }),
        [authenticated, user, setUserWithSentry, ready, navbarState, setNavbarState],
    );

    const [alerts, setAlerts] = React.useState<AlertOptions[]>([]);

    const addAlert = React.useCallback(
        (alert: AlertOptions) => {
            setAlerts((prevAlerts) => unique(
                [...prevAlerts, alert],
                (a) => a.name,
            ) ?? prevAlerts);
        },
        [setAlerts],
    );

    const removeAlert = React.useCallback(
        (name: string) => {
            setAlerts((prevAlerts) => {
                const i = prevAlerts.findIndex((a) => a.name === name);
                if (i === -1) {
                    return prevAlerts;
                }

                const newAlerts = [...prevAlerts];
                newAlerts.splice(i, 1);

                return newAlerts;
            });
        },
        [setAlerts],
    );

    const updateAlertContent = React.useCallback(
        (name: string, children: React.ReactNode) => {
            setAlerts((prevAlerts) => {
                const i = prevAlerts.findIndex((a) => a.name === name);
                if (i === -1) {
                    return prevAlerts;
                }

                const updatedAlert = {
                    ...prevAlerts[i],
                    children,
                };

                const newAlerts = [...prevAlerts];
                newAlerts.splice(i, 1, updatedAlert);

                return newAlerts;
            });
        },
        [setAlerts],
    );

    const alertContext = React.useMemo(
        () => ({
            alerts,
            addAlert,
            updateAlertContent,
            removeAlert,
        }),
        [alerts, addAlert, updateAlertContent, removeAlert],
    );

    let children;

    if (!ready) {
        children = (
            <Init className={styles.init} />
        );
    } else {
        children = (
            <Router history={browserHistory}>
                {navbarState && (
                    <Navbar className={styles.navbar} />
                )}
                <Suspense
                    fallback={(
                        <PreloadMessage
                            className={styles.preloadMessage}
                            content="Loading page..."
                        />
                    )}
                >
                    {/*
                      * NOTE: styling for view is located in
                      * `/public-configs/routes/styles.css`
                      */}
                    <Routes />
                </Suspense>
            </Router>
        );
    }

    return (
        <div className={styles.base}>
            <ErrorBoundary
                showDialog
                fallback={(
                    <PreloadMessage
                        heading="Oops"
                        content="Some error occurred!"
                    />
                )}
            >
                <ApolloProvider client={apolloClient}>
                    <UserContext.Provider value={userContext}>
                        <AlertContext.Provider value={alertContext}>
                            <AuthPopup />
                            <AlertContainer className={styles.alertContainer} />
                            {children}
                        </AlertContext.Provider>
                    </UserContext.Provider>
                </ApolloProvider>
            </ErrorBoundary>
        </div>
    );
}

export default Base;
