import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../assets/CSS/ImageSearchDownloader.css";
import axios from "axios";

const VideoSearchDownloader: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoCount, setVideoCount] = useState(10);
  const [error, setError] = useState("");

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a keyword to search.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.pexels.com/videos/search?query=${query}&per_page=${videoCount}`,
        {
          headers: {
            Authorization:
              "idntiRbiNdSOHh8rupUcWKK1RzcXNOaz68TK8BGyG9p1blOcz3XHXOF4",
          },
        }
      );
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
        <div className="imgcard shadow p-4 mt-4">
          <h2 className="text-center mb-4">Video Search</h2>
          <div className="mb-3">
            <label className="form-label">
              Enter Keyword: <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Nature, Technology"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Video Count (1 - 80):</label>
            <input
              type="number"
              className="form-control"
              value={videoCount}
              onChange={(e) =>
                setVideoCount(Math.min(80, Math.max(1, Number(e.target.value))))
              }
              min={1}
              max={80}
            />
          </div>
          <button
            className="btn btn-primary w-100 mb-3"
            onClick={handleSearch}
            disabled={!query.trim() || loading}
          >
            {loading ? "Searching..." : "Search Videos"}
          </button>
        </div>

        {videos.length > 0 && (
          <div className="row mt-4 justify-content-center img-grid-wrapper">
            <div className="img-grid-container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {videos.map((video) => (
                  <div key={video.id} className="col">
                    <div className="img-card">
                      <img
                        src={video.image}
                        alt={`Video by ${video.user.name}`}
                        className="img-fluid"
                      />
                      <div className="img-card-body">
                        <h6 title={video.user.name}>{video.user.name}</h6>
                        <p>{`Duration: ${video.duration} sec`}</p>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-success dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Download Sizes
                          </button>
                          <ul className="dropdown-menu">
                            {video.video_files.map((file: any) => (
                              <li key={file.id}>
                                <a
                                  className="dropdown-item"
                                  href={file.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                >
                                  {file.quality} ({file.width}x{file.height})
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoSearchDownloader;
