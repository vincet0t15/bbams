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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
    courses: { id: number; name: string; code: string | null }[];
    filters: {
        search?: string;
        event_id?: string;
        date?: string;
        role?: string;
        course_id?: string;
    };
};

export default function AttendanceLogsIndex({
    logList,
    events,
    courses,
    filters,
}: Props) {
    const { data, setData } = useForm({
        search: filters.search || '',
        event_id: filters.event_id || 'all',
        date: filters.date || '',
        role: filters.role || 'all',
        course_id: filters.course_id || 'all',
    });

    const [isFiltering, setIsFiltering] = useState(false);

    const buildQuery = (overrides?: Partial<typeof data>) => {
        const current = { ...data, ...(overrides ?? {}) };
        const query: Record<string, string> = {};

        if (current.search) {
            query.search = current.search;
        }

        if (current.event_id && current.event_id !== 'all') {
            query.event_id = current.event_id;
        }

        if (current.date) {
            query.date = current.date;
        }

        if (current.role && current.role !== 'all') {
            query.role = current.role;
        }

        if (
            current.role === 'student' &&
            current.course_id &&
            current.course_id !== 'all'
        ) {
            query.course_id = current.course_id;
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
            role: 'all',
            course_id: 'all',
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
                <div className="flex items-center justify-between gap-3">
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        size="sm"
                        value={data.role}
                        onValueChange={(val) => {
                            if (!val) {
                                return;
                            }

                            const role = val;
                            setData('role', role);
                            router.get(
                                '/attendance-logs',
                                buildQuery({
                                    role,
                                    course_id:
                                        role === 'student'
                                            ? data.course_id
                                            : 'all',
                                }),
                                {
                                    preserveScroll: true,
                                    preserveState: true,
                                },
                            );
                        }}
                        className="w-full justify-start"
                    >
                        <ToggleGroupItem value="all">All</ToggleGroupItem>
                        <ToggleGroupItem value="student">
                            Students
                        </ToggleGroupItem>
                        <ToggleGroupItem value="faculty">
                            Faculty
                        </ToggleGroupItem>
                        <ToggleGroupItem value="staff">Staff</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {data.role === 'student' ? (
                            <div className="space-y-2">
                                <Label>Program</Label>
                                <Select
                                    value={data.course_id}
                                    onValueChange={(val) =>
                                        setData('course_id', val)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="All programs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All programs
                                        </SelectItem>
                                        {courses.map((course) => (
                                            <SelectItem
                                                key={course.id}
                                                value={String(course.id)}
                                            >
                                                {course.name}
                                                {course.code
                                                    ? ` (${course.code})`
                                                    : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : null}
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
