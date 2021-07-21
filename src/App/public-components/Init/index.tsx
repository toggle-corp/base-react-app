import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { removeNull } from '@togglecorp/toggle-form';

import { UserContext } from '#app/context/UserContext';
import MessagePage from '#app/components/MessagePage';

import {
    MeQuery,
} from '#generated/types';

const ME = gql`
    query Me {
      me {
          id
          displayName
          displayPictureUrl
          lastActiveProject
      }
    }
`;

function Init() {
    const {
        setReady,
        setUser,
    } = useContext(UserContext);

    const { error } = useQuery<MeQuery>(ME, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            const safeMe = removeNull(data.me);
            if (safeMe) {
                setUser({ ...safeMe, permissions: [] });
            } else {
                setUser(undefined);
            }
            setReady(true);
        },
    });

    if (error) {
        return (
            <MessagePage
                content="Some error occurred"
            />
        );
    }

    return (
        <MessagePage
            content="Checking user session..."
        />
    );
}
export default Init;
