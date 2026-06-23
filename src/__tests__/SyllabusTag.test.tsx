import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SyllabusTag from '@/app/(public)/_components/SyllabusTag';

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

describe('SyllabusTag', () => {
  it('returns null for null tag', () => {
    const { container } = render(<SyllabusTag tag={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('abbreviates known subject', () => {
    render(<SyllabusTag tag="Polity" />);
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('abbreviates with sub-topic', () => {
    render(<SyllabusTag tag="History > Modern India" />);
    expect(screen.getByText('H')).toBeInTheDocument();
  });

  it('falls back to full name for unknown subject', () => {
    render(<SyllabusTag tag="Miscellaneous" />);
    expect(screen.getByText('Miscellaneous')).toBeInTheDocument();
  });

  it('shows full tag in tooltip', () => {
    render(<SyllabusTag tag="Environment > Climate Change" />);
    expect(screen.getByText('ENV')).toBeInTheDocument();
  });
});
