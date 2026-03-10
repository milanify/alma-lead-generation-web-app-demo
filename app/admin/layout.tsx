import StoreProvider from '../StoreProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col justify-between">
          <div className="p-8 space-y-8">
            <h1 className="text-3xl font-black tracking-tighter">almă</h1>
            <nav className="space-y-4 text-sm font-semibold text-gray-600">
              <p className="text-black font-bold">Leads</p>
              <p>Settings</p>
            </nav>
          </div>
          <div className="p-8 flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xs">A</div>
            <span className="font-bold">Admin</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-12 bg-white">
          {children}
        </main>
      </div>
    </StoreProvider>
  );
}