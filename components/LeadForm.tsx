'use client';
import { useState } from 'react';
import { FileText, Dice5, Heart, ChevronDown } from 'lucide-react';
import { Lead } from '@/types';

export default function LeadForm() {
  const [data, setData] = useState<Partial<Lead>>({ visas: [] });
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.firstName) newErrors.firstName = 'First name is required';
    if (!data.lastName) newErrors.lastName = 'Last name is required';
    if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) newErrors.email = 'Valid email is required';
    if (!data.citizenship) newErrors.citizenship = 'Country of Citizenship is required';
    if (!data.visas || data.visas.length === 0) newErrors.visas = 'Please select at least one visa';
    if (!data.message || data.message.length < 10) newErrors.message = 'Please provide details on how we can help';
    if (!file) newErrors.file = 'Resume / CV is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const leadData = { ...data, resumeUrl: file ? file.name : '' };
    
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    setSubmitted(true);
  };

  const handleVisaChange = (visa: string) => {
    setData((prev) => {
      const visas = prev.visas || [];
      if (visas.includes(visa)) {
        return { ...prev, visas: visas.filter((v) => v !== visa) };
      } else {
        return { ...prev, visas: [...visas, visa] };
      }
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 pt-32 pb-20 max-w-[480px] mx-auto">
        <div className="flex flex-col items-center select-none">
          <FileText className="w-16 h-16 text-indigo-300 drop-shadow-sm" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Thank You</h2>
        <p className="text-gray-900 text-center font-medium px-4 leading-relaxed max-w-[400px]">
          Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai.
        </p>
        <div className="pt-4">
          <button onClick={() => window.location.reload()} className="px-10 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all">
            Go Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full border border-gray-300 rounded-xl p-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all";

  return (
    <div className="max-w-[460px] mx-auto space-y-12 pb-16 pt-8">
      <div className="text-center flex flex-col items-center space-y-4">
        <FileText className="w-12 h-12 text-indigo-300 mb-2 drop-shadow-sm" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold pb-2 tracking-tight">Want to understand your visa options?</h2>
        <p className="text-sm font-semibold text-gray-600 leading-relaxed px-2">
          Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <div>
            <input type="text" placeholder="First Name" value={data.firstName || ''} onChange={(e) => setData({ ...data, firstName: e.target.value })} className={inputClasses} />
            {errors.firstName && <p className="text-red-500 text-xs mt-1 px-1">{errors.firstName}</p>}
          </div>
          <div>
            <input type="text" placeholder="Last Name" value={data.lastName || ''} onChange={(e) => setData({ ...data, lastName: e.target.value })} className={inputClasses} />
            {errors.lastName && <p className="text-red-500 text-xs mt-1 px-1">{errors.lastName}</p>}
          </div>
          <div>
            <input type="email" placeholder="Email" value={data.email || ''} onChange={(e) => setData({ ...data, email: e.target.value })} className={inputClasses} />
            {errors.email && <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>}
          </div>
          <div className="relative">
            <select 
              value={data.citizenship || ''} 
              onChange={(e) => setData({ ...data, citizenship: e.target.value })} 
              className={`${inputClasses} appearance-none bg-transparent ${!data.citizenship ? 'text-gray-400' : 'text-gray-900'}`}
            >
              <option value="" disabled hidden>Country of Citizenship</option>
              <option value="Mexico" className="text-gray-900">Mexico</option>
              <option value="Brazil" className="text-gray-900">Brazil</option>
              <option value="South Korea" className="text-gray-900">South Korea</option>
              <option value="Russia" className="text-gray-900">Russia</option>
              <option value="France" className="text-gray-900">France</option>
              <option value="Other" className="text-gray-900">Other</option>
            </select>
            <ChevronDown className="absolute right-4 top-[18px] w-5 h-5 text-gray-400 pointer-events-none" />
            {errors.citizenship && <p className="text-red-500 text-xs mt-1 px-1">{errors.citizenship}</p>}
          </div>
          <div>
            <input type="text" placeholder="LinkedIn / Personal Website URL" value={data.linkedin || ''} onChange={(e) => setData({ ...data, linkedin: e.target.value })} className={inputClasses} />
          </div>
          <div>
            <div className="relative border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all group">
              <input 
                type="file" 
                id="resumeUpload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx"
              />
              <div className="flex items-center justify-between p-4 bg-white">
                <span className={`truncate text-sm ${file ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {file ? file.name : 'Resume / CV'}
                </span>
                <span className="text-gray-500 bg-gray-100 group-hover:bg-gray-200 px-3 py-1 rounded-md text-xs font-semibold transition-colors">
                  Browse
                </span>
              </div>
            </div>
            {errors.file && <p className="text-red-500 text-xs mt-1 px-1">{errors.file}</p>}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Dice5 className="w-12 h-12 text-indigo-300 mb-0 drop-shadow-sm" strokeWidth={1.5} />
          <h3 className="font-bold text-xl tracking-tight">Visa categories of interest?</h3>
          {errors.visas && <p className="text-red-500 text-xs text-center w-full">{errors.visas}</p>}
          <div className="w-full flex flex-col space-y-3 pt-2">
            {['O-1', 'EB-1A', 'EB-2 NIW', "I don't know"].map((visa) => (
              <label key={visa} className="flex items-center space-x-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${data.visas?.includes(visa) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                  {data.visas?.includes(visa) && (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-sm text-gray-800">{visa}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Heart className="w-12 h-12 text-indigo-300 mb-0 drop-shadow-sm" strokeWidth={1.5} />
          <h3 className="font-bold text-xl tracking-tight">How can we help you?</h3>
          <div className="w-full pt-2">
            <textarea 
              rows={4}
              placeholder="What is your current status and when does it expire? What is your past immigration history? Are you looking for long-term permanent residency or short-term employment visa or both? Are there any timeline considerations?" 
              value={data.message || ''} 
              onChange={(e) => setData({ ...data, message: e.target.value })} 
              className={`${inputClasses} resize-none text-sm placeholder:text-gray-400 leading-relaxed`} 
            />
            {errors.message && <p className="text-red-500 text-xs mt-1 px-1">{errors.message}</p>}
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-gray-900 border border-gray-900 text-white font-semibold rounded-2xl hover:bg-black transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 text-base">
          Submit
        </button>
      </form>
    </div>
  );
}