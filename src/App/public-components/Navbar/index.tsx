import React, { useContext } from 'react';
import { _cs } from '@togglecorp/fujs';

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
        user,
    } = useContext(UserContext);

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
                        {user.displayName ?? 'Anon'}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
