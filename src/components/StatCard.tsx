import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  trend?: number;
  trendLabel?: string;
}

const StatCard = ({ title, value, icon, color, trend, trendLabel }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ backgroundColor: `${color}15`, color }}>
        {icon}
      </div>
      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{value}</span>
        {trend !== undefined && (
          <div className="stat-card-trend">
            <span className={`trend-badge ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
              {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {Math.abs(trend)}%
            </span>
            {trendLabel && <span className="trend-label">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;