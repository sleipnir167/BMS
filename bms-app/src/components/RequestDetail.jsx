import React, { useState } from 'react';
import { StatusBadge, TypeBadge, PriorityBadge, FlowStep, fmt } from '../utils/helpers.jsx';

// ============================================================
// 申請詳細モーダル
// ============================================================

export default function RequestDetail({ data, onClose, setRequests, showToast }) {
  const [comment, setComment] = useState('');

  function resolveFlowState(status, step) {
    if (status === '承認済み') return 'done';
    if (step === 'current' && status === '申請中') return 'active';
    return 'wait';
  }

  function handleAddComment() {
    if (!comment.trim()) return;
    setRequests(prev => prev.map(r =>
      r.id !== data.id ? r : {
        ...r,
        comments: [...r.comments, {
          user: '田中 太郎',
          text: comment.trim(),
          date: new Date().toISOString().slice(0, 10),
        }],
      }
    ));
    setComment('');
    showToast('コメントを追加しました');
  }

  // 最新データを取得するためdataをそのまま使う
  const approverStep = resolveFlowState(data.status, 'current');
  const completeStep = data.status === '承認済み' ? 'done' : 'wait';

  return (
    <>
      {/* ヘッダー */}
      <div className="modal-header">
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <TypeBadge type={data.type} />
            <StatusBadge status={data.status} />
            <PriorityBadge priority={data.priority} />
          </div>
          <div className="modal-title">{data.title}</div>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* 基本情報 */}
      <div className="detail-row">
        <div className="detail-field">
          <div className="detail-label">申請番号</div>
          <div className="detail-value" style={{ fontFamily: 'monospace', fontSize: 13 }}>{data.id}</div>
        </div>
        <div className="detail-field">
          <div className="detail-label">申請者</div>
          <div className="detail-value">{data.applicant}</div>
        </div>
        <div className="detail-field">
          <div className="detail-label">部門</div>
          <div className="detail-value">{data.dept}</div>
        </div>
        <div className="detail-field">
          <div className="detail-label">申請日</div>
          <div className="detail-value">{data.date}</div>
        </div>
      </div>

      {/* 金額 */}
      {data.amount > 0 && (
        <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>申請金額</span>
          <span style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace' }}>¥{fmt(data.amount)}</span>
        </div>
      )}

      {/* 申請内容 */}
      {data.description && (
        <div style={{ marginBottom: 20 }}>
          <div className="detail-label" style={{ marginBottom: 6 }}>申請内容</div>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, background: 'var(--surface2)', padding: '12px 14px', borderRadius: 8 }}>
            {data.description}
          </p>
        </div>
      )}

      {/* 承認フロー */}
      <div className="flow" style={{ marginBottom: 20 }}>
        <FlowStep label={data.applicant} sublabel="申請者"   state="done" />
        <FlowStep label={data.approver}  sublabel="第1承認者" state={approverStep} />
        <FlowStep label="完了"           sublabel="承認済み"  state={completeStep} />
      </div>

      {/* コメント履歴 */}
      {data.comments.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="detail-label" style={{ marginBottom: 10 }}>
            コメント（{data.comments.length}件）
          </div>
          {data.comments.map((c, i) => (
            <div key={i} className="comment-item">
              <div className="comment-avatar">{c.user[0]}</div>
              <div>
                <div className="comment-meta">{c.user} · {c.date}</div>
                <div className="comment-text">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* コメント入力 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="form-control"
          placeholder="コメントを追加... (Enterで送信)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddComment()}
        />
        <button className="btn btn-primary" onClick={handleAddComment}>送信</button>
      </div>
    </>
  );
}
