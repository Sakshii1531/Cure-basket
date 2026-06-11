import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

function StatCard({ label, value, sub, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-7 bg-gray-100 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </>
      )}
    </div>
  );
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function RevenueChart({ data, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse flex items-end gap-2 h-32 pt-4">
        {[60,80,45,90,70,100].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-100 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No revenue data yet.</p>;
  }
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1.5 h-36 pt-4">
        {data.map((d, i) => {
          const pct = Math.round((d.revenue / max) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div
                  className="w-full bg-primary rounded-t transition-all duration-500 hover:bg-primary/90 cursor-default"
                  style={{ height: `${Math.max(pct, 4)}px`, minHeight: '4px' }}
                  title={`$${d.revenue.toLocaleString()}`}
                />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  ${(d.revenue / 1000).toFixed(1)}k
                </span>
              </div>
              <span className="text-[10px] text-gray-400">{MONTH_NAMES[(d._id.month - 1)]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersChart({ data, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse flex items-end gap-2 h-32 pt-4">
        {[40,70,55,85,60,95].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-100 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No user signup data yet.</p>;
  }
  const max = Math.max(...data.map(d => d.newUsers), 1);
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1.5 h-36 pt-4">
        {data.map((d, i) => {
          const pct = Math.round((d.newUsers / max) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div
                  className="w-full rounded-t transition-all duration-500 cursor-default"
                  style={{
                    height: `${Math.max(pct, 4)}px`,
                    minHeight: '4px',
                    backgroundColor: '#0d9488',
                  }}
                  title={`${d.newUsers} new user${d.newUsers !== 1 ? 's' : ''}`}
                />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.newUsers}
                </span>
              </div>
              <span className="text-[10px] text-gray-400">{MONTH_NAMES[(d._id.month - 1)]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Analytics() {
  const { user, authLoading } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [revenue, setRevenue] = useState([]);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueMonths, setRevenueMonths] = useState(6);

  // User growth chart state
  const [usersChart, setUsersChart] = useState([]);
  const [usersChartLoading, setUsersChartLoading] = useState(false);
  const [usersChartMonths, setUsersChartMonths] = useState(6);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setError('Not authorized');
      return;
    }
    api.get('/analytics/summary')
      .then(res => setSummary(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading || !user) return;
    setRevenueLoading(true);
    api.get(`/analytics/revenue?months=${revenueMonths}`)
      .then(res => setRevenue(res.data.data || []))
      .catch(() => setRevenue([]))
      .finally(() => setRevenueLoading(false));
  }, [authLoading, user, revenueMonths]);

  useEffect(() => {
    if (authLoading || !user) return;
    setUsersChartLoading(true);
    api.get(`/analytics/users?months=${usersChartMonths}`)
      .then(res => setUsersChart(res.data.data || []))
      .catch(() => setUsersChart([]))
      .finally(() => setUsersChartLoading(false));
  }, [authLoading, user, usersChartMonths]);

  const growthBadge = (pct) => {
    if (pct === null || pct === undefined) return null;
    const color = pct >= 0 ? 'text-emerald-600' : 'text-red-500';
    return <span className={`text-xs font-bold ${color}`}>{pct >= 0 ? '+' : ''}{pct}% vs last month</span>;
  };

  // Derived totals for User Growth summary strip
  const totalNewInPeriod = usersChart.reduce((sum, d) => sum + d.newUsers, 0);
  const peakMonth = usersChart.length
    ? usersChart.reduce((a, b) => (b.newUsers > a.newUsers ? b : a))
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
        <p className="text-gray-500 text-sm">View your store's sales performance and data.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Revenue This Month" value={summary ? `$${summary.revenue.thisMonth.toLocaleString()}` : '—'} sub={summary ? growthBadge(summary.revenue.growthPercent) : null} loading={loading} />
        <StatCard label="Orders This Month" value={summary ? summary.orders.thisMonth.toLocaleString() : '—'} sub={summary ? growthBadge(summary.orders.growthPercent) : null} loading={loading} />
        <StatCard label="Total Orders" value={summary ? summary.orders.total.toLocaleString() : '—'} loading={loading} />
        <StatCard label="Total Users" value={summary ? summary.users.total.toLocaleString() : '—'} sub={summary ? `+${summary.users.newThisMonth} this month` : null} loading={loading} />
        <StatCard label="Total Medicines" value={summary ? summary.medicines.total.toLocaleString() : '—'} loading={loading} />
        <StatCard label="Pending Prescriptions" value={summary ? summary.prescriptions.pending.toLocaleString() : '—'} loading={loading} />
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Revenue Trend</h3>
          <select
            value={revenueMonths}
            onChange={e => setRevenueMonths(Number(e.target.value))}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        </div>
        <RevenueChart data={revenue} loading={revenueLoading} />
      </div>

      {/* User Growth Trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: '#0d9488' }} />
            <h3 className="font-bold text-gray-900">User Growth</h3>
          </div>
          <select
            value={usersChartMonths}
            onChange={e => setUsersChartMonths(Number(e.target.value))}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        </div>

        {/* Summary strip */}
        {!usersChartLoading && usersChart.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-2 mb-1">
            <span className="text-xs text-gray-500">
              <span className="font-bold text-gray-800">{totalNewInPeriod}</span> new registrations in period
            </span>
            {peakMonth && (
              <span className="text-xs text-gray-500">
                Peak: <span className="font-bold text-gray-800">{peakMonth.newUsers}</span> in {MONTH_NAMES[peakMonth._id.month - 1]} {peakMonth._id.year}
              </span>
            )}
          </div>
        )}

        <UsersChart data={usersChart} loading={usersChartLoading} />
      </div>

      {/* Orders by Status + Revenue Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Orders by Status</h3>
          {loading ? (
            <div className="animate-pulse space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-50 rounded" />)}</div>
          ) : summary ? (
            <div className="space-y-3">
              {Object.entries(summary.orders.byStatus || {}).map(([status, count]) => {
                const pct = summary.orders.total > 0 ? Math.round((count / summary.orders.total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{status}</span>
                      <span className="font-bold text-gray-900">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Revenue Comparison</h3>
          {loading ? (
            <div className="animate-pulse space-y-3">{[1,2].map(i => <div key={i} className="h-12 bg-gray-50 rounded" />)}</div>
          ) : summary ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">This Month</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">${summary.revenue.thisMonth.toLocaleString()}</p>
                </div>
                {growthBadge(summary.revenue.growthPercent)}
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Last Month</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5">${summary.revenue.lastMonth.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Recent Orders table */}
      {summary?.recentOrders?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {summary.recentOrders.map(order => (
                  <tr key={order._id} className="text-gray-700">
                    <td className="py-3 font-semibold text-gray-900">{order.user?.name || 'Unknown'}</td>
                    <td className="py-3 font-bold">${order.totalAmount}</td>
                    <td className="py-3"><span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs font-bold">{order.status}</span></td>
                    <td className="py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
