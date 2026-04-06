import { Head, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type BinRow = {
    id: number;
    name?: string;
    title?: string;
    employee_no?: string;
    deleted_at: string | null;
    deleted_by: string | null;
};

type Props = {
    courses: BinRow[];
    events: BinRow[];
    faculties: BinRow[];
    staffs: BinRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Bin',
        href: '/bin',
    },
];

export default function BinIndex({
    courses,
    events,
    faculties,
    staffs,
}: Props) {
    const renderRows = (
        rows: BinRow[],
        type: 'courses' | 'events' | 'faculties' | 'staffs',
    ) => {
        if (!rows.length) {
            return (
                <div className="py-6 text-center text-sm text-muted-foreground">
                    Bin is empty.
                </div>
            );
        }

        return (
            <div className="space-y-2">
                {rows.map((row) => {
                    const getLabel = () => {
                        switch (type) {
                            case 'courses':
                                return row.name || `#${row.id}`;
                            case 'events':
                                return row.title || `#${row.id}`;
                            case 'faculties':
                            case 'staffs':
                                return row.name
                                    ? `${row.name} (${row.employee_no})`
                                    : `#${row.id}`;
                            default:
                                return `#${row.id}`;
                        }
                    };
                    const label = getLabel();
                    const restoreUrl = (() => {
                        switch (type) {
                            case 'courses':
                                return `/bin/courses/${row.id}/restore`;
                            case 'events':
                                return `/bin/events/${row.id}/restore`;
                            case 'faculties':
                                return `/bin/faculties/${row.id}/restore`;
                            case 'staffs':
                                return `/bin/staffs/${row.id}/restore`;
                            default:
                                return '';
                        }
                    })();
                    const forceUrl = (() => {
                        switch (type) {
                            case 'courses':
                                return `/bin/courses/${row.id}/force`;
                            case 'events':
                                return `/bin/events/${row.id}/force`;
                            case 'faculties':
                                return `/bin/faculties/${row.id}/force`;
                            case 'staffs':
                                return `/bin/staffs/${row.id}/force`;
                            default:
                                return '';
                        }
                    })();

                    return (
                        <div
                            key={`${type}-${row.id}`}
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
                                        Deleted by: {row.deleted_by || '-'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        router.put(restoreUrl, undefined, {
                                            preserveScroll: true,
                                        })
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

                                        router.delete(forceUrl, {
                                            preserveScroll: true,
                                        });
                                    }}
                                >
                                    Delete forever
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bin" />

            <div className="flex flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Deleted courses</CardTitle>
                    </CardHeader>
                    <CardContent>{renderRows(courses, 'courses')}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Deleted events</CardTitle>
                    </CardHeader>
                    <CardContent>{renderRows(events, 'events')}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Deleted faculties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {renderRows(faculties, 'faculties')}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Deleted staffs</CardTitle>
                    </CardHeader>
                    <CardContent>{renderRows(staffs, 'staffs')}</CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
