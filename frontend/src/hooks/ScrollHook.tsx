import { useGSAP, type useGSAPConfig } from "@gsap/react";
import React, { useEffect } from "react";

export default function useScrollEffect(
    callback: (y: number, h: number) => void,
    extraDeps: React.DependencyList = [],
) {
    useEffect(() => {
        return handleHook(callback);
    }, extraDeps);
}

export function useGSAPScrollEffect(
    callback: (y: number, h: number) => void,
    extraDeps: unknown[] | useGSAPConfig = [],
) {
    useGSAP(() => {
        return handleHook(callback);
    }, extraDeps);
}

/**
 * Function that runs the contents of the hook. Used to prevent code repeation
 * @param callback Custom callback to run
 * @returns Cleanup task
 */
function handleHook(callback: (y: number, h: number) => void) {
    const update = () => {
        callback(window.scrollY, window.innerHeight);
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
