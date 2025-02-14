require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ✅ CORS Middleware (Adjust to match frontend URL)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://blog-post--seven.vercel.app", // ✅ Deployed frontend
    ],
    credentials: true,
  })
);

// ✅ Increase Payload Size Limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Serve Uploaded Images
app.use("/uploads", express.static(uploadDir));
app.use("/uploads", express.static("uploads"));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Use Authentication Routes
app.use("/api/auth", authRoutes);

// ✅ Blog Schema & Model
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: null }, // Store image path
});
const Blog = mongoose.model("Blog", BlogSchema);

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// ✅ Create a new blog post with an image
app.post("/api/blogs", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and Description are required" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const newBlog = new Blog({ title, description, image: imagePath });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error("❌ Blog Creation Error:", err);
    res.status(500).json({ error: "Failed to save blog post" });
  }
});

// ✅ Get all blog posts
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    console.error("❌ Blog Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    console.error("❌ Blog Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// ✅ Update a blog post (Keep old image if not updated)
app.put("/api/blogs/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : blog.image;

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, image: imagePath },
      { new: true }
    );

    res.json(updatedBlog);
  } catch (err) {
    console.error("❌ Blog Update Error:", err);
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// ✅ Delete a blog post
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Delete image file from uploads directory if exists
    if (blog.image) {
      const imagePath = path.join(__dirname, blog.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog post deleted" });
  } catch (err) {
    console.error("❌ Blog Deletion Error:", err);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
