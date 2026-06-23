'use client';

import { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

export default function SearchControl({
  date,
  source,
  search,
}: {
  date: string;
  source: string;
  search?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(search || '');

  const navigate = (val: string) => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (source && source !== 'all') params.set('source', source);
    if (val) params.set('search', val);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <Input.Search
      placeholder="Search articles..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSearch={navigate}
      onClear={() => {
        setValue('');
        navigate('');
      }}
      allowClear
      size="small"
      variant="borderless"
      prefix={
        <SearchOutlined
          style={{ color: 'var(--color-text-tertiary)', fontSize: 12 }}
        />
      }
      style={{ height: 34 }}
    />
  );
}
