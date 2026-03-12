import { Head, router, useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
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
import type { Faculty } from '@/types/faculty';
import type { FilterProps } from '@/types/filter';
import type { PaginatedDataResponse } from '@/types/pagination';
import FacultyCreateDialog from './create';
import FacultyDeleteDialog from './delete';
import FacultyEditDialog from './edit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Faculty',
        href: '/faculties',
    },
];

interface Props {
    facultyList: PaginatedDataResponse<Faculty>;
    filters: FilterProps;
}

export default function FacultyIndex({ facultyList, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selected, setSelected] = useState<Faculty | null>(null);
    const { data, setData } = useForm({
        search: filters.search || '',
    });

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const query: Record<string, string> = {};

            if (data.search) {
                query.search = data.search;
            }

            router.get(
                '/faculties',
                Object.keys(query).length ? query : undefined,
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };

    const handleEditClick = (row: Faculty) => {
        setSelected(row);
        setOpenEdit(true);
    };
    const handleDeleteClick = (row: Faculty) => {
        setSelected(row);
        setOpenDelete(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Faculty" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => setOpenCreate(true)}
                    >
                        <PlusIcon />
                        <span className="rounded-sm lg:inline">Faculty</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input
                            onKeyDown={handleKeyDown}
                            onChange={handleSearchChange}
                            placeholder="Search by name, email, or employee no..."
                            value={data.search}
                        />
                        <Button
                            variant="outline"
                            onClick={() => {
                                const query: Record<string, string> = {};

                                if (data.search) {
                                    query.search = data.search;
                                }

                                router.get(
                                    '/faculties',
                                    Object.keys(query).length
                                        ? query
                                        : undefined,
                                    {
                                        preserveScroll: true,
                                        preserveState: true,
                                    },
                                );
                            }}
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="font-bold text-primary">
                                    Name
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Username
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Email
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Employee No
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Department
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Position
                                </TableHead>
                                <TableHead className="font-bold text-primary">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facultyList.data.length > 0 ? (
                                facultyList.data.map((f) => (
                                    <TableRow key={f.id} className="text-sm">
                                        <TableCell className="text-sm">
                                            {f.user?.name}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {f.user?.username}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {f.user?.email}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {f.employee_no || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {f.department || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {f.position || '-'}
                                        </TableCell>
                                        <TableCell className="flex gap-2 text-sm">
                                            <span
                                                onClick={() =>
                                                    handleEditClick(f)
                                                }
                                                className="cursor-pointer text-green-500 hover:text-green-700 hover:underline"
                                            >
                                                Edit
                                            </span>
                                            <span
                                                onClick={() =>
                                                    handleDeleteClick(f)
                                                }
                                                className="cursor-pointer text-red-500 hover:text-orange-700 hover:underline"
                                            >
                                                Delete
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
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
                    <Pagination data={facultyList} />
                </div>
            </div>
            {openCreate && (
                <FacultyCreateDialog
                    open={openCreate}
                    setOpen={setOpenCreate}
                />
            )}
            {openEdit && selected && (
                <FacultyEditDialog
                    open={openEdit}
                    setOpen={setOpenEdit}
                    faculty={selected}
                />
            )}
            {openDelete && selected && (
                <FacultyDeleteDialog
                    open={openDelete}
                    setOpen={setOpenDelete}
                    faculty={selected}
                />
            )}
        </AppLayout>
    );
}
