import { useGSAP, type useGSAPConfig } from "@gsap/react";
import React, { useEffect } from "react";

export function useScrollEffect(
    callback: (y: number, h: number, w: number) => void,
    extraDeps: React.DependencyList = [],
) {
    useEffect(() => {
        return handleScrollHook(callback);
    }, extraDeps);
}

export function useResizeEffect(
    callback: (h: number, w: number) => void,
    extraDeps: React.DependencyList = [],
) {
    useEffect(() => {
        return handleResizeHook(callback);
    }, extraDeps);
}

export function useGSAPScrollEffect(
    callback: (y: number, h: number, w: number) => void,
    extraDeps: unknown[] | useGSAPConfig = [],
) {
    useGSAP(() => {
        return handleScrollHook(callback);
    }, extraDeps);
}

export function useGSAPResizeEffect(
    callback: (h: number, w: number) => void,
    extraDeps: unknown[] | useGSAPConfig = [],
) {
    useGSAP(() => {
        return handleResizeHook(callback);
    }, extraDeps);
}

/**
 * Function that runs the contents of the scroll hook. Used to prevent code repeation
 * @param callback Custom callback to run when scrolling or resizing the window
 * @returns Cleanup task
 */
function handleScrollHook(callback: (y: number, h: number, w: number) => void) {
    const update = () => {
        callback(window.scrollY, window.innerHeight, window.innerWidth);
    };

    window.addEventListener("load", update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);
    update();

    return () => {
        window.removeEventListener("load", update);
        window.removeEventListener("resize", update);
        window.removeEventListener("scroll", update);
    };
}

/**
 * Function that runs the contents of the resize hook. Used to prevent code repeation
 * @param callback Custom callback to run when the window resizes
 * @returns Cleanup task
 */
function handleResizeHook(callback: (h: number, w: number) => void) {
    const update = () => {
        callback(window.innerHeight, window.innerWidth);
    };

    window.addEventListener("load", update);
    window.addEventListener("resize", update);
    update();

    return () => {
        window.removeEventListener("load", update);
        window.removeEventListener("resize", update);
    };
}
