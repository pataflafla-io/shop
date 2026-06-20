import { Sidebar, TopMenu } from "@/components/ui";

export default function ShopLayout({ children }: { children: React.ReactNode; }) {
    return (
        <main className="min-h-screen">
            <TopMenu />
            <Sidebar />
            <div className="px-5 sm:px-10">
                {children}
            </div>
        </main>
    );
}