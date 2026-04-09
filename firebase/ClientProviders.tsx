"use client";

import React from "react";
import { AuthProvider } from "./authProvider"; 

type Props = {
  children : React.ReactNode
}


export default function ClientProviders({children}:Props) {
  return <AuthProvider>{children}</AuthProvider>;
}