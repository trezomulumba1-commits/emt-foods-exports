import React from 'react';

// Minimal AuthProvider stub used by the frontend. Replace with real
// authentication context when integrating with backend auth flows.
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AuthProvider;
