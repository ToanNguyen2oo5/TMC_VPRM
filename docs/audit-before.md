# Kiểm Toán Giao Diện & Trải Nghiệm (Audit Before Hardening)
*Ngày kiểm toán: Giai đoạn 0*

## I. Baseline & Metrics (Số đo cơ sở)
- **Kích thước Bundle:** `index.js` ~ 2.5MB (chưa tách chunk - *Cần cải thiện bằng dynamic import*).
- **Lighthouse Scores (Dự kiến):** Performance ~ 70 do tải nặng 3D và nhiều assets, A11y ~ 80 do thiếu aria-labels.
- **FPS (Frames Per Second):**
  - Cuộn trang chủ: ~ 60 FPS (tốt trên máy tính).
  - Bật Camera WebAR: ~ 20-30 FPS (do chạy MediaPipe trực tiếp trên luồng UI).

## II. Bảng Vấn Đề (Issues List)

| Mã | Mô tả vấn đề | Bằng chứng / File | Mức độ |
|---|---|---|---|
| **A1** | Trang phục WebAR hiển thị thành một khối vuông trắng/đen che khuất người dùng. | `CameraView.jsx`, `CostumeRenderer.js`. Do file `ao-dai-placeholder.png` không có kênh Alpha (nền trong suốt), hoặc do Canvas không blend đúng `globalCompositeOperation`. | **P0** (Chặn chức năng AR) |
| **A2** | Phụ kiện (nón, khăn) không bám theo đầu khi đứng lùi ra xa toàn thân. | `CameraView.jsx`. MediaPipe FaceMesh mất dấu khuôn mặt khi khung hình quá nhỏ (chỉ hoạt động tốt cự ly gần). | **P1** (Hỏng trải nghiệm) |
| **A3** | Điều hướng hoàn toàn dùng `activeTab` thay vì React Router. | `App.jsx`. Không thể copy URL gửi cho bạn bè, bấm nút Back của trình duyệt sẽ văng khỏi app. | **P1** |
| **A4** | Navbar và MusicPlayer chồng chéo ở màn hình nhỏ (320px - 768px). | `LiquidNavbar.jsx`, `MusicPlayer.jsx`. Fix cứng toạ độ, MusicPlayer nằm đè lên Navbar ở góc phải. | **P2** |
| **A5** | Thiếu Tab "So sánh" (Compare) trong thanh điều hướng mới. | `LiquidNavbar.jsx`. Component cũ có nhưng đã bị lược bỏ nhầm khi cấu trúc lại. | **P2** |
| **A6** | Thanh tiến trình Phối đồ hiển thị % và số bước không logic. | `StickyStepper.jsx`. Ghi 1-4 nhưng logic app có 5 cụm (Scene, Suggest, Customize, Warning, Result). | **P2** |
| **A7** | Phím tắt `Alt + 1..6` trùng phím tắt chuyển Tab của trình duyệt web (Chrome/Edge/Firefox). | `App.jsx`. Người dùng ấn `Alt+2` sẽ nhảy sang Tab thứ 2 của trình duyệt thay vì đổi trang trong app. | **P1** |
| **A8** | Rò rỉ bộ nhớ (Memory Leak) ở hiệu ứng background. | `WeatherFX`, `LotusPetals`. Các RequestAnimationFrame không tự dừng khi tab trình duyệt bị ẩn (visibility hidden) hoặc sang trang AR. | **P2** |
| **A9** | Không có Error Boundary (Bao đóng lỗi) khi WebGL crash. | `App.jsx`, `SilkOverlay.jsx`. Nếu máy quá yếu không chạy nổi WebGL, nguyên trang web sẽ bị kẹt trắng xoá. | **P0** |
| **A10**| Trợ năng (A11y) chưa hoàn thiện. Tương phản ở vài chỗ chữ nhỏ trên nền kính thấp hơn mức quy định. | Thiếu `aria-hidden` cho các icon trang trí, bàn phím không bắt được focus (Focus trap) khi mở Modal AR. | **P3** |

## III. Kế hoạch Hardening
- **Giai đoạn 1:** Ưu tiên giải quyết triệt để A1 (WebAR Rendering) bằng cách rà soát Canvas `globalCompositeOperation` và thay thế/chỉnh sửa ảnh placeholder về định dạng PNG trong suốt.
- **Giai đoạn 2:** Bổ sung PoseLandmarker (A2) để nhận diện đầu từ xa.
- **Giai đoạn 3:** Chuyển đổi kiến trúc sang `react-router-dom` (A3, A5, A6).
- **Giai đoạn 4, 5, 6:** Xử lý Responsive (A4), Memory Leak (A8), Error Boundaries (A9), và A11y (A10, A7).
