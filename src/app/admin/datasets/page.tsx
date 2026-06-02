'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TrainingDataset } from '@/lib/types';

const PERSONAS = ['article_summarizer', 'quiz_generator', 'gk_analyst', 'general'];

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<TrainingDataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', persona: PERSONAS[0] });
  const [building, setBuilding] = useState(false);

  const fetchDatasets = async () => {
    try {
      const data = await api.getInteractions({ type: 'datasets' });
      setDatasets(Array.isArray(data) ? data : data.datasets || []);
    } catch {
      setError('Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setBuilding(true);
    try {
      await api.buildDataset(formData);
      setShowForm(false);
      setFormData({ name: '', persona: PERSONAS[0] });
      fetchDatasets();
    } catch (err: any) {
      setError(err.message || 'Failed to build dataset');
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Datasets</h1>
          <p className="text-text-muted text-sm mt-1">Manage training datasets for fine-tuning</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent-hover text-surface font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {showForm ? 'Cancel' : 'Build Dataset'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleBuild} className="bg-surface-card border border-surface-border rounded-lg p-5 mb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Dataset Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent"
                placeholder="e.g., polity-articles-v1"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Persona</label>
              <select
                value={formData.persona}
                onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                className="w-full bg-surface border border-surface-border rounded-lg px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent"
              >
                {PERSONAS.map((p) => (
                  <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={building}
            className="mt-4 bg-accent hover:bg-accent-hover text-surface font-medium px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {building ? 'Building...' : 'Build Dataset'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-surface-border rounded w-1/3 mb-3" />
              <div className="h-4 bg-surface-border rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : datasets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted">No datasets created yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {datasets.map((ds) => (
            <div key={ds.id} className="bg-surface-card border border-surface-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-text-primary font-semibold">{ds.name}</h3>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    ds.status === 'ready'
                      ? 'bg-green-500/20 text-green-300'
                      : ds.status === 'building'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-surface-border text-text-muted'
                  }`}
                >
                  {ds.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span>Persona: {ds.persona.replace(/_/g, ' ')}</span>
                <span>{ds.num_examples} examples</span>
                {ds.lora_adapter_path && <span className="text-accent">LoRA: {ds.lora_adapter_path}</span>}
              </div>
              <p className="text-xs text-text-muted mt-1">
                Created: {new Date(ds.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
