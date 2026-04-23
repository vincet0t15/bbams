import { Head, router, useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import Pagination from '@/components/paginationData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { Event } from '@/types/event';
import type { FilterProps } from '@/types/filter';
import type { PaginatedDataResponse } from '@/types/pagination';
import EventCreateDialog from './create';
import EventDeleteDialog from './delete';
import EventEditDialog from './edit';
import { Card, CardContent } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Events',
        href: '/events',
    },
];

type Props = {
    eventList: PaginatedDataResponse<Event>;
    filters: FilterProps;
};

export default function EventsIndex({ eventList, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [facultiesTotal, setFacultiesTotal] = useState<number | null>(null);
    const [staffTotal, setStaffTotal] = useState<number | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = data.search
                ? { search: data.search }
                : undefined;
            router.get('/events', queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setOpenEdit(true);
    };

    const handleDeleteClick = (event: Event) => {
        setSelectedEvent(event);
        setOpenDelete(true);
    };

    useEffect(() => {
        const jsonHeaders = {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Inertia': 'true',
        };

        const resolveTotalFromPayload = (data, keyName) => {
            const payload = keyName ? data?.props?.[keyName] ?? data : data;
            const maybeTotal =
                (typeof payload?.total === 'number' ? payload.total : null) ||
                (typeof payload?.meta?.total === 'number' ? payload.meta.total : null) ||
                (typeof payload?.data?.total === 'number' ? payload.data.total : null) ||
                (typeof payload?.data?.meta?.total === 'number' ? payload.data.meta.total : null) ||
                (Array.isArray(payload?.data) ? payload.data.length :
                    (Array.isArray(payload) ? payload.length : 0));

            return Number(maybeTotal ?? 0);
        };

        fetch('/faculties', { headers: jsonHeaders, credentials: 'same-origin' })
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data) => setFacultiesTotal(resolveTotalFromPayload(data, 'facultyList')))
            .catch(() => setFacultiesTotal(0));

        fetch('/staff', { headers: jsonHeaders, credentials: 'same-origin' })
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data) => setStaffTotal(resolveTotalFromPayload(data, 'staffList')))
            .catch(() => setStaffTotal(0));
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
                <div className="flex w-full items-start gap-4">
                    <div className="w-1/3 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
                        <div className="text-sm font-medium">Total Events</div>
                        <div className="text-3xl font-bold">
                            {eventList.total ?? 0}
                        </div>
                    </div>
                </div>

                <Card className="mt-2 border-green-100 bg-green-50">
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-medium">Quick Tip</div>
                            <div className="text-sm text-muted-foreground">
                                Click an event row to open edit, or use the
                                action buttons.
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="default"
                        size="sm"
                        className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => setOpenCreate(true)}
                    >
                        <PlusIcon />
                        <span className="rounded-sm lg:inline">Event</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input
                            onKeyDown={handleKeyDown}
                            onChange={handleSearchChange}
                            placeholder="Search by title or location..."
                            value={data.search}
                        />
                        <Button
                            variant="default"
                            className="bg-sky-500 text-white hover:bg-sky-600"
                            onClick={() => {
                                const queryString = data.search
                                    ? { search: data.search }
                                    : undefined;
                                router.get('/events', queryString, {
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
                    <Table>
                        <TableHeader className="rounded-tl-xl rounded-tr-xl bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Title
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Location
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Start
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    End
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventList.data.length > 0 ? (
                                eventList.data.map((event) => (
                                    <TableRow
                                        key={event.id}
                                        className="cursor-pointer text-sm hover:bg-muted/10"
                                        role="button"
                                        onClick={() => handleEditClick(event)}
                                    >
                                        <TableCell className="text-sm uppercase">
                                            {event.title}
                                        </TableCell>
                                        <TableCell className="text-sm uppercase">
                                            {event.location || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {event.start_at || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {event.end_at || '-'}
                                        </TableCell>
                                        <TableCell className="flex gap-2 text-sm">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-green-500 hover:text-green-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(event);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-orange-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(event);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="p-8">
                                        <div className="flex h-48 w-full items-center justify-center">
                                            <div className="text-center">
                                                <div className="mb-4 text-4xl text-muted-foreground">
                                                    📅
                                                </div>
                                                <div className="text-lg font-semibold">
                                                    No events found
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Create your first event to
                                                    get started
                                                </div>
                                                <div className="mt-4">
                                                    <Button
                                                        variant="default"
                                                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                                                        onClick={() =>
                                                            setOpenCreate(true)
                                                        }
                                                    >
                                                        Add Event
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={eventList} />
                </div>
            </div>
            {openCreate && (
                <EventCreateDialog open={openCreate} setOpen={setOpenCreate} />
            )}
            {openEdit && selectedEvent && (
                <EventEditDialog
                    open={openEdit}
                    setOpen={setOpenEdit}
                    event={selectedEvent}
                />
            )}
            {openDelete && selectedEvent && (
                <EventDeleteDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    event={selectedEvent}
                />
            )}
        </AppLayout>
    );
}
