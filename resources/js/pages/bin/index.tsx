import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type BinRow = {
    id: number;
    name?: string;
    title?: string;
    deleted_at: string | null;
    deleted_by: string | null;
};

type Props = {
    courses: BinRow[];
    events: BinRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bin',
        href: '/bin',
    },
];

export default function BinIndex({ courses, events }: Props) {
    const [tab, setTab] = useState<'courses' | 'events'>('courses');

    const rows = useMemo(() => {
        return tab === 'courses' ? courses : events;
    }, [courses, events, tab]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bin" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        variant={tab === 'courses' ? 'default' : 'outline'}
                        onClick={() => setTab('courses')}
                    >
                        Courses
                    </Button>
                    <Button
                        type="button"
                        variant={tab === 'events' ? 'default' : 'outline'}
                        onClick={() => setTab('events')}
                    >
                        Events
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {tab === 'courses'
                                ? 'Deleted courses'
                                : 'Deleted events'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {rows.length ? (
                                rows.map((row) => {
                                    const label =
                                        tab === 'courses'
                                            ? row.name || `#${row.id}`
                                            : row.title || `#${row.id}`;
                                    const restoreUrl =
                                        tab === 'courses'
                                            ? `/bin/courses/${row.id}/restore`
                                            : `/bin/events/${row.id}/restore`;
                                    const forceUrl =
                                        tab === 'courses'
                                            ? `/bin/courses/${row.id}/force`
                                            : `/bin/events/${row.id}/force`;

                                    return (
                                        <div
                                            key={`${tab}-${row.id}`}
                                            className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-medium">
                                                    {label}
                                                </div>
                                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                    {row.deleted_at ? (
                                                        <Badge variant="secondary">
                                                            {row.deleted_at}
                                                        </Badge>
                                                    ) : null}
                                                    <Badge variant="outline">
                                                        Deleted by:{' '}
                                                        {row.deleted_by || '-'}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.put(
                                                            restoreUrl,
                                                            undefined,
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Restore
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        if (
                                                            !window.confirm(
                                                                `Permanently delete "${label}"?`,
                                                            )
                                                        ) {
                                                            return;
                                                        }

                                                        router.delete(
                                                            forceUrl,
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        );
                                                    }}
                                                >
                                                    Delete forever
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    Bin is empty.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
