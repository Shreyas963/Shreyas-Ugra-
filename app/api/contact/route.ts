import { NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(1, "Message is required").max(5000),
})

const NOTIFY_DEFAULT = "shreyasugratarikere@gmail.com"

export async function POST(request: Request) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors
    const first = Object.values(msg).flat()[0] ?? "Invalid input"
    return NextResponse.json({ ok: false, error: first }, { status: 400 })
  }

  const { name, email, message } = parsed.data
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL?.trim() || NOTIFY_DEFAULT

  if (!accessKey) {
    const body = `${message}\n\n— ${name} <${email}>`
    const mailto = `mailto:${encodeURIComponent(notifyTo)}?subject=${encodeURIComponent(`Portfolio contact from ${name}`)}&body=${encodeURIComponent(body)}`
    return NextResponse.json({
      ok: false,
      code: "NOT_CONFIGURED" as const,
      mailto,
      hint: "Add WEB3FORMS_ACCESS_KEY to .env.local for direct delivery, or use your email app via the link.",
    })
  }

  const upstream = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Portfolio contact from ${name}`,
      name,
      email,
      message,
      from_name: name,
      replyto: email,
    }),
  })

  const data = (await upstream.json().catch(() => ({}))) as { success?: boolean; message?: string }

  if (!upstream.ok || !data.success) {
    return NextResponse.json(
      { ok: false, error: data.message || "Could not deliver message. Try again later." },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true })
}
