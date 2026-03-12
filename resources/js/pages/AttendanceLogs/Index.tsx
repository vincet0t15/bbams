import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { AttendanceLog } from '@/types/attendance-log';
import type { PaginatedDataResponse } from '@/types/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Attendance Logs',
        href: '/attendance-logs',
    },
];

type Props = {
    logList: PaginatedDataResponse<AttendanceLog>;
    events: { id: number; title: string | null }[];
    filters: {
        search?: string;
        event_id?: string;
        date?: string;
    };
};

export default function AttendanceLogsIndex({
    logList,
    events,
    filters,
}: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
        event_id: filters.event_id || 'all',
        date: filters.date || '',
    });

    const [isFiltering, setIsFiltering] = useState(false);

    const buildQuery = () => {
        const query: Record<string, string> = {};

        if (data.search) {
            query.search = data.search;
        }

        if (data.event_id && data.event_id !== 'all') {
            query.event_id = data.event_id;
        }

        if (data.date) {
            query.date = data.date;
        }

        return Object.keys(query).length ? query : undefined;
    };

    const submit = () => {
        setIsFiltering(true);
        router.get('/attendance-logs', buildQuery(), {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    const reset = () => {
        setData({
            search: '',
            event_id: 'all',
            date: '',
        } as any);
        router.get('/attendance-logs', undefined, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            submit();
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label>Event</Label>
                            <Select
                                value={data.event_id}
                                onValueChange={(val) =>
                                    setData('event_id', val)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All events" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All events
                                    </SelectItem>
                                    {events.map((event) => (
                                        <SelectItem
                                            key={event.id}
                                            value={String(event.id)}
                                        >
                                            {event.title ??
                                                `Event #${event.id}`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={data.date}
                                onChange={(e) =>
                                    setData('date', e.target.value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Search</Label>
                            <Input
                                onKeyDown={handleKeyDown}
                                onChange={handleSearchChange}
                                placeholder="Search by name, email, or username..."
                                value={data.search}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={submit}
                            disabled={isFiltering}
                        >
                            Search
                        </Button>
                        <Button variant="ghost" onClick={reset}>
                            Reset
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Date/Time
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Type
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Event
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Username
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Role
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logList.data.length > 0 ? (
                                logList.data.map((log) => (
                                    <TableRow key={log.id} className="text-sm">
                                        <TableCell className="text-sm">
                                            {log.date_time ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {log.check_type_label}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {log.event?.title ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {log.user?.name ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {log.user?.username ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {log.user?.role ?? '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-3 text-center text-gray-500"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <Pagination data={logList} />
                </div>
            </div>
        </AppLayout>
    );
}
