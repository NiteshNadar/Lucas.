import { NextResponse } from "next/server";

// ─────────────────────────────────────
// SECURE API ROUTE — /api/contact
// This code runs on the SERVER only.
// Your n8n webhook URL is NEVER exposed
// to the browser or Chrome DevTools.
// ─────────────────────────────────────

// Put your n8n webhook URL here. It is 100% hidden from the frontend.
const N8N_WEBHOOK_URL = "https://pluxon8n.app.n8n.cloud/webhook/lead";

// Validation (server-side mirror of client-side rules)
const validators = {
  name: (v) => /^[\p{L}\s.\-']{2,50}$/u.test((v || "").trim()),
  phone: (v) => /^\+?[0-9\s\-()]{7,20}$/.test((v || "").trim()),
  email: (v) =>
    /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(
      (v || "").trim()
    ),
  description: (v) => (v || "").trim().length >= 10,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, description } = body;

    // Server-side validation (never trust the client)
    const errors = [];
    if (!validators.name(name)) errors.push("Invalid name");
    if (!validators.phone(phone)) errors.push("Invalid phone");
    if (!validators.email(email)) errors.push("Invalid email");
    if (!validators.description(description)) errors.push("Invalid description");

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    // If n8n webhook is configured, forward the data securely
    if (N8N_WEBHOOK_URL) {
      const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          description: description.trim(),
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!webhookResponse.ok) {
        console.error("n8n webhook failed:", webhookResponse.status);
        return NextResponse.json(
          { error: "Submission failed. Please try again." },
          { status: 502 }
        );
      }
    } else {
      // Log to server console if no webhook is configured yet
      console.log("📩 New contact form submission:", {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        description: description.trim(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
