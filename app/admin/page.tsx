'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchLeads, updateLeadStatus } from '@/lib/features/leadsSlice';
import { format } from 'date-fns';
import { Search, ChevronDown } from 'lucide-react';

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: leads, status } = useSelector((state: RootState) => state.leads);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock Auth
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Very basic mock auth guard
    const auth = prompt('Enter admin password (hint: password):');
    if (auth === 'password') setIsAuthenticated(true);
    
    dispatch(fetchLeads());
  }, [dispatch]);

  if (!isAuthenticated) return <div className="p-10">Unauthorized</div>;
  if (status === 'loading') return <div className="p-10">Loading leads...</div>;

  const filteredLeads = leads.filter(l => 
    l.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl">
      <h2 className="text-3xl font-bold">Leads</h2>
      
      {/* Controls */}
      <div className="flex space-x-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-md text-sm text-gray-600 bg-white">
          <span>Status</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Country</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold">{lead.firstName} {lead.lastName}</td>
                <td className="px-6 py-4 text-gray-600">
                  {format(new Date(lead.submittedAt), "MM/dd/yyyy, h:mm a")}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    lead.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{lead.citizenship}</td>
                <td className="px-6 py-4">
                  {lead.status === 'PENDING' && (
                    <button 
                      onClick={() => dispatch(updateLeadStatus({ id: lead.id, status: 'REACHED_OUT' }))}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Mark Reached Out
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Mock */}
        <div className="bg-white border-t p-4 flex justify-end space-x-2 text-sm text-gray-500">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">&lt;</button>
          <button className="px-3 py-1 border rounded bg-black text-white">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">&gt;</button>
        </div>
      </div>
    </div>
  );
}