import React from 'react';
import { _cs } from '@togglecorp/fujs';

import PageContent from '#app/public-components/PageContent';

import styles from './styles.css';

interface Props {
    className?: string;
}

function Tagging(props: Props) {
    const {
        className,
    } = props;

    return (
        <PageContent className={_cs(styles.tagging, className)}>
            Tagging
        </PageContent>
    );
}

export default Tagging;
