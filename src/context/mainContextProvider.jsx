import { createContext, useState } from "react";

export const mainContext = createContext();

export default function MainContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
  };

  return (
    <mainContext.Provider value={{ contextValue }}>
      {children}
    </mainContext.Provider>
  );
}
