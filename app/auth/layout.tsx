
export default function ShopLayout({ children }: { children: React.ReactNode; }) {
    return (
        <main className="flex justify-center">
            <div className="w-full sm:w-87.5 px-5">
                {children}
            </div>
        </main>
    );
}