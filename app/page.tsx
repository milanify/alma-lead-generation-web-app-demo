import LeadForm from '@/components/LeadForm';
import Image from 'next/image';

export default function PublicPage() {
  return (
    <main className="min-h-screen flex bg-white">
      {/* Left Side Hero Area */}
      <div className="hidden lg:flex flex-col w-1/3 bg-[#D9E3A5] p-12 relative overflow-hidden">
        {/* Mocking the graphic with basic CSS shapes for rapid implementation */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#C5D67D] rounded-full -translate-x-1/2 -translate-y-1/4 drop-shadow-2xl"></div>
        <div className="absolute top-20 left-10 w-48 h-48 bg-[#D3E090] rounded-full drop-shadow-xl"></div>
        
        <div className="relative z-10 mt-32 space-y-6">
          <h1 className="text-2xl font-black tracking-tighter">almă</h1>
          <h2 className="text-5xl font-extrabold leading-tight text-black">
            Get An Assessment<br/>Of Your Immigration Case
          </h2>
        </div>
      </div>

      {/* Right Side Form Area */}
      <div className="flex-1 overflow-y-auto px-6 py-12 lg:px-24">
        <LeadForm />
      </div>
    </main>
  );
}