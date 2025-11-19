const SC_BASE = "https://hcidcsug--ugsc-akan-api.modal.run"

function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "content-type": "application/json" },
  })
}

async function forwardSuggestPOSTJSON(word: string, model_name: string, max: number) {
  const upstream = await fetch(`${SC_BASE}/suggest`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      word,
      model_name,
      max_suggestions: max,
    }),
    cache: "no-store",
  })
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
    // Accept GET from client, normalize to POST JSON upstream
    const { searchParams } = new URL(req.url)
    const word = (searchParams.get("word") || "").trim()
    const model_name = (searchParams.get("model_name") || "default").trim()
    const max = Number(searchParams.get("max_suggestions") || 5)
    if (!word) return jsonError('Missing required query parameter "word"', 422)
    return await forwardSuggestPOSTJSON(word, model_name, Number.isFinite(max) ? max : 5)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Suggest failed"
    return jsonError(message, 502)
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""
    let word = ""
    let model_name = "default"
    let max = 5

    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}))
      word = typeof body?.word === "string" ? body.word.trim() : ""
      model_name = typeof body?.model_name === "string" ? body.model_name.trim() : "default"
      const m = Number(body?.max_suggestions ?? 5)
      max = Number.isFinite(m) ? m : 5
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData()
      word = String(form.get("word") || "").trim()
      model_name = String(form.get("model_name") || "default").trim()
      const m = Number(form.get("max_suggestions") || 5)
      max = Number.isFinite(m) ? m : 5
    } else {
      const { searchParams } = new URL(req.url)
      word = (searchParams.get("word") || "").trim()
      model_name = (searchParams.get("model_name") || "default").trim()
      const m = Number(searchParams.get("max_suggestions") || 5)
      max = Number.isFinite(m) ? m : 5
    }

    if (!word) return jsonError('Missing required field "word"', 422)
    return await forwardSuggestPOSTJSON(word, model_name, max)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Suggest failed"
    return jsonError(message, 502)
  }
}
