import React from 'react';
import { Switch, Route } from 'react-router-dom';

import getRouteSettings from '#app/public-configs/routes';

interface Props {
    className?: string;
}

function Routes(props: Props) {
    const { className } = props;
    const routes = getRouteSettings({
        className,
    });

    return (
        <Switch>
            <Route
                exact
                path={routes.dashboard.path}
                render={routes.dashboard.load}
            />
            <Route
                exact
                path={routes.about.path}
                render={routes.about.load}
            />
            <Route
                exact
                path={routes.project.path}
                render={routes.project.load}
            />
            <Route
                exact
                path={routes.signIn.path}
                render={routes.signIn.load}
            />
            <Route
                exact
                path={routes.signUp.path}
                render={routes.signUp.load}
            />
            <Route
                exact
                path={routes.forgetPassword.path}
                render={routes.forgetPassword.load}
            />
            <Route
                exact
                path={routes.resetPassword.path}
                render={routes.resetPassword.load}
            />
            <Route
                exact
                path={routes.fourHundredFour.path}
                render={routes.fourHundredFour.load}
            />
        </Switch>
    );
}
export default Routes;
