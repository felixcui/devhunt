import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '热门工具 - AI研发工具',
  description: '最受欢迎的AI研发工具'
};

export default function HotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 