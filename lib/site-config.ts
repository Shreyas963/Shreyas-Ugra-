/** Set in Vercel / .env as NEXT_PUBLIC_SITE_URL=https://your-domain.com (no trailing slash) */
export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (env) return env.replace(/\/$/, "")
  return "https://shreyas-portfolio1-six.vercel.app"
}

export const person = {
  /** Primary name for titles, SEO, and how you want to be found in search */
  brandName: "Shreyas Ugra",
  /** First name — helps tie this site to searches for “Shreyas” together with your work */
  firstName: "Shreyas",
  familyName: "Ugra",
  fullName: "Shreyas Ugra Tarikere Vasudeva Murthy",
  /** Extra phrases search engines may associate with your brand */
  alternateNames: [
    "Shreyas",
    "Shreyas Ugra T V",
    "Shreyas Ugra Tarikere Vasudeva Murthy",
    "Shreyas Ugra developer",
    "Shreyas Ugra portfolio",
    "Shreyas developer",
    "Shreyas portfolio",
  ],
  email: "shreyasugratarikere@gmail.com",
  jobTitle: "Full Stack & AI Developer",
  description:
    "Official portfolio of Shreyas Ugra — also known as Shreyas. Full Stack & AI Developer; M.Sc. Computer Science at RPTU Kaiserslautern. MERN stack, Python, machine learning, NLP. Based in Hamburg, Germany.",
  city: "Hamburg",
  country: "DE",
  linkedIn: "https://www.linkedin.com/in/shreyas-ugra-tarikere-vasudeva-murthy-4994a9254/",
  github: "https://github.com/Shreyas963",
} as const
