'use client';
import { useState, useMemo } from 'react';
import Select from 'react-select';
import { FileText, Dice5, Heart } from 'lucide-react';
import { Lead } from '@/types';

// Large list of countries for the dropdown
const COUNTRIES = [
  'United States', 'Mexico', 'Brazil', 'South Korea', 'Russia', 'France',
  'China', 'India', 'Canada', 'United Kingdom', 'Japan', 'Germany',
  'Australia', 'Italy', 'Spain', 'Argentina', 'Other'
].map(c => ({ value: c, label: c }));

export default function LeadForm() {
  const [data, setData] = useState<Partial<Lead>>({ visas: [] });
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [noLinkedin, setNoLinkedin] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.firstName) newErrors.firstName = 'First name is required';
    if (!data.lastName) newErrors.lastName = 'Last name is required';

    // Robust Email Regex
    if (!data.email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(data.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!data.citizenship) newErrors.citizenship = 'Country of Citizenship is required';

    // LinkedIn validation if "None" is NOT checked
    if (!noLinkedin) {
      if (!data.linkedin || !/^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$|^(https?:\/\/)?([\w]+\.)?.*\.com.*$/.test(data.linkedin)) {
        newErrors.linkedin = 'Valid LinkedIn / Personal Website URL. Or click None.';
      }
    }

    if (!data.visas || data.visas.length === 0) {
      newErrors.visas = 'Please select at least one visa';
    } else if (data.visas.includes("I don't know")) {
      // Valid submission, no error
    }

    if (!data.message || data.message.length < 10) {
      if (data.message && data.message.length > 0) {
        newErrors.message = `Please enter ${10 - data.message.length} more characters for submission. You have entered ${data.message.length} so far.`;
      } else {
        newErrors.message = 'Please provide details on how we can help';
      }
    }

    if (!file) newErrors.file = 'Resume / CV is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const leadData = {
      ...data,
      linkedin: noLinkedin ? 'None Provided' : data.linkedin,
      resumeUrl: file ? file.name : ''
    };

    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    setSubmitted(true);
  };

  const handleVisaChange = (visa: string) => {
    setData((prev) => {
      let visas = prev.visas || [];

      // If clicking "I don't know"
      if (visa === "I don't know") {
        if (visas.includes("I don't know")) {
          return { ...prev, visas: [] }; // uncheck it
        } else {
          return { ...prev, visas: ["I don't know"] }; // check it, clear others
        }
      }

      // If clicking anything else, remove "I don't know" first
      visas = visas.filter(v => v !== "I don't know");

      if (visas.includes(visa)) {
        return { ...prev, visas: visas.filter((v) => v !== visa) };
      } else {
        return { ...prev, visas: [...visas, visa] };
      }
    });
  };

  const handleNoneClick = () => {
    setNoLinkedin(!noLinkedin);
    if (!noLinkedin) {
      // Clear errors for linkedin when switching to "None"
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs.linkedin;
        return newErrs;
      });
      setData(prev => ({ ...prev, linkedin: '' }));
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-20 px-8">
        <div className="flex flex-col items-center select-none">
          <FileText className="w-16 h-16 text-indigo-300 drop-shadow-sm" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Thank You</h2>
        <p className="text-gray-900 text-center font-medium leading-relaxed max-w-[400px]">
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
    <div className="mx-auto space-y-12 pb-16 pt-10 px-6 sm:px-12">
      <div className="text-center flex flex-col items-center space-y-4">
        <FileText className="w-12 h-12 text-indigo-300 mb-2 drop-shadow-sm" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold pb-2 tracking-tight">Want to understand your visa options?</h2>
        <p className="text-sm font-semibold text-gray-600 leading-relaxed max-w-sm">
          Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="First Name"
              value={data.firstName || ''}
              onChange={(e) => {
                e.target.setCustomValidity("");
                setData({ ...data, firstName: e.target.value });
              }}
              onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please include letters only.")}
              pattern="[A-Za-z\s\-]+"
              className={inputClasses}
              required
            />
            {errors.firstName && !data.firstName && <p className="text-red-500 text-xs mt-1 px-1">{errors.firstName}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              value={data.lastName || ''}
              onChange={(e) => {
                e.target.setCustomValidity("");
                setData({ ...data, lastName: e.target.value });
              }}
              onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("Please include letters only.")}
              pattern="[A-Za-z\s\-]+"
              className={inputClasses}
              required
            />
            {errors.lastName && !data.lastName && <p className="text-red-500 text-xs mt-1 px-1">{errors.lastName}</p>}
          </div>
          <div>
            <input type="email" placeholder="Email" value={data.email || ''} onChange={(e) => setData({ ...data, email: e.target.value })} className={inputClasses} />
            {errors.email && <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <Select
              options={COUNTRIES}
              placeholder="Country of Citizenship"
              className="react-select-container"
              classNamePrefix="react-select"
              value={data.citizenship ? { value: data.citizenship, label: data.citizenship } : null}
              onChange={(option) => setData({ ...data, citizenship: option?.value || '' })}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? 'black' : '#d1d5db',
                  borderRadius: '0.75rem',
                  padding: '5px',
                  boxShadow: state.isFocused ? '0 0 0 2px black' : 'none',
                  '&:hover': { borderColor: state.isFocused ? 'black' : '#d1d5db' },
                }),
                placeholder: (base) => ({ ...base, color: '#9ca3af', fontWeight: 400 }),
                singleValue: (base) => ({ ...base, color: '#111827' })
              }}
            />
            {errors.citizenship && <p className="text-red-500 text-xs mt-1 px-1">{errors.citizenship}</p>}
          </div>

          <div className="relative border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all group flex items-center bg-white pr-4">
            <input
              type="text"
              placeholder="LinkedIn / Personal Website URL"
              value={data.linkedin || ''}
              onChange={(e) => setData({ ...data, linkedin: e.target.value })}
              className={`w-full p-4 border-none focus:ring-0 focus:outline-none ${noLinkedin ? 'text-gray-400 bg-gray-50' : 'text-gray-900 bg-white'} placeholder:text-gray-400`}
              disabled={noLinkedin}
            />
            <button
              type="button"
              onClick={handleNoneClick}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ml-2 shrink-0 ${noLinkedin ? 'bg-gray-800 text-white hover:bg-black' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}
            >
              None
            </button>
          </div>
          {errors.linkedin && <p className="text-red-500 text-xs mt-1 px-1">{errors.linkedin}</p>}

          <div>
            <div className="relative border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all group mt-4">
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
                {/* Hidden native checkbox for accessibility, but controlled logic via handleVisaChange */}
                <input
                  type="checkbox"
                  className="hidden"
                  checked={data.visas?.includes(visa) || false}
                  onChange={() => handleVisaChange(visa)}
                />
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