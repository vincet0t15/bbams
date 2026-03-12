import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, User } from '@/types';
import type { PaginatedDataResponse } from '@/types/pagination';
import { Course } from '@/types/course';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import courses from '@/routes/courses';
import { FilterProps } from '@/types/filter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/paginationData';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Courses',
        href: '/courses',
    },
];

interface Props {
    courseList: PaginatedDataResponse<Course>;
    filters: FilterProps;
}
export default function CoursesIndex({ courseList, filters }: Props) {
    const [openCreate, setOpenCreate] = useState(false);
    const { data, setData } = useForm({
        search: filters.search || '',
    });
    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            const queryString = data.search ? { search: data.search } : undefined;
            router.get((courses.index().url), queryString, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setData('search', e.target.value);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courses" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setOpenCreate(true)}>
                        <PlusIcon />
                        <span className="rounded-sm lg:inline">Course</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Input onKeyDown={handleKeyDown} onChange={handleSearchChange} placeholder="Search..." value={data.search} />
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-sm border shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-primary font-bold">Course Name</TableHead>
                                <TableHead className="text-primary font-bold">Course Code</TableHead>
                                <TableHead className="text-primary font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courseList.data.length > 0 ? (
                                courseList.data.map((course, index) => (
                                    <TableRow key={index} className="text-sm">
                                        <TableCell className="cursor-pointer text-sm uppercase hover:font-bold hover:underline">
                                            {course.name}
                                        </TableCell>
                                        <TableCell className="text-sm uppercase">{course.description}</TableCell>
                                        <TableCell className="text-sm gap-2 flex">
                                            <span
                                                className="cursor-pointer text-green-500 hover:text-orange-700 hover:underline"

                                            >
                                                Edit
                                            </span>
                                            <span
                                                className="text-red-500 cursor-pointer hover:text-orange-700 hover:underline"

                                            >
                                                Delete
                                            </span>

                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-3 text-center text-gray-500">
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Pagination data={courseList} />
                </div>
            </div>

        </AppLayout>
    );
}
