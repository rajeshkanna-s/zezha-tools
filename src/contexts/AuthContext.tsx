import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
  canUpload: () => boolean;
  signOut: () => Promise<void>;
  profile?: any;
  subscription?: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockUser = {
    id: 'mock-user-id',
    email: 'user@example.com',
    user_metadata: { name: 'Zezha User' }
  };
  
  const value: AuthContextType = {
    user: mockUser,
    loading: false,
    canUpload: () => true,
    signOut: async () => {},
    profile: null,
    subscription: { plan_name: 'free_trial' }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: { id: 'mock-user-id', email: 'user@example.com', user_metadata: { name: 'Zezha User' } },
      loading: false,
      canUpload: () => true,
      signOut: async () => {},
      profile: null,
      subscription: { plan_name: 'free_trial' }
    };
  }
  return context;
};
