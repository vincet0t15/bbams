import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type PermissionDto = {
    id: number;
    name: string;
};

type RoleDto = {
    id: number;
    name: string;
    permissions: PermissionDto[];
};

type Props = {
    roles: RoleDto[];
    permissions: PermissionDto[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles & Permissions',
        href: '/roles',
    },
];

export default function RolesIndex({ roles, permissions }: Props) {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        [],
    );

    const permissionNames = useMemo(
        () => permissions.map((p) => p.name),
        [permissions],
    );

    const createPermissionForm = useForm({
        name: '',
    });

    const createRoleForm = useForm({
        name: '',
        permissions: [] as string[],
    });

    const togglePermission = (permission: string) => {
        setSelectedPermissions((prev) => {
            if (prev.includes(permission)) {
                return prev.filter((p) => p !== permission);
            }

            return [...prev, permission];
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles & Permissions" />

            <div className="flex flex-col gap-4 p-4">
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Permission</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="space-y-3"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    createPermissionForm.post('/permissions', {
                                        preserveScroll: true,
                                        onSuccess: () =>
                                            createPermissionForm.reset(),
                                    });
                                }}
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="permission-name">
                                        Permission name
                                    </Label>
                                    <Input
                                        id="permission-name"
                                        value={createPermissionForm.data.name}
                                        onChange={(e) =>
                                            createPermissionForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        autoComplete="off"
                                    />
                                    <InputError
                                        message={
                                            createPermissionForm.errors.name
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={createPermissionForm.processing}
                                >
                                    Create
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Create Role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                className="space-y-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    createRoleForm.setData(
                                        'permissions',
                                        selectedPermissions,
                                    );
                                    createRoleForm.post('/roles', {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setSelectedPermissions([]);
                                            createRoleForm.reset();
                                        },
                                    });
                                }}
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="role-name">Role name</Label>
                                    <Input
                                        id="role-name"
                                        value={createRoleForm.data.name}
                                        onChange={(e) =>
                                            createRoleForm.setData(
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        autoComplete="off"
                                    />
                                    <InputError
                                        message={createRoleForm.errors.name}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm font-medium">
                                        Permissions
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {permissionNames.map((name) => (
                                            <label
                                                key={name}
                                                className="flex cursor-pointer items-center gap-2 text-sm"
                                            >
                                                <Checkbox
                                                    checked={selectedPermissions.includes(
                                                        name,
                                                    )}
                                                    onCheckedChange={() =>
                                                        togglePermission(name)
                                                    }
                                                />
                                                <span>{name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError
                                        message={
                                            createRoleForm.errors.permissions
                                        }
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={createRoleForm.processing}
                                >
                                    Create
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex flex-col gap-2 rounded-lg border p-3"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="font-medium">
                                            {role.name}
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                router.delete(
                                                    `/roles/${role.id}`,
                                                    {
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.length ? (
                                            role.permissions.map((p) => (
                                                <Badge
                                                    key={p.id}
                                                    variant="secondary"
                                                >
                                                    {p.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                No permissions
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
