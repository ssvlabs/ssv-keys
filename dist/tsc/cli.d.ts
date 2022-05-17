#!/usr/bin/env node
declare global {
    interface Window {
        crypto: any;
    }
}
export {};
