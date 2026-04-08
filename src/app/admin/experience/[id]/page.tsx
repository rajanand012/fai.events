'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

interface Experience {
  id: number;
  slug: string;
  title: string;
  destination: string;
  province: string;
  category: string;
  summaryShort: string;
  summaryLong: string;
  whySpecial: string | null;
  imageUrl: string | null;
  sourceUrl: string;
  websiteUrl: string | null;
  bookingUrl: string | null;
  socialLink: string | null;
  contactLink: string | null;
  priceRange: string | null;
  priceNote: string | null;
  aiScore: number;
  aiReasoning: string | null;
  uniquenessScore: number | null;
  luxuryScore: number | null;
  authenticityScore: number | null;
  status: string;
  isFeatured: number | null;
  tags: string | null;
  bestTimeToVisit: string | null;
  duration: string | null;
  discoveredAt: string;
  publishedAt: string | null;
  updatedAt: string;
  pipelineRunId: number | null;
}

function ScoreBar({ label, value }: { label: string; value: number | null }) {
  const score = value ?? 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{score}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-blue rounded-full transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function ExperienceEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/experiences/${id}`);
        if (!res.ok) {
          setError('Experience not found');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setExperience(data.experience);
      } catch {
        setError('Failed to load experience');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function updateField(field: string, value: unknown) {
    if (!experience) return;
    setExperience({ ...experience, [field]: value });
  }

  async function handleSave() {
    if (!experience) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/experiences/${experience.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: experience.title,
          destination: experience.destination,
          province: experience.province,
          category: experience.category,
          summaryShort: experience.summaryShort,
          summaryLong: experience.summaryLong,
          whySpecial: experience.whySpecial,
          imageUrl: experience.imageUrl,
          sourceUrl: experience.sourceUrl,
          websiteUrl: experience.websiteUrl,
          bookingUrl: experience.bookingUrl,
          socialLink: experience.socialLink,
          contactLink: experience.contactLink,
          priceRange: experience.priceRange,
          priceNote: experience.priceNote,
          status: experience.status,
          isFeatured: experience.isFeatured,
          bestTimeToVisit: experience.bestTimeToVisit,
          duration: experience.duration,
          tags: experience.tags,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExperience(data.experience);
        setSuccess('Experience saved successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save experience');
      }
    } catch {
      setError('Failed to save experience');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!experience) return;
    if (!confirm('Are you sure you want to archive this experience?')) return;

    try {
      const res = await fetch(`/api/experiences/${experience.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/experiences');
      } else {
        setError('Failed to archive experience');
      }
    } catch {
      setError('Failed to archive experience');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-500">{error || 'Experience not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => router.push('/admin/experiences')}
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 block"
          >
            &larr; Back to Experiences
          </button>
          <h1 className="text-2xl font-bold text-brand-charcoal">
            Edit Experience
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm bg-brand-charcoal text-white rounded-lg font-medium hover:bg-brand-charcoal/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={experience.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={experience.destination}
                    onChange={(e) => updateField('destination', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province
                  </label>
                  <input
                    type="text"
                    value={experience.province}
                    onChange={(e) => updateField('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={experience.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <input
                    type="text"
                    value={experience.priceRange || ''}
                    onChange={(e) => updateField('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Summary
                </label>
                <textarea
                  value={experience.summaryShort}
                  onChange={(e) => updateField('summaryShort', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Summary
                </label>
                <textarea
                  value={experience.summaryLong}
                  onChange={(e) => updateField('summaryLong', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why Special
                </label>
                <textarea
                  value={experience.whySpecial || ''}
                  onChange={(e) => updateField('whySpecial', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
              Links
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source URL
                </label>
                <input
                  type="url"
                  value={experience.sourceUrl}
                  onChange={(e) => updateField('sourceUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={experience.websiteUrl || ''}
                    onChange={(e) => updateField('websiteUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking URL
                  </label>
                  <input
                    type="url"
                    value={experience.bookingUrl || ''}
                    onChange={(e) => updateField('bookingUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Link
                  </label>
                  <input
                    type="url"
                    value={experience.socialLink || ''}
                    onChange={(e) => updateField('socialLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Link
                  </label>
                  <input
                    type="url"
                    value={experience.contactLink || ''}
                    onChange={(e) => updateField('contactLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={experience.imageUrl || ''}
                  onChange={(e) => updateField('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
              Additional Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={experience.bestTimeToVisit || ''}
                    onChange={(e) => updateField('bestTimeToVisit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={experience.duration || ''}
                    onChange={(e) => updateField('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Note
                </label>
                <input
                  type="text"
                  value={experience.priceNote || ''}
                  onChange={(e) => updateField('priceNote', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (JSON array)
                </label>
                <input
                  type="text"
                  value={experience.tags || '[]'}
                  onChange={(e) => updateField('tags', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Featured */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
              Status
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={experience.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={!!experience.isFeatured}
                  onChange={(e) =>
                    updateField('isFeatured', e.target.checked ? 1 : 0)
                  }
                  className="rounded"
                />
                <label htmlFor="isFeatured" className="text-sm text-gray-700">
                  Featured
                </label>
              </div>
            </div>
          </div>

          {/* AI Evaluation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
              AI Evaluation
            </h2>
            <div className="space-y-3">
              <ScoreBar label="Overall Score" value={experience.aiScore} />
              <ScoreBar label="Uniqueness" value={experience.uniquenessScore} />
              <ScoreBar label="Luxury" value={experience.luxuryScore} />
              <ScoreBar label="Authenticity" value={experience.authenticityScore} />
            </div>
            {experience.aiReasoning && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  AI Reasoning
                </p>
                <p className="text-sm text-gray-500 whitespace-pre-wrap">
                  {experience.aiReasoning}
                </p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
              Metadata
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">ID</dt>
                <dd className="font-medium">{experience.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Slug</dt>
                <dd className="font-medium font-mono text-xs">
                  {experience.slug}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Discovered</dt>
                <dd className="font-medium">
                  {new Date(experience.discoveredAt).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Published</dt>
                <dd className="font-medium">
                  {experience.publishedAt
                    ? new Date(experience.publishedAt).toLocaleString()
                    : 'Not published'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Last Updated</dt>
                <dd className="font-medium">
                  {new Date(experience.updatedAt).toLocaleString()}
                </dd>
              </div>
              {experience.pipelineRunId && (
                <div>
                  <dt className="text-gray-500">Pipeline Run</dt>
                  <dd className="font-medium">#{experience.pipelineRunId}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
