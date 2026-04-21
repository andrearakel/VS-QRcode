import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getLogs, clearLogs, exportLogs } from '../services/analyticsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CATEGORY_COLORS = {
  saga: '#f59e0b',
  sotspor: '#10b981',
  naeringarefni: '#3b82f6',
  hreinleiki: '#8b5cf6',
  extra: '#ec4899',
  landing: '#6b7280',
  recipe: '#ef4444',
};

const CATEGORY_LABELS = {
  saga: 'Saga (Story)',
  sotspor: 'Sótspor (Footprint)',
  naeringarefni: 'Næring (Nutrition)',
  hreinleiki: 'Hreinleiki (Purity)',
  extra: 'More Info',
  landing: 'Page View',
  recipe: 'Recipe Click',
};

export default function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLogs(getLogs());
  }, [refreshKey]);

  const stats = useMemo(() => {
    const productViews = {};
    const categoryTaps = {};
    const recipeTaps = {};
    let totalEvents = 0;

    logs.forEach((event) => {
      totalEvents++;

      // Product views
      if (event.productId) {
        productViews[event.productId] = (productViews[event.productId] || 0) + 1;
      }

      // Category taps (exclude landing page views)
      if (event.category && event.category !== 'landing') {
        categoryTaps[event.category] = (categoryTaps[event.category] || 0) + 1;
      }

      // Recipe clicks
      if (event.category === 'recipe') {
        const key = `${event.productId}`;
        recipeTaps[key] = (recipeTaps[key] || 0) + 1;
      }
    });

    // Unique products viewed
    const uniqueProducts = Object.keys(productViews).length;

    // Most viewed product
    const mostViewed = Object.entries(productViews)
      .sort(([, a], [, b]) => b - a)[0];

    // Category chart data
    const categoryData = Object.entries(categoryTaps)
      .map(([name, count]) => ({
        name: CATEGORY_LABELS[name] || name,
        count,
        key: name,
      }))
      .sort((a, b) => b.count - a.count);

    // Product chart data
    const productData = Object.entries(productViews)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalEvents,
      uniqueProducts,
      mostViewed,
      categoryData,
      productData,
      recipeTaps: Object.entries(recipeTaps),
    };
  }, [logs]);

  // Recent events (last 20, newest first)
  const recentEvents = useMemo(() => {
    return [...logs]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
  }, [logs]);

  const handleClear = () => {
    if (window.confirm('Clear all analytics data? This cannot be undone.')) {
      clearLogs();
      setRefreshKey((k) => k + 1);
    }
  };

  const handleExport = () => {
    exportLogs();
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">📊 VS Analytics</h1>
            <p className="text-sm text-gray-400 mt-1">Visible Sustainability — Testing Dashboard</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              📥 Export JSON
            </button>
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard label="Total Events" value={stats.totalEvents} icon="📈" />
          <SummaryCard label="Products Viewed" value={stats.uniqueProducts} icon="🐟" />
          <SummaryCard
            label="Most Viewed"
            value={stats.mostViewed ? stats.mostViewed[0] : '—'}
            icon="🏆"
          />
          <SummaryCard label="Total Sessions" value={logs.filter((l) => l.category === 'landing').length} icon="👤" />
        </div>

        {/* Charts row */}
        {stats.totalEvents > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category popularity */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <h2 className="font-bold text-sm text-gray-300 mb-4">Category Taps</h2>
              {stats.categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {stats.categoryData.map((entry) => (
                        <Cell key={entry.key} fill={CATEGORY_COLORS[entry.key] || '#6b7280'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm">No category taps yet</p>
              )}
            </div>

            {/* Product views */}
            <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
              <h2 className="font-bold text-sm text-gray-300 mb-4">Product Views</h2>
              {stats.productData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.productData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
                      labelStyle={{ color: '#f3f4f6' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-sm">No product views yet</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-10 border border-gray-800 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400">No analytics data yet.</p>
            <p className="text-gray-500 text-sm mt-1">
              Scan a product QR code to start collecting data.
            </p>
          </div>
        )}

        {/* Recent activity */}
        {recentEvents.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
            <h2 className="font-bold text-sm text-gray-300 mb-4">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b border-gray-800">
                    <th className="text-left py-2 pr-4">Time</th>
                    <th className="text-left py-2 pr-4">Product</th>
                    <th className="text-left py-2 pr-4">Action</th>
                    <th className="text-left py-2">Depth</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-2 pr-4 text-gray-400 text-xs whitespace-nowrap">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-2 pr-4 text-gray-300 font-mono text-xs">
                        {event.productId || '—'}
                      </td>
                      <td className="py-2 pr-4">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: (CATEGORY_COLORS[event.category] || '#6b7280') + '20',
                            color: CATEGORY_COLORS[event.category] || '#6b7280',
                          }}
                        >
                          {CATEGORY_LABELS[event.category] || event.category}
                        </span>
                      </td>
                      <td className="py-2 text-gray-500 text-xs">{event.depth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="text-center pt-4">
          <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
            ← Back to scanner
          </Link>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}