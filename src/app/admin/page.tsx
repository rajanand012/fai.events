'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PipelineRun {
  id: number;
  startedAt: string;
  completedAt: string | null;
  status: string | null;
  sourcesSearched: number | null;
  candidatesFound: number | null;
  evaluated: number | null;
  duplicatesSkipped: number | null;
  published: number | null;
  triggerType: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  avgScore: number;
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color || 'text-brand-charcoal'}`}>
        {value}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    avgScore: 0,
  });
  const [runs, setRuns] = useState<PipelineRun[]>([]);
  const [pipelineRunning, setPipelineRunning] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const [allRes, pendingRes, approvedRes] = await Promise.all([
          fetch('/api/experiences?status=all&limit=1'),
          fetch('/api/experiences?status=pending&limit=1'),
          fetch('/api/experiences?status=approved&limit=1'),
        ]);

        const [allData, pendingData, approvedData] = await Promise.all([
          allRes.json(),
          pendingRes.json(),
          approvedRes.json(),
        ]);

        // Calculate average score from the full list
        const scoreRes = await fetch('/api/experiences?status=all&limit=200');
        const scoreData = await scoreRes.json();
        const scores = scoreData.experiences.map(
          (e: { aiScore: number }) => e.aiScore
        );
        const avgScore =
          scores.length > 0
            ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
            : 0;

        setStats({
          total: allData.total,
          pending: pendingData.total,
          approved: approvedData.total,
          avgScore: Math.round(avgScore * 10) / 10,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }

    async function loadRuns() {
      try {
        const res = await fetch('/api/admin/pipeline');
        const data = await res.json();
        setRuns(data.runs || []);
      } catch (error) {
        console.error('Failed to load pipeline runs:', error);
      }
    }

    loadStats();
    loadRuns();
  }, []);

  async function handleRunPipeline() {
    setPipelineRunning(true);
    try {
      const res = await fetch('/api/admin/pipeline', { method: 'POST' });
      const data = await res.json();
      console.log('Pipeline result:', data);
      // Reload runs
      const runsRes = await fetch('/api/admin/pipeline');
      const runsData = await runsRes.json();
      setRuns(runsData.runs || []);
    } catch (error) {
      console.error('Pipeline error:', error);
    } finally {
      setPipelineRunning(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-charcoal">Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={handleRunPipeline}
            disabled={pipelineRunning}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-brand-blue/90 transition-colors disabled:opacity-50"
          >
            {pipelineRunning ? 'Running...' : 'Run Discovery Now'}
          </button>
          <Link
            href="/admin/experiences?status=pending"
            className="px-4 py-2 bg-brand-yellow text-brand-charcoal rounded-lg text-sm font-medium hover:bg-brand-yellow/90 transition-colors"
          >
            View Pending
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Experiences" value={stats.total} />
        <StatCard
          label="Pending Review"
          value={stats.pending}
          color="text-yellow-600"
        />
        <StatCard
          label="Published"
          value={stats.approved}
          color="text-green-600"
        />
        <StatCard
          label="Avg AI Score"
          value={stats.avgScore}
          color="text-brand-blue"
        />
      </div>

      {/* Pipeline Runs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-brand-charcoal">
            Recent Pipeline Runs
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Trigger</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Sources</th>
                <th className="px-6 py-3 font-medium">Found</th>
                <th className="px-6 py-3 font-medium">Evaluated</th>
                <th className="px-6 py-3 font-medium">Published</th>
              </tr>
            </thead>
            <tbody>
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No pipeline runs yet
                  </td>
                </tr>
              ) : (
                runs.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 text-sm">
                      {new Date(run.startedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-sm capitalize">
                      {run.triggerType}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                          run.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : run.status === 'running'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{run.sourcesSearched ?? 0}</td>
                    <td className="px-6 py-3 text-sm">{run.candidatesFound ?? 0}</td>
                    <td className="px-6 py-3 text-sm">{run.evaluated ?? 0}</td>
                    <td className="px-6 py-3 text-sm">{run.published ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
