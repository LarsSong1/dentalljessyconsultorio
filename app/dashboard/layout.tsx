// app/dashboard/layout.tsx
import { LayoutWrapper } from "@/components/layout-wrapper"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutWrapper breadcrumbs={[]}>
      {children}
    </LayoutWrapper>
  )
}
