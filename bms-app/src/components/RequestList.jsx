import React, { useState } from 'react';
import { StatusBadge, TypeBadge, PriorityBadge, Avatar, EmptyState, fmt } from '../utils/helpers.jsx';

// ============================================================
// 申請一覧画面
// ============================================================

const STATUS_OPTIONS = ['全て', '下書き', '申請中', '差戻し', '承認済み', '却下'];
const TYPE_OPTIONS   = ['全て', '経費精算', '稟議', '各種届出'];

export default function RequestList({ requests, setRequests, setModal, showToast, search }) {
  const [statusFilter, setStatusFilter] = useState('全て');
  const [typeFilter,   setTypeFilter]   = useState('全て');

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch  = !search || r.title.includes(q) || r.applicant.includes(q) || r.id.toLowerCase().includes(q);
    const matchStatus  = statusFilter === '全て' || r.status === statusFilter;
    const matchType    = typeFilter   === '全て' || r.type   === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  function handleDelete(id) {
    if (!window.confirm('この申請を削除しますか？')) return;
    setRequests(prev => prev.filter(r => r.id !== id));
    showToast('申請を削除しました');
  }

  function handleWithdraw(id) {
    if (!window.confirm('この申請を取り下げますか？')) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: '取下げ' } : r));
    showToast('申請を取り下げました');
  }

  return (
    <div>
      {/* フィルターバー */}
      <div className="filter-bar">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          {TYPE_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'var(--text3)', marginLeft: 'auto' }}>
          {filtered.length}件
        </span>
      </div>

      {/* テーブル */}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>申請ID</th><th>タイトル</th><th>種別</th><th>申請者</th>
                <th>金額</th><th>申請日</th><th>ステータス</th><th>優先度</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState icon="📭" text="該当する申請がありません" />
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text3)' }}>{r.id}</td>
                    <td>
                      <span
                        style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 500 }}
                        onClick={() => setModal({ type: 'detail', data: r })}
                      >
                        {r.title}
                      </span>
                    </td>
                    <td><TypeBadge type={r.type} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Avatar name={r.applicant} size={22} />
                        {r.applicant}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>
                      {r.amount > 0 ? `¥${fmt(r.amount)}` : '─'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text2)' }}>{r.date}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td><PriorityBadge priority={r.priority} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-sm"
                          onClick={() => setModal({ type: 'detail', data: r })}>
                          詳細
                        </button>
                        {r.status === '下書き' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}>
                            削除
                          </button>
                        )}
                        {r.status === '申請中' && (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleWithdraw(r.id)}>
                            取下げ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
