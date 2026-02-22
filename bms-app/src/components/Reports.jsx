import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { StatusBadge, TypeBadge, fmt } from '../utils/helpers.jsx';
import { EXPENSE_DEPT_DATA } from '../data/mockData.js';

// ============================================================
// レポート・集計画面
// ============================================================

const TOOLTIP_STYLE = {
  contentStyle: { background: '#161B22', border: '1px solid #30363D', borderRadius: 8, fontSize: 12 },
};

const STATUS_BAR_COLOR = {
  '承認済み': 'var(--green)', '申請中': 'var(--accent)',
  '差戻し': 'var(--yellow)', '却下': 'var(--red)', '下書き': 'var(--text3)',
};

export default function Reports({ requests }) {
  const [period, setPeriod] = useState('月次');

  const approved  = requests.filter(r => r.status === '承認済み').length;
  const totalAmt  = requests.filter(r => r.status === '承認済み').reduce((s, r) => s + r.amount, 0);
  const approvalRate = requests.length > 0 ? Math.round(approved / requests.length * 100) : 0;

  const byStatus = ['承認済み', '申請中', '差戻し', '却下', '下書き'].map(s => ({
    name: s,
    count: requests.filter(r => r.status === s).length,
  }));

  function handleExport(type) {
    alert(`※ モック画面のため${type}エクスポートは未実装です`);
  }

  return (
    <div>
      {/* ツールバー */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }}
        >
          {['月次', '四半期', '年次'].map(p => <option key={p}>{p}</option>)}
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => handleExport('CSV')}>📥 CSVエクスポート</button>
        <button className="btn btn-secondary btn-sm" onClick={() => handleExport('PDF')}>📄 PDFエクスポート</button>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text3)' }}>
          集計期間: {period}
        </span>
      </div>

      {/* KPIカード */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card blue">
          <div className="kpi-label">総申請件数</div>
          <div className="kpi-value">{requests.length}</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">承認率</div>
          <div className="kpi-value">{approvalRate}%</div>
        </div>
        <div className="kpi-card yellow">
          <div className="kpi-label">平均承認日数</div>
          <div className="kpi-value">1.8日</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">承認済み経費合計</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>¥{fmt(totalAmt)}</div>
        </div>
      </div>

      {/* チャート */}
      <div className="chart-grid" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">📊 部門別経費実績 vs 予算（万円）</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={EXPENSE_DEPT_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="dept" stroke="#8B949E" fontSize={11} />
              <YAxis stroke="#8B949E" fontSize={11} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Bar dataKey="予算" fill="#30363D" radius={[4,4,0,0]} />
              <Bar dataKey="経費" fill="#2F81F7" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">📋 ステータス別件数</div>
          {byStatus.map(s => (
            <div key={s.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
                <span>{s.name}</span>
                <span style={{ fontFamily: 'monospace', color: STATUS_BAR_COLOR[s.name] }}>
                  {s.count}件
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: requests.length > 0 ? `${s.count / requests.length * 100}%` : '0%',
                  background: STATUS_BAR_COLOR[s.name],
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 全申請一覧 */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">申請一覧（集計対象）</div>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{requests.length}件</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>申請ID</th><th>タイトル</th><th>種別</th><th>申請者</th><th>金額</th><th>ステータス</th><th>申請日</th></tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)' }}>{r.id}</td>
                  <td>{r.title}</td>
                  <td><TypeBadge type={r.type} /></td>
                  <td>{r.applicant}</td>
                  <td style={{ fontFamily: 'monospace' }}>{r.amount > 0 ? `¥${fmt(r.amount)}` : '─'}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
