import React, { useState } from 'react';
import { DEPTS, ACCOUNTS } from '../data/mockData.js';
import { generateRequestId } from '../utils/helpers.jsx';

// ============================================================
// 新規申請作成画面
// ============================================================

const TABS = ['基本情報', '詳細情報', '添付ファイル'];

const DEFAULT_FORM = {
  type: '経費精算', title: '', dept: '営業部', amount: '',
  priority: '通常', description: '', route: '通常承認ルート',
  accountCode: '6100', expenseDate: '', taxType: '課税（10%）',
};

export default function NewRequest({ setRequests, showToast, navigate }) {
  const [tab,  setTab]  = useState('基本情報');
  const [form, setForm] = useState(DEFAULT_FORM);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  function handleSubmit(isDraft) {
    if (!form.title.trim()) {
      showToast('タイトルを入力してください', 'red');
      return;
    }
    const newReq = {
      id:          generateRequestId(),
      type:        form.type,
      title:       form.title,
      dept:        form.dept,
      amount:      Number(form.amount) || 0,
      priority:    form.priority,
      description: form.description,
      applicant:   '田中 太郎',
      status:      isDraft ? '下書き' : '申請中',
      date:        new Date().toISOString().slice(0, 10),
      approver:    '鈴木 花子',
      comments:    [],
    };
    setRequests(prev => [newReq, ...prev]);
    showToast(isDraft ? '下書きを保存しました' : '申請を提出しました！');
    navigate('requests');
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {/* タブ */}
      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* 基本情報タブ */}
      {tab === '基本情報' && (
        <div className="card">
          <div className="form-group">
            <label className="form-label">申請種別 *</label>
            <select className="form-control" value={form.type} onChange={e => set('type', e.target.value)}>
              {['経費精算', '稟議', '各種届出'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">タイトル *</label>
            <input className="form-control" placeholder="申請タイトルを入力してください"
              value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">申請部門</label>
              <select className="form-control" value={form.dept} onChange={e => set('dept', e.target.value)}>
                {DEPTS.map(d => <option key={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">優先度</label>
              <select className="form-control" value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option>通常</option>
                <option>緊急</option>
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">金額（円）{form.type !== '各種届出' && '*'}</label>
              <input className="form-control" type="number" min="0" placeholder="0"
                value={form.amount} onChange={e => set('amount', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">承認ルート</label>
              <select className="form-control" value={form.route} onChange={e => set('route', e.target.value)}>
                <option>通常承認ルート</option>
                <option>緊急承認ルート</option>
                <option>高額承認ルート（100万円以上）</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 詳細情報タブ */}
      {tab === '詳細情報' && (
        <div className="card">
          <div className="form-group">
            <label className="form-label">申請内容・説明</label>
            <textarea className="form-control" rows={6} style={{ resize: 'vertical' }}
              placeholder="申請の詳細、目的、必要性などを記入してください（最大2000文字）"
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          {form.type === '経費精算' && (
            <>
              <div className="form-group">
                <label className="form-label">勘定科目</label>
                <select className="form-control" value={form.accountCode} onChange={e => set('accountCode', e.target.value)}>
                  {ACCOUNTS.filter(a => a.active).map(a => (
                    <option key={a.id} value={a.code}>{a.code} - {a.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">発生日</label>
                  <input className="form-control" type="date"
                    value={form.expenseDate || new Date().toISOString().slice(0, 10)}
                    onChange={e => set('expenseDate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">消費税区分</label>
                  <select className="form-control" value={form.taxType} onChange={e => set('taxType', e.target.value)}>
                    <option>課税（10%）</option>
                    <option>軽減税率（8%）</option>
                    <option>非課税</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 添付ファイルタブ */}
      {tab === '添付ファイル' && (
        <div className="card">
          <div
            style={{
              border: '2px dashed var(--border2)', borderRadius: 12, padding: 40,
              textAlign: 'center', color: 'var(--text3)', cursor: 'pointer',
            }}
            onDragOver={e => e.preventDefault()}
            onClick={() => alert('※ モック画面のためアップロード機能は未実装です')}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>📎</div>
            <div style={{ fontSize: 14, marginBottom: 8 }}>
              ファイルをドロップ、またはクリックしてアップロード
            </div>
            <div style={{ fontSize: 11 }}>PDF / Excel / Word / 画像（最大50MB / ファイル）</div>
          </div>
          <div className="alert blue" style={{ marginTop: 16 }}>
            <span>ℹ️</span>
            領収書・見積書などの証憑書類を添付してください。経費精算の場合は領収書の添付が必須です。
          </div>
        </div>
      )}

      {/* アクションボタン */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button className="btn btn-primary" onClick={() => handleSubmit(false)}>📤 申請提出</button>
        <button className="btn btn-secondary" onClick={() => handleSubmit(true)}>💾 下書き保存</button>
        <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => navigate('requests')}>
          キャンセル
        </button>
      </div>
    </div>
  );
}
