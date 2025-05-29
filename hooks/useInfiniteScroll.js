import { useState, useEffect, useCallback, useRef } from 'react';

export const useInfiniteScroll = (fetchMore, hasMore) => {
    const [isFetching, setIsFetching] = useState(false);
    const observerRef = useRef();
    const targetRef = useRef();

    const handleIntersection = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isFetching) {
            setIsFetching(true);
            fetchMore().finally(() => {
                setIsFetching(false);
            });
        }
    }, [fetchMore, hasMore, isFetching]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '100px'
        });

        observerRef.current = observer;

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleIntersection]);

    return [targetRef, isFetching];
};