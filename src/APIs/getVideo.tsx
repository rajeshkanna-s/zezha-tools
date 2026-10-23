import React, { useState, useEffect, useRef } from "react";
import {
  Search, Download, Loader2, Sparkles, AlertCircle,
  ExternalLink, Play, X, ChevronDown, Clock, Info, Film,
  Volume2, VolumeX, RefreshCw
} from "lucide-react";

const PRESETS = [
  "Nature", "Time-lapse", "Office", "Minimalist",
  "Abstract", "Technology", "People", "Drone"
];

const COUNT_PRESETS = [12, 24, 48, 80];

const VideoSearchDownloader: React.FC = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [videoCount, setVideoCount] = useState(24);
  const [error, setError] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [previewVideo, setPreviewVideo] = useState<any | null>(null);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
        `https://api.pexels.com/videos/search?query=${q}&per_page=${videoCount}`,
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
      setVideos(data.videos || []);
      if (!data.videos || data.videos.length === 0) {
        setError("No videos found for this keyword. Try something else.");
      }
    } catch (err: any) {
      console.error("Error fetching videos:", err);
      setError(`Failed to fetch videos: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    handleSearch(preset);
  };

  const getBestPreviewFile = (video: any) => {
    if (!video || !video.video_files || video.video_files.length === 0) return null;
    const mp4Files = video.video_files.filter((f: any) => f.file_type === "video/mp4" || f.link?.includes(".mp4"));
    const pool = mp4Files.length > 0 ? mp4Files : video.video_files;
    // Prefer HD 720p or SD 540p for quick and smooth buffering, followed by 1080p
    const preferred =
      pool.find((f: any) => f.height === 720 || f.width === 720) ||
      pool.find((f: any) => f.quality === "hd") ||
      pool.find((f: any) => f.height === 540 || f.width === 540) ||
      pool.find((f: any) => f.height === 1080 || f.width === 1080) ||
      pool[0];
    return preferred;
  };

  const handleOpenPreview = (video: any) => {
    const best = getBestPreviewFile(video);
    setSelectedFile(best);
    setIsMuted(true);
    setIsBuffering(true);
    setVideoError(null);
    setPreviewVideo(video);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header section with high-end gradient text & icon */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 rounded-3xl p-5 md:p-6 shadow-xl shadow-fuchsia-100/50 text-white relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>POWERED BY PEXELS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black font-display tracking-tight leading-none">
            Instant Stock <span className="text-fuchsia-200">Video Search</span>
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
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all font-medium text-slate-800 placeholder:text-slate-400 bg-slate-50/50 hover:bg-slate-50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g., Drone Beach, Slow Motion Coffee, City Lights..."
              />
            </div>
          </div>

          {/* Video Count Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Video Count ({videoCount})
            </label>
            <div className="flex flex-col gap-3">
              <input
                type="range"
                min={1}
                max={80}
                value={videoCount}
                onChange={(e) => setVideoCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20"
              />
              <div className="flex gap-2 justify-between">
                {COUNT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setVideoCount(preset)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${videoCount === preset
                        ? "bg-fuchsia-600 border-fuchsia-600 text-white shadow-md shadow-fuchsia-100"
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
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-md shadow-fuchsia-100 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching Stock...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Find Videos
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
      {videos.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-700">
                Found {videos.length} High-Definition Videos
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Hover to reveal detail. Click thumbnail to preview or use the dropdown to download.
              </p>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:border-slate-300 transition-all duration-300 relative"
              >
                {/* Video Thumbnail with Hover Overlay */}
                <div
                  onClick={() => handleOpenPreview(video)}
                  className="aspect-video w-full overflow-hidden bg-slate-900 relative cursor-pointer group/thumb"
                >
                  <img
                    src={video.image}
                    alt={`Video by ${video.user.name}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Duration Tag */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    {video.duration}s
                  </span>

                  {/* Play overlay button on hover */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg scale-75 group-hover/thumb:scale-100 flex items-center justify-center transition-transform duration-300">
                      <Play className="w-5 h-5 text-indigo-600 fill-indigo-600 translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase">
                          {video.user.name.charAt(0)}
                        </span>
                      </div>
                      <a
                        href={video.user.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-slate-700 hover:text-fuchsia-600 transition-colors truncate max-w-full inline-flex items-center gap-1"
                        title={`View ${video.user.name} on Pexels`}
                      >
                        {video.user.name}
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400 inline" />
                      </a>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Aspect Ratio: {video.width} x {video.height}
                    </p>
                  </div>

                  {/* React Custom Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdownId(activeDropdownId === video.id ? null : video.id);
                      }}
                      className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-between gap-1"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        Download
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {activeDropdownId === video.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-full left-0 right-0 mb-2 z-30 bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
                      >
                        <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Select Quality
                        </div>
                        <div className="max-h-48 overflow-y-auto custom-scrollbar">
                          {video.video_files.map((file: any) => (
                            <a
                              key={file.id}
                              href={file.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-fuchsia-600 transition-colors flex justify-between items-center decoration-transparent"
                            >
                              <span className="capitalize">{file.quality} Quality</span>
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {file.width}x{file.height}
                              </span>
                            </a>
                          ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden flex flex-col space-y-4 p-4">
                <div className="aspect-video w-full bg-slate-100 rounded-xl animate-pulse" />
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

      {/* Info Tip */}
      <div className="bg-fuchsia-50/50 rounded-2xl border border-fuchsia-100/50 p-6 flex gap-4">
        <Info className="w-6 h-6 text-fuchsia-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-fuchsia-950">Video playback & browser downloads</h4>
          <p className="text-xs text-fuchsia-800 leading-relaxed font-medium">
            Pexels video files use dynamic CDN servers. When downloading a quality, the link will open directly or begin fetching in a new browser tab. You can right-click any playing video to "Save Video As..." if it opens in the browser.
          </p>
        </div>
      </div>

      {/* Video Preview Modal overlay */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 w-full max-w-3xl flex flex-col relative max-h-[92vh] animate-in zoom-in-95 duration-200"
          >
            {/* Header / Dismiss */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm md:text-base">
                  Video Preview
                </h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Area */}
            <div className="bg-slate-950 aspect-video w-full max-h-[58vh] flex items-center justify-center relative shrink-0 overflow-hidden group/player">
              {/* Blurred background poster for portrait/vertical reels */}
              <div
                className="absolute inset-0 opacity-20 bg-cover bg-center filter blur-xl scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${previewVideo.image})` }}
              />

              {/* Video Element */}
              <video
                ref={videoRef}
                key={selectedFile?.link || previewVideo.id}
                src={selectedFile?.link}
                poster={previewVideo.image}
                controls
                autoPlay
                muted={isMuted}
                playsInline
                preload="auto"
                onLoadStart={() => setIsBuffering(true)}
                onWaiting={() => setIsBuffering(true)}
                onCanPlay={() => setIsBuffering(false)}
                onPlaying={() => setIsBuffering(false)}
                onError={() => {
                  setIsBuffering(false);
                  setVideoError("Unable to stream this video resolution in the browser. You can switch to another resolution below or open the direct stream.");
                }}
                className="w-full h-full object-contain relative z-10 max-h-[58vh]"
              />

              {/* Sound Toggle (Crucial for browser autoplay compliance) */}
              <button
                type="button"
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  if (videoRef.current) {
                    videoRef.current.muted = nextMuted;
                  }
                }}
                className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg transition-transform active:scale-95"
                title={isMuted ? "Click to unmute" : "Click to mute"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tap to Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Audio Active</span>
                  </>
                )}
              </button>

              {/* Quality Badge */}
              {selectedFile && (
                <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/10 pointer-events-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {selectedFile.quality || "HD"} • {selectedFile.width}x{selectedFile.height}
                </div>
              )}

              {/* Buffering Indicator */}
              {isBuffering && !videoError && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
                  <Loader2 className="w-8 h-8 text-white animate-spin drop-shadow" />
                  <span className="text-xs font-medium text-white/90 mt-2 bg-black/60 px-3 py-1 rounded-full">
                    Loading video stream...
                  </span>
                </div>
              )}

              {/* Error Recovery */}
              {videoError && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center text-white space-y-3">
                  <AlertCircle className="w-10 h-10 text-amber-400" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">Playback Stream Notice</h4>
                    <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                      {videoError}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <a
                      href={selectedFile?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-500/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Stream in New Tab
                    </a>
                    {previewVideo.video_files.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const currentIndex = previewVideo.video_files.findIndex((f: any) => f.id === selectedFile?.id);
                          const nextFile = previewVideo.video_files[(currentIndex + 1) % previewVideo.video_files.length];
                          setSelectedFile(nextFile);
                          setVideoError(null);
                          setIsBuffering(true);
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Try Alternate Quality
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Info & Quality Selector */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm">
                    Photographer: {previewVideo.user.name}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Duration: {previewVideo.duration} seconds • Dimensions: {previewVideo.width} x {previewVideo.height}
                  </p>
                </div>

                <a
                  href={previewVideo.user.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  View Profile
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Quality Switcher & Downloader */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Available Qualities (Click to Stream or Download)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Active: <strong className="text-indigo-600 uppercase">{selectedFile?.quality || "Default"}</strong> ({selectedFile?.width}x{selectedFile?.height})
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {previewVideo.video_files.map((file: any) => {
                    const isSelected = selectedFile?.id === file.id;
                    return (
                      <div
                        key={file.id}
                        className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? "bg-indigo-50/70 border-indigo-400 shadow-sm"
                            : "bg-slate-50/80 hover:bg-slate-100/80 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold capitalize ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>
                            {file.quality || "Standard"}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400">
                            {file.width}x{file.height}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(file);
                              setVideoError(null);
                              setIsBuffering(true);
                            }}
                            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all text-center ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {isSelected ? "Playing" : "Preview"}
                          </button>
                          <a
                            href={file.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                            title="Download this file"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSearchDownloader;
