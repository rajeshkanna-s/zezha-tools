import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../assets/CSS/ImageSearchDownloader.css";
import axios from "axios";

const ImageSearchDownloader: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const [imageCount, setImageCount] = useState(10);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${query}&per_page=${imageCount}`,
        {
          headers: {
            Authorization:
              "idntiRbiNdSOHh8rupUcWKK1RzcXNOaz68TK8BGyG9p1blOcz3XHXOF4",
          },
        }
      );
      setImages(response.data.photos);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const downloadAllImages = async () => {
    for (const img of images) {
      const url = img.src.medium;
      const filename = `image-${img.id}.jpg`;
      await downloadImage(url, filename);
    }
  };

  return (
    <div className="container-fluid">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
        {/* Search Form - stays top always */}
        <div className="imgcard shadow p-4 mt-4">
          <h2 className="text-center mb-4">Image Search</h2>
          <div className="mb-3">
            <label className="form-label">
              Enter Keyword: <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Nature, Computer"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image Count (1 - 80):</label>
            <input
              type="number"
              className="form-control"
              value={imageCount}
              onChange={(e) =>
                setImageCount(Math.min(80, Math.max(1, Number(e.target.value))))
              }
              min={1}
              max={80}
              placeholder="e.g., 10"
            />
          </div>

          <button
            className="btn btn-primary w-100 mb-3"
            onClick={handleSearch}
            disabled={!query.trim() || loading}
          >
            {loading ? "Searching..." : "Search Images"}
          </button>
        </div>

        {/* Results Section - appears below only after search */}
        {images.length > 0 && (
          <div className="row mt-4 justify-content-center img-grid-wrapper">
            <div className="text-end my-3">
              <button
                className="btn btn-outline-success"
                onClick={() => downloadAllImages()}
              >
                Download All (medium)
              </button>
            </div>
            <div className="img-grid-container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
                {images.map((img) => (
                  <div key={img.id} className="col">
                    <div className="img-card">
                      <img
                        src={img.src.medium}
                        alt={img.alt}
                        className="img-fluid"
                      />
                      <div className="img-card-body">
                        <h6 title={img.photographer}>{img.photographer}</h6>
                        <p>
                          {img.alt.length > 60
                            ? img.alt.slice(0, 60) + "..."
                            : img.alt}
                        </p>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-success dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Download Sizes
                          </button>
                          <ul className="dropdown-menu">
                            {Object.entries(img.src).map(([size, url]) => (
                              <li key={size}>
                                <button
                                  className="dropdown-item"
                                  onClick={() =>
                                    downloadImage(
                                      url as string,
                                      `image-${img.id}-${size}.jpg`
                                    )
                                  }
                                >
                                  {size}
                                </button>
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

export default ImageSearchDownloader;
