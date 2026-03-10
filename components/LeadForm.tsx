'use client';
import { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { vanillaRenderers, vanillaCells } from '@jsonforms/vanilla-renderers';
import { Lead } from '@/types';

// JSON Schema defines the data and validation
const schema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    citizenship: { type: 'string', enum: ['Mexico', 'Brazil', 'South Korea', 'Russia', 'France', 'Other'] },
    linkedin: { type: 'string' },
    visas: {
      type: 'array',
      items: { type: 'string', enum: ['O-1', 'EB-1A', 'EB-2 NIW', "I don't know"] },
      uniqueItems: true
    },
    message: { type: 'string', minLength: 10 }
  },
  required: ['firstName', 'lastName', 'email', 'citizenship', 'visas', 'message']
};

// UI Schema defines the layout matching the mockup
const uischema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/firstName', label: 'First Name' },
    { type: 'Control', scope: '#/properties/lastName', label: 'Last Name' },
    { type: 'Control', scope: '#/properties/email', label: 'Email' },
    { type: 'Control', scope: '#/properties/citizenship', label: 'Country of Citizenship' },
    { type: 'Control', scope: '#/properties/linkedin', label: 'LinkedIn / Personal Website URL' },
    { type: 'Control', scope: '#/properties/visas', label: 'Visa categories of interest?', options: { format: 'checkbox' } },
    { type: 'Control', scope: '#/properties/message', label: 'How can we help you?', options: { multi: true } }
  ]
};

export default function LeadForm() {
  const [data, setData] = useState<Partial<Lead>>({});
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    // In production, upload file to S3 and get URL. Here we mock it.
    const leadData = { ...data, resumeUrl: file ? file.name : '' };
    
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="text-4xl text-blue-500">📄</div>
        <h2 className="text-2xl font-bold">Thank You</h2>
        <p className="text-gray-600 text-center max-w-sm">
          Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai.
        </p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-black text-white rounded-md mt-4">
          Go Back to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <div className="text-4xl">📄</div>
        <h2 className="text-2xl font-bold">Want to understand your visa options?</h2>
        <p className="text-sm text-gray-500 font-semibold">Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.</p>
      </div>

      <div className="json-forms-wrapper space-y-4">
        <JsonForms schema={schema} uischema={uischema} data={data} renderers={vanillaRenderers} cells={vanillaCells} onChange={({ data }) => setData(data)} />
      </div>

      {/* Manual File Upload integration alongside JSONForms */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Resume / CV</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
      </div>

      <button onClick={handleSubmit} className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors">
        Submit
      </button>
    </div>
  );
}