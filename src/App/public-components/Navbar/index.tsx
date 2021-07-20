import React, { useContext, useCallback } from 'react';
import { _cs } from '@togglecorp/fujs';
import { Button } from '@the-deep/deep-ui';

import NavLink from '#app/components/NavLink';
import { UserContext } from '#app/context/UserContext';
import route from '#app/public-configs/routes';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Navbar(props: Props) {
    const { className } = props;

    const {
        authenticated,
        setUser,
        user,
    } = useContext(UserContext);

    const handleLogout = useCallback(
        () => {
            setUser(undefined);
        },
        [setUser],
    );
    const handleLogin = useCallback(
        () => {
            setUser({
                id: 1,
                name: 'Ram Bahadur',
                permissions: [],
            });
        },
        [setUser],
    );

    return (
        <nav className={_cs(className, styles.navbar)}>
            <div className={styles.appBrand}>
                {process.env.MY_APP}
            </div>
            <div className={styles.main}>
                <div className={styles.navLinks}>
                    <NavLink
                        exact
                        className={styles.link}
                        activeClassName={styles.active}
                        route={route.dashboard}
                    />
                    <NavLink
                        exact
                        className={styles.link}
                        activeClassName={styles.active}
                        route={route.about}
                    />
                </div>
            </div>
            <div className={styles.actions}>
                {authenticated && user && (
                    <div>
                        {user.name}
                    </div>
                )}
                {authenticated && (
                    <Button
                        name={undefined}
                        onClick={handleLogout}
                        variant="secondary"
                    >
                        Logout
                    </Button>
                )}
                {!authenticated && (
                    <Button
                        name={undefined}
                        onClick={handleLogin}
                        variant="secondary"
                    >
                        Login
                    </Button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
