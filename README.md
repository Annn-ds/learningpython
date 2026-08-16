# learningpython

Trang web cá nhân theo dõi quá trình học Python: video bài giảng (nhúng từ YouTube), ghi chú, và nhật ký bài học + bài tập mỗi ngày.

## Tính năng
- **Video**: thêm link YouTube, tự nhúng player, lưu theo ngày học.
- **Ghi chú**: ghi lại kiến thức học được, có tiêu đề và ngày.
- **Bài học**: tóm tắt nội dung học mỗi buổi kèm danh sách bài tập có thể tick hoàn thành.

Dữ liệu được lưu trong `localStorage` của trình duyệt (không cần backend).

## Chạy thử local
Mở trực tiếp `index.html` bằng trình duyệt, hoặc dùng một static server bất kỳ.

## Deploy bằng GitHub Pages
1. Push code lên nhánh `main`.
2. Vào **Settings → Pages** của repo, chọn source là nhánh `main`, thư mục `/ (root)`.
3. Trang sẽ có tại `https://<username>.github.io/learningpython/`.
