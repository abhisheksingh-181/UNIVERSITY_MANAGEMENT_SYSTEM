const express = require('express');
const db = require('../database/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require auth
router.use(authMiddleware);

// ===== DASHBOARD STATS =====
router.get('/stats', (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    let stats = {};

    if (role === 'student') {
        const courses = db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE user_id = ?').get(userId);
        const avgAttendance = db.prepare('SELECT AVG(attendance) as avg FROM enrollments WHERE user_id = ?').get(userId);
        const exams = db.prepare(`
            SELECT COUNT(*) as count FROM exams e
            JOIN enrollments en ON e.course_id = en.course_id
            WHERE en.user_id = ? AND e.date >= date('now')
        `).get(userId);
        const fees = db.prepare(`
            SELECT COALESCE(SUM(amount), 0) as total FROM fees
            WHERE user_id = ? AND paid = 0
        `).get(userId);

        stats = {
            totalCourses: courses.count,
            attendance: Math.round(avgAttendance.avg || 0),
            upcomingExams: exams.count,
            pendingFees: fees.total
        };
    } else if (role === 'faculty') {
        const totalStudents = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('student');
        const totalCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get();
        stats = { totalStudents: totalStudents.count, totalCourses: totalCourses.count };
    } else {
        const totalStudents = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('student');
        const totalFaculty = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('faculty');
        const totalCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get();
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
        stats = {
            totalStudents: totalStudents.count,
            totalFaculty: totalFaculty.count,
            totalCourses: totalCourses.count,
            totalUsers: totalUsers.count
        };
    }

    res.json({ stats, role });
});

// ===== COURSES =====
router.get('/courses', (req, res) => {
    if (req.user.role === 'student') {
        const courses = db.prepare(`
            SELECT c.*, e.grade, e.attendance, e.enrolled_at
            FROM courses c
            JOIN enrollments e ON c.id = e.course_id
            WHERE e.user_id = ?
        `).all(req.user.id);
        return res.json({ courses });
    }
    const courses = db.prepare('SELECT * FROM courses').all();
    res.json({ courses });
});

router.post('/courses', requireRole('admin', 'faculty'), (req, res) => {
    const { code, name, instructor, credits, description } = req.body;
    if (!code || !name || !instructor) {
        return res.status(400).json({ error: 'Code, name, and instructor are required.' });
    }
    try {
        const result = db.prepare(
            'INSERT INTO courses (code, name, instructor, credits, description) VALUES (?, ?, ?, ?, ?)'
        ).run(code, name, instructor, credits || 3, description || '');
        res.status(201).json({ message: 'Course created!', id: result.lastInsertRowid });
    } catch (err) {
        res.status(409).json({ error: 'Course code already exists.' });
    }
});

// ===== ENROLLMENT =====
router.post('/enroll', requireRole('admin'), (req, res) => {
    const { userId, courseId } = req.body;
    try {
        db.prepare('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)').run(userId, courseId);
        res.status(201).json({ message: 'Student enrolled!' });
    } catch (err) {
        res.status(409).json({ error: 'Already enrolled.' });
    }
});

// ===== EXAMS =====
router.get('/exams', (req, res) => {
    let exams;
    if (req.user.role === 'student') {
        exams = db.prepare(`
            SELECT ex.*, c.name as course_name, c.code as course_code
            FROM exams ex
            JOIN courses c ON ex.course_id = c.id
            JOIN enrollments e ON c.id = e.course_id
            WHERE e.user_id = ?
            ORDER BY ex.date ASC
        `).all(req.user.id);
    } else {
        exams = db.prepare(`
            SELECT ex.*, c.name as course_name, c.code as course_code
            FROM exams ex JOIN courses c ON ex.course_id = c.id
            ORDER BY ex.date ASC
        `).all();
    }
    res.json({ exams });
});

router.post('/exams', requireRole('admin', 'faculty'), (req, res) => {
    const { courseId, title, date, type, totalMarks } = req.body;
    const result = db.prepare(
        'INSERT INTO exams (course_id, title, date, type, total_marks) VALUES (?, ?, ?, ?, ?)'
    ).run(courseId, title, date, type || 'midterm', totalMarks || 100);
    res.status(201).json({ message: 'Exam created!', id: result.lastInsertRowid });
});

// ===== FEES =====
router.get('/fees', (req, res) => {
    const userId = req.user.role === 'student' ? req.user.id : req.query.userId;
    const fees = db.prepare('SELECT * FROM fees WHERE user_id = ? ORDER BY due_date').all(userId || req.user.id);
    res.json({ fees });
});

// ===== ATTENDANCE =====
router.get('/attendance', (req, res) => {
    if (req.user.role === 'student') {
        const records = db.prepare(`
            SELECT c.name as course_name, c.code, e.attendance
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = ?
        `).all(req.user.id);
        const avg = records.length ? Math.round(records.reduce((s, r) => s + r.attendance, 0) / records.length) : 0;
        return res.json({ records, average: avg });
    }
    res.json({ records: [], average: 0 });
});

// ===== ANNOUNCEMENTS =====
router.get('/announcements', (req, res) => {
    const announcements = db.prepare(`
        SELECT a.*, u.name as author_name
        FROM announcements a
        LEFT JOIN users u ON a.author_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 10
    `).all();
    res.json({ announcements });
});

router.post('/announcements', requireRole('admin', 'faculty'), (req, res) => {
    const { title, message, priority } = req.body;
    db.prepare('INSERT INTO announcements (title, message, author_id, priority) VALUES (?, ?, ?, ?)')
      .run(title, message, req.user.id, priority || 'normal');
    res.status(201).json({ message: 'Announcement posted!' });
});

// ===== USERS (admin only) =====
router.get('/users', requireRole('admin'), (req, res) => {
    const users = db.prepare('SELECT id, name, email, role, initials, created_at FROM users').all();
    res.json({ users });
});

router.delete('/users/:id', requireRole('admin'), (req, res) => {
    const id = req.params.id;
    if (Number(id) === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account.' });
    }
    db.prepare('DELETE FROM enrollments WHERE user_id = ?').run(id);
    db.prepare('DELETE FROM fees WHERE user_id = ?').run(id);
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ message: 'User deleted.' });
});

module.exports = router;
