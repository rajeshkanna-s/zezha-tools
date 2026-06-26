import React, { useState, useEffect } from "react";
import {
  Search, Download, Loader2, Sparkles, Check,
  AlertCircle, ExternalLink, Image as ImageIcon, ChevronDown,
  HelpCircle, Info, RefreshCw, Grid
} from "lucide-react";

const PRESETS = [
  "Nature", "Office", "Minimalist", "Abstract",
  "Technology", "Cityscape", "Animals", "Travel"
];

const COUNT_PRESETS = [12, 24, 48, 80];

const ImageSearchDownloader: React.FC = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageCount, setImageCount] = useState(24);
  const [error, setError] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownId(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleSearch = async (searchQuery = query) => {
    const q = searchQuery.trim();
    if (!q) {
      setError("Please enter a keyword to search.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${q}&per_page=${imageCount}`,
        {
          headers: {
            Authorization: "idntiRbiNdSOHh8rupUcWKK1RzcXNOaz68TK8BGyG9p1blOcz3XHXOF4",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setImages(data.photos || []);
      if (!data.photos || data.photos.length === 0) {
        setError("No images found for this keyword. Try something else.");
      }
    } catch (err: any) {
      console.error("Error fetching images:", err);
      setError(`Failed to fetch images: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    handleSearch(preset);
  };

  const downloadImage = async (url: string, filename: string, photoId?: string, sizeKey?: string) => {
    const taskKey = photoId && sizeKey ? `${photoId}-${sizeKey}` : "single";
    setDownloadingId(taskKey);
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
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: Open in new tab if CORS fails
      window.open(url, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadAllImages = async () => {
    if (images.length === 0) return;
    setDownloadingAll(true);
    try {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const url = img.src.large2x || img.src.medium;
        const filename = `image-${img.id}-large.jpg`;
        await downloadImage(url, filename);
      }
    } catch (err) {
      console.error("Error downloading all images:", err);
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header section with high-end gradient text & icon */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-5 md:p-6 shadow-xl shadow-indigo-100/50 text-white relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>POWERED BY PEXELS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight leading-none">
            Instant Stock <span className="text-indigo-200">Image Search</span>
          </h1>

        </div>
      </div>

      {/* Main Search Panel */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Keyword Input */}
          <div className="lg:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g., Nature, Coding Office, Neon Abstract..."
              />
            </div>
          </div>

          {/* Image Count Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Image Count ({imageCount})
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="range"
                min={1}
                max={80}
                value={imageCount}
                onChange={(e) => setImageCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex gap-2 justify-between">
                {COUNT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setImageCount(preset)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${imageCount === preset
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
            Popular:
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching Stock...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Find Images
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Search Notice</h4>
            <p className="text-xs text-rose-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Search results */}
      {images.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-700">
                Found {images.length} High-Res Images
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Click size options on any photo to download.
              </p>
            </div>

            <button
              onClick={downloadAllImages}
              disabled={downloadingAll}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-50 flex items-center gap-2 disabled:opacity-50"
            >
              {downloadingAll ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Downloading All...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download All (Max Size)
                </>
              )}
            </button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="group bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-slate-300 transition-all duration-300 relative"
              >
                {/* Photo container */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={img.src.medium}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase">
                          {img.photographer.charAt(0)}
                        </span>
                      </div>
                      <a
                        href={img.photographer_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors truncate max-w-full inline-flex items-center gap-1"
                        title={`View ${img.photographer} on Pexels`}
                      >
                        {img.photographer}
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400 inline" />
                      </a>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed line-clamp-2" title={img.alt}>
                      {img.alt || "No description provided."}
                    </p>
                  </div>

                  {/* React Custom Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === img.id ? null : img.id);
                      }}
                      className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-1"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        Download
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {activeDropdownId === img.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-full left-0 right-0 mb-2 z-30 bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
                      >
                        <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Select Format
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar">
                          {Object.entries(img.src).map(([size, url]) => {
                            const isDownloading = downloadingId === `${img.id}-${size}`;
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => {
                                  downloadImage(
                                    url as string,
                                    `image-${img.id}-${size}.jpg`,
                                    img.id.toString(),
                                    size
                                  );
                                  setActiveDropdownId(null);
                                }}
                                disabled={!!downloadingId}
                                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex justify-between items-center capitalize disabled:opacity-50"
                              >
                                <span>{size}</span>
                                {isDownloading ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
                                ) : (
                                  <Download className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-6">
          <div className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col space-y-4 p-4">
                <div className="aspect-[4/3] w-full bg-slate-100 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-slate-100 rounded animate-pulse w-1/2" />
                </div>
                <div className="h-9 bg-slate-50 rounded-xl border border-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Tips */}
      <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100/50 p-6 flex gap-4">
        <Info className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-indigo-950">How single downloads work</h4>
          <p className="text-xs text-indigo-800 leading-relaxed font-medium">
            This utility downloads photos directly to your system using cross-origin stream headers. If a specific size fails or has strict server restrictions, the system will open the image file link in a new tab so you can right-click and save it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageSearchDownloader;
