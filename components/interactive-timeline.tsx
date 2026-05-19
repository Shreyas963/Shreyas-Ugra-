"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Briefcase } from "lucide-react"

const timelineData = [
  {
    id: 1,
    year: "Apr 2026 - Present",
    title: "M.Sc. Computer Science",
    company: "RPTU Kaiserslautern",
    location: "Kaiserslautern, Germany",
    description: "Pursuing advanced computer science studies with focus on software systems and AI-driven applications.",
    technologies: ["Computer Science", "Software Engineering", "AI"],
    achievements: ["Currently pursuing M.Sc. in Germany", "Building deeper expertise in scalable systems and applied AI"],
  },
  {
    id: 2,
    year: "Sep 2023 - Apr 2024",
    title: "Full Stack & AI Developer Intern",
    company: "Infosys Springboard",
    location: "Bangalore, India",
    description: "Built backend and data pipelines to improve fraud-pattern detection and ML reliability.",
    technologies: ["Python", "Node.js", "Pandas", "NumPy", "ML Pipelines"],
    achievements: [
      "Engineered preprocessing and outlier detection logic to improve classification performance",
      "Designed backend modules to trace data flow and enforce data integrity",
      "Authored cross-team documentation for recurring workflow issues",
    ],
  },
  {
    id: 3,
    year: "Mar 2023 - Aug 2023",
    title: "IT Support & System Assistant",
    company: "Rooman Technologies",
    location: "Bangalore, India",
    description: "Supported system operations, troubleshooting, and process automation for internal teams.",
    technologies: ["PowerShell", "Windows Administration", "System Support"],
    achievements: [
      "Monitored systems and event logs to identify anomalies",
      "Automated internal workflows to improve operational efficiency",
      "Documented incidents and suspicious activity patterns",
    ],
  },
  {
    id: 4,
    year: "Dec 2021 - May 2025",
    title: "B.E. Computer Science & Engineering",
    company: "Visvesvaraya Technological University",
    location: "Bangalore, India",
    description: "Completed undergraduate degree with strong academics and hands-on software projects.",
    technologies: ["Data Structures", "Web Development", "Databases", "Machine Learning"],
    achievements: ["CGPA: 9.32", "Best Academic Excellence Award", "Ranked among top students in department"],
  },
]

export default function InteractiveTimeline() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full" />

      <div className="space-y-12">
        {timelineData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
          >
            {/* Content Card */}
            <div className={`w-5/12 ${index % 2 === 0 ? "pr-8" : "pl-8"}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                className="cursor-pointer"
              >
                <Card className="glass-morphism border-white/20 hover:border-cyan-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      <span className="text-cyan-400 font-semibold">{item.year}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>

                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4 text-purple-400" />
                      <span className="text-white/80">{item.company}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4 text-green-400" />
                      <span className="text-white/60">{item.location}</span>
                    </div>

                    <p className="text-white/70 mb-4">{item.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-white/10 text-white">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Timeline Node */}
            <div className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full border-4 border-black shadow-lg"
              />
            </div>

            {/* Spacer */}
            <div className="w-5/12" />
          </motion.div>
        ))}
      </div>

      {/* Expanded Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-morphism rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              {(() => {
                const item = timelineData.find((i) => i.id === selectedItem)
                if (!item) return null

                return (
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-white/80 mb-6">{item.description}</p>

                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Key Achievements:</h4>
                    <ul className="space-y-2 mb-6">
                      {item.achievements.map((achievement, i) => (
                        <li key={i} className="text-white/70 flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                          {achievement}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-white/10 text-white">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
