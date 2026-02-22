import React, { useState } from 'react';
import { TypeBadge, PriorityBadge, FlowStep, fmt } from '../utils/helpers.jsx';

// ============================================================
// 承認待ち画面
// ============================================================

export default function Approvals({ requests, setRequests, showToast, setModal }) {
  const pending = requests.filter(r => r.status === '申請中');
  const [comments, setComments] = useState({});

  function setComment(id, val) {
    setComments(prev => ({ ...prev, [id]: val }));
  }

  function handleApprove(id) {
    setRequests(prev => prev.map(r =>
      r.id !== id ? r : {
        ...r,
        status: '承認済み',
        comments: [...r.comments, {
          user: '鈴木 花子',
          text: comments[id] || '内容を確認しました。承認します。',
          date: new Date().toISOString().slice(0, 10),
        }],
      }
    ));
    setComments(prev => ({ ...prev, [id]: '' }));
    showToast('申請を承認しました ✅');
  }

  function handleReturn(id) {
    if (!comments[id]?.trim()) {
      showToast('差戻しコメントを入力してください', 'red');
      return;
    }
    setRequests(prev => prev.map(r =>
      r.id !== id ? r : {
        ...r,
        status: '差戻し',
        comments: [...r.comments, {
          user: '鈴木 花子', text: comments[id],
          date: new Date().toISOString().slice(0, 10),
        }],
      }
    ));
    setComments(prev => ({ ...prev, [id]: '' }));
    showToast('申請を差し戻しました');
  }

  function handleReject(id) {
    if (!comments[id]?.trim()) {
      showToast('却下コメントを入力してください', 'red');
      return;
    }
    setRequests(prev => prev.map(r =>
      r.id !== id ? r : {
        ...r,
        status: '却下',
        comments: [...r.comments, {
          user: '鈴木 花子', text: comments[id],
          date: new Date().toISOString().slice(0, 10),
        }],
      }
    ));
    setComments(prev => ({ ...prev, [id]: '' }));
    showToast('申請を却下しました', 'red');
  }

  if (pending.length === 0) {
    return (
      <div className="card">
        <div className="empty">
          <div className="empty-icon">✅</div>
          <div className="empty-text">承認待ちの申請はありません</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="alert yellow" style={{ marginBottom: 16 }}>
        <span>⚠️</span>
        {pending.length}件の申請が承認待ちです
      </div>

      {pending.map(r => (
        <div className="card" key={r.id} style={{ marginBottom: 16 }}>
          {/* ヘッダー */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <TypeBadge type={r.type} />
                <PriorityBadge priority={r.priority} />
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'monospace' }}>{r.id}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                {r.applicant} · {r.dept} · {r.date}
              </div>
            </div>
            {r.amount > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>申請金額</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace' }}>
                  ¥{fmt(r.amount)}
                </div>
              </div>
            )}
          </div>

          {/* 説明 */}
          {r.description && (
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.6, background: 'var(--surface2)', padding: '10px 14px', borderRadius: 8 }}>
              {r.description}
            </p>
          )}

          {/* 承認フロー */}
          <div className="flow">
            <FlowStep label={r.applicant} sublabel="申請者" state="done" />
            <FlowStep label="鈴木 花子"  sublabel="第1承認者" state="active" />
            <FlowStep label="佐藤 一郎"  sublabel="第2承認者" state="wait" />
            <FlowStep label="完了"        sublabel="承認済み"   state="wait" />
          </div>

          {/* コメント入力 */}
          <div className="form-group">
            <label className="form-label">
              承認コメント
              <span style={{ color: 'var(--text3)', fontWeight: 400 }}>（差戻し・却下時は必須）</span>
            </label>
            <textarea
              className="form-control"
              rows={2}
              style={{ resize: 'none' }}
              placeholder="コメントを入力..."
              value={comments[r.id] || ''}
              onChange={e => setComment(r.id, e.target.value)}
            />
          </div>

          {/* アクションボタン */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-green"     onClick={() => handleApprove(r.id)}>✓ 承認</button>
            <button className="btn btn-secondary" onClick={() => handleReturn(r.id)}>↩ 差戻し</button>
            <button className="btn btn-danger"    onClick={() => handleReject(r.id)}>✕ 却下</button>
            <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}
              onClick={() => setModal({ type: 'detail', data: r })}>
              詳細表示
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
