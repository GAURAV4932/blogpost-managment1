import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Navbar from "../components/Navbar";
import "./Analytics.css";

const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  // Fetch posts from db.json
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts");
        const data = await response.json();
        if (Array.isArray(data)) {
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Prepare chart data from fetched posts
  const getChartData = () => {
    const authorCount = {};
    posts.forEach((post) => {
      const author = post.author || "Unknown";
      authorCount[author] = (authorCount[author] || 0) + 1;
    });

    return Object.keys(authorCount).map((author) => ({
      name: author,
      posts: authorCount[author],
    }));
  };

  const chartData = getChartData();
  const header = ["ID", "Title", "Author", "Date"];
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (totalPages <= 0) return [];
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="analytics-page">
      <Navbar />
      <main className="analytics-main">
        <header className="analytics-header">
          <h1>Blog Analytics</h1>
          <p>Insights into your blog's performance and activity.</p>
        </header>

        {loading ? (
          <div className="loading-spinner">Loading analytics...</div>
        ) : (
          <>
            <div className="charts-container">
              <div className="chart-card">
                <h3>Posts per Author</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="posts"
                        fill="#8884d8"
                        name="Number of Posts"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie chart */}
              <div className="chart-card">
                <h3>Distribution by Author</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="posts"
                        nameKey="name"
                        label
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Dynamic table from db.json */}
            <div className="posts-table-section">
              <h3>All Posts</h3>
              <div className="table-wrapper">
                <table className="analytics-table">
                  <thead>
                    <tr>
                      {header.map((headerItem, index) => (
                        <th key={index}>{headerItem}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPosts.length > 0 ? (
                      currentPosts.map((post) => (
                        <tr key={post.id}>
                          <td>{post.id.substring(0, 4)}</td>
                          <td>{post.title}</td>
                          <td>{post.author || "Anonymous"}</td>
                          <td>{formatDate(post.date || post.createdAt)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">
                          No posts available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Dynamic pagination */}
              {posts.length > 0 && (
                <div className="pagination">
                  <button
                    className={`page-btn ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {getPageNumbers().map((number) => (
                    <button
                      key={number}
                      className={`page-btn ${currentPage === number ? "active" : ""}`}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    className={`page-btn ${currentPage === totalPages ? "disabled" : ""}`}
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}

              {posts.length === 0 && (
                <div className="pagination-placeholder"></div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
