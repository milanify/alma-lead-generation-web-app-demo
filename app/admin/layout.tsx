import { Metadata } from 'next';
import StoreProvider from '../StoreProvider';

export const metadata: Metadata = {
  title: "Leads | Admin",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col justify-between relative z-10">
          {/* Subtle yellow gradient background layer for the top part */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-[#FCFDDD] via-[#FCFECA]/30 to-white/0 pointer-events-none z-[-1]" />
          
          <div className="pt-12 px-10 space-y-12">
            <h1 className="text-4xl font-black tracking-tighter">almă</h1>
            <nav className="space-y-6 text-[15px] font-semibold text-gray-500">
              <p className="text-gray-900 font-bold group cursor-pointer flex items-center">
                Leads
              </p>
              <p className="hover:text-gray-900 cursor-pointer transition-colors">Settings</p>
            </nav>
          </div>
          
          <div className="p-8 px-10 flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-sm border border-gray-200 shadow-sm">
              A
            </div>
            <span className="font-bold text-[15px]">Admin</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.05)] relative z-20">
          <div className="p-12 max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </StoreProvider>
  );
}