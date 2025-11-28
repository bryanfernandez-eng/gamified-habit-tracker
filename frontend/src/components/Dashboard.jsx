import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { GameDashboard } from "./game/GameDashboard";
import Loader from "./Loader";

export default function Dashboard({ userStats, onStatsUpdate, updateTrigger }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return <GameDashboard userStats={userStats} onStatsUpdate={onStatsUpdate} updateTrigger={updateTrigger} />;
}