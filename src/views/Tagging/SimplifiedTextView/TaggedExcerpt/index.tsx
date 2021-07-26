import React from 'react';
import {
    IoClose,
    IoCheckmark,
    IoPencil,
} from 'react-icons/io5';
import { _cs } from '@togglecorp/fujs';
import {
    Footer,
    QuickActionButton,
    QuickActionButtonProps,
    QuickActionDropdownMenu,
    Heading,
    TextArea,
    useInputState,
    Button,
} from '@the-deep/deep-ui';

import styles from './styles.css';

interface TaggedExcerptProps<K extends string> {
    entryId: K;
    isActive?: boolean;
    onClick?: (entryId: K) => void;
    onCreateButtonClick?: QuickActionButtonProps<K>['onClick'];
    onRemoveButtonClick?: QuickActionButtonProps<K>['onClick'];
    className?: string;
    droppedExcerpt?: string;
    excerpt?: string;
    onExcerptChange?: (entryId: K, modifiedExcerpt: string) => void;
}

function TaggedExcerpt<K extends string>(props: TaggedExcerptProps<K>) {
    const {
        className,
        droppedExcerpt,
        entryId,
        excerpt: excerptFromProps,
        isActive,
        onClick,
        onCreateButtonClick,
        onRemoveButtonClick,
        onExcerptChange,
    } = props;

    const [excerpt, setExcerpt] = useInputState(excerptFromProps);

    const handleClick = React.useCallback(() => {
        onClick(entryId);
    }, [entryId, onClick]);

    const handleExcerptChange = React.useCallback((modifiedExcerpt) => {
        onExcerptChange(entryId, modifiedExcerpt);
    }, [entryId, onExcerptChange]);

    return (
        <div
            className={_cs(
                styles.taggedExcerpt,
                className,
            )}
        >
            <div
                role="presentation"
                className={styles.content}
                onClick={handleClick}
            >
                {droppedExcerpt}
            </div>
            {isActive && (
                <Footer
                    quickActions={(
                        <>
                            <QuickActionButton
                                name={entryId}
                                onClick={onRemoveButtonClick}
                            >
                                <IoClose />
                            </QuickActionButton>
                            <QuickActionButton
                                name={entryId}
                                onClick={onCreateButtonClick}
                                variant="primary"
                            >
                                <IoCheckmark />
                            </QuickActionButton>
                            <QuickActionDropdownMenu
                                label={<IoPencil />}
                                popupClassName={styles.editExcerptPopup}
                                popupContentClassName={styles.content}
                            >
                                <Heading size="small">
                                    Modify Excerpt
                                </Heading>
                                <TextArea
                                    className={styles.excerptTextArea}
                                    name={undefined}
                                    value={excerpt}
                                    onChange={setExcerpt}
                                    rows={4}
                                />
                                <Footer
                                    actions={(
                                        <Button
                                            name={excerpt}
                                            onClick={handleExcerptChange}
                                        >
                                            Done
                                        </Button>
                                    )}
                                />
                            </QuickActionDropdownMenu>
                        </>
                    )}
                />
            )}
        </div>
    );
}

export default TaggedExcerpt;
