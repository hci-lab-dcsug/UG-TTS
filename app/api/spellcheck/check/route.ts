const SC_BASE = "https://hcidcsug--ugsc-akan-api.modal.run"

function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "content-type": "application/json" },
  })
}

async function forwardCheckPOSTQuery(word: string, model_name: string) {
  // Upstream expects POST with query params, not JSON body
  const url = `${SC_BASE}/check?word=${encodeURIComponent(word)}&model_name=${encodeURIComponent(model_name)}`
  const upstream = await fetch(url, { method: "POST", cache: "no-store" })
  const text = await upstream.text()
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
    },
  })
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const word = (searchParams.get("word") || "").trim()
    const model_name = (searchParams.get("model_name") || "default").trim()
    if (!word) return jsonError('Missing required query parameter "word"', 422)
    return await forwardCheckPOSTQuery(word, model_name)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Check failed"
    return jsonError(message, 502)
  }
}

export async function POST(req: Request) {
  try {
    // Accept JSON or form, normalize to query param forward
    let word = ""
    let model_name = "default"

    const contentType = req.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}))
      word = typeof body?.word === "string" ? body.word.trim() : ""
      model_name = typeof body?.model_name === "string" ? body.model_name.trim() : "default"
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData()
      word = String(form.get("word") || "").trim()
      model_name = String(form.get("model_name") || "default").trim()
    } else {
      // Also support word/model_name in the URL query for flexibility
      const { searchParams } = new URL(req.url)
      word = (searchParams.get("word") || "").trim()
      model_name = (searchParams.get("model_name") || "default").trim()
    }

    if (!word) return jsonError('Missing required field "word"', 422)
    return await forwardCheckPOSTQuery(word, model_name)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Check failed"
    return jsonError(message, 502)
  }
}
