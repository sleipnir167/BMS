import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ===== MOCK DATA =====
const USERS = [
  { id: 1, name: "田中 太郎", dept: "営業部", role: "一般ユーザー", email: "tanaka@example.com", avatar: "田" },
  { id: 2, name: "鈴木 花子", dept: "経理部", role: "承認者", email: "suzuki@example.com", avatar: "鈴" },
  { id: 3, name: "佐藤 一郎", dept: "総務部", role: "部門管理者", email: "sato@example.com", avatar: "佐" },
  { id: 4, name: "山田 美咲", dept: "人事部", role: "一般ユーザー", email: "yamada@example.com", avatar: "山" },
  { id: 5, name: "伊藤 健二", dept: "IT部", role: "システム管理者", email: "ito@example.com", avatar: "伊" },
  { id: 6, name: "渡辺 さくら", dept: "マーケティング部", role: "一般ユーザー", email: "watanabe@example.com", avatar: "渡" },
];

const DEPTS = [
  { id: 1, code: "SALES", name: "営業部", head: "鈴木 花子", budget: 5000000 },
  { id: 2, code: "ACC", name: "経理部", head: "佐藤 一郎", budget: 2000000 },
  { id: 3, code: "GEN", name: "総務部", head: "山田 美咲", budget: 3000000 },
  { id: 4, code: "HR", name: "人事部", head: "伊藤 健二", budget: 2500000 },
  { id: 5, code: "IT", name: "IT部", head: "田中 太郎", budget: 8000000 },
  { id: 6, code: "MKT", name: "マーケティング部", head: "渡辺 さくら", budget: 4000000 },
];

const INITIAL_REQUESTS = [
  { id: "REQ-2025-001", type: "経費精算", title: "3月営業出張費精算", applicant: "田中 太郎", dept: "営業部", amount: 52400, status: "承認済み", date: "2025-03-01", approver: "鈴木 花子", priority: "通常", description: "大阪出張に伴う交通費・宿泊費の精算申請です。", comments: [{user:"鈴木 花子", text:"確認しました。承認します。", date:"2025-03-03"}] },
  { id: "REQ-2025-002", type: "稟議", title: "クラウドサービス導入稟議", applicant: "伊藤 健二", dept: "IT部", amount: 1200000, status: "申請中", date: "2025-03-05", approver: "山田 美咲", priority: "緊急", description: "業務効率化のためSaaSツール導入を申請します。", comments: [] },
  { id: "REQ-2025-003", type: "経費精算", title: "接待費精算（取引先A社）", applicant: "渡辺 さくら", dept: "マーケティング部", amount: 38000, status: "差戻し", date: "2025-03-08", approver: "佐藤 一郎", priority: "通常", description: "取引先A社との会食費の精算申請です。", comments: [{user:"佐藤 一郎", text:"領収書の詳細が不足しています。再提出をお願いします。", date:"2025-03-10"}] },
  { id: "REQ-2025-004", type: "各種届出", title: "テレワーク申請（4月分）", applicant: "山田 美咲", dept: "人事部", amount: 0, status: "承認済み", date: "2025-03-10", approver: "伊藤 健二", priority: "通常", description: "4月のテレワーク実施申請です。", comments: [] },
  { id: "REQ-2025-005", type: "稟議", title: "オフィス什器購入稟議", applicant: "佐藤 一郎", dept: "総務部", amount: 450000, status: "申請中", date: "2025-03-12", approver: "鈴木 花子", priority: "通常", description: "老朽化したオフィス家具の買い替え稟議です。", comments: [] },
  { id: "REQ-2025-006", type: "経費精算", title: "研修費精算", applicant: "鈴木 花子", dept: "経理部", amount: 28500, status: "下書き", date: "2025-03-14", approver: "─", priority: "通常", description: "外部研修参加費の精算申請です。", comments: [] },
  { id: "REQ-2025-007", type: "各種届出", title: "有給休暇申請（3/28）", applicant: "田中 太郎", dept: "営業部", amount: 0, status: "却下", date: "2025-03-15", approver: "鈴木 花子", priority: "通常", description: "有給休暇取得申請です。", comments: [{user:"鈴木 花子", text:"当日は重要商談があるため今回は見送りをお願いします。", date:"2025-03-16"}] },
];

const KPI_DATA = [
  { month: "10月", 申請数: 42, 承認率: 88, 平均日数: 2.1 },
  { month: "11月", 申請数: 55, 承認率: 91, 平均日数: 1.8 },
  { month: "12月", 申請数: 38, 承認率: 85, 平均日数: 2.5 },
  { month: "1月", 申請数: 61, 承認率: 93, 平均日数: 1.6 },
  { month: "2月", 申請数: 48, 承認率: 89, 平均日数: 2.0 },
  { month: "3月", 申請数: 72, 承認率: 94, 平均日数: 1.4 },
];

const PIE_DATA = [
  { name: "経費精算", value: 38, color: "#3B82F6" },
  { name: "稟議", value: 27, color: "#8B5CF6" },
  { name: "各種届出", value: 35, color: "#10B981" },
];

const EXPENSE_DEPT_DATA = [
  { dept: "営業", 経費: 420, 予算: 500 },
  { dept: "IT", 経費: 680, 予算: 800 },
  { dept: "総務", 経費: 180, 予算: 300 },
  { dept: "人事", 経費: 120, 予算: 250 },
  { dept: "MKT", 経費: 310, 予算: 400 },
];

const ACCOUNTS = [
  { id: 1, code: "6100", name: "交通費", category: "旅費交通費", active: true },
  { id: 2, code: "6110", name: "宿泊費", category: "旅費交通費", active: true },
  { id: 3, code: "6200", name: "接待交際費", category: "交際費", active: true },
  { id: 4, code: "6300", name: "消耗品費", category: "消耗品", active: true },
  { id: 5, code: "6400", name: "研修費", category: "教育費", active: true },
  { id: 6, code: "6500", name: "通信費", category: "通信費", active: false },
];

const NOTIFICATIONS = [
  { id: 1, type: "approval", text: "「クラウドサービス導入稟議」の承認が必要です", time: "10分前", read: false },
  { id: 2, type: "returned", text: "「接待費精算」が差し戻されました", time: "2時間前", read: false },
  { id: 3, type: "approved", text: "「テレワーク申請」が承認されました", time: "昨日", read: true },
  { id: 4, type: "alert", text: "承認期限超過: 3件の申請が期限を超過しています", time: "昨日", read: true },
];

// ===== STYLES =====
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg: #0D1117;
    --surface: #161B22;
    --surface2: #1C2333;
    --surface3: #21262D;
    --border: #30363D;
    --border2: #3D444D;
    --text: #E6EDF3;
    --text2: #8B949E;
    --text3: #656D76;
    --accent: #2F81F7;
    --accent2: #388BFD;
    --accent-bg: rgba(47,129,247,0.1);
    --green: #3FB950;
    --green-bg: rgba(63,185,80,0.1);
    --red: #F85149;
    --red-bg: rgba(248,81,73,0.1);
    --yellow: #D29922;
    --yellow-bg: rgba(210,153,34,0.1);
    --purple: #A371F7;
    --purple-bg: rgba(163,113,247,0.1);
    --sidebar-w: 240px;
  }

  body { font-family: 'Noto Sans JP', sans-serif; background: var(--bg); color: var(--text); }
  
  .app { display: flex; height: 100vh; overflow: hidden; }
  
  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow-y: auto;
  }
  .sidebar-logo {
    padding: 20px 16px;
    border-bottom: 1px solid var(--border);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: 0.5px;
  }
  .logo-icon {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #2F81F7, #A371F7);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .sidebar-section { padding: 12px 0; }
  .sidebar-label {
    font-size: 10px; font-weight: 600;
    color: var(--text3);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 16px 8px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text2);
    border-radius: 0;
    transition: all 0.15s;
    position: relative;
    border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active {
    background: var(--accent-bg);
    color: var(--accent);
    font-weight: 600;
  }
  .nav-item.active::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--accent);
    border-radius: 0 2px 2px 0;
  }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }
  .nav-badge {
    margin-left: auto;
    background: var(--red);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
  }
  .sidebar-footer {
    margin-top: auto;
    padding: 16px;
    border-top: 1px solid var(--border);
  }
  .user-card {
    display: flex; align-items: center; gap: 10px;
    padding: 8px;
    border-radius: 8px;
    background: var(--surface2);
    cursor: pointer;
  }
  .user-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2F81F7, #A371F7);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    flex-shrink: 0;
  }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 12px; font-weight: 600; color: var(--text); }
  .user-role { font-size: 10px; color: var(--text3); }
  
  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  
  /* TOPBAR */
  .topbar {
    height: 56px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    padding: 0 24px;
    gap: 16px;
    flex-shrink: 0;
  }
  .topbar-title { font-size: 16px; font-weight: 600; flex: 1; }
  .topbar-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 12px;
    width: 240px;
  }
  .topbar-search input {
    background: none; border: none; outline: none;
    font-size: 13px; color: var(--text);
    width: 100%;
    font-family: inherit;
  }
  .topbar-search input::placeholder { color: var(--text3); }
  .icon-btn {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 16px;
    color: var(--text2);
    position: relative;
    transition: all 0.15s;
  }
  .icon-btn:hover { border-color: var(--accent); color: var(--accent); }
  .notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 7px; height: 7px;
    background: var(--red);
    border-radius: 50%;
    border: 2px solid var(--surface);
  }
  
  /* CONTENT */
  .content { flex: 1; overflow-y: auto; padding: 24px; }
  
  /* CARDS */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
  }
  .card-title {
    font-size: 14px; font-weight: 600;
    color: var(--text2);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  
  /* KPI CARDS */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .kpi-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .kpi-card:hover { border-color: var(--border2); }
  .kpi-card::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px;
  }
  .kpi-card.blue::after { background: linear-gradient(90deg, #2F81F7, #388BFD); }
  .kpi-card.green::after { background: linear-gradient(90deg, #3FB950, #56d364); }
  .kpi-card.yellow::after { background: linear-gradient(90deg, #D29922, #E3B341); }
  .kpi-card.purple::after { background: linear-gradient(90deg, #A371F7, #bc8cff); }
  .kpi-label { font-size: 11px; color: var(--text3); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .kpi-value { font-size: 32px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; margin: 8px 0 4px; color: var(--text); }
  .kpi-delta { font-size: 12px; color: var(--green); display: flex; align-items: center; gap: 4px; }
  .kpi-delta.neg { color: var(--red); }
  .kpi-icon { position: absolute; right: 20px; top: 20px; font-size: 28px; opacity: 0.15; }

  /* CHART GRID */
  .chart-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  
  /* TABLE */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th {
    text-align: left;
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
  }
  td {
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    vertical-align: middle;
  }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--surface2); }
  
  /* BADGE / STATUS */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px; font-weight: 600;
    white-space: nowrap;
  }
  .badge.green { background: var(--green-bg); color: var(--green); }
  .badge.red { background: var(--red-bg); color: var(--red); }
  .badge.yellow { background: var(--yellow-bg); color: var(--yellow); }
  .badge.blue { background: var(--accent-bg); color: var(--accent); }
  .badge.purple { background: var(--purple-bg); color: var(--purple); }
  .badge.gray { background: var(--surface3); color: var(--text2); }
  .badge::before { content: '●'; font-size: 8px; }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px; font-weight: 600;
    cursor: pointer; border: none;
    font-family: inherit;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--border2); background: var(--surface3); }
  .btn-danger { background: var(--red-bg); color: var(--red); border: 1px solid rgba(248,81,73,0.2); }
  .btn-danger:hover { background: rgba(248,81,73,0.2); }
  .btn-green { background: var(--green-bg); color: var(--green); border: 1px solid rgba(63,185,80,0.2); }
  .btn-green:hover { background: rgba(63,185,80,0.2); }
  .btn-sm { padding: 5px 10px; font-size: 11px; }
  
  /* FORM */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
  .form-control {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    color: var(--text);
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
  }
  .form-control:focus { border-color: var(--accent); }
  .form-control::placeholder { color: var(--text3); }
  select.form-control option { background: var(--surface2); }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  
  /* MODAL */
  .overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 640px; max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    padding: 28px;
  }
  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .modal-title { font-size: 18px; font-weight: 700; }
  .close-btn {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: none;
    color: var(--text2);
    cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .close-btn:hover { background: var(--surface2); color: var(--text); }
  
  /* NOTIF PANEL */
  .notif-panel {
    position: absolute;
    top: 100%; right: 0;
    width: 340px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    z-index: 50;
    overflow: hidden;
    margin-top: 8px;
  }
  .notif-header {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
    font-size: 13px; font-weight: 600;
    display: flex; align-items: center; justify-content: space-between;
  }
  .notif-item {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; gap: 12px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .notif-item:hover { background: var(--surface2); }
  .notif-item.unread { background: rgba(47,129,247,0.04); }
  .notif-dot2 {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    flex-shrink: 0;
    margin-top: 5px;
  }
  .notif-text { font-size: 12px; color: var(--text); line-height: 1.5; }
  .notif-time { font-size: 11px; color: var(--text3); margin-top: 3px; }
  
  /* TABS */
  .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
  .tab {
    padding: 10px 18px;
    font-size: 13px; font-weight: 500;
    color: var(--text3);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.15s;
    background: none; border-top: none; border-left: none; border-right: none;
    font-family: inherit;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }
  
  /* FILTERS */
  .filter-bar {
    display: flex; gap: 10px; align-items: center;
    margin-bottom: 16px; flex-wrap: wrap;
  }
  .filter-bar select, .filter-bar input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 12px;
    color: var(--text);
    font-family: inherit;
    outline: none;
    cursor: pointer;
  }
  .filter-bar select:focus, .filter-bar input:focus { border-color: var(--accent); }
  
  /* DETAIL SECTION */
  .detail-row { display: flex; gap: 24px; margin-bottom: 16px; }
  .detail-field { flex: 1; }
  .detail-label { font-size: 11px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .detail-value { font-size: 14px; color: var(--text); }
  
  /* FLOW STEPS */
  .flow { display: flex; gap: 0; margin: 20px 0; }
  .flow-step {
    flex: 1;
    text-align: center;
    position: relative;
    padding: 12px 8px;
  }
  .flow-step::after {
    content: '→';
    position: absolute;
    right: -8px; top: 50%;
    transform: translateY(-50%);
    color: var(--text3);
    font-size: 18px;
  }
  .flow-step:last-child::after { display: none; }
  .flow-circle {
    width: 36px; height: 36px;
    border-radius: 50%;
    margin: 0 auto 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    font-weight: 700;
  }
  .flow-circle.done { background: var(--green-bg); color: var(--green); border: 2px solid var(--green); }
  .flow-circle.active { background: var(--accent-bg); color: var(--accent); border: 2px solid var(--accent); }
  .flow-circle.wait { background: var(--surface2); color: var(--text3); border: 2px solid var(--border); }
  .flow-name { font-size: 11px; color: var(--text2); }
  .flow-role { font-size: 10px; color: var(--text3); }
  
  /* COMMENT */
  .comment-item {
    display: flex; gap: 10px;
    padding: 12px;
    background: var(--surface2);
    border-radius: 8px;
    margin-bottom: 8px;
  }
  .comment-avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: var(--accent-bg);
    color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700;
    flex-shrink: 0;
  }
  .comment-text { font-size: 12px; color: var(--text); line-height: 1.5; }
  .comment-meta { font-size: 11px; color: var(--text3); margin-bottom: 4px; }
  
  /* ALERT */
  .alert {
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
    display: flex; gap: 10px; align-items: flex-start;
  }
  .alert.yellow { background: var(--yellow-bg); color: var(--yellow); border: 1px solid rgba(210,153,34,0.2); }
  .alert.blue { background: var(--accent-bg); color: var(--accent); border: 1px solid rgba(47,129,247,0.2); }
  .alert.red { background: var(--red-bg); color: var(--red); border: 1px solid rgba(248,81,73,0.2); }
  
  /* PROGRESS */
  .progress-bar { height: 6px; background: var(--surface3); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
  
  /* EMPTY */
  .empty { text-align: center; padding: 60px 20px; color: var(--text3); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.4; }
  .empty-text { font-size: 14px; }
  
  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 24px; right: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 13px;
    display: flex; gap: 10px; align-items: center;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    z-index: 200;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  
  .section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .section-title { font-size: 15px; font-weight: 700; }
  
  /* ACTIVITY */
  .activity-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    margin-top: 5px;
    flex-shrink: 0;
  }
  .tag {
    display: inline-flex;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px; font-weight: 600;
    background: var(--surface3);
    color: var(--text2);
  }
`;

// ===== HELPERS =====
function statusBadge(status) {
  const map = {
    "承認済み": "green", "申請中": "blue", "差戻し": "yellow",
    "却下": "red", "下書き": "gray"
  };
  return <span className={`badge ${map[status] || "gray"}`}>{status}</span>;
}

function priorityBadge(p) {
  return p === "緊急"
    ? <span className="badge red">緊急</span>
    : <span className="badge gray">通常</span>;
}

function typeBadge(t) {
  const map = { "経費精算": "blue", "稟議": "purple", "各種届出": "green" };
  return <span className={`badge ${map[t] || "gray"}`}>{t}</span>;
}

function fmt(n) { return n.toLocaleString("ja-JP"); }

// ===== MAIN APP =====
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [currentUser] = useState(USERS[0]);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [users, setUsers] = useState(USERS);
  const [depts, setDepts] = useState(DEPTS);
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null); // { type, data }
  const [search, setSearch] = useState("");

  const unreadCount = notifs.filter(n => !n.read).length;

  function showToast(msg, type = "green") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function navigate(p) { setPage(p); setShowNotif(false); }

  const pending = requests.filter(r => r.status === "申請中").length;
  const returned = requests.filter(r => r.status === "差戻し").length;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">⚙</div>
            BMS
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">メニュー</div>
            {[
              { id: "dashboard", icon: "▦", label: "ダッシュボード" },
              { id: "requests", icon: "📋", label: "申請一覧", badge: pending > 0 ? pending : null },
              { id: "new_request", icon: "✚", label: "新規申請" },
              { id: "approvals", icon: "✓", label: "承認待ち", badge: pending > 0 ? pending : null },
            ].map(item => (
              <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">管理</div>
            {[
              { id: "users", icon: "👤", label: "ユーザー管理" },
              { id: "masters", icon: "🗂", label: "マスタ管理" },
              { id: "reports", icon: "📊", label: "レポート" },
            ].map(item => (
              <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => navigate(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

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

        {/* MAIN */}
        <div className="main">
          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-title">
              {{ dashboard: "ダッシュボード", requests: "申請一覧", new_request: "新規申請", approvals: "承認待ち", users: "ユーザー管理", masters: "マスタ管理", reports: "レポート" }[page]}
            </div>
            <div className="topbar-search">
              <span style={{ color: "var(--text3)" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="検索..." />
            </div>
            <div style={{ position: "relative" }}>
              <div className="icon-btn" onClick={() => setShowNotif(!showNotif)}>
                🔔
                {unreadCount > 0 && <div className="notif-dot" />}
              </div>
              {showNotif && (
                <div className="notif-panel">
                  <div className="notif-header">
                    通知
                    <button className="btn btn-sm btn-secondary" onClick={() => setNotifs(notifs.map(n => ({ ...n, read: true })))}>全て既読</button>
                  </div>
                  {notifs.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`} onClick={() => setNotifs(notifs.map(x => x.id === n.id ? { ...x, read: true } : x))}>
                      {!n.read && <div className="notif-dot2" />}
                      <div>
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PAGES */}
          <div className="content" onClick={() => showNotif && setShowNotif(false)}>
            {page === "dashboard" && <Dashboard requests={requests} navigate={navigate} setModal={setModal} />}
            {page === "requests" && <RequestList requests={requests} setRequests={setRequests} setModal={setModal} showToast={showToast} search={search} />}
            {page === "new_request" && <NewRequest setRequests={setRequests} showToast={showToast} navigate={navigate} />}
            {page === "approvals" && <Approvals requests={requests} setRequests={setRequests} showToast={showToast} setModal={setModal} />}
            {page === "users" && <UserManagement users={users} setUsers={setUsers} showToast={showToast} />}
            {page === "masters" && <Masters depts={depts} setDepts={setDepts} accounts={accounts} setAccounts={setAccounts} showToast={showToast} />}
            {page === "reports" && <Reports requests={requests} />}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {modal.type === "detail" && (
              <RequestDetail data={modal.data} onClose={() => setModal(null)} setRequests={setRequests} showToast={showToast} />
            )}
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          <span>{toast.type === "green" ? "✅" : toast.type === "red" ? "❌" : "ℹ️"}</span>
          {toast.msg}
        </div>
      )}
    </>
  );
}

// ===== DASHBOARD =====
function Dashboard({ requests, navigate, setModal }) {
  const approved = requests.filter(r => r.status === "承認済み").length;
  const pending = requests.filter(r => r.status === "申請中").length;
  const returned = requests.filter(r => r.status === "差戻し").length;
  const totalAmt = requests.filter(r => r.status === "承認済み").reduce((s, r) => s + r.amount, 0);

  const recent = requests.slice(0, 5);

  return (
    <div>
      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-icon">📋</div>
          <div className="kpi-label">今月の申請件数</div>
          <div className="kpi-value">{requests.length}</div>
          <div className="kpi-delta">▲ 前月比 +18%</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-icon">✅</div>
          <div className="kpi-label">承認済み</div>
          <div className="kpi-value">{approved}</div>
          <div className="kpi-delta">承認率 {Math.round(approved / requests.length * 100)}%</div>
        </div>
        <div className="kpi-card yellow">
          <div className="kpi-icon">⏳</div>
          <div className="kpi-label">承認待ち</div>
          <div className="kpi-value">{pending}</div>
          <div className="kpi-delta neg">{returned > 0 ? `▼ 差戻し ${returned}件` : "良好"}</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-icon">💴</div>
          <div className="kpi-label">承認済み経費合計</div>
          <div className="kpi-value">¥{fmt(totalAmt)}</div>
          <div className="kpi-delta">▲ 前月比 +5%</div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="chart-grid">
        <div className="card">
          <div className="card-title">📈 月次申請トレンド</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={KPI_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="month" stroke="#8B949E" fontSize={11} />
              <YAxis stroke="#8B949E" fontSize={11} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="申請数" stroke="#2F81F7" strokeWidth={2} dot={{ fill: "#2F81F7", r: 4 }} />
              <Line type="monotone" dataKey="承認率" stroke="#3FB950" strokeWidth={2} dot={{ fill: "#3FB950", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">🥧 申請種別割合</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            {PIE_DATA.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text2)" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="chart-grid">
        {/* Recent Requests */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">最近の申請</div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("requests")}>全て見る</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>申請ID</th><th>タイトル</th><th>種別</th><th>ステータス</th></tr></thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => setModal({ type: "detail", data: r })}>
                    <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text3)" }}>{r.id}</td>
                    <td style={{ maxWidth: 200 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div></td>
                    <td>{typeBadge(r.type)}</td>
                    <td>{statusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>最近のアクティビティ</div>
          {[
            { color: "var(--green)", text: "「3月営業出張費精算」が承認されました", time: "10分前" },
            { color: "var(--yellow)", text: "「接待費精算」に差戻しが発生しました", time: "2時間前" },
            { color: "var(--accent)", text: "「クラウドサービス導入稟議」を提出しました", time: "昨日 14:30" },
            { color: "var(--green)", text: "「テレワーク申請」が承認されました", time: "昨日 09:15" },
            { color: "var(--red)", text: "「有給休暇申請」が却下されました", time: "2日前" },
          ].map((a, i) => (
            <div key={i} className="activity-item">
              <div className="activity-dot" style={{ background: a.color }} />
              <div>
                <div style={{ fontSize: 12, color: "var(--text)" }}>{a.text}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== REQUEST LIST =====
function RequestList({ requests, setRequests, setModal, showToast, search }) {
  const [statusFilter, setStatusFilter] = useState("全て");
  const [typeFilter, setTypeFilter] = useState("全て");

  const filtered = requests.filter(r => {
    const matchSearch = !search || r.title.includes(search) || r.applicant.includes(search) || r.id.includes(search);
    const matchStatus = statusFilter === "全て" || r.status === statusFilter;
    const matchType = typeFilter === "全て" || r.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  function deleteRequest(id) {
    setRequests(prev => prev.filter(r => r.id !== id));
    showToast("申請を削除しました");
  }

  return (
    <div>
      <div className="filter-bar">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["全て", "下書き", "申請中", "差戻し", "承認済み", "却下"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          {["全て", "経費精算", "稟議", "各種届出"].map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: "auto" }}>{filtered.length}件</span>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>申請ID</th><th>タイトル</th><th>種別</th><th>申請者</th>
                <th>金額</th><th>日付</th><th>ステータス</th><th>優先度</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><div className="empty"><div className="empty-icon">📭</div><div className="empty-text">該当する申請がありません</div></div></td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text3)" }}>{r.id}</td>
                  <td style={{ cursor: "pointer", color: "var(--accent)", fontWeight: 500 }} onClick={() => setModal({ type: "detail", data: r })}>{r.title}</td>
                  <td>{typeBadge(r.type)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--accent-bg)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                        {r.applicant[0]}
                      </div>
                      {r.applicant}
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace" }}>{r.amount > 0 ? `¥${fmt(r.amount)}` : "─"}</td>
                  <td style={{ fontSize: 12, color: "var(--text2)" }}>{r.date}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>{priorityBadge(r.priority)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setModal({ type: "detail", data: r })}>詳細</button>
                      {r.status === "下書き" && (
                        <button className="btn btn-danger btn-sm" onClick={() => deleteRequest(r.id)}>削除</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== NEW REQUEST =====
function NewRequest({ setRequests, showToast, navigate }) {
  const [form, setForm] = useState({ type: "経費精算", title: "", dept: "営業部", amount: "", priority: "通常", description: "", route: "通常承認ルート" });
  const [tab, setTab] = useState("基本情報");

  function submit(isDraft) {
    if (!form.title) { showToast("タイトルを入力してください", "red"); return; }
    const newReq = {
      id: `REQ-2025-0${Math.floor(Math.random() * 90 + 10)}`,
      ...form,
      amount: Number(form.amount) || 0,
      applicant: "田中 太郎",
      status: isDraft ? "下書き" : "申請中",
      date: new Date().toISOString().slice(0, 10),
      approver: "鈴木 花子",
      comments: []
    };
    setRequests(prev => [newReq, ...prev]);
    showToast(isDraft ? "下書き保存しました" : "申請を提出しました！");
    navigate("requests");
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="tabs">
        {["基本情報", "詳細情報", "添付ファイル"].map(t => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === "基本情報" && (
        <div className="card">
          <div className="form-group">
            <label className="form-label">申請種別 *</label>
            <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {["経費精算", "稟議", "各種届出"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">タイトル *</label>
            <input className="form-control" placeholder="申請タイトルを入力" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">申請部門</label>
              <select className="form-control" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                {DEPTS.map(d => <option key={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">優先度</label>
              <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option>通常</option><option>緊急</option>
              </select>
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">金額（円）</label>
              <input className="form-control" type="number" placeholder="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">承認ルート</label>
              <select className="form-control" value={form.route} onChange={e => setForm({ ...form, route: e.target.value })}>
                <option>通常承認ルート</option>
                <option>緊急承認ルート</option>
                <option>高額承認ルート（100万円以上）</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {tab === "詳細情報" && (
        <div className="card">
          <div className="form-group">
            <label className="form-label">申請内容・説明</label>
            <textarea className="form-control" rows={6} placeholder="申請の詳細、目的、必要性などを記入してください" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
          </div>
          {form.type === "経費精算" && (
            <>
              <div className="form-group">
                <label className="form-label">勘定科目</label>
                <select className="form-control">
                  {ACCOUNTS.filter(a => a.active).map(a => <option key={a.id}>{a.code} - {a.name}</option>)}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">発生日</label>
                  <input className="form-control" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
                </div>
                <div className="form-group">
                  <label className="form-label">消費税区分</label>
                  <select className="form-control">
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

      {tab === "添付ファイル" && (
        <div className="card">
          <div style={{ border: "2px dashed var(--border2)", borderRadius: 12, padding: 40, textAlign: "center", color: "var(--text3)", cursor: "pointer" }}
            onDragOver={e => e.preventDefault()}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📎</div>
            <div style={{ fontSize: 14, marginBottom: 8 }}>ファイルをドロップ、またはクリックしてアップロード</div>
            <div style={{ fontSize: 11 }}>PDF / Excel / Word / 画像（最大50MB）</div>
          </div>
          <div className="alert blue" style={{ marginTop: 16 }}>
            <span>ℹ️</span>
            領収書・見積書などの証憑書類を添付してください。経費精算の場合は領収書の添付が必須です。
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button className="btn btn-primary" onClick={() => submit(false)}>📤 申請提出</button>
        <button className="btn btn-secondary" onClick={() => submit(true)}>💾 下書き保存</button>
        <button className="btn btn-secondary" onClick={() => navigate("requests")} style={{ marginLeft: "auto" }}>キャンセル</button>
      </div>
    </div>
  );
}

// ===== APPROVALS =====
function Approvals({ requests, setRequests, showToast, setModal }) {
  const pending = requests.filter(r => r.status === "申請中");
  const [comment, setComment] = useState({});

  function approve(id) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "承認済み", comments: [...r.comments, { user: "鈴木 花子", text: comment[id] || "承認します。", date: new Date().toISOString().slice(0, 10) }] } : r));
    setComment(prev => ({ ...prev, [id]: "" }));
    showToast("承認しました ✅");
  }

  function reject(id, type) {
    if (!comment[id]) { showToast("コメントを入力してください", "red"); return; }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: type === "return" ? "差戻し" : "却下", comments: [...r.comments, { user: "鈴木 花子", text: comment[id], date: new Date().toISOString().slice(0, 10) }] } : r));
    setComment(prev => ({ ...prev, [id]: "" }));
    showToast(type === "return" ? "差戻しました" : "却下しました", "red");
  }

  return (
    <div>
      {pending.length === 0 ? (
        <div className="card"><div className="empty"><div className="empty-icon">✅</div><div className="empty-text">承認待ちの申請はありません</div></div></div>
      ) : (
        <>
          <div className="alert yellow" style={{ marginBottom: 16 }}><span>⚠️</span> {pending.length}件の申請が承認待ちです</div>
          {pending.map(r => (
            <div className="card" key={r.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                    {typeBadge(r.type)}
                    {priorityBadge(r.priority)}
                    <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "monospace" }}>{r.id}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{r.applicant} · {r.dept} · {r.date}</div>
                </div>
                {r.amount > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>申請金額</div>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: "var(--text)" }}>¥{fmt(r.amount)}</div>
                  </div>
                )}
              </div>

              {r.description && <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16, lineHeight: 1.6, background: "var(--surface2)", padding: "10px 14px", borderRadius: 8 }}>{r.description}</p>}

              {/* Approval Flow */}
              <div className="flow">
                <div className="flow-step">
                  <div className="flow-circle done">✓</div>
                  <div className="flow-name">{r.applicant}</div>
                  <div className="flow-role">申請者</div>
                </div>
                <div className="flow-step">
                  <div className="flow-circle active">👁</div>
                  <div className="flow-name">鈴木 花子</div>
                  <div className="flow-role">第1承認者</div>
                </div>
                <div className="flow-step">
                  <div className="flow-circle wait">─</div>
                  <div className="flow-name">佐藤 一郎</div>
                  <div className="flow-role">第2承認者</div>
                </div>
                <div className="flow-step">
                  <div className="flow-circle wait">─</div>
                  <div className="flow-name">完了</div>
                  <div className="flow-role">承認済み</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">承認コメント（差戻し・却下時は必須）</label>
                <textarea className="form-control" rows={2} placeholder="コメントを入力..." value={comment[r.id] || ""} onChange={e => setComment({ ...comment, [r.id]: e.target.value })} style={{ resize: "none" }} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-green" onClick={() => approve(r.id)}>✓ 承認</button>
                <button className="btn btn-secondary" onClick={() => reject(r.id, "return")}>↩ 差戻し</button>
                <button className="btn btn-danger" onClick={() => reject(r.id, "reject")}>✕ 却下</button>
                <button className="btn btn-secondary btn-sm" style={{ marginLeft: "auto" }} onClick={() => setModal({ type: "detail", data: r })}>詳細表示</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ===== REQUEST DETAIL =====
function RequestDetail({ data, onClose, setRequests, showToast }) {
  const [comment, setComment] = useState("");

  function addComment() {
    if (!comment) return;
    setRequests(prev => prev.map(r => r.id === data.id ? { ...r, comments: [...r.comments, { user: "田中 太郎", text: comment, date: new Date().toISOString().slice(0, 10) }] } : r));
    setComment("");
    showToast("コメントを追加しました");
  }

  return (
    <>
      <div className="modal-header">
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>{typeBadge(data.type)}{statusBadge(data.status)}{priorityBadge(data.priority)}</div>
          <div className="modal-title">{data.title}</div>
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="detail-row">
        <div className="detail-field">
          <div className="detail-label">申請番号</div>
          <div className="detail-value" style={{ fontFamily: "monospace", fontSize: 13 }}>{data.id}</div>
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

      {data.amount > 0 && (
        <div style={{ background: "var(--surface2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--text2)" }}>申請金額</span>
          <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "Space Grotesk, monospace" }}>¥{fmt(data.amount)}</span>
        </div>
      )}

      {data.description && (
        <div style={{ marginBottom: 20 }}>
          <div className="detail-label" style={{ marginBottom: 6 }}>申請内容</div>
          <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, background: "var(--surface2)", padding: "12px 14px", borderRadius: 8 }}>{data.description}</p>
        </div>
      )}

      {/* Timeline */}
      <div className="flow" style={{ marginBottom: 20 }}>
        <div className="flow-step">
          <div className="flow-circle done">✓</div>
          <div className="flow-name">{data.applicant}</div>
          <div className="flow-role">申請者</div>
        </div>
        <div className="flow-step">
          <div className={`flow-circle ${data.status === "承認済み" ? "done" : data.status === "申請中" ? "active" : "wait"}`}>
            {data.status === "承認済み" ? "✓" : data.status === "申請中" ? "👁" : "─"}
          </div>
          <div className="flow-name">{data.approver}</div>
          <div className="flow-role">第1承認者</div>
        </div>
        <div className="flow-step">
          <div className={`flow-circle ${data.status === "承認済み" ? "done" : "wait"}`}>
            {data.status === "承認済み" ? "✓" : "─"}
          </div>
          <div className="flow-name">完了</div>
          <div className="flow-role">承認済み</div>
        </div>
      </div>

      {/* Comments */}
      {data.comments.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div className="detail-label" style={{ marginBottom: 10 }}>コメント ({data.comments.length})</div>
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

      <div style={{ display: "flex", gap: 8 }}>
        <input className="form-control" placeholder="コメントを追加..." value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} />
        <button className="btn btn-primary" onClick={addComment}>送信</button>
      </div>
    </>
  );
}

// ===== USER MANAGEMENT =====
function UserManagement({ users, setUsers, showToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", dept: "営業部", role: "一般ユーザー", email: "" });

  function openNew() { setForm({ name: "", dept: "営業部", role: "一般ユーザー", email: "", avatar: "新" }); setEditUser(null); setShowModal(true); }
  function openEdit(u) { setForm(u); setEditUser(u); setShowModal(true); }

  function save() {
    if (!form.name || !form.email) { showToast("名前とメールを入力してください", "red"); return; }
    if (editUser) {
      setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...form } : u));
      showToast("ユーザーを更新しました");
    } else {
      setUsers(prev => [...prev, { ...form, id: Date.now(), avatar: form.name[0] }]);
      showToast("ユーザーを追加しました");
    }
    setShowModal(false);
  }

  function deleteUser(id) { setUsers(prev => prev.filter(u => u.id !== id)); showToast("ユーザーを削除しました"); }

  const roleColor = { "システム管理者": "red", "部門管理者": "purple", "承認者": "blue", "一般ユーザー": "green", "閲覧者": "gray" };

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: "var(--text2)" }}>{users.length}名</span>
        <button className="btn btn-primary" onClick={openNew}>＋ ユーザー追加</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>ユーザー</th><th>部門</th><th>ロール</th><th>メール</th><th>操作</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{u.avatar}</div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>{u.dept}</td>
                  <td><span className={`badge ${roleColor[u.role] || "gray"}`}>{u.role}</span></td>
                  <td style={{ fontSize: 12, color: "var(--text2)" }}>{u.email}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>編集</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>削除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editUser ? "ユーザー編集" : "ユーザー追加"}</div>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="form-group">
              <label className="form-label">氏名 *</label>
              <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例：田中 太郎" />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">部門</label>
                <select className="form-control" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
                  {DEPTS.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">ロール</label>
                <select className="form-control" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {["システム管理者", "部門管理者", "承認者", "一般ユーザー", "閲覧者"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">メールアドレス *</label>
              <input className="form-control" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@company.com" />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>キャンセル</button>
              <button className="btn btn-primary" onClick={save}>{editUser ? "更新" : "追加"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== MASTERS =====
function Masters({ depts, setDepts, accounts, setAccounts, showToast }) {
  const [activeTab, setActiveTab] = useState("部門");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});

  function openNew() {
    setForm(activeTab === "部門" ? { code: "", name: "", head: "", budget: "" } : { code: "", name: "", category: "旅費交通費", active: true });
    setEditItem(null); setShowModal(true);
  }
  function openEdit(item) { setForm(item); setEditItem(item); setShowModal(true); }

  function save() {
    if (!form.name) { showToast("名前を入力してください", "red"); return; }
    if (activeTab === "部門") {
      if (editItem) setDepts(prev => prev.map(d => d.id === editItem.id ? { ...d, ...form } : d));
      else setDepts(prev => [...prev, { ...form, id: Date.now(), budget: Number(form.budget) || 0 }]);
    } else {
      if (editItem) setAccounts(prev => prev.map(a => a.id === editItem.id ? { ...a, ...form } : a));
      else setAccounts(prev => [...prev, { ...form, id: Date.now() }]);
    }
    showToast("保存しました"); setShowModal(false);
  }

  function toggleActive(id) {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    showToast("更新しました");
  }

  return (
    <div>
      <div className="tabs">
        {["部門", "勘定科目"].map(t => (
          <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>{t}</button>
        ))}
      </div>

      <div className="section-header" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: "var(--text2)" }}>
          {activeTab === "部門" ? `${depts.length}件` : `${accounts.length}件`}
        </span>
        <button className="btn btn-primary" onClick={openNew}>＋ 追加</button>
      </div>

      <div className="card">
        {activeTab === "部門" ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>コード</th><th>部門名</th><th>部門長</th><th>予算</th><th>操作</th></tr></thead>
              <tbody>
                {depts.map(d => (
                  <tr key={d.id}>
                    <td><span className="tag">{d.code}</span></td>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{d.head}</td>
                    <td style={{ fontFamily: "monospace" }}>¥{fmt(d.budget)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>編集</button>
                        <button className="btn btn-danger btn-sm" onClick={() => { setDepts(prev => prev.filter(x => x.id !== d.id)); showToast("削除しました"); }}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>科目コード</th><th>科目名</th><th>カテゴリ</th><th>状態</th><th>操作</th></tr></thead>
              <tbody>
                {accounts.map(a => (
                  <tr key={a.id}>
                    <td><span className="tag">{a.code}</span></td>
                    <td style={{ fontWeight: 600 }}>{a.name}</td>
                    <td style={{ fontSize: 12, color: "var(--text2)" }}>{a.category}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => toggleActive(a.id)}>
                        <div style={{ width: 32, height: 18, borderRadius: 9, background: a.active ? "var(--green)" : "var(--surface3)", position: "relative", transition: "background 0.2s" }}>
                          <div style={{ position: "absolute", top: 2, left: a.active ? 14 : 2, width: 14, height: 14, borderRadius: "50%", background: "white", transition: "left 0.2s" }} />
                        </div>
                        <span style={{ fontSize: 12, color: a.active ? "var(--green)" : "var(--text3)" }}>{a.active ? "有効" : "無効"}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>編集</button>
                        <button className="btn btn-danger btn-sm" onClick={() => { setAccounts(prev => prev.filter(x => x.id !== a.id)); showToast("削除しました"); }}>削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ width: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{editItem ? "編集" : "新規追加"} - {activeTab}</div>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {activeTab === "部門" ? (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">コード</label>
                    <input className="form-control" value={form.code || ""} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="例: SALES" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">部門名 *</label>
                    <input className="form-control" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例: 営業部" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">部門長</label>
                  <input className="form-control" value={form.head || ""} onChange={e => setForm({ ...form, head: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">予算（円）</label>
                  <input className="form-control" type="number" value={form.budget || ""} onChange={e => setForm({ ...form, budget: e.target.value })} />
                </div>
              </>
            ) : (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">科目コード</label>
                    <input className="form-control" value={form.code || ""} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="例: 6100" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">科目名 *</label>
                    <input className="form-control" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例: 交通費" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">カテゴリ</label>
                  <select className="form-control" value={form.category || "旅費交通費"} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {["旅費交通費", "交際費", "消耗品", "教育費", "通信費", "その他"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>キャンセル</button>
              <button className="btn btn-primary" onClick={save}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== REPORTS =====
function Reports({ requests }) {
  const [period, setPeriod] = useState("月次");

  const byStatus = [
    { name: "承認済み", count: requests.filter(r => r.status === "承認済み").length },
    { name: "申請中", count: requests.filter(r => r.status === "申請中").length },
    { name: "差戻し", count: requests.filter(r => r.status === "差戻し").length },
    { name: "却下", count: requests.filter(r => r.status === "却下").length },
    { name: "下書き", count: requests.filter(r => r.status === "下書き").length },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <select style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "var(--text)", fontFamily: "inherit", outline: "none" }} value={period} onChange={e => setPeriod(e.target.value)}>
          {["月次", "四半期", "年次"].map(p => <option key={p}>{p}</option>)}
        </select>
        <button className="btn btn-secondary btn-sm">📥 CSVエクスポート</button>
        <button className="btn btn-secondary btn-sm">📄 PDFエクスポート</button>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="kpi-card blue">
          <div className="kpi-label">総申請件数</div>
          <div className="kpi-value">{requests.length}</div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-label">承認率</div>
          <div className="kpi-value">{Math.round(requests.filter(r => r.status === "承認済み").length / requests.length * 100)}%</div>
        </div>
        <div className="kpi-card yellow">
          <div className="kpi-label">平均承認日数</div>
          <div className="kpi-value">1.8日</div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-label">総承認金額</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>¥{fmt(requests.filter(r => r.status === "承認済み").reduce((s, r) => s + r.amount, 0))}</div>
        </div>
      </div>

      <div className="chart-grid" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">📊 部門別経費実績 vs 予算（万円）</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={EXPENSE_DEPT_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="dept" stroke="#8B949E" fontSize={11} />
              <YAxis stroke="#8B949E" fontSize={11} />
              <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #30363D", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="予算" fill="#30363D" radius={[4, 4, 0, 0]} />
              <Bar dataKey="経費" fill="#2F81F7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">📋 ステータス別件数</div>
          {byStatus.map(s => {
            const colorMap = { "承認済み": "var(--green)", "申請中": "var(--accent)", "差戻し": "var(--yellow)", "却下": "var(--red)", "下書き": "var(--text3)" };
            return (
              <div key={s.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>
                  <span>{s.name}</span>
                  <span style={{ fontFamily: "monospace", color: colorMap[s.name] }}>{s.count}件</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${s.count / requests.length * 100}%`, background: colorMap[s.name] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div className="section-title">申請一覧（集計対象）</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>申請ID</th><th>タイトル</th><th>種別</th><th>申請者</th><th>金額</th><th>ステータス</th><th>日付</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--text3)" }}>{r.id}</td>
                  <td>{r.title}</td>
                  <td>{typeBadge(r.type)}</td>
                  <td>{r.applicant}</td>
                  <td style={{ fontFamily: "monospace" }}>{r.amount > 0 ? `¥${fmt(r.amount)}` : "─"}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td style={{ fontSize: 12, color: "var(--text2)" }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
