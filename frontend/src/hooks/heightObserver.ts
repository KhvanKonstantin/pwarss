// Created by Konstantin Khvan on 6/20/20, 2:38 PM

import {RefObject, useEffect, useMemo, useRef, useState,} from "react";

declare var ResizeObserver: any;

export function useHeightObserver<T>(): [RefObject<T>, number] {
    const elementRef = useRef<T>(null);

    const [height, setHeight] = useState(0);
    const lastHeight = useRef(0);

    const resizeObserver = useMemo(() =>
        new ResizeObserver((entries: any) => {
            const entry = entries[0];

            if (!entry) {
                return
            }

            const newHeight = Math.round(entry.contentRect.height);
            if (lastHeight.current !== newHeight) {
                lastHeight.current = newHeight;
                setHeight(newHeight);
            }
        }), []);

    useEffect(() => {
        const element = elementRef.current;

        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    }, [elementRef, resizeObserver]);

    return useMemo(() => [elementRef, height], [elementRef, height]);
}


