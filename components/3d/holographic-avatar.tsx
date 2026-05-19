"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

/** Add your headshot as `public/profile.jpg` (square-ish photo works best). If missing, emoji fallback shows. */
const PROFILE_SRC = "/profile.jpg"

export default function HolographicAvatar() {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto">
      {/* Holographic Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
      />

      {/* Inner Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-2 rounded-full border border-purple-400/40"
      />

      {/* Avatar Container */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute inset-4 rounded-full glass-morphism flex items-center justify-center overflow-hidden ring-2 ring-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
      >
        {!imgError ? (
          <Image
            src={PROFILE_SRC}
            alt="Shreyas Ugra"
            fill
            sizes="(max-width: 768px) 144px, 176px"
            className="object-cover rounded-full"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center">
            <span className="text-5xl md:text-6xl" aria-hidden>
              👨‍💻
            </span>
          </div>
        )}
      </motion.div>

      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl animate-pulse pointer-events-none" />
    </div>
  )
}
