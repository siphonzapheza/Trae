import { Header } from './Header';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main className={isAuthenticated ? "container mx-auto px-4 py-8" : ""}>
        {children}
      </main>
    </div>
  );
}