import React from 'react';

// ============================================================
// ユーティリティ関数・共通UIヘルパー
// ============================================================

/** 数値を日本式カンマ区切りにフォーマット */
export function fmt(n) {
  return Number(n).toLocaleString('ja-JP');
}

const STATUS_COLOR = {
  '承認済み': 'green', '申請中': 'blue', '差戻し': 'yellow', '却下': 'red', '下書き': 'gray',
};
export function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_COLOR[status] || 'gray'}`}>{status}</span>;
}

const TYPE_COLOR = { '経費精算': 'blue', '稟議': 'purple', '各種届出': 'green' };
export function TypeBadge({ type }) {
  return <span className={`badge ${TYPE_COLOR[type] || 'gray'}`}>{type}</span>;
}

export function PriorityBadge({ priority }) {
  return priority === '緊急'
    ? <span className="badge red">緊急</span>
    : <span className="badge gray">通常</span>;
}

export function Avatar({ name, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #2F81F7, #A371F7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color: 'white', flexShrink: 0,
    }}>
      {name?.[0] ?? '?'}
    </div>
  );
}

export function FlowStep({ label, sublabel, state }) {
  const icon = { done: '✓', active: '👁', wait: '─' }[state] ?? '─';
  return (
    <div className="flow-step">
      <div className={`flow-circle ${state}`}>{icon}</div>
      <div className="flow-name">{label}</div>
      <div className="flow-role">{sublabel}</div>
    </div>
  );
}

export function Toggle({ active, onChange }) {
  return (
    <div
      className="toggle-track"
      style={{ background: active ? 'var(--green)' : 'var(--surface3)' }}
      onClick={onChange}
    >
      <div className="toggle-thumb" style={{ left: active ? 14 : 2 }} />
    </div>
  );
}

export function EmptyState({ icon = '📭', text = 'データがありません' }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-text">{text}</div>
    </div>
  );
}

export function generateRequestId() {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 900 + 100));
  return `REQ-${year}-${num}`;
}
