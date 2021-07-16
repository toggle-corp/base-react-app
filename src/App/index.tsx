import React from 'react';

import Lyrics from '#components/Lyrics';

import styles from './styles.css';

function App() {
    return (
        <div className={styles.app}>
            <div>
                <h1>
                    The House Of The Rising Sun
                </h1>
                <Lyrics />
            </div>
        </div>
    );
}

export default App;
