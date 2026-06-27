/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  path: string;
  params: Record<string, string>;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  // Read initial path from window.location.pathname or hash
  const getInitialPath = () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#')) {
      return hash.substring(1) || '/';
    }
    return window.location.pathname || '/';
  };

  const [path, setPath] = useState(getInitialPath());

  useEffect(() => {
    const handlePopState = () => {
      setPath(getInitialPath());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    // We update both hash and state to support iframe environments perfectly
    window.location.hash = to;
    window.history.pushState(null, '', to);
    setPath(to);
  };

  // Simple route parameter parser (e.g., /incident/:id)
  const getParams = (): Record<string, string> => {
    const params: Record<string, string> = {};
    
    // Parse dynamic routes like /incident/inc-123 or /report/rep-123
    if (path.startsWith('/incident/')) {
      params.incidentId = path.split('/incident/')[1]?.split('?')[0] || '';
    } else if (path.startsWith('/report/')) {
      params.reportId = path.split('/report/')[1]?.split('?')[0] || '';
    } else if (path.startsWith('/admin/incidents/')) {
      params.incidentId = path.split('/admin/incidents/')[1]?.split('?')[0] || '';
    } else if (path.startsWith('/department/incidents/')) {
      params.incidentId = path.split('/department/incidents/')[1]?.split('?')[0] || '';
    }
    
    return params;
  };

  return (
    <RouterContext.Provider value={{ path, params: getParams(), navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
