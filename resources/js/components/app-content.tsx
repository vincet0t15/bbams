import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = React.ComponentProps<'main'> & {
    variant?: AppVariant;
};

export function AppContent({ variant = 'sidebar', children, ...props }: Props) {
    if (variant === 'sidebar') {
        return (
            <SidebarInset {...props}>
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                    <div className="absolute -top-40 -left-40 size-[520px] rounded-full bg-primary/12 blur-3xl" />
                    <div className="absolute -right-40 -bottom-40 size-[520px] rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute top-1/3 left-1/2 size-[380px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
                </div>
                <div className="relative z-10">{children}</div>
            </SidebarInset>
        );
    }

    return (
        <main
            className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl"
            {...props}
        >
            {children}
        </main>
    );
}
