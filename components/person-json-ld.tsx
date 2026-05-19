import { getSiteUrl, person } from "@/lib/site-config"

export default function PersonJsonLd() {
  const url = getSiteUrl()
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.brandName,
    givenName: person.firstName,
    familyName: person.familyName,
    alternateName: ["Shreyas", person.fullName, "Shreyas Ugra T V"],
    url,
    email: person.email,
    jobTitle: person.jobTitle,
    description: person.description,
    image: `${url}/profile.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: person.city,
      addressCountry: person.country,
    },
    sameAs: [person.linkedIn, person.github, url],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "RPTU Kaiserslautern" },
      { "@type": "CollegeOrUniversity", name: "Visvesvaraya Technological University" },
    ],
    knowsAbout: [
      "Full Stack Development",
      "MERN Stack",
      "Python",
      "Machine Learning",
      "Natural Language Processing",
      "Computer Science",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
