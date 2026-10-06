# Tài Liệu Mô Tả Bố Cục Giao Diện (UI Layout) - Việt Phục Remix

## 1. Tổng quan
- **Mục đích:** "Việt Phục Remix" là web app tương tác giúp người dùng trẻ (Gen Z) khám phá, phối đồ, và trải nghiệm cổ phục Việt Nam (qua AI sinh ảnh và WebAR).
- **Các màn hình/route chính:**
  1. Trang Chủ (Home)
  2. Phối Đồ (Mixer)
  3. Thử AR (WebAR)
  4. Khám Phá (Explore)
  5. So Sánh (Compare)
  6. Lookbook
  7. Hub Văn Hoá (Culture)
- **Phong cách thị giác (Visual Style):**
  - **Bảng màu:** Đen Sơn Mài (`#1C1917`) kết hợp Vàng đồng (`#C9A15A`) và Đỏ trầm (`#7A1F2B`).
  - **Đường nét:** Phong cách Glassmorphism (Kính mờ) cho các thẻ/bảng điều khiển, bo góc lớn hoặc bo tròn hoàn toàn cho nút bấm (`border-radius: 9999px`).
  - **Chữ (Typography):** Sử dụng `Fraunces` cho các tiêu đề (mang tính cổ điển, sang trọng) và `Be Vietnam Pro` cho nội dung đọc.
  - **Hiệu ứng nền:** Tích hợp bộ tạo hiệu ứng thời tiết toàn trang (WeatherFX) tương ứng với thời tiết thực tế và hiệu ứng cánh hoa sen rơi (`LotusPetals`).

---

## 2. Thành phần dùng chung (Layout toàn app)

**Thanh điều hướng trên cùng (Top Navbar):**
- **Vị trí:** Dính chặt (sticky) ở đỉnh trang, nền kính mờ.
- **Trái:** Nhãn hiệu "Việt Phục Remix" (Chữ Remix tô màu gradient), kèm Logo có thể tuỳ chỉnh biến thể (Emblem/Crest).
- **Giữa (Nav Links):** Các nút chuyển tab dạng chữ (Trang Chủ, Phối Đồ, ✨ Thử AR, Khám Phá, So Sánh, Lookbook, Văn Hoá). Tab đang active được bôi nền vàng đồng nhạt và đổi màu chữ thành vàng. Nút So Sánh & Lookbook có hiển thị `badge` đếm số lượng nếu có dữ liệu.
- **Phải (Controls):** Nhóm các nút cài đặt hệ thống:
  - Widget thời tiết (kèm chấm nháy xanh báo live, nhiệt độ & thành phố).
  - Trình phát nhạc (MusicPlayer).
  - Nút Cánh sen 🌸 (Bật/tắt hiệu ứng cánh hoa).
  - Nút Đổi ngôn ngữ (🇻🇳 / 🇬🇧).
  - Nút Đổi Theme Sáng/Tối (☀️ / 🌙).

**Các Overlay dùng chung:**
- **ChatBot AI:** Biểu tượng nổi ở góc dưới, mở ra khung chat tư vấn văn hoá.
- **Toast Notification:** Hiển thị tự động ẩn ở góc màn hình (ví dụ: "✨ Đã đổi sang Áo tấc!").
- **Footer:** Chứa phần thông tin thương hiệu đơn giản, đường viền mờ.

---

## 3. Mô tả từng màn hình

### 3.1. Trang Chủ (Home)
- **Component chính:** `HeroCarousel`, `App.jsx`
- **Wireframe:**
```text
  ┌ Top Navbar ───────────────────────────────────┐
  ├ Hero Carousel (Ảnh chiếm toàn bề ngang)       ┤
  ├ Lối Tắt Sự Kiện (4 thẻ xếp ngang)             ┤
  ├ Bản đồ Việt Nam Tương Tác                     ┤
  ├ Mẹo Văn Hoá Hàng Ngày (Card)                  ┤
  └ Footer ───────────────────────────────────────┘
```
- **Lối tắt sự kiện:** Gồm 4 thẻ (Tết, Tốt nghiệp, Đám cưới, Kỷ yếu). Mỗi thẻ có icon Emoji, Tiêu đề phụ, và mô tả ngắn. Hiệu ứng kính mờ (glass-panel), hover nổi lên.

### 3.2. Phối Đồ (Mixer)
- **Component chính:** `OutfitCustomizer.jsx`, `SceneSelector.jsx`
- **Wireframe:**
```text
  ┌ Top Navbar ───────────────────────────────────┐
  ├ Thanh Tiến Trình (Sticky Stepper 1 - 2 - 3 - 4)┤
  ├ BƯỚC 1: Chọn Sự Kiện (Các thẻ card ảnh)       ┤
  ├ BƯỚC 2: Chọn Cổ Phục (Grid trang phục)        ┤
  ├ BƯỚC 3: Tuỳ chỉnh (Bảng màu + Phụ kiện)       ┤
  ├ BƯỚC 4: Xem trước 360° (Nút bấm tạo AI)       ┤
  └───────────────────────────────────────────────┘
```
- **Thành phần tương tác:**
  - **Cảnh báo văn hoá (Mismatch Warning):** Bảng thông báo màu cam/đỏ xuất hiện giữa Bước 2 và Bước 3 nếu chọn trang phục không hợp hoàn cảnh.
  - **Tuỳ chỉnh:** Chọn hệ màu (Primary, Secondary, Accent), check-box chọn Phụ kiện đính kèm.
  - **Trạng thái Sinh Ảnh (Loading):** Thanh progress bar hiện phần trăm tạo ảnh, xoay loading.

### 3.3. Thử AR (WebAR)
- **Component chính:** `WebARPage.jsx`, `CameraView.jsx`
- **Wireframe:**
```text
  ┌ Header: [← Quay lại]  [Tiêu đề]  [🪞] [Dropdown Camera] [🛠️] ┐
  ├ Khung hiển thị Camera (Bao phủ màn hình, 16:9 hoặc 9:16)       ┤
  │    (Chấm xanh báo trạng thái: Đã nhận diện khuôn mặt ✓)          │
  ├ Thanh chọn phụ kiện (Cuộn ngang - Khăn Đóng, Nón Lá,...)       ┤
  ├ Thanh hành động: [Tắt Cam]      [(📸)]      [✕ Thoát]         ┤
  └──────────────────────────────────────────────────────────────┘
```
- **Tương tác:** Dropdown chọn Camera (Liệt kê tất cả webcam khả dụng trên PC). Nút chụp ảnh chính giữa có vòng lặp tròn (Shutter ring).
- **Trạng thái:**
  - Khởi động: "Đang khởi động camera..." kèm vòng tròn xoay.
  - Khi chưa thấy mặt: "Hãy đưa khuôn mặt vào giữa khung hình."
  - Khi lỗi quyền: Bảng cảnh báo (Warning Banner) hướng dẫn nhấn ổ khoá trên trình duyệt.

### 3.4. So Sánh (Compare)
- **Component chính:** `OutfitComparison.jsx`
- **Wireframe:**
```text
  ┌ Top Navbar ───────────────────────────────────┐
  ├ Tiêu đề So Sánh & Nút [Nạp mẫu so sánh]       ┤
  ├ Cột 1 (Phương án A)      | Cột 2 (Phương án B)┤
  ├ Hình ảnh 360 / Thumbnail | Hình ảnh 360       ┤
  ├ Điểm số (Harmony, GenZ)  | Điểm số            ┤
  ├ Danh sách phụ kiện       | Danh sách phụ kiện ┤
  └───────────────────────────────────────────────┘
```

*(Các màn hình Khám Phá, Lookbook, và Culture mang cấu trúc tương tự dạng Lưới ảnh / Bảng điều khiển)*

---

## 4. Responsive
- **Breakpoints chính:** Desktop (>992px), Tablet (<991px), Mobile (<600px).
- **Mobile Behavior:**
  - **Bottom Navigation:** Trên điện thoại, Top Navbar được thu gọn bớt và thay thế bởi `MobileBottomNav` gắn ở cạnh dưới màn hình, chứa 4-5 icon chính giúp bấm bằng ngón cái dễ dàng.
  - **Lưới (Grid):** Các thẻ "Lối tắt sự kiện" xếp 4 cột trên Desktop sẽ chuyển thành 2 cột trên Tablet, và 1 cột (xếp chồng dọc) trên Mobile.
  - **WebAR:** Khung camera tự động nhận dạng tỉ lệ (aspect ratio). Nếu bề ngang nhỏ hơn chiều cao, camera sẽ hiển thị lấp đầy theo dạng Portrait (Crop bề ngang) thay vì bị méo.
  - **Giao diện chia đôi (Split Layout):** Khu vực Tuỳ chỉnh & Sinh ảnh AI chuyển từ 2 cột trái-phải sang xếp chồng (Cột điều khiển nằm trên, Ảnh sinh ra nằm dưới).

---

## 5. Hệ thống thiết kế (Design System)

- **Bảng màu (Color Palette):**
  - `--color-bg-primary`: `#1C1917` (Nền Đen Sơn Mài)
  - `--color-text-primary`: `#F7F3EC` (Chữ Trắng Ngà)
  - `--color-gold`: `#C9A15A` (Màu nhấn Vàng Đồng)
  - `--color-red-hue`: `#7A1F2B` (Màu Đỏ trầm)
- **Cấu trúc chữ (Typography):**
  - Font chính (Heading): `Fraunces`
  - Font nội dung (Sans): `Be Vietnam Pro`
- **Thành phần & Kích thước (Spacings):**
  - Nút bấm (`.btn`): Padding `0.75rem 2rem`, bo tròn hoàn toàn (`--radius-full: 9999px`).
  - Thẻ (`.glass-panel`): Nền kính mờ `rgba(255, 255, 255, 0.03)` kèm border mỏng `rgba(247, 243, 236, 0.1)`, bo góc `8px - 12px`.
- **Hiệu ứng (Animations):**
  - Nhấn nút (Hover): Nổi lên (TranslateY) và đổi viền sang màu vàng đồng.
  - Chuyển trang/Tải ảnh: Fade-in chậm (`0.8s`).

---

## 6. Nhận xét
- **Điểm mạnh:** Thiết kế giao diện Glassmorphism kết hợp Đen/Vàng mang lại cảm giác vô cùng sang trọng, đậm chất di sản nhưng vẫn rất hiện đại (đúng tinh thần "Remix"). Hệ thống chuyển cảnh mượt mà.
- **Điểm cần lưu ý:**
  - Trên màn hình tablet hẹp, các nút menu trên Navbar có thể bị chèn lấn nhau do số lượng tab khá nhiều. Nên cân nhắc gom nhóm hoặc cuộn ngang.
  - Màn hình WebAR đôi khi có phần text hướng dẫn hơi nhỏ trên màn hình di động, có thể khó đọc khi ra ngoài trời.
  - Tính năng thời tiết rơi (Canvas) cần đảm bảo tự động ngưng (Pause) khi chuyển sang tab khác để tiết kiệm hiệu năng thiết bị.
