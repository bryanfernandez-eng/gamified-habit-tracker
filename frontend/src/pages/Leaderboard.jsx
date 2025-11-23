import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { gameApi } from "../services/gameApi";

const demoPlayers = [
  { id: 1, name: "Michael Jordan", level: 5, currentFloor: 18, hp: 80, xp: 75 },
  { id: 2, name: "Lebron", level: 7, currentFloor: 21, hp: 92, xp: 44 },
  { id: 3, name: "Shamar", level: 9, currentFloor: 30, hp: 67, xp: 10 },
  { id: 4, name: "Abe", level: 4, currentFloor: 14, hp: 88, xp: 23 },
  { id: 5, name: "Juan", level: 8, currentFloor: 26, hp: 71, xp: 65 },
  { id: 6, name: "Bryan", level: 6, currentFloor: 19, hp: 60, xp: 90 },
  { id: 7, name: "Ari Vega", level: 10, currentFloor: 33, hp: 55, xp: 15 },
  { id: 8, name: "Luna Park", level: 3, currentFloor: 9, hp: 97, xp: 5 },
  { id: 9, name: "Theo Blaze", level: 5, currentFloor: 18, hp: 77, xp: 40 },
  { id: 10, name: "Ivy Quinn", level: 7, currentFloor: 22, hp: 83, xp: 72 },
];

function classNames(...arr) {
  return arr.filter(Boolean).join(" ");
}

const Medal = ({ place }) => {
  const styles = {
    1: "bg-yellow-400/90 text-gray-900 ring-yellow-300",
    2: "bg-gray-300 text-gray-900 ring-gray-200",
    3: "bg-amber-700 text-amber-50 ring-amber-600",
  }[place];
  return (
    <span
      aria-label={`${place} place`}
      className={classNames(
        "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ring-2",
        styles
      )}
    >
      {place}
    </span>
  );
};

const Badge = ({ children, color = "gold" }) => (
  <span
    className={classNames(
      "px-2 py-0.5 rounded-md text-xs font-semibold border",
      color === "gold"
        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
        : "bg-slate-500/20 text-slate-300 border-slate-500/40"
    )}
  >
    {children}
  </span>
);

const PodiumCard = ({ player, place, isCurrentUser }) => (
  <div
    className={classNames(
      "relative rounded-none p-5 shadow-2xl border-4",
      place === 1
        ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300 text-gray-900"
        : "bg-gray-800 border-gray-700 text-slate-100",
      isCurrentUser && place !== 1 && "ring-2 ring-yellow-400",
      "hover:shadow-2xl transition-all"
    )}
  >
    <div className="flex items-center gap-4">
      <Medal place={place} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={classNames(
            "truncate font-extrabold text-lg",
            place === 1 ? "text-gray-900" : "text-gray-100"
          )}>
            {player.name}
          </h3>
          <span className={classNames(
            "px-3 py-1 text-xs font-bold border-2 rounded-sm",
            place === 1
              ? "bg-yellow-600 border-yellow-700 text-yellow-900"
              : "bg-yellow-700 border-yellow-600 text-yellow-200"
          )}>
            Lvl {player.level}
          </span>
        </div>
        <p className={classNames(
          "text-sm mt-1",
          place === 1 ? "text-gray-800" : "text-gray-400"
        )}>
          Current Floor
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className={classNames(
            "text-3xl font-black",
            place === 1 ? "text-gray-900" : "text-gray-100"
          )}>
            {player.currentFloor}
          </span>
          <span className={classNames(
            "text-sm font-bold uppercase",
            place === 1 ? "text-gray-800" : "text-gray-400"
          )}>
            FLR
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className={classNames(
          "w-32 h-6 rounded-sm border-2 overflow-hidden",
          place === 1
            ? "bg-yellow-600 border-yellow-700"
            : "bg-gray-700 border-gray-600"
        )}>
          <div
            className={classNames(
              "h-full",
              place === 1 ? "bg-yellow-900" : "bg-yellow-500"
            )}
            style={{ width: `${Math.min(100, player.xp)}%` }}
          />
        </div>
        <span className={classNames(
          "text-xs font-bold",
          place === 1 ? "text-gray-800" : "text-gray-400"
        )}>
          XP {Math.round(player.xp)}/100
        </span>
      </div>
    </div>
  </div>
);

const Row = ({ index, player, isCurrentUser }) => (
  <div
    className={classNames(
      "grid grid-cols-12 items-center px-3 sm:px-4 py-3 border-l-4 transition-all",
      isCurrentUser
        ? "bg-yellow-500/15 border-l-yellow-400"
        : index % 2 ? "bg-slate-800/40" : "bg-slate-800/20",
      "hover:bg-orange-500/30"
    )}
  >
    <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
      <span className={classNames(
        "font-mono text-sm w-6 tabular-nums font-bold",
        isCurrentUser ? "text-yellow-400" : "text-slate-300"
      )}>
        {index + 1}
      </span>
      {isCurrentUser && <span className="text-xs text-yellow-400">★</span>}
    </div>
    <div className="col-span-6 sm:col-span-6 flex items-center gap-3">
      <div className={classNames(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border",
        isCurrentUser
          ? "bg-yellow-500/30 border-yellow-400 text-yellow-300"
          : "bg-slate-600/40 border-slate-500/50 text-slate-200"
      )}>
        {player.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="min-w-0">
        <p className={classNames(
          "truncate font-medium",
          isCurrentUser ? "text-yellow-300 font-bold" : "text-slate-100"
        )}>
          {player.name}
        </p>
        <p className={classNames(
          "text-[11px]",
          isCurrentUser ? "text-yellow-400" : "text-slate-400"
        )}>
          Lvl {player.level}
        </p>
      </div>
    </div>
    <div className={classNames(
      "col-span-2 sm:col-span-2 font-semibold text-right",
      isCurrentUser ? "text-yellow-400" : "text-yellow-300"
    )}>
      {player.currentFloor}
    </div>
    <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-2">
      <div className={classNames(
        "w-28 h-3.5 rounded-md overflow-hidden border",
        isCurrentUser
          ? "bg-yellow-600/40 border-yellow-500"
          : "bg-slate-700 border-slate-600"
      )}>
        <div
          className={isCurrentUser ? "h-full bg-yellow-500" : "h-full bg-yellow-500"}
          style={{ width: `${Math.min(100, player.xp)}%` }}
        />
      </div>
      <span className={classNames(
        "text-[10px] w-14 text-right",
        isCurrentUser ? "text-yellow-400" : "text-slate-400"
      )}>
        XP {Math.round(player.xp)}/100
      </span>
    </div>
  </div>
);

const Leaderboard = ({ players = demoPlayers, title = "LEADERBOARD" }) => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await gameApi.getLeaderboard();
      setLeaderboardData(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
      setError("Failed to load leaderboard");
      setLeaderboardData(null);
    } finally {
      setLoading(false);
    }
  };

  // Use backend data if available, otherwise use demo/props data
  const displayPlayers = leaderboardData ? leaderboardData.map((player) => ({
    id: player.id,
    username: player.username,
    name: player.display_name || player.username,
    level: player.level,
    currentFloor: player.level * 3 + Math.floor(player.current_xp / 10), // Calculate floor based on level and XP
    hp: player.current_hp,
    xp: Math.min(100, Math.round((player.current_xp / player.next_level_xp) * 100 * 100) / 100), // Convert to percentage and round to 2 decimals
  })) : players;

  const sorted = [...displayPlayers].sort((a, b) => {
    if (b.currentFloor !== a.currentFloor) return b.currentFloor - a.currentFloor;
    if (b.xp !== a.xp) return b.xp - a.xp;
    return a.name.localeCompare(b.name);
  });

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0F1924] text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-4">Loading Leaderboard...</div>
          <div className="text-slate-400">Fetching rankings from server</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0F1924] text-slate-100">
      {/* Top bar */}

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-center justify-between pt-6 pb-4">
          <h1 className="text-xl tracking-wider font-extrabold text-yellow-400">
            {title} — CURRENT FLOOR
          </h1>
          <div className="flex items-center gap-2 text-xs">
            <Badge>Sorted: Floor ↓</Badge>
            <Badge color="slate">Tie‑break: XP</Badge>
            {error && <Badge color="slate">⚠️ {error}</Badge>}
          </div>
        </div>

        {/* Podium */}
        <section className="grid sm:grid-cols-3 gap-4">
          {top3.map((p, idx) => (
            <PodiumCard
              key={p.id}
              player={p}
              place={idx + 1}
              isCurrentUser={user?.username === p.username}
            />
          ))}
        </section>

        {/* Table */}
        {rest.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-2xl border border-yellow-500/20 bg-slate-900/40">
            <div className="grid grid-cols-12 px-3 sm:px-4 py-2 text-[11px] uppercase tracking-wide text-slate-400 bg-slate-900/60 border-b border-slate-700">
              <div className="col-span-2 sm:col-span-1">#</div>
              <div className="col-span-6 sm:col-span-6">Player</div>
              <div className="col-span-2 sm:col-span-2 text-right text-yellow-400">Floor</div>
              <div className="col-span-2 sm:col-span-3 text-right">XP</div>
            </div>
            <div>
              {rest.map((p, i) => (
                <Row
                  key={p.id}
                  index={i + 3}
                  player={p}
                  isCurrentUser={user?.username === p.username}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
