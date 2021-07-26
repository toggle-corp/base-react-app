import { InitializeOptions } from 'react-ga';

export const trackingId = isBeta
    ? 'UA-112330910-1'
    : 'UA-112330910-2';

export const gaConfig: InitializeOptions = {
    debug: isDev || isNightly || isAlpha,
    testMode: isDev,
    gaOptions: {
        userId: undefined,
    },
};
