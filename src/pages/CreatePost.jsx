import React from "react";
import {
  FaHeading,
  FaUser,
  FaLink,
  FaCloadAlt,
  FaTimes,
  FaPaperPlane,
  FaCloudUploadAlt,
  FaRegPaperPlane,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./CreatePost.css";
const CreatePost = () => {
  return (
    <div className="create-post-page">
      <Navbar />
      <div className="create-post-container">
        <header className="form-header">
          <h1>Create a new post</h1>
          <p>Share your thought and stories with world</p>
        </header>

        <div className="post-form-card">
          <form>
            <div className="form-group">
              <label>Post title</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter a catchy title..."
                />
              </div>
            </div>

            <div className="from-group">
              <label>Aurthor Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icons" />
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  placeholder="your name"
                />
              </div>
            </div>

            <div className="from-group">
              <label>Description</label>
              <textarea
                name="description"
                className="from-control"
                placeholder="what's on your mind ? Write your story here"
              ></textarea>
            </div>

            <div className="form-group">
              <label>cover image</label>
              <div className="image-source-tabs">
                <button type="button" className="tab-btn active">
                  Image URL
                </button>

                <button type="button" className="tab-btn ">
                  Upload File
                </button>
              </div>
              <div className="input wrapper">
                <FaLink className="input-icon" />
                <input
                  type="URL"
                  name="imageURL"
                  className="form-control"
                  placeholder="paste image URL here"
                />
              </div>
              <div className="image-upload-area">
                <FaCloudUploadAlt className="upload-icon" />
                <p>Click to upload image from your device</p>

                <div className="image-preview-container">
                  <img src="" alt="Preview" className="image-preview" />
                  <button type="button" className="remove-image-btn">
                    <FaTimes />
                  </button>
                </div>
              </div>
              <div>
                <button type="button" className="remove-image-btn">
                  <FaRegPaperPlane /> Publish Post
                </button>

                <button type="button" className="cancel-btn">
                  clear form
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
