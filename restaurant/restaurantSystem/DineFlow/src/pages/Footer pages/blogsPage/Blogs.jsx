import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import "../../style/blog/blog.css";

// 1. Externalize Data (In production, this comes from a CMS or API)
const BLOG_POSTS = [
  {
    id: 1,
    title: "How Digital Menus are Revolutionizing Fine Dining",
    excerpt: "Discover how luxury restaurants are leveraging interactive digital menus to enhance guest experiences and streamline operations.",
    author: "Arjun Sharma",
    date: "2026-01-10", // ISO format for <time> tag
    displayDate: "Jan 10, 2026",
    readTime: "5 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
    slug: "/blog/digital-menus-revolution"
  },
  {
    id: 2,
    title: "Top 5 Restaurant Trends to Watch in 2026",
    excerpt: "From sustainable sourcing to AI-driven kitchen management, here is what is shaping the future of the culinary world.",
    author: "Sarah Jen",
    date: "2026-01-08",
    displayDate: "Jan 08, 2026",
    readTime: "7 min read",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    slug: "/blog/trends-2026"
  },
  {
    id: 3,
    title: "Optimizing Your Staff Workflow with Smart Analytics",
    excerpt: "Learn how data-driven decisions can help you manage peak hours and reduce table turnaround time effectively.",
    author: "Vikram Raj",
    date: "2026-01-05",
    displayDate: "Jan 05, 2026",
    readTime: "4 min read",
    category: "Management",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
    slug: "/blog/workflow-optimization"
  }
];

export default function BlogPage() {
  // 2. Memoize split to prevent unnecessary recalculations
  const { featuredPost, regularPosts } = useMemo(() => ({
    featuredPost: BLOG_POSTS[0],
    regularPosts: BLOG_POSTS.slice(1)
  }), []);

  if (!BLOG_POSTS.length) {
    return (
      <section className="no-posts">
        <h2>No articles found.</h2>
        <Link to="/">Return Home</Link>
      </section>
    );
  }

  return (
    <main className="blog-page-root">
      {/* HERO SECTION */}
      <header className="blog-hero">
        <div className="hero-container">
          <h1 className="hero-h1">Insights & Culinary Stories</h1>
          <p className="hero-p">Expert perspectives on the intersection of hospitality and technology.</p>
        </div>
      </header>

      <div className="blog-content-wrapper">
        {/* FEATURED POST - HIGHEST VISUAL PRIORITY */}
        {featuredPost && (
          <section className="featured-wrapper" aria-labelledby="featured-heading">
            <article className="featured-main-card">
              <div className="featured-img-box">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  fetchpriority="high" // Performance: Loads first
                />
              </div>
              <div className="featured-info">
                <span className="badge">{featuredPost.category}</span>
                <h2 id="featured-heading" className="featured-h2">{featuredPost.title}</h2>
                <p className="featured-excerpt">{featuredPost.excerpt}</p>
                <div className="author-meta">
                  <span className="meta-item"><User size={16} aria-hidden="true" /> {featuredPost.author}</span>
                  <span className="meta-item">
                    <Calendar size={16} aria-hidden="true" /> 
                    <time dateTime={featuredPost.date}>{featuredPost.displayDate}</time>
                  </span>
                </div>
                <Link to={featuredPost.slug} className="btn-primary">
                  Read Article <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          </section>
        )}

        {/* BLOG GRID */}
        <section className="posts-grid" aria-label="Recent articles">
          {regularPosts.map((post) => (
            <article key={post.id} className="grid-post-card">
              <Link to={post.slug} className="card-image-link" tabIndex="-1">
                <div className="image-aspect-wrapper">
                  <img src={post.image} alt="" loading="lazy" />
                  <span className="grid-badge">{post.category}</span>
                </div>
              </Link>
              <div className="card-body">
                <div className="read-meta"><Clock size={14} /> {post.readTime}</div>
                <h3 className="card-title">
                  <Link to={post.slug}>{post.title}</Link>
                </h3>
                <p className="card-text">{post.excerpt}</p>
                <footer className="card-footer">
                  <time className="footer-date" dateTime={post.date}>{post.displayDate}</time>
                  <Link to={post.slug} className="link-arrow">
                    Read More <ArrowRight size={16} />
                  </Link>
                </footer>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}