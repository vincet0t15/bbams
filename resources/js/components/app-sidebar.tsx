import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    KeyRound,
    LayoutGrid,
    Palette,
    Settings,
    Shield,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { edit as editAppearance } from '@/routes/appearance';
import courses from '@/routes/courses';
import { edit as editProfile } from '@/routes/profile';
import { show as showTwoFactor } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { index as usersIndex } from '@/routes/users';
import type { NavGroup, NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage();
    const canManageRoles = Boolean(
        (props as any)?.auth?.permissions?.includes?.('roles.manage'),
    );

    const mainNavItems: NavGroup[] = [
        {
            title: 'General',
            children: [
                {
                    title: 'Dashboard',
                    href: dashboard(),
                    icon: LayoutGrid,
                },
            ],
        },
        {
            title: 'Management',
            children: [
                {
                    title: 'Accounts',
                    href: usersIndex.url(),
                    icon: Users,
                },
                {
                    title: 'Courses',
                    href: courses.index.url(),
                    icon: BookOpen,
                },
                ...(canManageRoles
                    ? [
                        {
                            title: 'Permissions & Roles',
                            href: '/roles',
                            icon: Shield,
                        },
                    ]
                    : []),
            ],
        },
        {
            title: 'Settings',
            children: [
                {
                    title: 'Profile',
                    href: editProfile(),
                    icon: Settings,
                },

            ],
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
