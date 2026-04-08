'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Experience {
  id: number;
  slug: string;
  title: string;
  destination: string;
  category: string;
  aiScore: number;
  status: string;
  isFeatured: number | null;
  discoveredAt: string;
}

interface ExperiencesResponse {
  experiences: Experience[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function ExperiencesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [data, setData] = useState<ExperiencesResponse>({
    experiences: [],
    total: 0,
    page: 1,
    totalPages: 0,
  });
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/experiences?status=${status}&page=${page}&limit=20&sort=newest`
      );
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Failed to load experiences:', error);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  function handleTabChange(newStatus: string) {
    setStatus(newStatus);
    setPage(1);
    setSelected(new Set());
  }

  function toggleSelect(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === data.experiences.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.experiences.map((e) => e.id)));
    }
  }

  async function handleAction(id: number, action: string) {
    try {
      await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id], action }),
      });
      fetchExperiences();
    } catch (error) {
      console.error('Action failed:', error);
    }
  }

  async function handleBulkAction(action: string) {
    if (selected.size === 0) return;
    try {
      await fetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected), action }),
      });
      setSelected(new Set());
      fetchExperiences();
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  }

  function statusBadge(s: string) {
    const colors: Record<string, string> = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
      archived: 'bg-gray-100 text-gray-700',
    };
    return (
      <span
        className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
          colors[s] || 'bg-gray-100 text-gray-700'
        }`}
      >
        {s}
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-charcoal">Experiences</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              status === tab.key
                ? 'bg-white text-brand-charcoal shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-brand-light-blue rounded-lg">
          <span className="text-sm font-medium text-brand-charcoal">
            {selected.size} selected
          </span>
          <button
            onClick={() => handleBulkAction('approve')}
            className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleBulkAction('reject')}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={() => handleBulkAction('archive')}
            className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Archive
          </button>
          <button
            onClick={() => handleBulkAction('feature')}
            className="px-3 py-1 text-xs bg-brand-yellow text-brand-charcoal rounded-md hover:bg-brand-yellow/80"
          >
            Feature
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      data.experiences.length > 0 &&
                      selected.size === data.experiences.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : data.experiences.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No experiences found
                  </td>
                </tr>
              ) : (
                data.experiences.map((exp) => (
                  <tr
                    key={exp.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(exp.id)}
                        onChange={() => toggleSelect(exp.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/admin/experience/${exp.id}`}
                        className="text-brand-blue hover:underline font-medium"
                      >
                        {exp.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {exp.destination}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {exp.category}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {exp.aiScore}
                    </td>
                    <td className="px-4 py-3">{statusBadge(exp.status)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleAction(
                            exp.id,
                            exp.isFeatured ? 'unfeature' : 'feature'
                          )
                        }
                        className={`text-xs px-2 py-0.5 rounded ${
                          exp.isFeatured
                            ? 'bg-brand-yellow/20 text-brand-yellow'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {exp.isFeatured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(exp.discoveredAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {exp.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(exp.id, 'approve')}
                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(exp.id, 'reject')}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <Link
                          href={`/admin/experience/${exp.id}`}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing page {data.page} of {data.totalPages} ({data.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
