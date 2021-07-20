import { ApolloClientOptions, NormalizedCacheObject, InMemoryCache, ApolloLink as ApolloLinkFromClient } from '@apollo/client';
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { RestLink } from 'apollo-link-rest';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { createUploadLink } from 'apollo-upload-client';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT as string;

const apolloOptions: ApolloClientOptions<NormalizedCacheObject> = {
    link: ApolloLink.from([
        new RetryLink(),
        ApolloLink.split(
            (operation) => operation.getContext().hasUpload,
            createUploadLink({
                uri: GRAPHQL_ENDPOINT,
                credentials: 'include',
            }) as unknown as ApolloLink,
            ApolloLink.from([
                new RestLink({
                    uri: 'https://osmnames.idmcdb.org',
                }) as unknown as ApolloLink,
                new BatchHttpLink({
                    uri: GRAPHQL_ENDPOINT,
                    credentials: 'include',
                }),
                /*
                createHttpLink({
                    uri: GRAPHQL_ENDPOINT,
                    credentials: 'include',
                }),
                */
            ]),
        ),
    ]) as unknown as ApolloLinkFromClient,
    cache: new InMemoryCache(),
    assumeImmutableResults: true,
    defaultOptions: {
        query: {
            fetchPolicy: 'cache-first',
            // fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            // NOTE: https://github.com/apollographql/apollo-client/issues/7346#issuecomment-730275343
            // Setting nextFetchPolicy to stop duplicate queries call
            nextFetchPolicy: 'cache-first',
            // fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
    },
};

export default apolloOptions;
