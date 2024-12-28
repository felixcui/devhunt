import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '工具资讯 - AI研发工具',
  description: 'AI研发工具最新资讯和动态'
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 