'use client';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchLeads, updateLeadStatus } from '@/lib/features/leadsSlice';
import { format } from 'date-fns';
import { Search, ChevronDown, MoveDown, MoveUp } from 'lucide-react';
import { Lead } from '@/types';

type SortColumn = 'firstName' | 'submittedAt' | 'status' | 'citizenship';
type SortDirection = 'asc' | 'desc';

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: leads, status } = useSelector((state: RootState) => state.leads);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'PENDING' | 'REACHED_OUT'>('All');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Sorting State
  const [sortColumn, setSortColumn] = useState<SortColumn>('submittedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'All'>(5);
  const [isPaginationDropdownOpen, setIsPaginationDropdownOpen] = useState(false);

  useEffect(() => {
    setIsAuthenticated(true);
    if (status === 'idle') {
      dispatch(fetchLeads());
    }
  }, [dispatch, status]);

  // Polling hook for real-time automatic syncing
  useEffect(() => {
    const fetchIfVisible = () => {
      if (document.visibilityState === "visible") {
        dispatch(fetchLeads());
      }
    };

    const interval = setInterval(fetchIfVisible, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleStatusToggle = (lead: Lead) => {
    const newStatus = lead.status === 'PENDING' ? 'REACHED_OUT' : 'PENDING';
    dispatch(updateLeadStatus({ id: lead.id, status: newStatus }));
  };

  // 1. Filter Source Data
  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      // Status Filter
      if (statusFilter !== 'All' && l.status !== statusFilter) return false;

      // Global Search
      const searchLower = searchTerm.toLowerCase();
      const searchableString = `${l.firstName} ${l.lastName} ${l.citizenship} ${l.status}`.toLowerCase();
      if (searchTerm && !searchableString.includes(searchLower)) return false;

      return true;
    });
  }, [leads, searchTerm, statusFilter]);

  // 2. Sort Filtered Data
  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      if (sortColumn === 'firstName') {
        valA = `${a.firstName} ${a.lastName}`.toLowerCase();
        valB = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortColumn === 'submittedAt') {
        valA = new Date(a.submittedAt).getTime();
        valB = new Date(b.submittedAt).getTime();
      } else if (sortColumn === 'status') {
        valA = a.status;
        valB = b.status;
      } else if (sortColumn === 'citizenship') {
        valA = a.citizenship.toLowerCase();
        valB = b.citizenship.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLeads, sortColumn, sortDirection]);

  // 3. Paginate Sorted Data
  const paginatedLeads = useMemo(() => {
    if (itemsPerPage === 'All') return sortedLeads;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedLeads, currentPage, itemsPerPage]);

  const totalPages = itemsPerPage === 'All' ? 1 : Math.ceil(sortedLeads.length / itemsPerPage);

  // Reset page to 1 when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);


  if (!isAuthenticated) return <div className="p-10 font-sans">Unauthorized</div>;
  if (status === 'loading') return <div className="p-10 font-sans text-gray-500">Loading leads...</div>;

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return <MoveDown className="inline-block w-3.5 h-3.5 ml-1.5 text-gray-300" strokeWidth={2.5} />;
    return sortDirection === 'asc' ?
      <MoveUp className="inline-block w-3.5 h-3.5 ml-1.5 text-gray-700" strokeWidth={2.5} /> :
      <MoveDown className="inline-block w-3.5 h-3.5 ml-1.5 text-gray-700" strokeWidth={2.5} />;
  };

  return (
    <div className="space-y-8 font-sans w-full max-w-[1000px]">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900">Leads</h2>

      {/* Controls */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-4">
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent font-medium placeholder:text-gray-400 placeholder:font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center justify-between space-x-3 px-5 py-3 border border-gray-200 rounded-xl text-[15px] font-semibold text-gray-500 bg-white hover:bg-gray-50 transition-colors w-40"
            >
              <span className="truncate">{statusFilter === 'All' ? 'Status' : statusFilter === 'PENDING' ? 'Pending' : 'Reached Out'}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" strokeWidth={2.5} />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                {['All', 'PENDING', 'REACHED_OUT'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setStatusFilter(opt as any); setIsStatusDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    {opt === 'All' ? 'All Statuses' : opt === 'PENDING' ? 'Pending' : 'Reached Out'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Right Pagination Controls: Rows per page */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 font-medium relative">
          <span>Rows per page:</span>
          <div className="relative">
            <button
              onClick={() => setIsPaginationDropdownOpen(!isPaginationDropdownOpen)}
              className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors text-gray-900 font-bold"
            >
              <span>{itemsPerPage}</span>
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={3} />
            </button>

            {isPaginationDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-20 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                {[5, 10, 'All'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setItemsPerPage(opt as any); setIsPaginationDropdownOpen(false); }}
                    className="w-full text-center px-4 py-1.5 text-sm font-bold hover:bg-gray-100 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table - Added overflow-hidden to fix clipping on border-radius component */}
      <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-[15px]">
            <thead className="text-gray-400 font-semibold bg-white border-b border-gray-100 select-none">
              <tr>
                <th className="px-8 py-5 whitespace-nowrap cursor-pointer hover:text-gray-600 transition-colors" onClick={() => handleSort('firstName')}>
                  Name <SortIcon column="firstName" />
                </th>
                <th className="px-8 py-5 whitespace-nowrap cursor-pointer hover:text-gray-600 transition-colors" onClick={() => handleSort('submittedAt')}>
                  Submitted <SortIcon column="submittedAt" />
                </th>
                <th className="px-8 py-5 whitespace-nowrap cursor-pointer hover:text-gray-600 transition-colors" onClick={() => handleSort('status')}>
                  Status <SortIcon column="status" />
                </th>
                <th className="px-8 py-5 whitespace-nowrap cursor-pointer hover:text-gray-600 transition-colors" onClick={() => handleSort('citizenship')}>
                  Country <SortIcon column="citizenship" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedLeads.length > 0 ? paginatedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 font-bold text-gray-900 whitespace-nowrap">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium whitespace-nowrap">
                    {format(new Date(lead.submittedAt), "MM/dd/yyyy, h:mm a")}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusToggle(lead)}
                      className="group flex items-center space-x-2 transition-all hover:opacity-80 disabled:opacity-50"
                      title="Click to toggle status"
                    >
                      <span className={`font-bold transition-colors ${lead.status === 'PENDING' ? 'text-gray-900 group-hover:text-gray-600' : 'text-gray-500 group-hover:text-gray-800'}`}>
                        {lead.status === 'PENDING' ? 'Pending' : 'Reached Out'}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:rotate-180 transition-transform duration-300">
                          <path d="M21 2v6h-6"></path>
                          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                          <path d="M3 22v-6h6"></path>
                          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                        </svg>
                      </div>
                    </button>
                  </td>
                  <td className="px-8 py-6 text-gray-900 font-medium whitespace-nowrap">
                    {lead.citizenship}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-gray-500 font-medium">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination controls */}
        <div className="bg-white px-8 py-5 flex justify-end items-center space-x-6 border-t border-gray-100 rounded-b-2xl">
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:hover:text-gray-400"
            >
              &lt;
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center font-bold text-sm rounded-md transition-all ${currentPage === page ? 'border-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 text-gray-900 hover:text-black transition-colors disabled:opacity-30 disabled:hover:text-gray-900"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}