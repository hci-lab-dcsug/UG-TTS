const SC_BASE = "https://hcidcsug--ugsc-akan-api.modal.run"

export async function GET() {
  try {
    // Upstream returns models at the root path
    const upstream = await fetch(`${SC_BASE}/`, { cache: "no-store" })
    const text = await upstream.text()
    return new Response(text, {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") || "application/json",
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch models"
    return new Response(JSON.stringify({ message }), {
      status: 502,
      headers: { "content-type": "application/json" },
    })
  }
}
