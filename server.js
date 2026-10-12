const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GUEST_FILE = path.join(__dirname, 'guests.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API nhận thông tin đăng nhập/nhập tên từ khách mời
app.post('/api/login', (req, res) => {
    const { fullname } = req.body;
    if (!fullname || fullname.trim() === '') {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập họ và tên!' });
    }

    const newGuest = {
        fullname: fullname.trim(),
        time: new Date().toLocaleString('vi-VN')
    };

    // Đọc danh sách cũ hoặc tạo mới file guests.json
    let guests = [];
    if (fs.existsSync(GUEST_FILE)) {
        try {
            const data = fs.readFileSync(GUEST_FILE, 'utf8');
            guests = JSON.parse(data);
        } catch (err) {
            guests = [];
        }
    }

    // Thêm khách mới vào danh sách
    guests.push(newGuest);
    fs.writeFileSync(GUEST_FILE, JSON.stringify(guests, null, 2), 'utf8');

    // Phản hồi thành công và trả về tên để chuyển trang
    res.json({ success: true, fullname: newGuest.fullname });
});

// API cho phép bạn check danh sách khách mời qua trình duyệt (hoặc xem file guests.json trực tiếp)
app.get('/admin/guests', (req, res) => {
    if (fs.existsSync(GUEST_FILE)) {
        const data = fs.readFileSync(GUEST_FILE, 'utf8');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.send(data);
    } else {
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`Link truy cập thiệp (BẤT NGỜ Ở ĐÂY): http://localhost:${PORT}`);
    console.log(`Link kiểm tra danh sách khách: http://localhost:${PORT}/admin/guests`);
});