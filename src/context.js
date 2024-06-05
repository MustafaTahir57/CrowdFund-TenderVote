import React, { createContext, useState } from "react";
export const AuthUserContext = createContext();
const AuthState = (props) => {
  const [connectWallet, setConnectWallet] = useState("Connect Wallet");
  const [checkBalance, setCheckBalance] = useState();
  return (
    <AuthUserContext.Provider
      value={{ connectWallet, setConnectWallet, setCheckBalance, checkBalance}}
    >
      {props.children}
    </AuthUserContext.Provider>
  );
};
export default AuthState;