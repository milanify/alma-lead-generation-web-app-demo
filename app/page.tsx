import LeadForm from '@/components/LeadForm';

export default function PublicPage() {
  return (
    <main className="min-h-screen flex bg-white font-sans">
      {/* Left Side Hero Area */}
      <div className="hidden lg:flex flex-col w-[40%] bg-[#DCE2B1] pl-16 pr-8 py-16 relative overflow-hidden">
        {/* Mocking the graphic with layered circles like the Assessment mock */}
        <div className="absolute top-0 left-[-20%] w-[40vw] h-[40vw] min-w-[500px] min-h-[500px]">
          {/* Base bottom circle */}
          <div className="absolute top-[5%] left-[-5%] w-[85%] h-[85%] bg-[#C0CA7A] rounded-full drop-shadow-xl blur-[1px]"></div>
          {/* Middle circle */}
          <div className="absolute top-[18%] left-[2%] w-[70%] h-[70%] bg-[#CAD581] rounded-full drop-shadow-2xl"></div>
          {/* Top small circle */}
          <div className="absolute top-[35%] left-[8%] w-[50%] h-[50%] bg-[#D7E28E] rounded-full drop-shadow-2xl shadow-inner border border-[#E9F4A4]/50"></div>
          {/* Topmost small circle */}
          <div className="absolute top-[55%] left-[18%] w-[25%] h-[25%] bg-[#DAE58C] rounded-full drop-shadow-xl border border-[#E9F4A4]/30"></div>
        </div>
        
        <div className="relative z-10 pt-[50%] lg:pt-[45%] xl:pt-[35%] space-y-6">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 flex items-center mb-10">
            almă
          </h1>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
            Get An Assessment<br/>Of Your Immigration Case
          </h2>
        </div>
      </div>

      {/* Right Side Form Area */}
      <div className="flex-1 overflow-y-auto">
        <LeadForm />
      </div>
    </main>
  );
}