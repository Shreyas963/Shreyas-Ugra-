"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Send, Mic, MicOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const QUICK_PROMPTS = [
  {
    label: "Tell me about Shreyas's experience",
    text: "I'd like to know more about your internship at Infosys Springboard and the projects you contributed to there.",
  },
  {
    label: "What technologies does he use?",
    text: "Could you summarize your strongest technical skills across full stack development, ML/NLP, and tooling?",
  },
  {
    label: "Schedule a meeting",
    text: "I'd like to schedule a short call to discuss a potential collaboration. Please suggest a few time slots that work for you.",
  },
] as const

type SpeechRecognitionResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

type SpeechRecognitionInstance = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onresult: ((ev: SpeechRecognitionResultEvent) => void) | null
  onerror: ((ev: Event) => void) | null
  onend: (() => void) | null
}

export default function ContactSection() {
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const recognitionRef = useRef<{ stop: () => void } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        code?: string
        mailto?: string
        hint?: string
      }

      if (data.ok) {
        toast({
          title: "Message sent",
          description: "Thanks for reaching out — I'll get back to you soon.",
        })
        setFormData({ name: "", email: "", message: "" })
        return
      }

      if (data.code === "NOT_CONFIGURED" && data.mailto) {
        toast({
          title: "Opening your email app",
          description:
            data.hint ??
            "Add WEB3FORMS_ACCESS_KEY to .env.local to send from the site without leaving the page.",
        })
        window.location.assign(data.mailto)
        return
      }

      toast({
        variant: "destructive",
        title: "Could not send",
        description: data.error ?? "Something went wrong. Please try again.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Check your connection and try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const applyQuickPrompt = (text: string) => {
    setFormData((prev) => ({ ...prev, message: text }))
    toast({ title: "Message filled", description: "Edit as you like, then send." })
  }

  const toggleRecording = () => {
    if (typeof window === "undefined") return

    if (isRecording) {
      recognitionRef.current?.stop()
      recognitionRef.current = null
      setIsRecording(false)
      return
    }

    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition

    if (!SpeechRecognitionCtor) {
      toast({
        title: "Voice input unavailable",
        description: "Try Chrome or Edge, or type your message.",
      })
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ""
      if (transcript) {
        setFormData((prev) => ({
          ...prev,
          message: prev.message ? `${prev.message} ${transcript}`.trim() : transcript,
        }))
      }
    }
    recognition.onerror = () => {
      recognitionRef.current = null
      setIsRecording(false)
      toast({
        variant: "destructive",
        title: "Voice input failed",
        description: "Allow microphone access or try again.",
      })
    }
    recognition.onend = () => {
      recognitionRef.current = null
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setIsRecording(true)
      toast({ title: "Listening…", description: "Speak your message. Tap the mic again to stop." })
    } catch {
      recognitionRef.current = null
      toast({
        variant: "destructive",
        title: "Could not start microphone",
        description: "Check permissions and try again.",
      })
    }
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 liquid-gradient font-sora">Let's Connect</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Ready to bring your ideas to life? Let's discuss how we can create something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">💬 Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="glass-morphism border-white/20 text-white placeholder:text-white/50"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="glass-morphism border-white/20 text-white placeholder:text-white/50 min-h-32"
                      required
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleRecording}
                      className={`absolute top-2 right-2 ${
                        isRecording ? "text-red-400 animate-pulse" : "text-white/60"
                      }`}
                    >
                      {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full glass-morphism border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:animate-glow disabled:opacity-60"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-5 w-5" />
                    )}
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info & AI Assistant */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            {/* Contact Information */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">📞 Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <span className="text-white/80">shreyasugratarikere@gmail.com</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <span className="text-white/80">(+49) 015567046223</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <span className="text-white/80">Hamburg, Germany</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">🤖 AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 flex items-center justify-center text-sm">
                      AI
                    </div>
                    <div className="flex-1">
                      <p className="text-white/80 text-sm">
                        Hi! I can answer questions about Shreyas's work experience, technical stack, AI projects, and
                        availability for collaboration opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((p) => (
                      <Badge
                        key={p.label}
                        role="button"
                        tabIndex={0}
                        variant="secondary"
                        className="bg-white/10 text-white cursor-pointer hover:bg-white/20 transition-colors"
                        onClick={() => applyQuickPrompt(p.text)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            applyQuickPrompt(p.text)
                          }
                        }}
                      >
                        {p.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">🌐 Connect Online</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      name: "GitHub",
                      icon: "🐙",
                      color: "hover:text-gray-400",
                      href: "https://github.com/Shreyas963",
                    },
                    {
                      name: "LinkedIn",
                      icon: "💼",
                      color: "hover:text-blue-400",
                      href: "https://linkedin.com/in/shreyas-ugra-t-v-4994a9254",
                    },
                    {
                      name: "Portfolio",
                      icon: "🌐",
                      color: "hover:text-cyan-400",
                      href: "https://shreyas-portfolio1-six.vercel.app",
                    },
                    {
                      name: "Email",
                      icon: "✉️",
                      color: "hover:text-purple-400",
                      href: "mailto:shreyasugratarikere@gmail.com",
                    },
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 p-3 rounded-lg glass-morphism border border-white/10 text-white/80 transition-colors ${social.color}`}
                    >
                      <span className="text-lg">{social.icon}</span>
                      <span>{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 pt-8 border-t border-white/10 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/60">© 2026 Shreyas Ugra. Crafted with ❤️ and cutting-edge tech.</div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
              <span className="text-white/40 text-sm">Powered by Next.js & Three.js</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
