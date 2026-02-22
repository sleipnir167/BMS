import React, { useState } from 'react';
import { Avatar, EmptyState } from '../utils/helpers.jsx';
import { DEPTS } from '../data/mockData.js';

// ============================================================
// ユーザー管理画面（CRUD）
// ============================================================

const ROLES = ['システム管理者', '部門管理者', '承認者', '一般ユーザー', '閲覧者'];

const ROLE_COLOR = {
  'システム管理者': 'red', '部門管理者': 'purple',
  '承認者': 'blue', '一般ユーザー': 'green', '閲覧者': 'gray',
};

const EMPTY_FORM = { name: '', dept: '営業部', role: '一般ユーザー', email: '', avatar: '' };

export default function UserManagement({ users, setUsers, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editUser,  setEditUser]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  function openNew() {
    setForm(EMPTY_FORM);
    setEditUser(null);
    setShowModal(true);
  }

  function openEdit(u) {
    setForm(u);
    setEditUser(u);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name.trim())  { showToast('氏名を入力してください', 'red'); return; }
    if (!form.email.trim()) { showToast('メールアドレスを入力してください', 'red'); return; }

    const avatar = form.name.trim()[0] ?? '?';
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form, avatar } : u));
      showToast('ユーザーを更新しました');
    } else {
      setUsers(prev => [...prev, { ...form, avatar, id: Date.now() }]);
      showToast('ユーザーを追加しました');
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    if (!window.confirm('このユーザーを削除しますか？')) return;
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('ユーザーを削除しました');
  }

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: 'var(--text2)' }}>{users.length}名</span>
        <button className="btn btn-primary" onClick={openNew}>＋ ユーザー追加</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ユーザー</th><th>部門</th><th>ロール</th><th>メールアドレス</th><th>操作</th></tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5}><EmptyState /></td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={u.name} size={32} />
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.dept}</td>
                  <td><span className={`badge ${ROLE_COLOR[u.role] || 'gray'}`}>{u.role}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{u.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>編集</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>削除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 追加・編集モーダル */}
      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editUser ? 'ユーザー編集' : 'ユーザー追加'}</div>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">氏名 *</label>
              <input className="form-control" placeholder="例：田中 太郎"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">部門</label>
                <select className="form-control" value={form.dept} onChange={e => set('dept', e.target.value)}>
                  {DEPTS.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">ロール</label>
                <select className="form-control" value={form.role} onChange={e => set('role', e.target.value)}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">メールアドレス *</label>
              <input className="form-control" type="email" placeholder="example@company.com"
                value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>キャンセル</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editUser ? '更新' : '追加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
