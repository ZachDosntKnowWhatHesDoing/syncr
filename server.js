const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Setup file uploads (profile pics / posts)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/profile.html'));
});

// Signup route
app.post('/signup', upload.single('profilePic'), (req, res) => {
    let users = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));
    const { username, password } = req.body;
    const profilePic = req.file ? '/images/' + req.file.filename : '';
    users.push({ username, password, profilePic });
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));
    res.redirect('/login');
});

// Post creation route
app.post('/post', upload.single('postImage'), (req, res) => {
    let posts = JSON.parse(fs.readFileSync('data/posts.json', 'utf-8'));
    const { username, content } = req.body;
    const postImage = req.file ? '/images/' + req.file.filename : '';
    posts.push({ username, content, postImage, timestamp: Date.now() });
    fs.writeFileSync('data/posts.json', JSON.stringify(posts, null, 2));
    res.redirect('/');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
