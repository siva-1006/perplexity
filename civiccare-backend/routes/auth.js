// // const express = require("express");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");
// // const router = express.Router();

// // // Signup
// // router.post("/signup", async (req, res) => {
// //   try {
// //     const { name, email, phone, password, info } = req.body;
// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const user = new User({ name, email, phone, password: hashedPassword, info });
// //     await user.save();
// //     res.json({ message: "User created successfully" });
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });

// // // Login
// // router.post("/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ error: "User not found" });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(400).json({ error: "Invalid password" });

// //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// //     res.json({ token, user });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Profile
// // router.get("/me", async (req, res) => {
// //   const authHeader = req.headers.authorization;
// //   if (!authHeader) return res.status(401).json({ error: "No token" });

// //   const token = authHeader.split(" ")[1];
// //   if (!token) return res.status(401).json({ error: "No token" });

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     const user = await User.findById(decoded.id).select("-password");
// //     res.json(user);
// //   } catch (err) {
// //     res.status(401).json({ error: "Invalid token" });
// //   }
// // });

// // module.exports = router;



// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const router = express.Router();

// // =====================
// // Signup
// // =====================
// router.post("/signup", async (req, res) => {
//   try {
//     const { email, phone, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       email,
//       phone,
//       password: hashedPassword,
//     });

//      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({ token, user });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
//   //   await user.save();
//   //   res.json({ message: "User created successfully" });
//   // } catch (err) {
//   //   res.status(400).json({ error: err.message });
//   // }
// });

// // =====================
// // Login
// // =====================
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid password" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // =====================
// // Get profile (GET /me)
// // =====================
// router.get("/me", async (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "No token" });

//   const token = authHeader.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// });

// // =====================
// // Update profile (PUT /me)
// // =====================
// router.put("/me", async (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "No token" });

//   const token = authHeader.split(" ")[1];
//   if (!token) return res.status(401).json({ error: "No token" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { name, info } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       decoded.id,
//       { name, info },
//       { new: true }
//     ).select("-password");

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// });

// module.exports = router;




const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// =====================
// Signup
// =====================
router.post("/signup", async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      phone,
      password: hashedPassword,
    });

    await user.save(); // ✅ Save user before creating token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =====================
// Login
// =====================
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; // Support both email and phone
    if (!identifier || !password) {
      return res.status(400).json({ error: "Email/phone and password are required" });
    }

    // Try to find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });
    
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// Get profile (GET /me)
// =====================
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// =====================
// Update profile (PUT /me)
// =====================
router.put("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, info } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { name, info },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// =====================
// Reports endpoints
// =====================

// Create a new report
router.post("/reports", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { description, category, location, image, modelPrediction } = req.body;

    // For now, just return success - you can add a Report model later
    res.json({ 
      message: "Report submitted successfully",
      reportId: Date.now().toString() // Temporary ID
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Get user's reports
router.get("/reports", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For now, return empty array - you can add a Report model later
    res.json({ reports: [] });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Get all reports (for admin/public view)
router.get("/reports/all", async (req, res) => {
  try {
    // For now, return empty array - you can add a Report model later
    res.json({ reports: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
