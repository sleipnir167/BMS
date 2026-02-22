// ============================================================
// モックデータ定義
// 本番環境ではAPIから取得する
// ============================================================

export const USERS = [
  { id: 1, name: "田中 太郎",   dept: "営業部",           role: "一般ユーザー",   email: "tanaka@example.com",    avatar: "田" },
  { id: 2, name: "鈴木 花子",   dept: "経理部",           role: "承認者",         email: "suzuki@example.com",    avatar: "鈴" },
  { id: 3, name: "佐藤 一郎",   dept: "総務部",           role: "部門管理者",     email: "sato@example.com",      avatar: "佐" },
  { id: 4, name: "山田 美咲",   dept: "人事部",           role: "一般ユーザー",   email: "yamada@example.com",    avatar: "山" },
  { id: 5, name: "伊藤 健二",   dept: "IT部",             role: "システム管理者", email: "ito@example.com",       avatar: "伊" },
  { id: 6, name: "渡辺 さくら", dept: "マーケティング部", role: "一般ユーザー",   email: "watanabe@example.com",  avatar: "渡" },
];

export const DEPTS = [
  { id: 1, code: "SALES", name: "営業部",           head: "鈴木 花子",   budget: 5000000 },
  { id: 2, code: "ACC",   name: "経理部",           head: "佐藤 一郎",   budget: 2000000 },
  { id: 3, code: "GEN",   name: "総務部",           head: "山田 美咲",   budget: 3000000 },
  { id: 4, code: "HR",    name: "人事部",           head: "伊藤 健二",   budget: 2500000 },
  { id: 5, code: "IT",    name: "IT部",             head: "田中 太郎",   budget: 8000000 },
  { id: 6, code: "MKT",   name: "マーケティング部", head: "渡辺 さくら", budget: 4000000 },
];

export const INITIAL_REQUESTS = [
  {
    id: "REQ-2025-001", type: "経費精算", title: "3月営業出張費精算",
    applicant: "田中 太郎", dept: "営業部", amount: 52400,
    status: "承認済み", date: "2025-03-01", approver: "鈴木 花子", priority: "通常",
    description: "大阪出張に伴う交通費・宿泊費の精算申請です。",
    comments: [{ user: "鈴木 花子", text: "確認しました。承認します。", date: "2025-03-03" }],
  },
  {
    id: "REQ-2025-002", type: "稟議", title: "クラウドサービス導入稟議",
    applicant: "伊藤 健二", dept: "IT部", amount: 1200000,
    status: "申請中", date: "2025-03-05", approver: "山田 美咲", priority: "緊急",
    description: "業務効率化のためSaaSツール導入を申請します。",
    comments: [],
  },
  {
    id: "REQ-2025-003", type: "経費精算", title: "接待費精算（取引先A社）",
    applicant: "渡辺 さくら", dept: "マーケティング部", amount: 38000,
    status: "差戻し", date: "2025-03-08", approver: "佐藤 一郎", priority: "通常",
    description: "取引先A社との会食費の精算申請です。",
    comments: [{ user: "佐藤 一郎", text: "領収書の詳細が不足しています。再提出をお願いします。", date: "2025-03-10" }],
  },
  {
    id: "REQ-2025-004", type: "各種届出", title: "テレワーク申請（4月分）",
    applicant: "山田 美咲", dept: "人事部", amount: 0,
    status: "承認済み", date: "2025-03-10", approver: "伊藤 健二", priority: "通常",
    description: "4月のテレワーク実施申請です。",
    comments: [],
  },
  {
    id: "REQ-2025-005", type: "稟議", title: "オフィス什器購入稟議",
    applicant: "佐藤 一郎", dept: "総務部", amount: 450000,
    status: "申請中", date: "2025-03-12", approver: "鈴木 花子", priority: "通常",
    description: "老朽化したオフィス家具の買い替え稟議です。",
    comments: [],
  },
  {
    id: "REQ-2025-006", type: "経費精算", title: "研修費精算",
    applicant: "鈴木 花子", dept: "経理部", amount: 28500,
    status: "下書き", date: "2025-03-14", approver: "─", priority: "通常",
    description: "外部研修参加費の精算申請です。",
    comments: [],
  },
  {
    id: "REQ-2025-007", type: "各種届出", title: "有給休暇申請（3/28）",
    applicant: "田中 太郎", dept: "営業部", amount: 0,
    status: "却下", date: "2025-03-15", approver: "鈴木 花子", priority: "通常",
    description: "有給休暇取得申請です。",
    comments: [{ user: "鈴木 花子", text: "当日は重要商談があるため今回は見送りをお願いします。", date: "2025-03-16" }],
  },
];

export const ACCOUNTS = [
  { id: 1, code: "6100", name: "交通費",     category: "旅費交通費", active: true  },
  { id: 2, code: "6110", name: "宿泊費",     category: "旅費交通費", active: true  },
  { id: 3, code: "6200", name: "接待交際費", category: "交際費",     active: true  },
  { id: 4, code: "6300", name: "消耗品費",   category: "消耗品",     active: true  },
  { id: 5, code: "6400", name: "研修費",     category: "教育費",     active: true  },
  { id: 6, code: "6500", name: "通信費",     category: "通信費",     active: false },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "approval", text: "「クラウドサービス導入稟議」の承認が必要です",     time: "10分前", read: false },
  { id: 2, type: "returned", text: "「接待費精算」が差し戻されました",                 time: "2時間前", read: false },
  { id: 3, type: "approved", text: "「テレワーク申請」が承認されました",               time: "昨日",   read: true  },
  { id: 4, type: "alert",    text: "承認期限超過: 3件の申請が期限を超過しています",    time: "昨日",   read: true  },
];

export const KPI_TREND_DATA = [
  { month: "10月", 申請数: 42, 承認率: 88, 平均日数: 2.1 },
  { month: "11月", 申請数: 55, 承認率: 91, 平均日数: 1.8 },
  { month: "12月", 申請数: 38, 承認率: 85, 平均日数: 2.5 },
  { month: "1月",  申請数: 61, 承認率: 93, 平均日数: 1.6 },
  { month: "2月",  申請数: 48, 承認率: 89, 平均日数: 2.0 },
  { month: "3月",  申請数: 72, 承認率: 94, 平均日数: 1.4 },
];

export const TYPE_RATIO_DATA = [
  { name: "経費精算", value: 38, color: "#3B82F6" },
  { name: "稟議",     value: 27, color: "#8B5CF6" },
  { name: "各種届出", value: 35, color: "#10B981" },
];

export const EXPENSE_DEPT_DATA = [
  { dept: "営業",  経費: 420, 予算: 500 },
  { dept: "IT",    経費: 680, 予算: 800 },
  { dept: "総務",  経費: 180, 予算: 300 },
  { dept: "人事",  経費: 120, 予算: 250 },
  { dept: "MKT",   経費: 310, 予算: 400 },
];

export const ACTIVITY_LOG = [
  { color: "var(--green)",  text: "「3月営業出張費精算」が承認されました",          time: "10分前"     },
  { color: "var(--yellow)", text: "「接待費精算」に差戻しが発生しました",            time: "2時間前"    },
  { color: "var(--accent)", text: "「クラウドサービス導入稟議」を提出しました",      time: "昨日 14:30" },
  { color: "var(--green)",  text: "「テレワーク申請」が承認されました",              time: "昨日 09:15" },
  { color: "var(--red)",    text: "「有給休暇申請」が却下されました",                time: "2日前"      },
];
