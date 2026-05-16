interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  return (
    <div className="gap-6 lg:grid lg:grid-cols-[16rem_1fr]">
      {sidebar}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
