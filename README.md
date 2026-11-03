# Roomly - Frontend quản lý phòng thuê

Frontend demo xây dựng bằng React + Vite, dùng dữ liệu mẫu ở phía trình duyệt (chưa kết nối Backend/SQL Server).

## 1. Yêu cầu
- Node.js 18 trở lên
- npm

## 2. Chạy project
Mở terminal tại thư mục project và chạy:

```bash
npm install
npm run dev
```

Mở địa chỉ Vite in ra (thường là http://localhost:5173).

## 3. Chức năng đã có
- Dashboard: thống kê phòng, tỷ lệ lấp đầy, doanh thu đã thu, hợp đồng gần đây.
- Rooms: tìm kiếm, thêm, sửa, xóa phòng.
- Contracts: tìm kiếm, thêm, sửa, xóa hợp đồng; chọn người thuê và phòng từ danh sách.
- Invoices: tìm kiếm, thêm, sửa, xóa hóa đơn; tự tính tổng tiền.
- Users: tìm kiếm, thêm, sửa, xóa người dùng.

## 4. Đối chiếu với ERD
- ROOMS: room_number, room_name, floor, area, price, max_occupancy, status, description.
- USERS: username, full_name, email, phone_number.
- CONTRACTS: user_id, room_id, start_date, end_date, deposit, status.
- INVOICES: contract_id, month, year, room_price, electricity_cost, water_cost, other_fees, total_amount, status.
- ROLES và USER_ROLES: hiện thể hiện vai trò mẫu trong giao diện Users; cần bổ sung API/phân quyền thật ở Backend.

## 5. Lưu ý
Dữ liệu hiện là mock data trong `src/App.jsx`. Tải lại trang sẽ trở về dữ liệu mẫu. Khi có Backend, thay dữ liệu mẫu bằng các API như `GET /api/rooms`, `POST /api/rooms`, ... Không lưu mật khẩu thật ở FE và không đưa thông tin xác thực vào mã nguồn.
