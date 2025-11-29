'use client';

interface WeeklyContentProps {
  html: string;
}

export default function WeeklyContent({ html }: WeeklyContentProps) {
  return (
    <article
      className="weekly-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

