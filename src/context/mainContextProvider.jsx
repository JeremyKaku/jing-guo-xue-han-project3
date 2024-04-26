import { createContext, useState } from "react";

export const mainContext = createContext();

export default function MainContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [navBarActive, setNavBarActive] = useState("home");

  const contextValue = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    searchValue,
    setSearchValue,
    navBarActive,
    setNavBarActive,
  };

  return (
    <mainContext.Provider value={{ contextValue }}>
      {children}
    </mainContext.Provider>
  );
}
