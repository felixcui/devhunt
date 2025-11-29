'use client';

interface AboutContentProps {
  html: string;
}

export default function AboutContent({ html }: AboutContentProps) {
  return (
    <article
      className="about-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

