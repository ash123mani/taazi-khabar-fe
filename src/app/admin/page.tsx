'use client';

import Link from 'next/link';

const adminLinks = [
  {
    title: 'Training Data',
    description: 'Browse and manage AI interactions, provide feedback on responses',
    href: '/admin/training-data',
    icon: '📊',
  },
  {
    title: 'Datasets',
    description: 'Build and manage training datasets from curated interactions',
    href: '/admin/datasets',
    icon: '📦',
  },
  {
    title: 'Models',
    description: 'View model registry, swap active models, rollback versions',
    href: '/admin/models',
    icon: '🤖',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
      <p className="text-text-muted mb-8">Manage AI training data, datasets, and models</p>

      <div className="grid gap-6 md:grid-cols-3">
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <div className="bg-surface-card border border-surface-border rounded-lg p-6 hover:border-accent/30 transition-colors h-full">
              <div className="text-3xl mb-4">{link.icon}</div>
              <h2 className="text-lg font-semibold text-text-primary mb-2">{link.title}</h2>
              <p className="text-sm text-text-muted">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
