// // require("dotenv").config();
// // const express = require("express");
// // const mongoose = require("mongoose");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");

// // const app = express();
// // app.use(express.json());

// // // Connect to MongoDB
// // mongoose.connect(process.env.MONGO_URI)
// //   .then(() => console.log("✅ MongoDB Connected"))
// //   .catch(err => console.error("MongoDB error:", err));

// // // User Schema
// // const userSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   password: { type: String, required: true }
// // });

// // const User = mongoose.model("User", userSchema);

// // // Signup endpoint
// // app.post("/signup", async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;
// //     // Check if user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) return res.status(400).json({ error: "User already exists" });

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const user = new User({ name, email, password: hashedPassword });
// //     await user.save();
// //     res.json({ message: "User created successfully" });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Login endpoint
// // app.post("/login", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ error: "User not found" });

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(400).json({ error: "Invalid password" });

// //     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// //     res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // // Start server
// // const PORT = process.env.PORT || 4000;
// // app.listen(PORT, () => console.log(`Server started on port ${PORT}`));





// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const authRoutes = require("./routes/auth");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.error("MongoDB error:", err));

// // Routes
// // app.use(".routes/auth", authRoutes);
// app.use("/api/auth", authRoutes);


// // Test route
// app.get("/", (req, res) => {
//   res.send("CivicCare Backend Running 🚀");
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB error:", err));

// Mount auth routes at /api/auth
app.use("/api/auth", authRoutes);

// Test route to verify server running
app.get("/", (req, res) => {
  res.send("CivicCare Backend Running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
