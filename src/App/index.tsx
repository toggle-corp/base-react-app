import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { Router } from 'react-router-dom';
import { init, ErrorBoundary, setUser as setUserOnSentry } from '@sentry/react';
import { isNotDefined, unique } from '@togglecorp/fujs';
import { AlertContainer, AlertContext, AlertOptions } from '@the-deep/deep-ui';

import '@the-deep/deep-ui/build/index.css';

import MessagePage from '#app/components/MessagePage';
import browserHistory from '#app/configs/history';
import sentryConfig from '#app/configs/sentry';
import { UserContext, UserContextInterface } from '#app/context/UserContext';
import useStoredState from '#app/hooks/useStoredState';
import AuthPopup from '#app/private-components/AuthPopup';
import { sync } from '#app/private-hooks/useAuthSync';
import Navbar from '#app/public-components/Navbar';
import Routes from '#app/public-components/Routes';
import { User } from '#app/public-types/user';

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

function App() {
    const [user, setUser] = useStoredState<User | undefined>('user', undefined);
    // TODO: set this to false
    const [ready, setReady] = useState(true);

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

    if (!ready) {
        return (
            <MessagePage
                content="Checking user session..."
            />
        );
    }

    return (
        <ErrorBoundary
            fallback={(
                <MessagePage
                    heading="Oops"
                    content="Some error occurred!"
                />
            )}
            showDialog
        >
            <UserContext.Provider value={userContext}>
                <AlertContext.Provider value={alertContext}>
                    <AuthPopup />
                    <div className={styles.alertContainer}>
                        <AlertContainer />
                    </div>
                    <Router history={browserHistory}>
                        {navbarState && (
                            <Navbar className={styles.navbar} />
                        )}
                        <div className={styles.content}>
                            <Suspense
                                fallback={(
                                    <MessagePage
                                        content="Loading page..."
                                    />
                                )}
                            >
                                <Routes />
                            </Suspense>
                        </div>
                    </Router>
                </AlertContext.Provider>
            </UserContext.Provider>
        </ErrorBoundary>
    );
}

export default App;
