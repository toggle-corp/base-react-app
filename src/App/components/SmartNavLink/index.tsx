import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import useRouteMatching, {
    RouteData,
    Attrs,
} from '#app/private-hooks/useRouteMatching';

export type Props = Omit<NavLinkProps, 'to'> & {
    route: RouteData;
    attrs?: Attrs;
    children?: React.ReactNode;
};

function SmartNavLink(props: Props) {
    const {
        route,
        attrs,
        children,
        ...otherProps
    } = props;

    const routeData = useRouteMatching(route, attrs);
    if (!routeData) {
        return null;
    }

    return (
        <NavLink
            {...otherProps}
            to={routeData.to}
        >
            {children ?? routeData.children}
        </NavLink>
    );
}

export default SmartNavLink;
