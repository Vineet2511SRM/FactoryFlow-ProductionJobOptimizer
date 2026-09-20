import React from 'react';

export default function MetricCard({ title, value, unit = '', subtitle, icon: Icon, color = 'amber', badge }) {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-700',
      badgeBg: 'bg-indigo-100 text-indigo-800'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      iconBg: 'bg-rose-100 text-rose-700',
      badgeBg: 'bg-rose-100 text-rose-800'
    },
    stone: {
      bg: 'bg-stone-50',
      text: 'text-stone-800',
      border: 'border-stone-200',
      iconBg: 'bg-stone-200 text-stone-700',
      badgeBg: 'bg-stone-100 text-stone-700'
    }
  };

  const scheme = colorMap[color] || colorMap.amber;

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {title}
          </p>
          <div className="flex items-baseline mt-1.5 space-x-1">
            <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${scheme.text}`}>
              {value}
            </span>
            {unit && (
              <span className="text-xs font-medium text-stone-500">
                {unit}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-stone-500 mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end space-y-2">
          {Icon && (
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${scheme.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          {badge && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${scheme.badgeBg}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
