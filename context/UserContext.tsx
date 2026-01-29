import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  displayName: string;
  email: string;
  statusMessage: string;
  avatar: string | null;
}

interface UserContextType {
  user: User;
  status: string;
  setStatus: (status: string) => void;
  setStatusMessage: (message: string) => void;
  setDisplayName: (name: string) => void;
}

const defaultUser: User = {
  id: 'user-1',
  displayName: 'You ✨',
  email: 'you@example.com',
  statusMessage: '♪ Living my best life',
  avatar: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);
  const [status, setStatus] = useState('online');

  const setStatusMessage = (message: string) => {
    setUser(prev => ({ ...prev, statusMessage: message }));
  };

  const setDisplayName = (name: string) => {
    setUser(prev => ({ ...prev, displayName: name }));
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        status, 
        setStatus, 
        setStatusMessage,
        setDisplayName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
