import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { GameDashboard } from "./game/GameDashboard";
import Loader from "./Loader";

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return <GameDashboard />;
}