"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { type VideoSlot, VIDEO_SLOTS } from "@/data/video-data";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

interface VideoCardProps {
  video: VideoSlot;
  onClick: (video: VideoSlot) => void;
}

function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <motion.div
      className="reel-card"
      variants={{
        hidden: { opacity: 0, scale: 0.97 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_OUT } },
      }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(video)}
      tabIndex={0}
      role="button"
      aria-label={`Reproducir: ${video.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(video);
        }
      }}
    >
      <div className="reel-card__thumb">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="reel-card__img"
          loading="lazy"
          decoding="async"
        />
        <div className="reel-card__overlay" aria-hidden="true" />
        <div className="reel-card__play" aria-hidden="true">
          <PlayIcon />
        </div>
      </div>

      <div className="reel-card__info">
        <span className="reel-card__category">{video.category}</span>
        <p className="reel-card__title">{video.title}</p>
        <div className="reel-card__platforms">
          {video.instagramUrl && (
            <span className="reel-card__platform">
              <InstagramIcon />
              Instagram
            </span>
          )}
          {video.tiktokUrl && (
            <span className="reel-card__platform">
              <TikTokIcon />
              TikTok
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface VideoModalProps {
  video: VideoSlot;
  onClose: () => void;
}

function VideoModal({ video, onClose }: VideoModalProps) {
  const [platform, setPlatform] = useState<"instagram" | "tiktok">(
    video.instagramUrl ? "instagram" : "tiktok"
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const activeUrl = platform === "instagram" ? video.instagramUrl : video.tiktokUrl;

  const getEmbedUrl = (url: string, p: "instagram" | "tiktok") => {
    if (p === "instagram") {
      const reelMatch = url.match(/instagram\.com\/reel\/([^/?]+)/);
      if (reelMatch) return `https://www.instagram.com/reel/${reelMatch[1]}/embed/`;
      const postMatch = url.match(/instagram\.com\/p\/([^/?]+)/);
      if (postMatch) return `https://www.instagram.com/p/${postMatch[1]}/embed/`;
      return url;
    }
    if (p === "tiktok") {
      const match = url.match(/video\/(\d+)/);
      if (match) return `https://www.tiktok.com/embed/v2/${match[1]}`;
      return url;
    }
    return url;
  };

  return (
    <motion.div
      className="reel-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Video: ${video.title}`}
    >
      <motion.div
        className="reel-modal__inner"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="reel-modal__header">
          <div>
            <span className="reel-card__category">{video.category}</span>
            <p className="reel-modal__title">{video.title}</p>
          </div>
          <button
            className="reel-modal__close"
            onClick={onClose}
            aria-label="Cerrar video"
          >
            <X size={20} />
          </button>
        </div>

        {video.instagramUrl && video.tiktokUrl && (
          <div className="reel-modal__tabs">
            <button
              className={`reel-modal__tab ${platform === "instagram" ? "reel-modal__tab--active" : ""}`}
              onClick={() => setPlatform("instagram")}
            >
              <InstagramIcon />
              Instagram
            </button>
            <button
              className={`reel-modal__tab ${platform === "tiktok" ? "reel-modal__tab--active" : ""}`}
              onClick={() => setPlatform("tiktok")}
            >
              <TikTokIcon />
              TikTok
            </button>
          </div>
        )}

        <div className="reel-modal__embed">
          {activeUrl && (
            <iframe
              src={getEmbedUrl(activeUrl, platform)}
              className="reel-modal__iframe"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              title={video.title}
            />
          )}
        </div>

        <div className="reel-modal__footer">
          {activeUrl && (
            <Link
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
            >
              Ver en {platform === "instagram" ? "Instagram" : "TikTok"}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ReelsSection() {
  const [activeVideo, setActiveVideo] = useState<VideoSlot | null>(null);

  const openModal = useCallback((video: VideoSlot) => {
    setActiveVideo(video);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setActiveVideo(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <section className="reels section-spacing" aria-label="Videos del taller">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow-wrap">
            <span className="section-eyebrow-dot" aria-hidden="true" />
            <span className="section-eyebrow">En acción</span>
          </div>
          <h2 className="section-heading">
            El proceso,
            <br />
            <span className="section-heading-accent">en video</span>
          </h2>
          <p className="section-description">
            Mirá cómo trabajamos. Cada reel muestra el proceso real detrás de cada tratamiento.
          </p>
        </div>

        <motion.div
          className="reels__grid"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {VIDEO_SLOTS.map((video) => (
            <VideoCard key={video.id} video={video} onClick={openModal} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <VideoModal video={activeVideo} onClose={closeModal} />
        )}
      </AnimatePresence>
    </section>
  );
}