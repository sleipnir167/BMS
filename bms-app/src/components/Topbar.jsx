import React from 'react';

// ============================================================
// トップバー（ページタイトル・検索・通知）
// ============================================================

const PAGE_TITLES = {
  dashboard:   'ダッシュボード',
  requests:    '申請一覧',
  new_request: '新規申請',
  approvals:   '承認待ち',
  users:       'ユーザー管理',
  masters:     'マスタ管理',
  reports:     'レポート',
};

export default function Topbar({ page, search, setSearch, notifs, showNotif, setShowNotif, setNotifs }) {
  const unreadCount = notifs.filter(n => !n.read).length;

  const notifIconMap = { approval: '📋', returned: '↩', approved: '✅', alert: '⚠️' };

  return (
    <div className="topbar">
      <div className="topbar-title">{PAGE_TITLES[page] ?? page}</div>

      {/* 検索 */}
      <div className="topbar-search">
        <span style={{ color: 'var(--text3)' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="申請番号・タイトル・申請者で検索..."
        />
      </div>

      {/* 通知 */}
      <div style={{ position: 'relative' }}>
        <div className="icon-btn" onClick={() => setShowNotif(v => !v)}>
          🔔
          {unreadCount > 0 && <div className="notif-dot" />}
        </div>

        {showNotif && (
          <div className="notif-panel">
            <div className="notif-header">
              通知
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setNotifs(ns => ns.map(n => ({ ...n, read: true })))}
              >
                全て既読
              </button>
            </div>
            {notifs.map(n => (
              <div
                key={n.id}
                className={`notif-item ${!n.read ? 'unread' : ''}`}
                onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))}
              >
                {!n.read && <div className="notif-dot2" />}
                <div>
                  <div className="notif-text">
                    {notifIconMap[n.type] ?? '🔔'} {n.text}
                  </div>
                  <div className="notif-time">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
