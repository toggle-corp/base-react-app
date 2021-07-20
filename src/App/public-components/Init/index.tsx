import React, { useContext, useEffect } from 'react';

import { UserContext } from '#app/context/UserContext';
import MessagePage from '#app/components/MessagePage';

function Init() {
    const {
        setReady,
    } = useContext(UserContext);

    useEffect(
        () => {
            const timeout = setTimeout(
                () => {
                    setReady(true);
                },
                500,
            );
            return () => {
                clearTimeout(timeout);
            };
        },
        [setReady],
    );

    return (
        <MessagePage
            content="Checking user session..."
        />
    );
}
export default Init;
