const SC_BASE = "https://hcidcsug--ugsc-akan-api.modal.run"

function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "content-type": "application/json" },
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { text, model_name = "default" } = body || {}
    if (!text) return jsonError('Missing required field "text"', 422)

    const upstream = await fetch(`${SC_BASE}/spellcheck`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, model_name }),
    })
    const textResp = await upstream.text()
    return new Response(textResp, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/json",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Spellcheck failed"
    return jsonError(message, 502)
  }
}
