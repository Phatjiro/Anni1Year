# WORKSPACE DESIGN & CODE RULES

Tất cả các agent khi lập trình và thiết kế giao diện cho dự án này bắt buộc phải tuân thủ nghiêm ngặt các quy tắc sau:

---

## 1. QUY TẮC ICON & HÌNH HỌC (NO DEFAULT ICONS)
- **Tuyệt đối không dùng emoji hệ thống hoặc icon mặc định** làm thành phần giao diện chính (như ❤️, 🎵, 💌, ⭐, biểu tượng unicode thô).
- **Sử dụng Inline SVG cao cấp hoặc SVG symbols được vẽ trau chuốt**:
  - Mọi icon phải được chuẩn hóa viewBox (ví dụ: `0 0 24 24`), stroke-width đồng nhất (thường là `1.5` hoặc `2`), stroke-linecap và stroke-linejoin `round`.
  - Có thể phối hợp hiệu ứng phát sáng nhẹ (`filter: drop-shadow(...)`), màu chuyển sắc gradient hoặc micro-animation (xoay, đập nhẹ, đổi màu) khi tương tác.
  - Phải có kích thước cố định theo hệ thống spacing (`16px`, `20px`, `24px`, `32px`).

---

## 2. QUY TẮC COMMENT TRONG CODE (ZERO CODE COMMENTS)
- **Tuyệt đối KHÔNG viết comment trong bất kỳ file code nào**:
  - Không có comment `<!-- ... -->` trong HTML.
  - Không có comment `/* ... */` trong CSS.
  - Không có comment `// ...` hay `/* ... */` trong JavaScript / TypeScript.
- **Code phải tự giải thích (Self-explanatory)**:
  - Tên biến, tên hàm, class CSS và ID phải có tính ngữ nghĩa cao (Semantic Naming).
  - Cấu trúc module rõ ràng, gọn gàng và tường minh.

---

## 3. QUY TẮC TYPOGRAPHY & TIẾNG VIỆT (CONSISTENT VIETNAMESE TYPOGRAPHY)

### 3.1. Lựa chọn Font chữ
- Chỉ sử dụng các font có hỗ trợ đầy đủ ký tự và dấu tiếng Việt (Vietnamese Subsets / Latin Extended), tuyệt đối không để xảy ra tình trạng lỗi font (tofu) hay lệch chân chữ.
- **Phân định rõ 3 họ font chủ đạo**:
  1. `Display / Serif Font` (Tiêu đề, ngày tháng trang trọng): **'Playfair Display', serif** - Độ tương phản nét thanh nét đậm sang trọng.
  2. `Cursive / Script Font` (Lời đề tựa, dòng nhật ký chữ viết tay mềm mại): **'Dancing Script', cursive** hoặc **'Alex Brush', cursive**.
  3. `Body / Sans-Serif Font` (Nội dung nhật ký dài, nút bấm, thông tin chi tiết): **'Be Vietnam Pro', 'Quicksand', sans-serif** - Nét tròn trịa, thanh thoát, dễ đọc trên màn hình điện thoại.

### 3.2. Hệ thống Font Size Scale (Đồng nhất qua CSS Variables)
Mọi kích thước chữ phải tuân theo hệ thống thang bậc cố định trong `:root`, không dùng kích thước tùy hứng (ad-hoc):
```css
:root {
  --font-display: 'Playfair Display', serif;
  --font-script: 'Dancing Script', cursive;
  --font-body: 'Be Vietnam Pro', sans-serif;

  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-md: 1.125rem;   /* 18px */
  --text-lg: 1.25rem;    /* 20px */
  --text-xl: 1.5rem;     /* 24px */
  --text-2xl: 2rem;      /* 32px */
  --text-3xl: 2.5rem;    /* 40px */
  --text-hero: clamp(2.5rem, 7vw, 4.5rem);
}
```

### 3.3. Quy chuẩn dấu và khoảng cách hiển thị tiếng Việt
- `line-height` cho tiếng Việt tối thiểu từ `1.6` đến `1.8` để đảm bảo các dấu mũ, dấu thanh (`?, ~, /, \, .`) không bị dính vào dòng trên hoặc dưới.
- Không áp dụng `letter-spacing` âm hoặc quá hẹp lên các font có dấu tiếng Việt.
- Sử dụng `text-rendering: optimizeLegibility` và `-webkit-font-smoothing: antialiased` để các nét thanh của chữ hiển thị mượt mà trên cả màn hình Retina và màn hình thường.

---

## 4. QUY TẮC TRẢI NGHIỆM VÀ HIỂN THỊ (RESPONSIVE & PERFORMANCE)
- Giao diện phải được tối ưu hoàn hảo trên thiết bị di động (Mobile First).
- Tỷ lệ khung hình và kích thước ảnh polaroid/gallery phải duy trì chuẩn mực không bị méo mó (`object-fit: cover`).
- Mọi chuyển động animation phải mượt mà đạt chuẩn 60fps, sử dụng `transform` và `opacity` để tránh giật lag.
