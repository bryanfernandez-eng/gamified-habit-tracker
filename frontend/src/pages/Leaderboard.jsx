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
    1: "bg-yellow-400 text-yellow-900 ring-yellow-600",
    2: "bg-gray-300 text-gray-800 ring-gray-400",
    3: "bg-amber-700 text-amber-100 ring-amber-900",
  }[place];
  return (
    <span
      aria-label={`${place} place`}
      className={classNames(
        "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-serif font-bold ring-2 shadow-sm",
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
      "px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-bold border",
      color === "gold"
        ? "bg-rulebook-ink/5 text-rulebook-ink border-rulebook-ink/20"
        : "bg-rulebook-crimson/5 text-rulebook-crimson border-rulebook-crimson/20"
    )}
  >
    {children}
  </span>
);

const PodiumCard = ({ player, place, isCurrentUser }) => (
  <div
    className={classNames(
      "relative p-5 transition-all rulebook-card",
      place === 1
        ? "transform scale-105 z-10 border-rulebook-crimson"
        : "border-rulebook-charcoal",
      isCurrentUser && "ring-2 ring-rulebook-crimson ring-offset-2 ring-offset-rulebook-paper"
    )}
  >
    <div className="flex items-center gap-4">
      <Medal place={place} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={classNames(
            "truncate font-serif font-bold text-lg",
            place === 1 ? "text-rulebook-crimson" : "text-rulebook-ink"
          )}>
            {player.name}
          </h3>
          <span className={classNames(
            "px-2 py-0.5 text-[10px] font-bold border rounded-sm uppercase tracking-wide",
            place === 1
              ? "bg-rulebook-crimson text-rulebook-paper border-rulebook-crimson"
              : "bg-rulebook-ink/10 border-rulebook-ink/20 text-rulebook-ink"
          )}>
            Lvl {player.level}
          </span>
        </div>
        <p className="text-xs mt-1 text-rulebook-ink/60 font-mono uppercase tracking-wide">
          Current Floor
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-3xl font-serif font-bold text-rulebook-ink">
            {player.currentFloor}
          </span>
          <span className="text-xs font-bold uppercase text-rulebook-ink/40">
            FLR
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="w-24 h-4 rounded-full border border-rulebook-ink/20 overflow-hidden bg-rulebook-ink/5">
          <div
            className={classNames(
              "h-full",
              place === 1 ? "bg-rulebook-crimson" : "bg-rulebook-ink"
            )}
            style={{ width: `${Math.min(100, player.xp)}%` }}
          />
        </div>
        <span className="text-[10px] font-mono font-bold text-rulebook-ink/60">
          XP {Math.round(player.xp)}/100
        </span>
      </div>
    </div>
  </div>
);

const Row = ({ index, player, isCurrentUser }) => (
  <div
    className={classNames(
      "grid grid-cols-12 items-center px-3 sm:px-4 py-3 border-b border-rulebook-ink/10 transition-all",
      isCurrentUser
        ? "bg-rulebook-crimson/5"
        : "hover:bg-rulebook-ink/5"
    )}
  >
    <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
      <span className={classNames(
        "font-serif text-lg w-6 tabular-nums font-bold",
        isCurrentUser ? "text-rulebook-crimson" : "text-rulebook-ink/60"
      )}>
        {index + 1}
      </span>
      {isCurrentUser && <span className="text-xs text-rulebook-crimson">★</span>}
    </div>
    <div className="col-span-6 sm:col-span-6 flex items-center gap-3">
      <div className={classNames(
        "w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold border-2 font-serif",
        isCurrentUser
          ? "bg-rulebook-crimson text-rulebook-paper border-rulebook-crimson"
          : "bg-rulebook-paper border-rulebook-ink/20 text-rulebook-ink"
      )}>
        {player.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div className="min-w-0">
        <p className={classNames(
          "truncate font-serif font-bold",
          isCurrentUser ? "text-rulebook-crimson" : "text-rulebook-ink"
        )}>
          {player.name}
        </p>
        <p className="text-[10px] text-rulebook-ink/40 font-mono uppercase tracking-wide">
          Lvl {player.level}
        </p>
      </div>
    </div>
    <div className={classNames(
      "col-span-2 sm:col-span-2 font-serif font-bold text-right text-lg",
      isCurrentUser ? "text-rulebook-crimson" : "text-rulebook-ink"
    )}>
      {player.currentFloor}
    </div>
    <div className="col-span-2 sm:col-span-3 flex items-center justify-end gap-2">
      <div className="w-24 h-2 rounded-full overflow-hidden border border-rulebook-ink/10 bg-rulebook-ink/5">
        <div
          className={isCurrentUser ? "h-full bg-rulebook-crimson" : "h-full bg-rulebook-ink/60"}
          style={{ width: `${Math.min(100, player.xp)}%` }}
        />
      </div>
      <span className="text-[10px] w-14 text-right font-mono text-rulebook-ink/40 hidden sm:inline-block">
        {Math.round(player.xp)} XP
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
      <div className="min-h-screen w-full bg-rulebook-paper flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-serif font-bold text-rulebook-ink mb-4 uppercase tracking-widest">Loading Leaderboard...</div>
          <div className="text-rulebook-ink/60 font-mono text-sm">Fetching rankings from the Guild...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-rulebook-paper pt-20 pb-12">
      {/* Content */}
      <main className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8 border-b-4 border-double border-rulebook-charcoal pb-4">
          <h1 className="text-3xl font-serif font-bold text-rulebook-ink uppercase tracking-widest">
            {title} — <span className="text-rulebook-crimson">Current Floor</span>
          </h1>
          <div className="flex items-center gap-2 text-xs hidden sm:flex">
            <Badge>Sorted: Floor ↓</Badge>
            <Badge color="slate">Tie‑break: XP</Badge>
            {error && <Badge color="slate">⚠️ {error}</Badge>}
          </div>
        </div>

        {/* Podium */}
        <section className="grid sm:grid-cols-3 gap-6 mb-12">
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
          <section className="rulebook-card overflow-hidden p-0">
            <div className="grid grid-cols-12 px-3 sm:px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-rulebook-ink/60 bg-rulebook-ink/5 border-b-2 border-rulebook-ink/10 font-serif">
              <div className="col-span-2 sm:col-span-1">#</div>
              <div className="col-span-6 sm:col-span-6">Player</div>
              <div className="col-span-2 sm:col-span-2 text-right text-rulebook-crimson">Floor</div>
              <div className="col-span-2 sm:col-span-3 text-right">XP</div>
            </div>
            <div className="divide-y divide-rulebook-ink/5">
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
