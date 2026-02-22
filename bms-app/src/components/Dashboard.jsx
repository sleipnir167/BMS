import React from 'react';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { StatusBadge, TypeBadge, fmt } from '../utils/helpers.jsx';
import { KPI_TREND_DATA, TYPE_RATIO_DATA, EXPENSE_DEPT_DATA, ACTIVITY_LOG } from '../data/mockData.js';

// ============================================================
// ダッシュボード画面
// ============================================================

const TOOLTIP_STYLE = {
  contentStyle: { background: '#161B22', border: '1px solid #30363D', borderRadius: 8, fontSize: 12 },
};

export default function Dashboard({ requests, navigate, setModal }) {
  const approved  = requests.filter(r => r.status === '承認済み').length;
  const pending   = requests.filter(r => r.status === '申請中').length;
  const returned  = requests.filter(r => r.status === '差戻し').length;
  const totalAmt  = requests.filter(r => r.status === '承認済み').reduce((s, r) => s + r.amount, 0);
  const approvalRate = requests.length > 0 ? Math.round(approved / requests.length * 100) : 0;

  return (
    <div>
      {/* KPI カード */}
      <div className="kpi-grid">
        <KPICard color="blue" icon="📋" label="今月の申請件数"
          value={requests.length} delta="▲ 前月比 +18%" />
        <KPICard color="green" icon="✅" label="承認済み"
          value={approved} delta={`承認率 ${approvalRate}%`} />
        <KPICard color="yellow" icon="⏳" label="承認待ち"
          value={pending} delta={returned > 0 ? `▼ 差戻し ${returned}件` : '良好'} deltaNeg={returned > 0} />
        <KPICard color="purple" icon="💴" label="承認済み経費合計"
          value={`¥${fmt(totalAmt)}`} valueSmall delta="▲ 前月比 +5%" />
      </div>

      {/* チャート上段 */}
      <div className="chart-grid">
        <div className="card">
          <div className="card-title">📈 月次申請トレンド</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={KPI_TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="month" stroke="#8B949E" fontSize={11} />
              <YAxis stroke="#8B949E" fontSize={11} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="申請数" stroke="#2F81F7" strokeWidth={2} dot={{ fill: '#2F81F7', r: 4 }} />
              <Line type="monotone" dataKey="承認率" stroke="#3FB950" strokeWidth={2} dot={{ fill: '#3FB950', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">🥧 申請種別割合</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={TYPE_RATIO_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {TYPE_RATIO_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            {TYPE_RATIO_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text2)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* チャート下段 */}
      <div className="chart-grid">
        {/* 最近の申請 */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">最近の申請</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('requests')}>全て見る</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>申請ID</th><th>タイトル</th><th>種別</th><th>ステータス</th></tr>
              </thead>
              <tbody>
                {requests.slice(0, 5).map(r => (
                  <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setModal({ type: 'detail', data: r })}>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)' }}>{r.id}</td>
                    <td>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                        {r.title}
                      </div>
                    </td>
                    <td><TypeBadge type={r.type} /></td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* アクティビティ */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>最近のアクティビティ</div>
          {ACTIVITY_LOG.map((a, i) => (
            <div key={i} className="activity-item">
              <div className="activity-dot" style={{ background: a.color }} />
              <div>
                <div style={{ fontSize: 12, color: 'var(--text)' }}>{a.text}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// KPIカードサブコンポーネント
function KPICard({ color, icon, label, value, delta, deltaNeg, valueSmall }) {
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={valueSmall ? { fontSize: 22 } : {}}>{value}</div>
      <div className={`kpi-delta ${deltaNeg ? 'neg' : ''}`}>{delta}</div>
    </div>
  );
}
