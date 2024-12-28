import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

declare module 'next/navigation' {
  export function notFound(): never;
  export function useRouter(): AppRouterInstance;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
} 