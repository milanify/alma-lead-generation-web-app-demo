import { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: "Get Assessment | Alma",
};

export default function PublicPage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#fafaf8] font-sans">
      {/* Top Hero Area */}
      <div className="w-full bg-[#DCE2B1] pt-12 pb-20 relative overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Mocking the graphic circles */}
        <div className="absolute top-[-50%] left-[10%] w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] pointer-events-none opacity-60">
          <div className="absolute top-[5%] left-[-5%] w-[85%] h-[85%] bg-[#C0CA7A] rounded-full drop-shadow-xl blur-[1px]"></div>
          <div className="absolute top-[18%] left-[2%] w-[70%] h-[70%] bg-[#CAD581] rounded-full drop-shadow-2xl"></div>
          <div className="absolute top-[35%] left-[8%] w-[50%] h-[50%] bg-[#D7E28E] rounded-full drop-shadow-2xl shadow-inner border border-[#E9F4A4]/50"></div>
          <div className="absolute top-[55%] left-[18%] w-[25%] h-[25%] bg-[#DAE58C] rounded-full drop-shadow-xl border border-[#E9F4A4]/30"></div>
        </div>
        
        <div className="relative z-10 space-y-4 max-w-2xl mt-8">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 flex items-center justify-center mb-6">
            almă
          </h1>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
            Get An Assessment<br/>Of Your Immigration Case
          </h2>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-y-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl max-w-[600px] mx-auto overflow-hidden">
          <LeadForm />
        </div>
      </div>
    </main>
  );
}