import React, { useState } from 'react';
import { Toggle, EmptyState } from '../utils/helpers.jsx';

// ============================================================
// マスタ管理画面（部門・勘定科目 CRUD）
// ============================================================

const ACCOUNT_CATEGORIES = ['旅費交通費', '交際費', '消耗品', '教育費', '通信費', 'その他'];

export default function Masters({ depts, setDepts, accounts, setAccounts, showToast }) {
  const [activeTab, setActiveTab] = useState('部門');
  const [showModal, setShowModal] = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [form,      setForm]      = useState({});

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  function openNew() {
    setForm(activeTab === '部門'
      ? { code: '', name: '', head: '', budget: '' }
      : { code: '', name: '', category: '旅費交通費', active: true });
    setEditItem(null);
    setShowModal(true);
  }

  function openEdit(item) {
    setForm({ ...item });
    setEditItem(item);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name?.trim()) { showToast('名前を入力してください', 'red'); return; }
    if (activeTab === '部門') {
      if (editItem) {
        setDepts(prev => prev.map(d => d.id === editItem.id ? { ...d, ...form, budget: Number(form.budget) || 0 } : d));
      } else {
        setDepts(prev => [...prev, { ...form, budget: Number(form.budget) || 0, id: Date.now() }]);
      }
    } else {
      if (editItem) {
        setAccounts(prev => prev.map(a => a.id === editItem.id ? { ...a, ...form } : a));
      } else {
        setAccounts(prev => [...prev, { ...form, id: Date.now() }]);
      }
    }
    showToast('保存しました');
    setShowModal(false);
  }

  function handleDelete(id) {
    if (!window.confirm('削除しますか？')) return;
    if (activeTab === '部門') {
      setDepts(prev => prev.filter(d => d.id !== id));
    } else {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
    showToast('削除しました');
  }

  function toggleActive(id) {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    showToast('更新しました');
  }

  const fmt = n => Number(n).toLocaleString('ja-JP');

  return (
    <div>
      {/* タブ */}
      <div className="tabs">
        {['部門', '勘定科目'].map(t => (
          <button key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      <div className="section-header" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: 'var(--text2)' }}>
          {activeTab === '部門' ? `${depts.length}件` : `${accounts.length}件`}
        </span>
        <button className="btn btn-primary" onClick={openNew}>＋ 追加</button>
      </div>

      <div className="card">
        {/* 部門テーブル */}
        {activeTab === '部門' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>コード</th><th>部門名</th><th>部門長</th><th>予算</th><th>操作</th></tr></thead>
              <tbody>
                {depts.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState /></td></tr>
                ) : depts.map(d => (
                  <tr key={d.id}>
                    <td><span className="tag">{d.code}</span></td>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{d.head}</td>
                    <td style={{ fontFamily: 'monospace' }}>¥{fmt(d.budget)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>編集</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 勘定科目テーブル */}
        {activeTab === '勘定科目' && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>科目コード</th><th>科目名</th><th>カテゴリ</th><th>状態</th><th>操作</th></tr></thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState /></td></tr>
                ) : accounts.map(a => (
                  <tr key={a.id}>
                    <td><span className="tag">{a.code}</span></td>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td style={{ fontSize: 12, color: 'var(--text2)' }}>{a.category}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Toggle active={a.active} onChange={() => toggleActive(a.id)} />
                        <span style={{ fontSize: 12, color: a.active ? 'var(--green)' : 'var(--text3)' }}>
                          {a.active ? '有効' : '無効'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>編集</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 追加・編集モーダル */}
      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editItem ? '編集' : '新規追加'} ─ {activeTab}</div>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {activeTab === '部門' ? (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">コード</label>
                    <input className="form-control" placeholder="例: SALES"
                      value={form.code || ''} onChange={e => set('code', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">部門名 *</label>
                    <input className="form-control" placeholder="例: 営業部"
                      value={form.name || ''} onChange={e => set('name', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">部門長</label>
                  <input className="form-control" placeholder="例: 田中 太郎"
                    value={form.head || ''} onChange={e => set('head', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">予算（円）</label>
                  <input className="form-control" type="number" min="0"
                    value={form.budget || ''} onChange={e => set('budget', e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">科目コード</label>
                    <input className="form-control" placeholder="例: 6100"
                      value={form.code || ''} onChange={e => set('code', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">科目名 *</label>
                    <input className="form-control" placeholder="例: 交通費"
                      value={form.name || ''} onChange={e => set('name', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">カテゴリ</label>
                  <select className="form-control" value={form.category || '旅費交通費'}
                    onChange={e => set('category', e.target.value)}>
                    {ACCOUNT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>キャンセル</button>
              <button className="btn btn-primary" onClick={handleSave}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
