/**
 * Cloudflare Pages Function: /api/chat
 * Zero-cost, zero-VPN OpenRouter Proxy for MedSim.
 * Runs on Cloudflare Edge servers globally (outside Russia), bypassing any direct ISP blocks in RU.
 */
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const apiKey = context.env.OPENROUTER_API_KEY || "sk-or-v1-placeholder";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medsim.pages.dev",
        "X-Title": "MedSim Clinical Simulator"
      },
      body: JSON.stringify(body)
    });

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
