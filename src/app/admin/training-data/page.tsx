'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AIInteraction } from '@/lib/types';

export default function TrainingDataPage() {
  const [interactions, setInteractions] = useState<AIInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editResponse, setEditResponse] = useState('');

  const fetchInteractions = async () => {
    try {
      const data = await api.getInteractions();
      setInteractions(Array.isArray(data) ? data : data.interactions || []);
    } catch {
      setError('Failed to load interactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  const handleFeedback = async (id: string, feedback: number) => {
    try {
      await api.updateInteraction(id, { user_feedback: feedback });
      setInteractions((prev) =>
        prev.map((i) => (i.id === id ? { ...i, user_feedback: feedback } : i))
      );
    } catch {
      // ignore
    }
  };

  const handleEdit = async (id: string) => {
    if (!editResponse.trim()) return;
    try {
      await api.updateInteraction(id, { response: editResponse });
      setInteractions((prev) =>
        prev.map((i) => (i.id === id ? { ...i, response: editResponse } : i))
      );
      setEditingId(null);
      setEditResponse('');
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Training Data</h1>
      <p className="text-text-muted mb-6">Browse AI interactions, provide feedback, and edit responses.</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-surface-border rounded w-1/4 mb-3" />
              <div className="h-4 bg-surface-border rounded w-3/4 mb-2" />
              <div className="h-4 bg-surface-border rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : interactions.length === 0 ? (
        <p className="text-center text-text-muted py-8">No interactions recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {interactions.map((item) => (
            <div key={item.id} className="bg-surface-card border border-surface-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded font-medium">
                  {item.persona}
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-xs text-text-muted mb-1">Prompt</p>
                <p className="text-sm text-text-primary bg-surface rounded-lg p-3">{item.prompt}</p>
              </div>

              <div className="mb-3">
                <p className="text-xs text-text-muted mb-1">Response</p>
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editResponse}
                      onChange={(e) => setEditResponse(e.target.value)}
                      className="w-full bg-surface border border-surface-border rounded-lg p-3 text-sm text-text-primary focus:outline-none focus:border-accent"
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-xs bg-accent text-surface px-3 py-1.5 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditResponse(''); }}
                        className="text-xs border border-surface-border text-text-muted px-3 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary bg-surface rounded-lg p-3">{item.response}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-text-muted mr-1">Feedback:</p>
                  {[1, -1].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleFeedback(item.id, item.user_feedback === val ? null : val)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${
                        item.user_feedback === val
                          ? val === 1
                            ? 'bg-green-500/20 border-green-500/30 text-green-300'
                            : 'bg-red-500/20 border-red-500/30 text-red-300'
                          : 'border-surface-border text-text-muted hover:text-text-secondary'
                      }`}
                    >
                      {val === 1 ? '👍' : '👎'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => { setEditingId(item.id); setEditResponse(item.response); }}
                  className="text-xs text-accent hover:text-accent-hover"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
