import React, { useState } from 'react';
import {
  Film,
  Play,
  Clock,
  Download,
  Trash2,
  Search,
  Sparkles,
  BookOpen,
  Eye,
  Calendar,
  X,
} from 'lucide-react';
import { SavedVideo, VideoStyle } from '../types';
import { VideoCanvasPlayer } from '../components/VideoCanvasPlayer';

interface VideoLibraryViewProps {
  savedVideos: SavedVideo[];
  onDeleteVideo: (id: string) => void;
  onNavigateToGenerator: () => void;
}

export const VideoLibraryView: React.FC<VideoLibraryViewProps> = ({
  savedVideos,
  onDeleteVideo,
  onNavigateToGenerator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<SavedVideo | null>(
    savedVideos.length > 0 ? savedVideos[0] : null
  );

  const filteredVideos = savedVideos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 bg-slate-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>Saved Video Lessons</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Educational Video Library
          </h2>
          <p className="text-slate-400 text-sm">
            Revisit, replay, and download all generated animated whiteboard & lecture videos.
          </p>
        </div>

        <button
          onClick={onNavigateToGenerator}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Video</span>
        </button>
      </div>

      {/* Active Video Player Spotlight (if one is selected) */}
      {selectedVideo && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-4 shadow-2xl relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                NOW PLAYING
              </span>
              <h3 className="text-lg font-bold text-white truncate max-w-xl">
                {selectedVideo.title}
              </h3>
            </div>
            <button
              onClick={() => setSelectedVideo(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close player spotlight"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <VideoCanvasPlayer script={selectedVideo.script} autoPlay={false} />
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved videos by topic or concept..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <span className="text-xs text-slate-400">
          Showing {filteredVideos.length} of {savedVideos.length} videos
        </span>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isSelected = selectedVideo?.id === video.id;
            return (
              <div
                key={video.id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 group flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-xl'
                    : 'border-slate-800 hover:border-slate-700 hover:shadow-lg'
                }`}
              >
                {/* Thumbnail / Header */}
                <div
                  onClick={() => setSelectedVideo(video)}
                  className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden flex items-center justify-center border-b border-slate-800/80"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-10" />

                  {/* Play icon badge */}
                  <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center z-20 group-hover:scale-110 group-hover:bg-cyan-500 transition-all shadow-lg">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>

                  {/* Duration pill */}
                  <div className="absolute bottom-3 right-3 z-20 text-[10px] font-mono text-white bg-black/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.durationSec}s</span>
                  </div>

                  {/* Style pill */}
                  <div className="absolute top-3 left-3 z-20 text-[10px] font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {video.style.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {video.script.overview || video.topic}
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {video.createdAt}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteVideo(video.id);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500 space-y-3 bg-slate-900/30 rounded-3xl border border-slate-800">
          <Film className="w-12 h-12 mx-auto text-slate-600" />
          <h4 className="text-base font-bold text-white">No videos found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try a different search term or generate an educational video from the Video Generator tab.
          </p>
        </div>
      )}
    </div>
  );
};
