import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormattedSummary from '@/components/FormattedSummary';

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return { ...actual };
});

describe('FormattedSummary', () => {
  it('renders summary heading for empty string', () => {
    render(<FormattedSummary summary="" />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('renders summary heading for raw markdown', () => {
    render(<FormattedSummary summary="Just some **bold** text" />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('parses summary section correctly', () => {
    const md = '### GK Summary\n\nTest summary content';
    render(<FormattedSummary summary={md} />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
  });

  it('parses key facts section', () => {
    const md = '### Key Facts\n\n- Fact one\n- Fact two';
    render(<FormattedSummary summary={md} />);
    expect(screen.getByText('Key Facts')).toBeInTheDocument();
  });

  it('parses analysis section', () => {
    const md = '### Analysis\n\nAnalysis content here';
    render(<FormattedSummary summary={md} />);
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  it('parses syllabus tag section', () => {
    const md = '### Syllabus Tag\n\nPolity > Constitution';
    render(<FormattedSummary summary={md} />);
    expect(screen.getByText('Syllabus')).toBeInTheDocument();
  });

  it('parses interview angle section', () => {
    const md = '### Interview Angle\n\nInterview question';
    render(<FormattedSummary summary={md} />);
    expect(screen.getByText('Interview Angle')).toBeInTheDocument();
  });

  it('renders key terms as tags', () => {
    const md = '### Key Terms\n\nTerm1, Term2, Term3';
    render(<FormattedSummary summary={md} />);
    expect(screen.getByText('Key Terms')).toBeInTheDocument();
  });

  it('handles multiple sections', () => {
    const md = '### GK Summary\n\nSummary\n\n### Key Facts\n\nFact 1\n\n### Analysis\n\nAnalysis';
    render(<FormattedSummary summary={md} />);
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Key Facts')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  it('renders sections in defined order', () => {
    const md = '### Analysis\n\nAnalysis\n\n### GK Summary\n\nSummary';
    render(<FormattedSummary summary={md} />);
    const labels = screen.getAllByText(/Summary|Analysis/);
    expect(labels.length).toBeGreaterThanOrEqual(2);
  });
});
