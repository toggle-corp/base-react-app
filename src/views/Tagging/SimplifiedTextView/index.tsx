import React from 'react';
import { IoAddCircle } from 'react-icons/io5';
import { useTextSelection } from 'use-text-selection';
import { _cs } from '@togglecorp/fujs';
import { Button } from '@the-deep/deep-ui';

import TaggedExcerpt from './TaggedExcerpt';
import styles from './styles.css';

export interface Entry {
    clientId: string;
    droppedExcerpt: string;
    excerpt: string;
}

interface Split {
    startIndex: number;
    endIndex: number;
    excerpt: string;
    droppedExcerpt: string;
}

function filterOutNull<D, FD extends Exclude<D, null>>(list: D[] | undefined): FD[] {
    if (!list) {
        return [];
    }

    return list.filter((d) => !!d) as FD[];
}

interface Props {
    className?: string;
    text?: string;
    entries?: Entry[];
    onAddButtonClick?: (selectedText: string) => void;
    onExcerptChange?: (entryClientId: Entry['clientId'], newExcerpt) => void;
    activeEntryClientId?: Entry['clientId'];
    onExcerptClick?: (entryClientId: Entry['clientId']) => void;
    onCreateButtonClick?: (entryClientId: Entry['clientId']) => void;
    onRemoveButtonClick?: (entryClientId: Entry['clientId']) => void;
}

function SimplifiedTextView(props: Props) {
    const {
        className,
        text,
        entries,
        onAddButtonClick,
        onExcerptChange,
        activeEntryClientId,
        onExcerptClick,
        onCreateButtonClick,
        onRemoveButtonClick,
    } = props;

    // TODO: Remove overlapping splits if necessary
    const splits = React.useMemo(() => (
        filterOutNull(
            entries?.map((entry) => {
                if (!text || !entry.droppedExcerpt) {
                    return null;
                }

                const startIndex = text.indexOf(entry.droppedExcerpt);
                if (startIndex === -1) {
                    return null;
                }

                const endIndex = startIndex + entry.droppedExcerpt.length;

                return ({
                    startIndex,
                    endIndex,
                    entryId: entry.clientId,
                    excerpt: entry.excerpt,
                    droppedExcerpt: entry.droppedExcerpt,
                });
            }),
        ).sort((a: Split, b: Split) => (
            a.startIndex - b.startIndex
        ))
    ), [text, entries]);

    let children: React.ReactNode = null;
    if (!text || splits.length === 0) {
        children = text;
    } else {
        children = (
            <>
                {splits[0].startIndex > 0 && (
                    <span>
                        {text.substring(0, splits[0].startIndex)}
                    </span>
                )}
                {splits.map((split, i) => (
                    <React.Fragment key={split.startIndex}>
                        {i > 0 && splits[i - 1].endIndex < split.startIndex && (
                            <span>
                                {text.substring(splits[i - 1].endIndex, split.startIndex)}
                            </span>
                        )}
                        <TaggedExcerpt
                            entryId={split.entryId}
                            onClick={onExcerptClick}
                            isActive={activeEntryClientId === split.entryId}
                            excerpt={split.excerpt}
                            droppedExcerpt={split.droppedExcerpt}
                            onExcerptChange={onExcerptChange}
                            onCreateButtonClick={onCreateButtonClick}
                            onRemoveButtonClick={onRemoveButtonClick}
                        />
                    </React.Fragment>
                ))}
                {splits[splits.length - 1].endIndex < text.length && (
                    <span>
                        {text.substring(splits[splits.length - 1].endIndex, text.length)}
                    </span>
                )}
            </>
        );
    }

    const containerRef = React.useRef<HTMLDivElement>(null);
    const {
        clientRect,
        isCollapsed,
        textContent,
    } = useTextSelection(containerRef.current ?? undefined);

    const position = React.useMemo(() => {
        const parent = containerRef.current;
        if (!clientRect || !parent) {
            return undefined;
        }

        const parentRect = parent.getBoundingClientRect();

        const pos: {
            left?: number;
            right?: number;
            top: number;
        } = {
            left: undefined,
            right: undefined,
            top: clientRect.top - parentRect.top + parent.scrollTop,
        };

        if (containerRef.current && clientRect) {
            if (clientRect.x > (parent.offsetWidth / 2)) {
                pos.right = (parentRect.width + parentRect.left)
                    - (clientRect.left + clientRect.width);
            } else {
                pos.left = clientRect.left - parentRect.left;
            }
        } else {
            pos.left = clientRect.left - parentRect.left;
        }

        return pos;
    }, [clientRect]);

    return (
        <div
            ref={containerRef}
            className={_cs(styles.simplifiedTextView, className)}
        >
            {children}
            {!isCollapsed && textContent && (
                <div
                    className={styles.actionsPopup}
                    style={position ? ({ ...position }) : undefined}
                >
                    <Button
                        name={textContent}
                        variant="action"
                        className={styles.addButton}
                        onClick={onAddButtonClick}
                    >
                        <IoAddCircle className={styles.addIcon} />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default SimplifiedTextView;
