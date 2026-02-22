import React, { useState } from 'react';
import { globalStyles } from './styles.js';
import { useToast } from './hooks/useToast.js';

// コンポーネント
import Sidebar         from './components/Sidebar.jsx';
import Topbar          from './components/Topbar.jsx';
import Dashboard       from './components/Dashboard.jsx';
import RequestList     from './components/RequestList.jsx';
import NewRequest      from './components/NewRequest.jsx';
import Approvals       from './components/Approvals.jsx';
import UserManagement  from './components/UserManagement.jsx';
import Masters         from './components/Masters.jsx';
import Reports         from './components/Reports.jsx';
import RequestDetail   from './components/RequestDetail.jsx';

// データ
import {
  USERS, DEPTS, INITIAL_REQUESTS, ACCOUNTS, INITIAL_NOTIFICATIONS,
} from './data/mockData.js';

// ============================================================
// アプリケーションルート
// ============================================================

export default function App() {
  // ── 状態管理 ──────────────────────────────────────────────
  const [page,        setPage]        = useState('dashboard');
  const [currentUser]                 = useState(USERS[0]);
  const [requests,    setRequests]    = useState(INITIAL_REQUESTS);
  const [users,       setUsers]       = useState(USERS);
  const [depts,       setDepts]       = useState(DEPTS);
  const [accounts,    setAccounts]    = useState(ACCOUNTS);
  const [notifs,      setNotifs]      = useState(INITIAL_NOTIFICATIONS);
  const [showNotif,   setShowNotif]   = useState(false);
  const [search,      setSearch]      = useState('');
  const [modal,       setModal]       = useState(null); // { type: 'detail', data: {...} }

  const { toast, showToast } = useToast();

  const pendingCount = requests.filter(r => r.status === '申請中').length;

  function navigate(p) {
    setPage(p);
    setShowNotif(false);
    setSearch('');
  }

  // モーダル内のデータを常に最新にする
  const modalData = modal?.type === 'detail'
    ? { ...modal, data: requests.find(r => r.id === modal.data.id) ?? modal.data }
    : modal;

  // ── レンダリング ─────────────────────────────────────────
  return (
    <>
      <style>{globalStyles}</style>

      <div className="app" onClick={() => showNotif && setShowNotif(false)}>
        {/* サイドバー */}
        <Sidebar
          page={page}
          navigate={navigate}
          currentUser={currentUser}
          pendingCount={pendingCount}
        />

        {/* メインエリア */}
        <div className="main">
          {/* トップバー */}
          <Topbar
            page={page}
            search={search}
            setSearch={setSearch}
            notifs={notifs}
            showNotif={showNotif}
            setShowNotif={setShowNotif}
            setNotifs={setNotifs}
          />

          {/* ページコンテンツ */}
          <div className="content" onClick={() => setShowNotif(false)}>
            {page === 'dashboard'   && <Dashboard    requests={requests} navigate={navigate} setModal={setModal} />}
            {page === 'requests'    && <RequestList  requests={requests} setRequests={setRequests} setModal={setModal} showToast={showToast} search={search} />}
            {page === 'new_request' && <NewRequest   setRequests={setRequests} showToast={showToast} navigate={navigate} />}
            {page === 'approvals'   && <Approvals    requests={requests} setRequests={setRequests} showToast={showToast} setModal={setModal} />}
            {page === 'users'       && <UserManagement users={users} setUsers={setUsers} showToast={showToast} />}
            {page === 'masters'     && <Masters      depts={depts} setDepts={setDepts} accounts={accounts} setAccounts={setAccounts} showToast={showToast} />}
            {page === 'reports'     && <Reports      requests={requests} />}
          </div>
        </div>
      </div>

      {/* 申請詳細モーダル */}
      {modalData?.type === 'detail' && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <RequestDetail
              data={modalData.data}
              onClose={() => setModal(null)}
              setRequests={setRequests}
              showToast={showToast}
            />
          </div>
        </div>
      )}

      {/* トースト通知 */}
      {toast && (
        <div className="toast">
          <span>{toast.type === 'green' ? '✅' : toast.type === 'red' ? '❌' : 'ℹ️'}</span>
          {toast.msg}
        </div>
      )}
    </>
  );
}
