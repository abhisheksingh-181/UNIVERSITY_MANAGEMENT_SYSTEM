const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'uniflow.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// ===== CREATE TABLES =====
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    initials TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    instructor TEXT NOT NULL,
    credits INTEGER DEFAULT 3,
    semester TEXT DEFAULT 'Fall 2026',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    attendance REAL DEFAULT 0,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(user_id, course_id)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'present',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT DEFAULT 'midterm',
    total_marks INTEGER DEFAULT 100,
    FOREIGN KEY (course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    due_date TEXT,
    paid INTEGER DEFAULT 0,
    paid_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    author_id INTEGER,
    priority TEXT DEFAULT 'normal',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );
`);

// ===== SEED DATA (only if users table is empty) =====
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('password', 10);

  // Seed users
  const insertUser = db.prepare('INSERT INTO users (name, email, password, role, initials) VALUES (?, ?, ?, ?, ?)');
  insertUser.run('Abhishek Singh', 'abhishek@uniflow.edu', hash, 'student', 'AS');
  insertUser.run('Dr. Sharma', 'sharma@uniflow.edu', hash, 'faculty', 'DS');
  insertUser.run('Admin', 'admin@uniflow.edu', hash, 'admin', 'AD');

  // Seed courses
  const insertCourse = db.prepare('INSERT INTO courses (code, name, instructor, credits, description) VALUES (?, ?, ?, ?, ?)');
  insertCourse.run('CS301', 'Operating System', 'Dr. Sharma', 4, 'Study of OS concepts, process management, memory management');
  insertCourse.run('CS302', 'Database Management', 'Prof. Singh', 4, 'Relational databases, SQL, normalization, transactions');
  insertCourse.run('CS303', 'Computer Networks', 'Prof. Kumar', 3, 'Network layers, protocols, TCP/IP, routing');
  insertCourse.run('CS304', 'Software Engineering', 'Dr. Gupta', 3, 'SDLC, agile, design patterns, testing');
  insertCourse.run('CS305', 'Data Structures', 'Prof. Verma', 4, 'Arrays, trees, graphs, sorting algorithms');
  insertCourse.run('MA201', 'Discrete Mathematics', 'Dr. Patel', 3, 'Logic, sets, combinatorics, graph theory');

  // Enroll Abhishek in courses
  const insertEnrollment = db.prepare('INSERT INTO enrollments (user_id, course_id, grade, attendance) VALUES (?, ?, ?, ?)');
  insertEnrollment.run(1, 1, 'A', 82);
  insertEnrollment.run(1, 2, 'A+', 90);
  insertEnrollment.run(1, 3, 'B+', 78);
  insertEnrollment.run(1, 4, 'A', 85);
  insertEnrollment.run(1, 5, 'A+', 92);
  insertEnrollment.run(1, 6, 'B', 75);

  // Seed exams
  const insertExam = db.prepare('INSERT INTO exams (course_id, title, date, type, total_marks) VALUES (?, ?, ?, ?, ?)');
  insertExam.run(1, 'OS Midterm', '2026-12-05', 'midterm', 100);
  insertExam.run(2, 'DBMS Final', '2026-12-15', 'final', 100);
  insertExam.run(3, 'CN Quiz 3', '2026-11-28', 'quiz', 25);

  // Seed fees
  const insertFee = db.prepare('INSERT INTO fees (user_id, amount, description, due_date, paid) VALUES (?, ?, ?, ?, ?)');
  insertFee.run(1, 12500, 'Tuition Fee — Semester 6', '2026-12-01', 0);
  insertFee.run(1, 5000, 'Lab Fee', '2026-11-15', 1);

  // Seed announcements
  const insertAnn = db.prepare('INSERT INTO announcements (title, message, author_id, priority) VALUES (?, ?, ?, ?)');
  insertAnn.run('Semester Exams Schedule', 'End-semester exams begin Dec 5. Check your timetable.', 3, 'high');
  insertAnn.run('Library Extended Hours', 'Library open until 11 PM during exam week.', 3, 'normal');
  insertAnn.run('Hackathon Registration', 'Register for UniFlow Hackathon 2026 by Nov 30.', 2, 'normal');

  console.log('✅ Database seeded with sample data');
}

module.exports = db;
