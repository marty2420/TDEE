import React, { createContext, useContext, useState } from 'react';

type TdeeContextType = {
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
};

const TdeeContext = createContext<TdeeContextType | undefined>(undefined);

export const TdeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <TdeeContext.Provider value={{ isUpdating, setIsUpdating }}>
      {children}
    </TdeeContext.Provider>
  );
};

export const useTdee = () => {
  const context = useContext(TdeeContext);
  if (!context) {
    throw new Error('useTdee must be used within a TdeeProvider');
  }
  return context;
};
