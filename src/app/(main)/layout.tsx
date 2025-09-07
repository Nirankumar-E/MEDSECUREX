'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/useAuth';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
} from '@/components/ui/sidebar';
// MODIFICATION: Added UserCircle for the new profile button
import { Bell, ChevronDown, LayoutDashboard, LogOut, Settings, ShieldAlert, ShieldCheck, HeartPulse, Archive, ClipboardList, FileText, BarChart, Rocket, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { auth } from '@/lib/firebase';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, role, loading, setUser, setRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const navItems = [
    { href: '/overview', label: 'Overview', icon: LayoutDashboard, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/health-api-shield', label: 'Health API Shield', icon: HeartPulse, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/med-x-box', label: 'MED x Box', icon: Archive, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/alerts', label: 'Alerts', icon: ShieldAlert, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/incidents', label: 'Incidents', icon: FileText, roles: ['Admin', 'Analyst'] },
    { href: '/ttps', label: 'TTPs', icon: BarChart, roles: ['Admin', 'Analyst'] },
    { href: '/pii-reports', label: 'PII Reports', icon: ClipboardList, roles: ['Admin', 'Analyst'] },
    { href: '/agents', label: 'Agents', icon: Rocket, roles: ['Admin', 'Analyst', 'Viewer'] },
    { href: '/settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
  ];

  const filteredNavItems = navItems.filter(item => role && item.roles.includes(role));
  
  const getPageData = (path: string) => {
    return navItems.find(item => path.startsWith(item.href))
  }
  const currentPage = getPageData(pathname)

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setRole(null);
    localStorage.removeItem('medi-secure-x2-user');
    router.push('/login');
  }

  return (
    // MODIFICATION: Removed defaultOpen prop to let the component control its state
    <SidebarProvider>
      <Sidebar>
        {/* MODIFICATION: Simplified header to only show the logo */}
        <SidebarHeader>
          <div className="bg-primary text-primary-foreground rounded-lg p-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="flex-1">
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      {/* MODIFICATION: Removed the text span to make it icon-only */}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>

        {/* MODIFICATION: Replaced the footer content with an icon-only dropdown trigger */}
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip="Profile" className="w-full mt-auto">
                    <UserCircle />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            {currentPage && (
              <h1 className="text-lg font-semibold md:text-xl font-headline text-muted-foreground">{currentPage.label}</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign out</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-4">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}