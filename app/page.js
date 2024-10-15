"use client";
import React, { useState } from "react";
import LoginPage from "@/components/Login";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [login, isLogin] = useState(false);
  const checkLogin=()=>{
       isLogin(true)
  }
  return !login ? <LoginPage user={checkLogin} /> : <Dashboard />;
}
