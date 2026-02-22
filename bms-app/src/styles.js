// ============================================================
// グローバルスタイル定義
// ============================================================

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #0D1117;
    --surface:    #161B22;
    --surface2:   #1C2333;
    --surface3:   #21262D;
    --border:     #30363D;
    --border2:    #3D444D;
    --text:       #E6EDF3;
    --text2:      #8B949E;
    --text3:      #656D76;
    --accent:     #2F81F7;
    --accent2:    #388BFD;
    --accent-bg:  rgba(47,129,247,0.1);
    --green:      #3FB950;
    --green-bg:   rgba(63,185,80,0.1);
    --red:        #F85149;
    --red-bg:     rgba(248,81,73,0.1);
    --yellow:     #D29922;
    --yellow-bg:  rgba(210,153,34,0.1);
    --purple:     #A371F7;
    --purple-bg:  rgba(163,113,247,0.1);
    --sidebar-w:  240px;
  }

  body { font-family: 'Noto Sans JP', sans-serif; background: var(--bg); color: var(--text); }

  /* ===== LAYOUT ===== */
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* ===== SIDEBAR ===== */
  .sidebar {
    width: var(--sidebar-w); background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto;
  }
  .sidebar-logo {
    padding: 20px 16px; border-bottom: 1px solid var(--border);
    font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 700;
    color: var(--accent); display: flex; align-items: center; gap: 10px; letter-spacing: 0.5px;
  }
  .logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #2F81F7, #A371F7);
    border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px;
  }
  .sidebar-section { padding: 12px 0; }
  .sidebar-label {
    font-size: 10px; font-weight: 600; color: var(--text3);
    text-transform: uppercase; letter-spacing: 1px; padding: 4px 16px 8px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 8px 16px;
    cursor: pointer; font-size: 13px; color: var(--text2);
    transition: all 0.15s; position: relative;
    border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent-bg); color: var(--accent); font-weight: 600; }
  .nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--accent); border-radius: 0 2px 2px 0;
  }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }
  .nav-badge {
    margin-left: auto; background: var(--red); color: white;
    font-size: 10px; font-weight: 700; padding: 1px 6px;
    border-radius: 10px; min-width: 18px; text-align: center;
  }
  .sidebar-footer { margin-top: auto; padding: 16px; border-top: 1px solid var(--border); }
  .user-card {
    display: flex; align-items: center; gap: 10px; padding: 8px;
    border-radius: 8px; background: var(--surface2); cursor: pointer;
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #2F81F7, #A371F7);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
  }
  .user-info { flex: 1; min-width: 0; }
  .user-name  { font-size: 12px; font-weight: 600; color: var(--text); }
  .user-role  { font-size: 10px; color: var(--text3); }

  /* ===== MAIN ===== */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* ===== TOPBAR ===== */
  .topbar {
    height: 56px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0;
  }
  .topbar-title { font-size: 16px; font-weight: 600; flex: 1; }
  .topbar-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 6px 12px; width: 240px;
  }
  .topbar-search input {
    background: none; border: none; outline: none;
    font-size: 13px; color: var(--text); width: 100%; font-family: inherit;
  }
  .topbar-search input::placeholder { color: var(--text3); }
  .icon-btn {
    width: 36px; height: 36px; border: 1px solid var(--border); border-radius: 8px;
    background: var(--surface2); display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; color: var(--text2); position: relative; transition: all 0.15s;
  }
  .icon-btn:hover { border-color: var(--accent); color: var(--accent); }
  .notif-dot {
    position: absolute; top: 6px; right: 6px; width: 7px; height: 7px;
    background: var(--red); border-radius: 50%; border: 2px solid var(--surface);
  }

  /* ===== CONTENT ===== */
  .content { flex: 1; overflow-y: auto; padding: 24px; }

  /* ===== CARD ===== */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .card-title { font-size: 14px; font-weight: 600; color: var(--text2); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

  /* ===== KPI ===== */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 20px; position: relative; overflow: hidden; transition: border-color 0.2s;
  }
  .kpi-card:hover { border-color: var(--border2); }
  .kpi-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
  .kpi-card.blue::after   { background: linear-gradient(90deg, #2F81F7, #388BFD); }
  .kpi-card.green::after  { background: linear-gradient(90deg, #3FB950, #56d364); }
  .kpi-card.yellow::after { background: linear-gradient(90deg, #D29922, #E3B341); }
  .kpi-card.purple::after { background: linear-gradient(90deg, #A371F7, #bc8cff); }
  .kpi-label { font-size: 11px; color: var(--text3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi-value { font-size: 32px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; margin: 8px 0 4px; color: var(--text); }
  .kpi-delta { font-size: 12px; color: var(--green); display: flex; align-items: center; gap: 4px; }
  .kpi-delta.neg { color: var(--red); }
  .kpi-icon { position: absolute; right: 20px; top: 20px; font-size: 28px; opacity: 0.15; }

  /* ===== CHARTS ===== */
  .chart-grid   { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }

  /* ===== TABLE ===== */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 600;
    color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  td { padding: 12px 14px; border-bottom: 1px solid var(--border); color: var(--text); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface2); }

  /* ===== BADGE ===== */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap;
  }
  .badge.green  { background: var(--green-bg);  color: var(--green);  }
  .badge.red    { background: var(--red-bg);    color: var(--red);    }
  .badge.yellow { background: var(--yellow-bg); color: var(--yellow); }
  .badge.blue   { background: var(--accent-bg); color: var(--accent); }
  .badge.purple { background: var(--purple-bg); color: var(--purple); }
  .badge.gray   { background: var(--surface3);  color: var(--text2);  }
  .badge::before { content: '●'; font-size: 8px; }

  /* ===== BUTTON ===== */
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
    border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; font-family: inherit; transition: all 0.15s; white-space: nowrap;
  }
  .btn-primary   { background: var(--accent);   color: white; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--border2); background: var(--surface3); }
  .btn-danger    { background: var(--red-bg);   color: var(--red);   border: 1px solid rgba(248,81,73,0.2); }
  .btn-danger:hover  { background: rgba(248,81,73,0.2); }
  .btn-green     { background: var(--green-bg); color: var(--green); border: 1px solid rgba(63,185,80,0.2); }
  .btn-green:hover   { background: rgba(63,185,80,0.2); }
  .btn-sm { padding: 5px 10px; font-size: 11px; }

  /* ===== FORM ===== */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
  .form-control {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 9px 12px; font-size: 13px; color: var(--text);
    font-family: inherit; outline: none; transition: border-color 0.15s;
  }
  .form-control:focus { border-color: var(--accent); }
  .form-control::placeholder { color: var(--text3); }
  select.form-control option { background: var(--surface2); }
  .form-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* ===== MODAL ===== */
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    width: 640px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 28px;
  }
  .modal-header {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;
  }
  .modal-title { font-size: 18px; font-weight: 700; }
  .close-btn {
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
    background: none; color: var(--text2); cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .close-btn:hover { background: var(--surface2); color: var(--text); }

  /* ===== NOTIFICATION PANEL ===== */
  .notif-panel {
    position: absolute; top: 100%; right: 0; width: 340px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 50; overflow: hidden; margin-top: 8px;
  }
  .notif-header {
    padding: 14px 16px; border-bottom: 1px solid var(--border);
    font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: space-between;
  }
  .notif-item {
    padding: 12px 16px; border-bottom: 1px solid var(--border);
    display: flex; gap: 12px; cursor: pointer; transition: background 0.15s;
  }
  .notif-item:hover { background: var(--surface2); }
  .notif-item.unread { background: rgba(47,129,247,0.04); }
  .notif-dot2 { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex-shrink: 0; margin-top: 5px; }
  .notif-text { font-size: 12px; color: var(--text); line-height: 1.5; }
  .notif-time { font-size: 11px; color: var(--text3); margin-top: 3px; }

  /* ===== TABS ===== */
  .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
  .tab {
    padding: 10px 18px; font-size: 13px; font-weight: 500; color: var(--text3);
    cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s;
    background: none; border-top: none; border-left: none; border-right: none; font-family: inherit;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

  /* ===== FILTER BAR ===== */
  .filter-bar { display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
  .filter-bar select, .filter-bar input {
    background: var(--surface2); border: 1px solid var(--border); border-radius: 8px;
    padding: 7px 12px; font-size: 12px; color: var(--text); font-family: inherit; outline: none; cursor: pointer;
  }
  .filter-bar select:focus, .filter-bar input:focus { border-color: var(--accent); }

  /* ===== DETAIL ===== */
  .detail-row   { display: flex; gap: 24px; margin-bottom: 16px; }
  .detail-field { flex: 1; }
  .detail-label { font-size: 11px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .detail-value { font-size: 14px; color: var(--text); }

  /* ===== WORKFLOW FLOW ===== */
  .flow { display: flex; gap: 0; margin: 20px 0; }
  .flow-step { flex: 1; text-align: center; position: relative; padding: 12px 8px; }
  .flow-step::after { content: '→'; position: absolute; right: -8px; top: 50%; transform: translateY(-50%); color: var(--text3); font-size: 18px; }
  .flow-step:last-child::after { display: none; }
  .flow-circle { width: 36px; height: 36px; border-radius: 50%; margin: 0 auto 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
  .flow-circle.done   { background: var(--green-bg);  color: var(--green);  border: 2px solid var(--green);  }
  .flow-circle.active { background: var(--accent-bg); color: var(--accent); border: 2px solid var(--accent); }
  .flow-circle.wait   { background: var(--surface2);  color: var(--text3);  border: 2px solid var(--border); }
  .flow-name { font-size: 11px; color: var(--text2); }
  .flow-role { font-size: 10px; color: var(--text3); }

  /* ===== COMMENT ===== */
  .comment-item { display: flex; gap: 10px; padding: 12px; background: var(--surface2); border-radius: 8px; margin-bottom: 8px; }
  .comment-avatar { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-bg); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
  .comment-text { font-size: 12px; color: var(--text); line-height: 1.5; }
  .comment-meta { font-size: 11px; color: var(--text3); margin-bottom: 4px; }

  /* ===== ALERT ===== */
  .alert { padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; display: flex; gap: 10px; align-items: flex-start; }
  .alert.yellow { background: var(--yellow-bg); color: var(--yellow); border: 1px solid rgba(210,153,34,0.2); }
  .alert.blue   { background: var(--accent-bg); color: var(--accent); border: 1px solid rgba(47,129,247,0.2); }
  .alert.red    { background: var(--red-bg);    color: var(--red);    border: 1px solid rgba(248,81,73,0.2);  }

  /* ===== PROGRESS ===== */
  .progress-bar  { height: 6px; background: var(--surface3); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }

  /* ===== EMPTY STATE ===== */
  .empty      { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.4; }
  .empty-text { font-size: 14px; }

  /* ===== SECTION HEADER ===== */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title  { font-size: 15px; font-weight: 700; }

  /* ===== ACTIVITY ===== */
  .activity-item { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .activity-item:last-child { border-bottom: none; }
  .activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }

  /* ===== TAG ===== */
  .tag { display: inline-flex; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: var(--surface3); color: var(--text2); }

  /* ===== TOGGLE ===== */
  .toggle-track { width: 32px; height: 18px; border-radius: 9px; position: relative; transition: background 0.2s; cursor: pointer; }
  .toggle-thumb { position: absolute; top: 2px; width: 14px; height: 14px; border-radius: 50%; background: white; transition: left 0.2s; }

  /* ===== TOAST ===== */
  .toast {
    position: fixed; bottom: 24px; right: 24px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 10px; padding: 12px 18px;
    font-size: 13px; display: flex; gap: 10px; align-items: center;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 200; animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* ===== SCROLLBAR ===== */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
`;
