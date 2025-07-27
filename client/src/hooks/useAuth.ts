import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    fetch('/api/auth/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
      }
      setIsLoading(false);
    })
    .catch(() => {
      setIsLoading(false);
    });
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
