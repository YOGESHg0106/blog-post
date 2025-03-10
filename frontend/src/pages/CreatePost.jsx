import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreatePost.css";

const CreatePost = () => {
  const [post, setPost] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("description", post.description);
      if (image) formData.append("image", image);

      await axios.post(
        "https://blog-post-production-f5b3.up.railway.app/api/blogs", // ✅ Updated API URL
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-container">
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit} className="create-form">
        <label>Title:</label>
        <input
          type="text"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />

        <label>Description:</label>
        <textarea
          value={post.description}
          onChange={(e) => setPost({ ...post, description: e.target.value })}
          required
        />

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="image-preview" />
        )}

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
