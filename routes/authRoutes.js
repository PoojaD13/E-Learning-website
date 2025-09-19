
const express = require("express");
const path=require("path");
const Student = require("../models/Student");

const router=express.Router();

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..","front-end", "login-reg.html"));
});

router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname,"..", "front-end", "login-reg.html"));
});

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.send(`<script>alert('Email already registered.'); window.location.href = "/register";</script>`);
        }

        const newStudent = new Student({ name, email, password });
        await newStudent.save();

        return res.send(`<script>alert('Registration successful!'); window.location.href = "/login";</script>`);
    } catch (err) {
        console.error("❌ Registration error:", err);
        return res.status(500).send("Server error during registration");
    }
});

router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    if (role === "Admin" && email === "admin@gmail.com" && password === "admin123") {
        //admin info in session
        req.session.user ={
            email,
            role:"admin"
        };
        return res.redirect("/admin");
    }

    if (role === "User") {
        try {
            const student = await Student.findOne({ email, password });

            if (!student) {
                return res.send(`<script>alert('Invalid credentials!'); window.location.href = "/login";</script>`);
            }
            //session for a student 
            req.session.user={
                email:student.email,
                role:"user"
            };

            return res.redirect("/user-dashboard");

        } catch (err) {
            console.error("❌ Login error:", err);
            return res.status(500).send("Server error");
        }
    }

    return res.send(`<script>alert('Invalid role selected.'); window.location.href = "/login";</script>`);
});

// Route to check login status
router.get("/auth/status", (req, res) => {
    if (req.session && req.session.user) {
      const{email,name}=req.session.user;
        return res.json({ loggedIn: true, email,name });
    } else {
        return res.json({ loggedIn: false });
    }
});

// Logout route
router.get("/auth/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Logout failed");
        }
        res.clearCookie("connect.sid"); // clear session cookie
        res.redirect("/"); // or just send a status: res.sendStatus(200);
    });
});

// routers to check the credentials and change password 

router.post('/auth/verify-user', async (req, res) => {
  const { email } = req.body;
  // Lookup user by email
  const user = await User.findOne({ email });
  if (user) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false, message: "Email not found" });
  }
});



// Step 1: Verify user email and old password
router.post('/verify-user', async (req, res) => {
  try {
    console.log('Incoming /verify-user:', req.body);

    const { email, oldPassword } = req.body;

    if (!email || !oldPassword) {
      return res.status(400).json({ error: 'Email and old password are required' });
    }

    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ If using bcrypt:
    // const isMatch = await bcrypt.compare(oldPassword, user.password);
    // if (!isMatch) return res.status(401).json({ error: 'Old password is incorrect' });

    if (user.password !== oldPassword) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    return res.json({ verified: true, message: 'User verified' });
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Step 2: Update password
router.post('/reset-password', async (req, res) => {
  try {
    console.log('Incoming /reset-password:', req.body);

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ If using bcrypt:
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    // user.password = hashedPassword;

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});
// In discussionRoutes.js (or main route file)
router.get('/courses/:courseTitle/discussion-forum', (req, res) => {
  res.render('discussion-forum', { courseTitle: req.params.courseTitle });
});



module.exports=router;