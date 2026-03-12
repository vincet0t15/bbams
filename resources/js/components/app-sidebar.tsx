import { Link } from '@inertiajs/react';
import {
    BookOpen,
    FolderGit2,
    KeyRound,
    LayoutGrid,
    Palette,
    Settings,
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
import { edit as editProfile } from '@/routes/profile';
import { show as showTwoFactor } from '@/routes/two-factor';
import { edit as editPassword } from '@/routes/user-password';
import { index as usersIndex } from '@/routes/users';
import type { NavGroup, NavItem } from '@/types';
import courses from '@/routes/courses';

const mainNavItems = [
    {
        title: 'General',
        children: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
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
            {
                title: 'Password',
                href: editPassword(),
                icon: KeyRound,
            },
            {
                title: 'Two-factor auth',
                href: showTwoFactor(),
                icon: ShieldCheck,
            },
            {
                title: 'Appearance',
                href: editAppearance(),
                icon: Palette,
            },
        ],
    },
] satisfies NavGroup[];

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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
