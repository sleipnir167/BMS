import React from 'react';

// ============================================================
// サイドナビゲーション
// ============================================================

const NAV_ITEMS = [
  { id: 'dashboard',   icon: '▦',  label: 'ダッシュボード', section: 'menu' },
  { id: 'requests',    icon: '📋', label: '申請一覧',       section: 'menu', badgeKey: 'pending' },
  { id: 'new_request', icon: '✚',  label: '新規申請',       section: 'menu' },
  { id: 'approvals',   icon: '✓',  label: '承認待ち',       section: 'menu', badgeKey: 'pending' },
  { id: 'users',       icon: '👤', label: 'ユーザー管理',   section: 'admin' },
  { id: 'masters',     icon: '🗂', label: 'マスタ管理',     section: 'admin' },
  { id: 'reports',     icon: '📊', label: 'レポート',       section: 'admin' },
];

export default function Sidebar({ page, navigate, currentUser, pendingCount }) {
  const menuItems = NAV_ITEMS.filter(i => i.section === 'menu');
  const adminItems = NAV_ITEMS.filter(i => i.section === 'admin');

  const renderItem = (item) => (
    <button
      key={item.id}
      className={`nav-item ${page === item.id ? 'active' : ''}`}
      onClick={() => navigate(item.id)}
    >
      <span className="nav-icon">{item.icon}</span>
      {item.label}
      {item.badgeKey === 'pending' && pendingCount > 0 && (
        <span className="nav-badge">{pendingCount}</span>
      )}
    </button>
  );

  return (
    <nav className="sidebar">
      {/* ロゴ */}
      <div className="sidebar-logo">
        <div className="logo-icon">⚙</div>
        BMS
      </div>

      {/* メニュー */}
      <div className="sidebar-section">
        <div className="sidebar-label">メニュー</div>
        {menuItems.map(renderItem)}
      </div>

      {/* 管理 */}
      <div className="sidebar-section">
        <div className="sidebar-label">管理</div>
        {adminItems.map(renderItem)}
      </div>

      {/* ユーザー情報 */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{currentUser.avatar}</div>
          <div className="user-info">
            <div className="user-name">{currentUser.name}</div>
            <div className="user-role">{currentUser.dept} · {currentUser.role}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
