'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchLeads, updateLeadStatus } from '@/lib/features/leadsSlice';
import { format } from 'date-fns';
import { Search, ChevronDown, MoveDown } from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: leads, status } = useSelector((state: RootState) => state.leads);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Very basic mock auth guard
    setIsAuthenticated(true); // Auto-auth for dev speed; usually prompt or login
    if (status === 'idle') {
      dispatch(fetchLeads());
    }
  }, [dispatch, status]);

  if (!isAuthenticated) return <div className="p-10 font-sans">Unauthorized</div>;
  if (status === 'loading') return <div className="p-10 font-sans text-gray-500">Loading leads...</div>;

  const filteredLeads = leads.filter(l => 
    l.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ThIcon = () => <MoveDown className="inline-block w-3.5 h-3.5 ml-1.5 text-gray-400" strokeWidth={2.5} />;

  return (
    <div className="space-y-8 font-sans w-full max-w-[1000px]">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Leads</h2>
      
      {/* Controls */}
      <div className="flex space-x-4 mb-2">
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-medium placeholder:text-gray-400 placeholder:font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-3 px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-400 bg-white hover:bg-gray-50 transition-colors">
          <span>Status</span>
          <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[15px]">
            <thead className="text-gray-400 font-semibold bg-white border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 whitespace-nowrap">Name <ThIcon /></th>
                <th className="px-8 py-5 whitespace-nowrap">Submitted <ThIcon /></th>
                <th className="px-8 py-5 whitespace-nowrap">Status <ThIcon /></th>
                <th className="px-8 py-5 whitespace-nowrap">Country <ThIcon /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 font-semibold text-gray-900 whitespace-nowrap">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="px-8 py-6 text-gray-600 font-medium whitespace-nowrap">
                    {format(new Date(lead.submittedAt), "MM/dd/yyyy, h:mm a")}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    {lead.status === 'PENDING' ? (
                      <button 
                        onClick={() => dispatch(updateLeadStatus({ id: lead.id, status: 'REACHED_OUT' }))}
                        className="font-semibold text-gray-900 hover:text-black transition-colors"
                        title="Click to mark as Reached Out"
                      >
                        Pending
                      </button>
                    ) : (
                      <span className="font-semibold text-gray-900">
                        Reached Out
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-gray-900 font-medium whitespace-nowrap">
                    {lead.citizenship}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-8 py-5 flex justify-end items-center space-x-2 border-t border-gray-100">
          <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors font-medium text-sm">
            &lt;
          </button>
          <div className="flex space-x-1">
            <button className="w-8 h-8 flex items-center justify-center border-2 border-gray-900 rounded-lg font-bold text-gray-900 text-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:text-gray-900 transition-colors text-sm">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:text-gray-900 transition-colors text-sm">
              3
            </button>
          </div>
          <button className="p-2 text-gray-900 hover:text-black transition-colors font-medium text-sm">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}