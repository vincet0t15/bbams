import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    const [openEditRole, setOpenEditRole] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState<RoleDto | null>(null);

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

    const updateRoleForm = useForm({
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

    const openEditRoleDialog = (role: RoleDto) => {
        setRoleToEdit(role);
        updateRoleForm.setData('name', role.name);
        updateRoleForm.setData(
            'permissions',
            role.permissions.map((p) => p.name),
        );
        setOpenEditRole(true);
    };

    const toggleEditPermission = (permission: string) => {
        const current = updateRoleForm.data.permissions;

        if (current.includes(permission)) {
            updateRoleForm.setData(
                'permissions',
                current.filter((p) => p !== permission),
            );

            return;
        }

        updateRoleForm.setData('permissions', [...current, permission]);
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
                                        selectedPermissions.filter((p) =>
                                            permissionNames.includes(p),
                                        ),
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
                        <CardTitle>Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                                >
                                    <div className="text-sm font-medium">
                                        {permission.name}
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            if (
                                                !window.confirm(
                                                    `Delete permission "${permission.name}"?`,
                                                )
                                            ) {
                                                return;
                                            }

                                            router.delete(
                                                `/permissions/${permission.id}`,
                                                {
                                                    preserveScroll: true,
                                                },
                                            );
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

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
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={role.name === 'admin'}
                                                onClick={() => {
                                                    if (role.name === 'admin') {
                                                        return;
                                                    }

                                                    openEditRoleDialog(role);
                                                }}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={role.name === 'admin'}
                                                onClick={() => {
                                                    if (role.name === 'admin') {
                                                        return;
                                                    }

                                                    if (
                                                        !window.confirm(
                                                            `Delete role "${role.name}"?`,
                                                        )
                                                    ) {
                                                        return;
                                                    }

                                                    router.delete(
                                                        `/roles/${role.id}`,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
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

            <Dialog
                open={openEditRole}
                onOpenChange={(open) => {
                    if (!open) {
                        setRoleToEdit(null);
                        updateRoleForm.reset();
                    }

                    setOpenEditRole(open);
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Update Role</DialogTitle>
                        <DialogDescription>
                            {roleToEdit
                                ? `Update role "${roleToEdit.name}"`
                                : 'Update role'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-role-name">Role name</Label>
                            <Input
                                id="edit-role-name"
                                value={updateRoleForm.data.name}
                                onChange={(e) =>
                                    updateRoleForm.setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                                autoComplete="off"
                            />
                            <InputError message={updateRoleForm.errors.name} />
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
                                            checked={updateRoleForm.data.permissions.includes(
                                                name,
                                            )}
                                            onCheckedChange={() =>
                                                toggleEditPermission(name)
                                            }
                                        />
                                        <span>{name}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError
                                message={updateRoleForm.errors.permissions}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpenEditRole(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            disabled={!roleToEdit || updateRoleForm.processing}
                            onClick={() => {
                                if (!roleToEdit) {
                                    return;
                                }

                                updateRoleForm.put(`/roles/${roleToEdit.id}`, {
                                    preserveScroll: true,
                                    onSuccess: () => setOpenEditRole(false),
                                });
                            }}
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
