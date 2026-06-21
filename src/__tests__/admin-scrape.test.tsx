import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

const { mockGetScrapeSummary, mockScrapeDate, mockMessageSuccess, mockMessageError } = vi.hoisted(() => ({
  mockGetScrapeSummary: vi.fn(),
  mockScrapeDate: vi.fn(),
  mockMessageSuccess: vi.fn(),
  mockMessageError: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  api: {
    getScrapeSummary: mockGetScrapeSummary,
    scrapeDate: mockScrapeDate,
  },
}));

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');
  return {
    ...actual,
    message: { success: mockMessageSuccess, error: mockMessageError },
  };
});

import ScrapePage from '@/app/admin/scrape/page';

const sampleSources = {
  sources: {
    thehindu: [
      {
        date: '2026-06-06',
        total_articles: 5,
        scrape_times: ['2026-06-06T10:00:00Z'],
        categories: { 'GS Paper II': 3, 'GS Paper III': 2 },
      },
      { date: '2026-06-05', total_articles: 0, scrape_times: [], categories: {} },
    ],
    indianexpress: [
      {
        date: '2026-06-06',
        total_articles: 3,
        scrape_times: ['2026-06-06T11:00:00Z'],
        categories: { 'GS Paper I': 3 },
      },
      { date: '2026-06-05', total_articles: 0, scrape_times: [], categories: {} },
    ],
  },
};

describe('Admin Scrape Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and description', () => {
    mockGetScrapeSummary.mockReturnValue(new Promise(() => {}));
    render(<ScrapePage />);
    expect(screen.getByText('Scrape by Date')).toBeInTheDocument();
    expect(screen.getByText(/Click a date row/)).toBeInTheDocument();
  });

  it('shows loading spinner on mount', () => {
    mockGetScrapeSummary.mockReturnValue(new Promise(() => {}));
    render(<ScrapePage />);
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('renders tabs for both sources after loading', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });
    expect(screen.getByText('The Indian Express')).toBeInTheDocument();
  });

  it('renders date rows in the table', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/2026-06-06/)).toBeInTheDocument();
    });
  });

  it('shows Scraped button for dates with articles', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/2026-06-06/)).toBeInTheDocument();
    });
    expect(screen.getByText('Scraped')).toBeInTheDocument();
  });

  it('shows Scrape button for dates without articles in visible tab', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });

    const scrapeButtons = screen.getAllByText('Scrape');
    expect(scrapeButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('calls scrapeDate when Scrape button is clicked', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    mockScrapeDate.mockResolvedValue({ articles_created: 10, articles_filtered_out: 2 });
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Scrape')[0]);
    expect(mockScrapeDate).toHaveBeenCalled();
  });

  it('shows success message after scrape', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    mockScrapeDate.mockResolvedValue({ articles_created: 10, articles_filtered_out: 2 });
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Scrape')[0]);

    await waitFor(() => {
      expect(mockMessageSuccess).toHaveBeenCalledWith('Created 10 articles, filtered out 2');
    });
  });

  it('shows error message when scrape fails', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    mockScrapeDate.mockRejectedValue(new Error('Rate limit'));
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Scrape')[0]);

    await waitFor(() => {
      expect(mockMessageError).toHaveBeenCalledWith('Rate limit');
    });
  });

  it('shows generic error fallback', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    mockScrapeDate.mockRejectedValue({});
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Scrape')[0]);

    await waitFor(() => {
      expect(mockMessageError).toHaveBeenCalledWith('Scrape failed');
    });
  });

  it('shows error message when scrape-summary fails', async () => {
    mockGetScrapeSummary.mockRejectedValue(new Error('Network error'));
    render(<ScrapePage />);

    await waitFor(() => {
      expect(mockMessageError).toHaveBeenCalledWith('Failed to load scrape data');
    });
  });

  it('disables all Scrape buttons while one is scraping', async () => {
    mockGetScrapeSummary.mockResolvedValue(sampleSources);
    mockScrapeDate.mockReturnValue(new Promise(() => {}));
    render(<ScrapePage />);

    await waitFor(() => {
      expect(screen.getByText('The Hindu')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Scrape')[0]);

    await waitFor(() => {
      const allScrapeBtns = screen.getAllByText('Scrape');
      allScrapeBtns.forEach((btn) => {
        expect(btn.closest('button')).toBeDisabled();
      });
    });
  });
});
