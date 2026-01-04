import "./Blogs.css";
import React, { useState } from "react";
import blogData from "./BlogData";


const POSTS_PER_PAGE = 3;

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(blogData.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentBlogs = blogData.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  return (
    <section className="blog-page">
      {/* Header */}
      <div className="blog-header">
        <h1>From Our Restaurant</h1>
        <p>Stories, flavors, and experiences from our kitchen</p>
      </div>

      {/* Blog Cards */}
      <div className="blog-grid">
        {currentBlogs.map((blog) => (
          <article className="blog-card" key={blog.id}>
            <div className="blog-image">
              <img src={blog.image} alt={blog.title} />
              <span className="blog-category">{blog.category}</span>
            </div>

            <div className="blog-content">
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>

              <div className="blog-footer">
                <span className="blog-date">{blog.date}</span>
                <button className="read-btn">Read More</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}