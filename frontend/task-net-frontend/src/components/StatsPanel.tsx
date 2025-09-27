import React, { useEffect, useState } from "react";
import useTasks from "../hooks/useTasks";

type Props = {
  completed?: number;
  pending?: number;
  total?: number;
  percent?: number;
};

const StatsPanel: React.FC<Props> = ({ completed, pending, total, percent }) => {
  const { fetchGlobalStats } = useTasks();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchGlobalStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [fetchGlobalStats]);

  if (loading) return <div>Loading stats...</div>;
  if (!stats) return null;

  // Prefer global total from backend (stats.total). Fall back to passed total prop, then to completed+pending.
  const totalCount =
    typeof stats?.total === "number"
      ? stats.total
      : typeof total === "number"
      ? total
      : Number(stats?.completed || 0) + Number(stats?.pending || 0);

  // Use completed from backend when available, otherwise fallback to prop
  const completedCount = typeof stats?.completed === "number" ? stats.completed : completed ?? 0;

  // detect in-progress count from several possible backend keys
  const inProgressCount = Number(
    stats?.raw?.byStatus?.["in-progress"] ??
      stats?.raw?.byStatus?.inProgress ??
      stats?.raw?.byStatus?.in_progress ??
      stats?.byStatus?.["in-progress"] ??
      stats?.byStatus?.inProgress ??
      stats?.byStatus?.in_progress ??
      0
  );

  // pendingCount should include both "pending" and "in-progress" tasks (not completed)
  const pendingFromStats = typeof stats?.pending === "number" ? stats.pending : pending ?? 0;
  const pendingCount = Number(pendingFromStats) + Number(inProgressCount);

  const pct =
    typeof percent === "number"
      ? percent
      : totalCount === 0
      ? 0
      : Math.round((Number(completedCount) / totalCount) * 100);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <div style={{ width: 120, height: 120 }} className="flex items-center justify-center">
            <svg width="120" height="120" viewBox={`0 0 88 88`} aria-hidden>
              <defs>
                <linearGradient id="grad" x1="0%" x2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <circle stroke="#eef2f7" fill="transparent" strokeWidth={10} r={34} cx={44} cy={44} />
              <circle
                stroke="url(#grad)"
                fill="transparent"
                strokeWidth={10}
                strokeLinecap="round"
                r={34}
                cx={44}
                cy={44}
                strokeDasharray={`${Math.PI * 2 * 34} ${Math.PI * 2 * 34}`}
                strokeDashoffset={Math.PI * 2 * 34 * (1 - pct / 100)}
                style={{ transition: "stroke-dashoffset 600ms ease" }}
                transform={`rotate(-90 44 44)`}
              />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight={700} fill="#0f172a">
                {pct}%
              </text>
            </svg>
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-semibold mb-1">Tiến độ hoàn thành</h4>
            <p className="text-sm text-muted mb-3">
              {completedCount} hoàn thành / {totalCount} tổng
            </p>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: "#34d399" }} />
                <div>
                  <div className="font-medium">{completedCount}</div>
                  <div className="text-muted">Hoàn thành</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ background: "#f97316" }} />
                <div>
                  <div className="font-medium">{pendingCount}</div>
                  <div className="text-muted">Chưa hoàn thành</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div style={{ width: `${pct}%` }} className="h-3">
              <div style={{ height: "100%", background: "linear-gradient(90deg,#34d399,#059669)" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-muted">Tổng: {totalCount} nhiệm vụ</div>
    </div>
  );
};

export default StatsPanel;