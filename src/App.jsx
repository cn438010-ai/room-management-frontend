import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, DoorOpen, FileText, Receipt, Users, Settings, Search,
  Bell, Plus, MoreHorizontal, Pencil, Trash2, X, Menu, ChevronDown,
  TrendingUp, Wallet, CalendarDays, CheckCircle2, Clock3, LogOut,
  Building2, SlidersHorizontal
} from 'lucide-react';

const initialRooms = [
  { id: 1, room_number: 'P101', room_name: 'Phòng Standard 101', floor: 1, area: 25, price: 3000000, max_occupancy: 2, status: 'Đang thuê', description: 'Có cửa sổ, điều hòa' },
  { id: 2, room_number: 'P102', room_name: 'Phòng Deluxe 102', floor: 1, area: 32, price: 4200000, max_occupancy: 3, status: 'Còn trống', description: 'Ban công, nội thất đầy đủ' },
  { id: 3, room_number: 'P201', room_name: 'Phòng Standard 201', floor: 2, area: 24, price: 2900000, max_occupancy: 2, status: 'Đang thuê', description: 'Yên tĩnh, có cửa sổ' },
  { id: 4, room_number: 'P202', room_name: 'Phòng Studio 202', floor: 2, area: 38, price: 5000000, max_occupancy: 3, status: 'Bảo trì', description: 'Đang sửa nhà vệ sinh' },
  { id: 5, room_number: 'P301', room_name: 'Phòng Deluxe 301', floor: 3, area: 35, price: 4500000, max_occupancy: 2, status: 'Còn trống', description: 'View thoáng' },
  { id: 6, room_number: 'P302', room_name: 'Phòng Standard 302', floor: 3, area: 26, price: 3200000, max_occupancy: 2, status: 'Đang thuê', description: 'Đầy đủ tiện nghi' }
];
const initialUsers = [
  { id: 1, username: 'nguyenvana', full_name: 'Nguyễn Văn An', email: 'an.nguyen@email.com', phone_number: '0901234567', role: 'Người thuê', status: 'Hoạt động' },
  { id: 2, username: 'tranthib', full_name: 'Trần Thị Bình', email: 'binh.tran@email.com', phone_number: '0912345678', role: 'Người thuê', status: 'Hoạt động' },
  { id: 3, username: 'admin', full_name: 'Quản trị viên', email: 'admin@roomly.vn', phone_number: '0987654321', role: 'Admin', status: 'Hoạt động' }
];
const initialContracts = [
  { id: 1, user_id: 1, room_id: 1, tenant: 'Nguyễn Văn An', room: 'P101', start_date: '2026-01-01', end_date: '2026-12-31', deposit: 3000000, status: 'Đang hiệu lực' },
  { id: 2, user_id: 2, room_id: 3, tenant: 'Trần Thị Bình', room: 'P201', start_date: '2026-03-01', end_date: '2027-02-28', deposit: 2900000, status: 'Đang hiệu lực' },
  { id: 3, user_id: 1, room_id: 6, tenant: 'Nguyễn Văn An', room: 'P302', start_date: '2025-05-01', end_date: '2026-04-30', deposit: 3200000, status: 'Đã kết thúc' }
];
const initialInvoices = [
  { id: 1, contract_id: 1, room: 'P101', tenant: 'Nguyễn Văn An', month: 10, year: 2026, room_price: 3000000, electricity_cost: 450000, water_cost: 120000, other_fees: 100000, total_amount: 3670000, status: 'Đã thanh toán' },
  { id: 2, contract_id: 2, room: 'P201', tenant: 'Trần Thị Bình', month: 10, year: 2026, room_price: 2900000, electricity_cost: 520000, water_cost: 150000, other_fees: 0, total_amount: 3570000, status: 'Chưa thanh toán' },
  { id: 3, contract_id: 1, room: 'P101', tenant: 'Nguyễn Văn An', month: 9, year: 2026, room_price: 3000000, electricity_cost: 410000, water_cost: 120000, other_fees: 50000, total_amount: 3580000, status: 'Đã thanh toán' }
];
const money = n => new Intl.NumberFormat('vi-VN').format(Number(n || 0)) + ' đ';
const date = s => s ? new Date(s + 'T00:00:00').toLocaleDateString('vi-VN') : '—';

function App() {
  const [page, setPage] = useState('Dashboard');
  const [rooms, setRooms] = useState(initialRooms);
  const [users, setUsers] = useState(initialUsers);
  const [contracts, setContracts] = useState(initialContracts);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');

  const notify = message => { setToast(message); setTimeout(() => setToast(''), 2600); };
  const nav = [
    { label: 'Tổng quan', icon: LayoutDashboard, page: 'Dashboard' },
    { label: 'Phòng', icon: DoorOpen, page: 'Rooms' },
    { label: 'Hợp đồng', icon: FileText, page: 'Contracts' },
    { label: 'Hóa đơn', icon: Receipt, page: 'Invoices' },
    { label: 'Người dùng', icon: Users, page: 'Users' }
  ];
  const occupied = rooms.filter(r => r.status === 'Đang thuê').length;
  const available = rooms.filter(r => r.status === 'Còn trống').length;
  const revenue = invoices.filter(i => i.status === 'Đã thanh toán').reduce((s, i) => s + i.total_amount, 0);
  const filtered = arr => arr.filter(x => Object.values(x).join(' ').toLowerCase().includes(query.toLowerCase()));

  function openCreate(type) { setEditing(null); setModal(type); }
  function openEdit(type, item) { setEditing(item); setModal(type); }
  function save(type, data) {
    const setter = { room: setRooms, user: setUsers, contract: setContracts, invoice: setInvoices }[type];
    const current = { room: rooms, user: users, contract: contracts, invoice: invoices }[type];
    if (editing) setter(current.map(x => x.id === editing.id ? { ...data, id: editing.id } : x));
    else setter([...current, { ...data, id: Math.max(0, ...current.map(x => x.id)) + 1 }]);
    setModal(null); setEditing(null); notify(editing ? 'Đã cập nhật dữ liệu.' : 'Đã thêm dữ liệu mới.');
  }
  function remove(type, id) {
    const setter = { room: setRooms, user: setUsers, contract: setContracts, invoice: setInvoices }[type];
    const current = { room: rooms, user: users, contract: contracts, invoice: invoices }[type];
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) { setter(current.filter(x => x.id !== id)); notify('Đã xóa dữ liệu.'); }
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileOpen ? 'show' : ''}`}>
      <div className="brand"><div className="brand-mark"><Building2 size={21}/></div><div><b>roomly</b><small>PROPERTY MANAGER</small></div><button className="mobile-close" onClick={() => setMobileOpen(false)}><X/></button></div>
      <div className="workspace"><div className="workspace-icon">R</div><div><b>Tòa nhà Roomly</b><small>Gói quản lý cơ bản</small></div><ChevronDown size={15}/></div>
      <div className="nav-caption">MENU CHÍNH</div>
      <nav>{nav.map(item => <button key={item.page} className={`nav-item ${page === item.page ? 'active' : ''}`} onClick={() => {setPage(item.page);setQuery('');setMobileOpen(false);}}><item.icon size={18}/><span>{item.label}</span>{page === item.page && <span className="active-dot"/>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><b>Cần hỗ trợ?</b><p>Xem hướng dẫn sử dụng hệ thống quản lý.</p><button onClick={() => notify('Chức năng hỗ trợ sẽ được bổ sung.')}>Trung tâm trợ giúp <span>→</span></button></div><button className="nav-item"><Settings size={18}/><span>Cài đặt</span></button><div className="profile"><div className="avatar">AD</div><div><b>Admin Roomly</b><small>Quản trị viên</small></div><LogOut size={17}/></div></div>
    </aside>
    {mobileOpen && <div className="scrim" onClick={() => setMobileOpen(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="hamburger" onClick={() => setMobileOpen(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> <b>{page === 'Dashboard' ? 'Tổng quan' : page === 'Rooms' ? 'Quản lý phòng' : page === 'Contracts' ? 'Hợp đồng' : page === 'Invoices' ? 'Hóa đơn' : 'Người dùng'}</b></div><div className="top-actions"><div className="top-date"><CalendarDays size={15}/> Chủ nhật, 01/11/2026</div><button className="icon-btn" onClick={() => notify('Bạn không có thông báo mới.')}><Bell size={18}/><i/></button><div className="top-avatar">AD</div></div></header>
      <section className="content">
        {page === 'Dashboard' && <Dashboard rooms={rooms} contracts={contracts} invoices={invoices} occupied={occupied} available={available} revenue={revenue} setPage={setPage}/>}
        {page === 'Rooms' && <Rooms rooms={filtered(rooms)} allRooms={rooms} onAdd={() => openCreate('room')} onEdit={r => openEdit('room',r)} onDelete={id => remove('room',id)} query={query} setQuery={setQuery}/>}
        {page === 'Contracts' && <Contracts contracts={filtered(contracts)} users={users} rooms={rooms} onAdd={() => openCreate('contract')} onEdit={r => openEdit('contract',r)} onDelete={id => remove('contract',id)} query={query} setQuery={setQuery}/>}
        {page === 'Invoices' && <Invoices invoices={filtered(invoices)} onAdd={() => openCreate('invoice')} onEdit={r => openEdit('invoice',r)} onDelete={id => remove('invoice',id)} query={query} setQuery={setQuery}/>}
        {page === 'Users' && <UsersPage users={filtered(users)} onAdd={() => openCreate('user')} onEdit={r => openEdit('user',r)} onDelete={id => remove('user',id)} query={query} setQuery={setQuery}/>}
      </section>
    </main>
    {modal && <Modal type={modal} editing={editing} users={users} rooms={rooms} contracts={contracts} onClose={() => setModal(null)} onSave={data => save(modal,data)}/>}
    {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
  </div>;
}

function PageHeading({eyebrow,title,description,action,children}) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><div className="heading-actions">{children}{action}</div></div>;
}
function Stat({label,value,sub,icon:Icon,tone,trend}) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-foot"><span className="trend"><TrendingUp size={13}/>{trend}</span><span>{sub}</span></div></div>;
}
function Dashboard({rooms,contracts,invoices,occupied,available,revenue,setPage}) {
  const paid = invoices.filter(i => i.status === 'Đã thanh toán').length;
  return <>
    <PageHeading eyebrow="OVERVIEW" title="Tổng quan" description="Theo dõi tình hình hoạt động và các chỉ số của tòa nhà." action={<button className="btn btn-primary" onClick={() => setPage('Rooms')}><Plus size={17}/> Quản lý phòng</button>}/>
    <div className="welcome-banner"><div><span className="welcome-label">CHỦ NHẬT, 01 THÁNG 11, 2026</span><h2>Chào buổi chiều, Admin! <span>✦</span></h2><p>Dưới đây là tình hình hoạt động của tòa nhà hôm nay.</p></div><div className="banner-art"><div className="art-building"><div/><div/><div/><div/><div/><div/></div><div className="art-sun"/></div></div>
    <div className="section-title"><div><h3>Chỉ số hoạt động</h3><p>Tổng quan dữ liệu hiện tại</p></div><span className="period-pill">Tháng 11, 2026 <ChevronDown size={14}/></span></div>
    <div className="stats-grid">
      <Stat label="Tổng số phòng" value={rooms.length} sub="Phòng trong hệ thống" icon={Building2} tone="blue" trend="Tổng quan"/>
      <Stat label="Phòng đang thuê" value={occupied} sub={`${rooms.length ? Math.round(occupied/rooms.length*100) : 0}% tổng số phòng`} icon={DoorOpen} tone="purple" trend="Đang sử dụng"/>
      <Stat label="Phòng còn trống" value={available} sub="Sẵn sàng cho thuê" icon={CheckCircle2} tone="green" trend="Có thể thuê"/>
      <Stat label="Doanh thu đã thu" value={money(revenue)} sub={`${paid}/${invoices.length} hóa đơn đã thu`} icon={Wallet} tone="orange" trend="Đã thanh toán"/>
    </div>
    <div className="dashboard-grid"><div className="panel"><div className="panel-head"><div><h3>Tình trạng phòng</h3><p>Phân bổ trạng thái phòng hiện tại</p></div><button className="text-button" onClick={() => setPage('Rooms')}>Xem tất cả →</button></div><div className="occupancy"><div className="donut" style={{'--progress':`${rooms.length ? occupied/rooms.length*100 : 0}%`}}><div><b>{rooms.length ? Math.round(occupied/rooms.length*100) : 0}%</b><small>Lấp đầy</small></div></div><div className="legend"><div><i className="dot purple-dot"/><span>Đang thuê</span><b>{occupied}</b></div><div><i className="dot green-dot"/><span>Còn trống</span><b>{available}</b></div><div><i className="dot orange-dot"/><span>Bảo trì</span><b>{rooms.filter(r=>r.status==='Bảo trì').length}</b></div></div></div></div>
    <div className="panel"><div className="panel-head"><div><h3>Hợp đồng gần đây</h3><p>Các hợp đồng mới nhất</p></div><button className="text-button" onClick={() => setPage('Contracts')}>Xem tất cả →</button></div><div className="recent-list">{contracts.slice(0,4).map(c=><div className="recent-row" key={c.id}><div className="recent-avatar">{c.tenant.split(' ').slice(-1)[0][0]}</div><div className="recent-info"><b>{c.tenant}</b><small>Phòng {c.room} · {date(c.start_date)}</small></div><Status value={c.status}/></div>)}</div></div></div>
    <div className="panel table-panel"><div className="panel-head"><div><h3>Hóa đơn gần đây</h3><p>Theo dõi các khoản thu mới nhất</p></div><button className="text-button" onClick={() => setPage('Invoices')}>Xem tất cả →</button></div><InvoiceTable invoices={invoices.slice(0,4)} compact/></div>
  </>;
}
function Toolbar({query,setQuery,placeholder,button,onAdd}) {
  return <div className="toolbar"><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder}/><kbd>⌘ K</kbd></div><button className="filter-btn" onClick={() => setQuery('')}><SlidersHorizontal size={16}/> Xóa lọc</button>{button && <button className="btn btn-primary" onClick={onAdd}><Plus size={17}/>{button}</button>}</div>;
}
function Status({value}) {
  const cls = value?.includes('Đã thanh toán') || value?.includes('Còn trống') || value?.includes('Hoạt động') ? 'success' : value?.includes('Đang') || value?.includes('Chưa') ? 'warning' : value?.includes('Bảo trì') ? 'danger' : 'neutral';
  return <span className={`status ${cls}`}><i/>{value}</span>;
}
function ActionMenu({onEdit,onDelete}) { return <div className="row-actions"><button title="Sửa" onClick={onEdit}><Pencil size={15}/></button><button title="Xóa" onClick={onDelete}><Trash2 size={15}/></button></div>; }
function Rooms({rooms,allRooms,onAdd,onEdit,onDelete,query,setQuery}) {
  return <><PageHeading eyebrow="PROPERTY" title="Quản lý phòng" description="Quản lý danh sách, tình trạng và thông tin các phòng cho thuê."/><div className="mini-stats"><div><span>Tổng số phòng</span><b>{allRooms.length}</b></div><div><span>Đang cho thuê</span><b>{allRooms.filter(r=>r.status==='Đang thuê').length}</b></div><div><span>Còn trống</span><b>{allRooms.filter(r=>r.status==='Còn trống').length}</b></div><div><span>Đang bảo trì</span><b>{allRooms.filter(r=>r.status==='Bảo trì').length}</b></div></div><Toolbar query={query} setQuery={setQuery} placeholder="Tìm theo số phòng, tên phòng..." button="Thêm phòng" onAdd={onAdd}/><div className="panel table-panel"><div className="panel-head"><div><h3>Danh sách phòng</h3><p>{rooms.length} phòng được tìm thấy</p></div><span className="table-note">Cập nhật theo dữ liệu hệ thống</span></div><div className="table-wrap"><table><thead><tr><th>PHÒNG</th><th>TẦNG</th><th>DIỆN TÍCH</th><th>GIÁ THUÊ / THÁNG</th><th>SỨC CHỨA</th><th>TRẠNG THÁI</th><th></th></tr></thead><tbody>{rooms.map(r=><tr key={r.id}><td><div className="room-cell"><div className="room-thumb"><DoorOpen size={18}/></div><div><b>{r.room_number}</b><small>{r.room_name}</small></div></div></td><td>Tầng {r.floor}</td><td>{r.area} m²</td><td className="amount">{money(r.price)}</td><td>{r.max_occupancy} người</td><td><Status value={r.status}/></td><td><ActionMenu onEdit={()=>onEdit(r)} onDelete={()=>onDelete(r.id)}/></td></tr>)}</tbody></table>{rooms.length===0&&<Empty/>}</div></div></>;
}
function Contracts({contracts,users,rooms,onAdd,onEdit,onDelete,query,setQuery}) {
  return <><PageHeading eyebrow="LEASE MANAGEMENT" title="Quản lý hợp đồng" description="Theo dõi thông tin thuê phòng, thời hạn và tiền đặt cọc."/><Toolbar query={query} setQuery={setQuery} placeholder="Tìm theo người thuê, số phòng..." button="Tạo hợp đồng" onAdd={onAdd}/><div className="panel table-panel"><div className="panel-head"><div><h3>Danh sách hợp đồng</h3><p>{contracts.length} hợp đồng trong hệ thống</p></div></div><div className="table-wrap"><table><thead><tr><th>MÃ HĐ</th><th>NGƯỜI THUÊ</th><th>PHÒNG</th><th>NGÀY BẮT ĐẦU</th><th>NGÀY KẾT THÚC</th><th>TIỀN ĐẶT CỌC</th><th>TRẠNG THÁI</th><th></th></tr></thead><tbody>{contracts.map(c=><tr key={c.id}><td className="muted">#HD-{String(c.id).padStart(4,'0')}</td><td><b>{c.tenant}</b></td><td><span className="room-code">{c.room}</span></td><td>{date(c.start_date)}</td><td>{date(c.end_date)}</td><td className="amount">{money(c.deposit)}</td><td><Status value={c.status}/></td><td><ActionMenu onEdit={()=>onEdit(c)} onDelete={()=>onDelete(c.id)}/></td></tr>)}</tbody></table>{contracts.length===0&&<Empty/>}</div></div></>;
}
function InvoiceTable({invoices,compact=false,onEdit,onDelete}) {
 return <div className="table-wrap"><table><thead><tr><th>MÃ HÓA ĐƠN</th><th>PHÒNG / NGƯỜI THUÊ</th><th>KỲ THANH TOÁN</th><th>TỔNG TIỀN</th><th>TRẠNG THÁI</th>{!compact&&<th></th>}</tr></thead><tbody>{invoices.map(i=><tr key={i.id}><td className="muted">#INV-{String(i.id).padStart(4,'0')}</td><td><div><b>{i.room}</b><small className="sub-cell">{i.tenant}</small></div></td><td>Tháng {i.month}/{i.year}</td><td className="amount">{money(i.total_amount)}</td><td><Status value={i.status}/></td>{!compact&&<td><ActionMenu onEdit={()=>onEdit(i)} onDelete={()=>onDelete(i.id)}/></td>}</tr>)}</tbody></table>{invoices.length===0&&<Empty/>}</div>;
}
function Invoices({invoices,onAdd,onEdit,onDelete,query,setQuery}) {
 const total = invoices.reduce((s,i)=>s+i.total_amount,0);
 return <><PageHeading eyebrow="BILLING" title="Quản lý hóa đơn" description="Theo dõi chi phí hàng tháng và tình trạng thanh toán của người thuê."/><div className="mini-stats"><div><span>Tổng hóa đơn đang hiển thị</span><b>{invoices.length}</b></div><div><span>Tổng giá trị</span><b>{money(total)}</b></div><div><span>Đã thanh toán</span><b>{invoices.filter(i=>i.status==='Đã thanh toán').length}</b></div><div><span>Chưa thanh toán</span><b>{invoices.filter(i=>i.status==='Chưa thanh toán').length}</b></div></div><Toolbar query={query} setQuery={setQuery} placeholder="Tìm theo mã, phòng, người thuê..." button="Tạo hóa đơn" onAdd={onAdd}/><div className="panel table-panel"><div className="panel-head"><div><h3>Danh sách hóa đơn</h3><p>{invoices.length} hóa đơn được tìm thấy</p></div></div><InvoiceTable invoices={invoices} onEdit={onEdit} onDelete={onDelete}/></div></>;
}
function UsersPage({users,onAdd,onEdit,onDelete,query,setQuery}) {
 return <><PageHeading eyebrow="ACCESS CONTROL" title="Người dùng" description="Quản lý tài khoản, thông tin liên hệ và vai trò trong hệ thống."/><Toolbar query={query} setQuery={setQuery} placeholder="Tìm theo tên, username, email..." button="Thêm người dùng" onAdd={onAdd}/><div className="panel table-panel"><div className="panel-head"><div><h3>Danh sách người dùng</h3><p>{users.length} tài khoản</p></div></div><div className="table-wrap"><table><thead><tr><th>NGƯỜI DÙNG</th><th>USERNAME</th><th>EMAIL</th><th>SỐ ĐIỆN THOẠI</th><th>VAI TRÒ</th><th>TRẠNG THÁI</th><th></th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td><div className="user-cell"><div className="user-avatar">{u.full_name.split(' ').slice(-1)[0][0]}</div><b>{u.full_name}</b></div></td><td className="muted">@{u.username}</td><td>{u.email}</td><td>{u.phone_number}</td><td><span className="role-pill">{u.role}</span></td><td><Status value={u.status}/></td><td><ActionMenu onEdit={()=>onEdit(u)} onDelete={()=>onDelete(u.id)}/></td></tr>)}</tbody></table>{users.length===0&&<Empty/>}</div></div></>;
}
function Empty(){return <div className="empty-state">Không tìm thấy dữ liệu phù hợp.</div>}

function Modal({type,editing,users,rooms,contracts,onClose,onSave}) {
 const title = {room:'phòng',user:'người dùng',contract:'hợp đồng',invoice:'hóa đơn'}[type];
 const [form,setForm] = useState(() => {
   if(editing) return {...editing};
   if(type==='room') return {room_number:'',room_name:'',floor:1,area:'',price:'',max_occupancy:2,status:'Còn trống',description:''};
   if(type==='user') return {username:'',full_name:'',email:'',phone_number:'',role:'Người thuê',status:'Hoạt động'};
   if(type==='contract') return {user_id:users[0]?.id||'',room_id:rooms.find(r=>r.status==='Còn trống')?.id||rooms[0]?.id||'',start_date:'2026-11-01',end_date:'2027-10-31',deposit:'',status:'Đang hiệu lực'};
   return {contract_id:contracts[0]?.id||'',month:11,year:2026,room_price:'',electricity_cost:0,water_cost:0,other_fees:0,total_amount:0,status:'Chưa thanh toán'};
 });
 const set = (key,value) => setForm(f=>({...f,[key]:value}));
 const field = (label,key,opts={}) => <label className="form-field"><span>{label}</span>{opts.options ? <select value={form[key]??''} onChange={e=>set(key,e.target.value)}>{opts.options.map(o=><option value={o.value} key={o.value}>{o.label}</option>)}</select> : opts.textarea ? <textarea rows="3" value={form[key]??''} onChange={e=>set(key,e.target.value)} /> : <input type={opts.type||'text'} min={opts.min} step={opts.step} value={form[key]??''} onChange={e=>set(key,e.target.value)} placeholder={opts.placeholder||''} required={opts.required!==false}/> }</label>;
 const submit = e => { e.preventDefault(); let data={...form}; if(type==='room'){['floor','area','price','max_occupancy'].forEach(k=>data[k]=Number(data[k]));} if(type==='contract'){data.user_id=Number(data.user_id);data.room_id=Number(data.room_id);data.deposit=Number(data.deposit);data.tenant=users.find(u=>u.id===data.user_id)?.full_name||'Chưa chọn';data.room=rooms.find(r=>r.id===data.room_id)?.room_number||'—';} if(type==='invoice'){['contract_id','month','year','room_price','electricity_cost','water_cost','other_fees'].forEach(k=>data[k]=Number(data[k]));data.total_amount=data.room_price+data.electricity_cost+data.water_cost+data.other_fees;const c=contracts.find(x=>x.id===data.contract_id);data.room=c?.room||'—';data.tenant=c?.tenant||'—';} onSave(data); };
 const total = Number(form.room_price||0)+Number(form.electricity_cost||0)+Number(form.water_cost||0)+Number(form.other_fees||0);
 return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><form className="modal" onSubmit={submit}><div className="modal-head"><div><span className="eyebrow">{editing?'UPDATE':'CREATE NEW'}</span><h2>{editing?'Chỉnh sửa':'Thêm'} {title}</h2></div><button type="button" className="icon-btn" onClick={onClose}><X size={19}/></button></div><div className="modal-body">
 {type==='room'&&<div className="form-grid">{field('Số phòng','room_number')}{field('Tên phòng','room_name')}{field('Tầng','floor',{type:'number'})}{field('Diện tích (m²)','area',{type:'number',step:'0.1'})}{field('Giá thuê (VNĐ/tháng)','price',{type:'number'})}{field('Số người tối đa','max_occupancy',{type:'number'})}{field('Trạng thái','status',{options:['Còn trống','Đang thuê','Bảo trì'].map(x=>({value:x,label:x}))})}{field('Mô tả','description',{textarea:true})}</div>}
 {type==='user'&&<div className="form-grid">{field('Họ và tên','full_name')}{field('Tên đăng nhập','username')}{field('Email','email',{type:'email'})}{field('Số điện thoại','phone_number')}{field('Vai trò','role',{options:['Người thuê','Admin'].map(x=>({value:x,label:x}))})}{field('Trạng thái','status',{options:['Hoạt động','Tạm khóa'].map(x=>({value:x,label:x}))})}</div>}
 {type==='contract'&&<div className="form-grid">{field('Người thuê','user_id',{options:users.map(u=>({value:u.id,label:u.full_name}))})}{field('Phòng','room_id',{options:rooms.map(r=>({value:r.id,label:`${r.room_number} - ${r.room_name}`}))})}{field('Ngày bắt đầu','start_date',{type:'date'})}{field('Ngày kết thúc','end_date',{type:'date'})}{field('Tiền đặt cọc (VNĐ)','deposit',{type:'number'})}{field('Trạng thái','status',{options:['Đang hiệu lực','Đã kết thúc','Đã hủy'].map(x=>({value:x,label:x}))})}</div>}
 {type==='invoice'&&<><div className="form-grid">{field('Hợp đồng','contract_id',{options:contracts.map(c=>({value:c.id,label:`${c.room} - ${c.tenant}`}))})}{field('Tháng','month',{type:'number',min:1})}{field('Năm','year',{type:'number'})}{field('Tiền phòng (VNĐ)','room_price',{type:'number'})}{field('Tiền điện (VNĐ)','electricity_cost',{type:'number'})}{field('Tiền nước (VNĐ)','water_cost',{type:'number'})}{field('Chi phí khác (VNĐ)','other_fees',{type:'number'})}{field('Trạng thái','status',{options:['Chưa thanh toán','Đã thanh toán'].map(x=>({value:x,label:x}))})}</div><div className="total-preview"><span>Tổng tiền dự kiến</span><b>{money(total)}</b></div></>}
 </div><div className="modal-footer"><button type="button" className="btn btn-light" onClick={onClose}>Hủy</button><button className="btn btn-primary" type="submit">{editing?'Lưu thay đổi':'Lưu dữ liệu'}</button></div></form></div>;
}

export default App;