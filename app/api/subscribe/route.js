// Sign up for a free account at https://buttondown.email, then find your
// API key at https://buttondown.email/settings/api and add it to your
// hosting provider's environment variables as BUTTONDOWN_API_KEY.
export async function POST(request) {
  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Email signup isn't connected yet. Add BUTTONDOWN_API_KEY in your hosting provider's environment variables." },
      { status: 500 }
    );
  }

  const { email } = await request.json();
  if (!email || !email.includes("@")) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errText = await response.text();
      // Buttondown returns a 400 with a friendly-ish message if someone's
      // already subscribed - treat that as a success, not an error.
      if (response.status === 400 && errText.toLowerCase().includes("already")) {
        return Response.json({ ok: true, alreadySubscribed: true });
      }
      return Response.json({ error: `Signup failed: ${errText}` }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: "Could not reach the signup service." }, { status: 500 });
  }
}
