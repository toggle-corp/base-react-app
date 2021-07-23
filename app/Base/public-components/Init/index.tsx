import React, { useContext, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { removeNull } from '@togglecorp/toggle-form';

import { UserContext } from '#base/context/UserContext';
import PreloadMessage from '#base/components/PreloadMessage';
import { checkErrorCode } from '#base/public-utils/apollo';

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

    const [errored, setErrored] = useState(false);

    useQuery<MeQuery>(ME, {
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
        onError: (error) => {
            const { graphQLErrors } = error;
            const meErrored = checkErrorCode(
                graphQLErrors,
                ['me'],
                '401',
            );

            setErrored(meErrored);
            setReady(true);
        },
    });

    if (errored) {
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
