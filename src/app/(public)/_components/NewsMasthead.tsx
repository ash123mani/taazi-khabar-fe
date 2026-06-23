'use client';

import { DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useIsMobile } from '@/hooks/useIsMobile';

interface NewsMastheadProps {
  date: string;
  onDateChange: (date: string) => void;
}

export default function NewsMasthead({ date, onDateChange }: NewsMastheadProps) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border-light)',
        paddingBottom: isMobile ? 8 : 12,
        marginBottom: isMobile ? 8 : 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <div
          className="newspaper-heading"
          style={{
            fontWeight: 800,
            fontSize: isMobile ? 20 : 26,
            letterSpacing: '-0.3px',
            color: 'var(--color-text)',
            lineHeight: 1.15,
          }}
        >
          {dayjs(date).format('D MMMM')} Briefings
        </div>
        <DatePicker
          value={dayjs(date)}
          onChange={(d) => {
            if (d) onDateChange(d.format('YYYY-MM-DD'));
          }}
          allowClear={false}
          format="DD-MM-YYYY"
          disabledDate={(current) => {
            if (!current) return false;
            return current.isBefore(dayjs('2026-06-07')) || current.isAfter(dayjs());
          }}
          suffixIcon={
            <CalendarOutlined style={{ fontSize: isMobile ? 10 : 12, color: 'var(--color-text-tertiary)' }} />
          }
          size="small"
          style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 2, fontSize: 11 }}
        />
      </div>
    </div>
  );
}
