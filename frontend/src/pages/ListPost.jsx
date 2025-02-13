import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/ListPost.css";

const ListPost = () => {
  const { user } = useContext(AuthContext); // ✅ Check user auth
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // ✅ Redirect if not logged in
    } else {
      axios
        .get("http://localhost:5000/api/blogs")
        .then((res) => setPosts(res.data))
        .catch((err) => console.error("Error fetching posts:", err));
    }
  }, [user, navigate]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/blogs/${id}`)
      .then(() => setPosts(posts.filter((post) => post._id !== id)))
      .catch((err) => console.error("Error deleting post:", err));
  };

  return (
    <div className="list-container">
      <h2>All Blog Posts</h2>
      <button className="add-btn" onClick={() => navigate("/create")}>
        + Add New Post
      </button>
      <div className="post-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <img
                src={`http://localhost:5000${post.image}`}
                alt={post.title}
                className="post-image"
              />
              <h3 className="post-title">{post.title}</h3>
              <p className="post-description">{post.description}</p>
              <div className="post-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit/${post._id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default ListPost;
