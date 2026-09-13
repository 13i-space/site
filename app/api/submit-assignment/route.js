// Sign up for a free account at https://resend.com, verify a sending
// domain (or use their default onboarding domain for testing), grab an
// API key from the dashboard, and add it to your hosting provider's
// environment variables as RESEND_API_KEY.
const TO_EMAIL = "pjdonaghy@gmail.com";
const FROM_EMAIL = "13i Assignments <onboarding@resend.dev>";

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Submissions aren't connected yet. Add RESEND_API_KEY in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { name, email, story } = await request.json();
  if (!story || story.trim().length < 10) {
    return Response.json({ error: "Please write a bit more before submitting." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email || undefined,
        subject: `New Assignment submission from ${name || "Anonymous"}`,
        text: `From: ${name || "Anonymous"}\nEmail: ${email || "not provided"}\n\n---\n\n${story}`,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return Response.json({ error: `Submission failed: ${errText}` }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: "Could not reach the submission service." }, { status: 500 });
  }
}
