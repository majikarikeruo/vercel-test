export default async function handler(request) {
  try {
    const fullUrl = new URL(request.url, "http://localhost");
    const speaker = fullUrl.searchParams.get("speaker");
    const from = fullUrl.searchParams.get("from");
    const until = fullUrl.searchParams.get("until");

    // 外部APIからのレスポンスをそのまま流す（ストリーミング）
    const response = await fetch(
      `https://kokkai.ndl.go.jp/api/speech?${new URLSearchParams({
        speaker,
        from,
        until,
        recordPacking: "json",
      })}`
    );

    // レスポンスをそのまま返す（パースせずに）
    return new Response(response.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
