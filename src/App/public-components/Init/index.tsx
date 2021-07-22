import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { removeNull } from '@togglecorp/toggle-form';

import { UserContext } from '#app/context/UserContext';
import PreloadMessage from '#app/components/PreloadMessage';

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

interface Props {
    className?: string;
}
function Init(props: Props) {
    const { className } = props;
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
            <PreloadMessage
                className={className}
                content="Some error occurred"
            />
        );
    }

    return (
        <PreloadMessage
            className={className}
            content="Checking user session..."
        />
    );
}
export default Init;
