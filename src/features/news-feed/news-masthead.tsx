import dayjs from 'dayjs';
import DatePickerControl from './date-picker-control';

export default function NewsMasthead({ date }: { date: string }) {
  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border-light)',
        paddingBottom: 12,
        marginBottom: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <div
          className="newspaper-heading"
          style={{
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: '-0.3px',
            color: 'var(--color-text)',
            lineHeight: 1.15,
          }}
        >
          {dayjs(date).format('D MMMM')} Briefings
        </div>
        <DatePickerControl date={date} />
      </div>
    </div>
  );
}
