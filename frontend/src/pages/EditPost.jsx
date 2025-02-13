import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/EditPost.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    axios
      .get(`https://blog-post-production-f5b3.up.railway.app/api/blogs/${id}`) // ✅ Updated API URL
      .then((res) => {
        setPost({
          title: res.data.title,
          description: res.data.description,
          image: null, // Clear previous image input
        });
        setPreview(
          res.data.image
            ? `https://blog-post-production-f5b3.up.railway.app${res.data.image}`
            : ""
        );
      })
      .catch((err) => console.error("Error fetching post:", err));
  }, [id]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPost({ ...post, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("description", post.description);
    if (post.image) formData.append("image", post.image);

    try {
      await axios.put(
        `https://blog-post-production-f5b3.up.railway.app/api/blogs/${id}`, // ✅ Updated API URL
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigate("/");
    } catch (err) {
      console.error("Error updating post:", err);
      alert("Failed to update post. Please try again.");
    }
  };

  return (
    <div className="edit-container">
      <h2>Edit Blog Post</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={post.description}
          onChange={handleChange}
          required
        />

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}

        <div className="button-group">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
