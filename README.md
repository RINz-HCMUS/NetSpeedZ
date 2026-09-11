# NetSpeedZ - Modern Web Speedtest

Ứng dụng đo kiểm và chẩn đoán chất lượng đường truyền Internet thế hệ mới, hoạt động hoàn toàn trên trình duyệt (**Client-Side Direct**) với mạng lưới máy chủ Anycast Edge PoP tốc độ cao.

![NetSpeedZ Banner](https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80)

---

## ⚡ Tính năng nổi bật

- **Client-Side Direct & Zero-Backend:** Không cần máy chủ trung gian proxy, không lưu dữ liệu, bảo mật 100% quyền riêng tư.
- **Đo đa luồng thực tế (Multi-stream):** Đo kiểm đa luồng song song HTTP/HTTPS để kiểm tra tải tối đa của đường truyền.
- **Nhận diện Dual-Stack:** Tự động phát hiện cả địa chỉ IPv4 và IPv6 cùng thông tin nhà mạng (ISP).
- **Hệ thống đánh giá khoa học:**
  - Chấm điểm tổng quan 0–100 theo 5 phân hạng: `A+`, `A`, `B`, `C`, `D`.
  - Đánh giá chi tiết 4 tác vụ mạng: **Gaming**, **Streaming 4K**, **Video Call**, **Tải tệp lớn**.
- **Lưu trữ cục bộ (Local Storage):** Toàn bộ lịch sử kiểm tra được lưu trên trình duyệt của bạn; hỗ trợ xuất báo cáo file Excel (CSV) và JSON.
- **Giao diện hiện đại & Tối ưu di động:** Hỗ trợ Dark Mode / Light Mode, thiết kế chuẩn Responsive thích ứng mọi kích thước màn hình.

---

## 🚀 Hướng dẫn Publish miễn phí lên nền tảng thứ ba

Vì **NetSpeedZ** được xây dựng dưới dạng **Single Page Application (SPA)** với Vite và React, bạn có thể triển khai miễn phí vĩnh viễn với HTTPS và CDN toàn cầu:

### 1. Cách triển khai lên Vercel (Khuyên dùng - Nhanh nhất)
1. Đăng nhập vào [Vercel](https://vercel.com/) bằng tài khoản GitHub của bạn.
2. Bấm **"Add New..."** &rarr; Chọn **"Project"**.
3. Chọn Repository `NetSpeedZ` vừa tạo trên GitHub &rarr; Bấm **"Import"**.
4. Cấu hình tự động của Vercel:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Bấm **"Deploy"**. Trong vòng 30 giây, ứng dụng sẽ có link truy cập miễn phí dạng `ten-du-an.vercel.app` (hỗ trợ gắn tên miền riêng miễn phí).

### 2. Cách triển khai lên Cloudflare Pages
1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Chọn mục **Workers & Pages** &rarr; **Create application** &rarr; Tab **Pages** &rarr; **Connect to Git**.
3. Chọn repo `NetSpeedZ`.
4. Cấu hình Build:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Bấm **Save and Deploy**. Bạn sẽ nhận được đường dẫn `*.pages.dev` với băng thông không giới hạn!

### 3. Cách triển khai lên Netlify
1. Đăng nhập vào [Netlify](https://www.netlify.com/).
2. Chọn **"Add new site"** &rarr; **"Import an existing project"** &rarr; Chọn **GitHub**.
3. Chọn repo `NetSpeedZ`.
4. Nhấn **"Deploy NetSpeedZ"**.

---

## 💻 Cài đặt & Chạy trên máy cục bộ (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/<tai-khoan-cua-ban>/NetSpeedZ.git
cd NetSpeedZ

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Khởi chạy dev server
npm run dev

# 4. Đóng gói cho môi trường production
npm run build
```

---

## 🛠️ Công nghệ sử dụng
- **React 18** & **TypeScript**
- **Vite** (Build tool siêu tốc)
- **Tailwind CSS** (Styling & Dark mode)
- **Lucide React** (Bộ icon hiện đại)
- **HTML5 Canvas & SVG** (Đồng hồ tốc độ & Biểu đồ thời gian thực)
