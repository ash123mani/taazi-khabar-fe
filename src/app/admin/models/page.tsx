'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Model {
  id: string;
  name: string;
  version: string;
  status: string;
  active: boolean;
  accuracy: number | null;
  created_at: string;
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [swapping, setSwapping] = useState(false);

  const fetchModels = async () => {
    try {
      const data = await api.getModels();
      setModels(Array.isArray(data) ? data : data.models || []);
    } catch {
      setError('Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSwap = async (modelId: string) => {
    setSwapping(true);
    try {
      await api.updateModels({ active_model_id: modelId });
      fetchModels();
    } catch (err: any) {
      setError(err.message || 'Failed to swap model');
    } finally {
      setSwapping(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Model Registry</h1>
      <p className="text-text-muted mb-8">Manage active model, swap versions, rollback if needed.</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-surface-border rounded w-1/3 mb-3" />
              <div className="h-4 bg-surface-border rounded w-1/2 mb-2" />
              <div className="h-4 bg-surface-border rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted">No models registered.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className={`bg-surface-card border rounded-lg p-5 transition-colors ${
                model.active
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-surface-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-text-primary font-semibold flex items-center gap-2">
                    {model.name}
                    {model.active && (
                      <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-text-muted">v{model.version}</p>
                </div>
                {!model.active && (
                  <button
                    onClick={() => handleSwap(model.id)}
                    disabled={swapping}
                    className="text-sm bg-surface hover:bg-surface-border text-text-secondary border border-surface-border px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {swapping ? 'Swapping...' : 'Make Active'}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className={`font-medium ${
                  model.status === 'ready' ? 'text-green-400' : 'text-amber-400'
                }`}>
                  {model.status}
                </span>
                {model.accuracy !== null && (
                  <span>Accuracy: {(model.accuracy * 100).toFixed(1)}%</span>
                )}
                <span>
                  Added: {new Date(model.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
