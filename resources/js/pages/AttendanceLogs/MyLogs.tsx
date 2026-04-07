import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    CalendarDays,
    Clock,
    FileSpreadsheet,
    Filter,
    Search,
} from 'lucide-react';
import Pagination from '@/components/paginationData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import type { PaginatedDataResponse } from '@/types/pagination';

type LogRow = {
    id: number;
    date_time: string | null;
    check_type: number;
    check_type_label: string;
    event: {
        id: number | null;
        title: string | null;
    };
};

type Event = {
    id: number;
    title: string | null;
};

type Props = {
    logList: PaginatedDataResponse<LogRow>;
    events: Event[];
    filters: {
        event_id?: string;
        date?: string;
    };
    user: {
        id: number;
        name: string;
        account_type: string;
    };
};

export default function MyLogs({ logList, events, filters, user }: Props) {
    const [searchDate, setSearchDate] = useState(filters.date || '');
    const [selectedEvent, setSelectedEvent] = useState(
        filters.event_id || 'all',
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Attendance Logs', href: '/attendance-logs' },
    ];

    const handleFilter = () => {
        router.get(
            '/attendance-logs',
            {
                ...(selectedEvent !== 'all' && { event_id: selectedEvent }),
                ...(searchDate && { date: searchDate }),
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleReset = () => {
        setSearchDate('');
        setSelectedEvent('all');
        router.get(
            '/attendance-logs',
            {},
            { preserveState: true, replace: true },
        );
    };

    const totalIn = logList.data.filter((log) => log.check_type === 1).length;
    const totalOut = logList.data.filter((log) => log.check_type === 2).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Attendance Logs" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            My Attendance Logs
                        </h1>
                        <p className="text-muted-foreground">
                            Welcome, {user.name} ({user.account_type})
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/my-dtr">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            View My DTR
                        </Link>
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Records
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {logList.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Time In
                            </CardTitle>
                            <Clock className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {totalIn}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Time Out
                            </CardTitle>
                            <Clock className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {totalOut}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                        <CardDescription>
                            Filter your attendance logs by date or event
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="min-w-[200px] flex-1">
                                <label className="mb-2 block text-sm font-medium">
                                    Event
                                </label>
                                <Select
                                    value={selectedEvent}
                                    onValueChange={setSelectedEvent}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Events" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Events
                                        </SelectItem>
                                        {events.map((event) => (
                                            <SelectItem
                                                key={event.id}
                                                value={event.id.toString()}
                                            >
                                                {event.title ||
                                                    'Untitled Event'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="min-w-[200px] flex-1">
                                <label className="mb-2 block text-sm font-medium">
                                    Date
                                </label>
                                <div className="relative">
                                    <CalendarDays className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        value={searchDate}
                                        onChange={(e) =>
                                            setSearchDate(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={handleFilter}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Apply
                                </Button>
                                <Button variant="outline" onClick={handleReset}>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Logs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Records</CardTitle>
                        <CardDescription>
                            Your attendance check-in and check-out records
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Event</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logList.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="py-8 text-center"
                                        >
                                            <p className="text-muted-foreground">
                                                No attendance logs found
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logList.data.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                {log.date_time ? (
                                                    <div>
                                                        <div className="font-medium">
                                                            {new Date(
                                                                log.date_time,
                                                            ).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {new Date(
                                                                log.date_time,
                                                            ).toLocaleTimeString()}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        log.check_type === 1
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        log.check_type === 1
                                                            ? 'bg-green-600 hover:bg-green-700'
                                                            : 'bg-red-600 hover:bg-red-700'
                                                    }
                                                >
                                                    {log.check_type_label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {log.event?.title || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {logList.total > 15 && (
                            <div className="mt-4">
                                <Pagination data={logList} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
