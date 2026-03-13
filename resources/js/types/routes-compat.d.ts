declare module '@/routes' {
    export function dashboard(): string;
    export function home(): string;
    export function login(): string;
    export function register(): string;
    export function logout(): string;
}

declare module '@/routes/password' {
    // Use loose types to interop with generated helpers that expose `.form()`
    export const email: any;
    export const request: any;
    export const update: any;
}
