'use client';

import { DatePicker } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useRouter, usePathname } from 'next/navigation';

export default function DatePickerControl({ date }: { date: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DatePicker
      value={dayjs(date)}
      onChange={(d) => {
        if (d) router.replace(`${pathname}?date=${d.format('YYYY-MM-DD')}`);
      }}
      allowClear={false}
      format="DD-MM-YYYY"
      disabledDate={(current) => {
        if (!current) return false;
        return current.isBefore(dayjs('2026-06-07')) || current.isAfter(dayjs());
      }}
      suffixIcon={
        <CalendarOutlined
          style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}
        />
      }
      size="small"
      style={{
        background: 'transparent',
        border: '1px solid var(--color-border)',
        borderRadius: 2,
        fontSize: 11,
      }}
    />
  );
}
