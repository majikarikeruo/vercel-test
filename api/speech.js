//1つ目の引数がフロントからデータを受け取る固有の場所になっている
export default async function handler(request) {
  try {
    const fullUrl = new URL(request.url, "http://localhost");
    const speaker = fullUrl.searchParams.get("speaker");
    const from = fullUrl.searchParams.get("from");
    const until = fullUrl.searchParams.get("until");

    console.log("1. Received params:", { speaker, from, until });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒でタイムアウト

    const response = await fetch(`https://kokkai.ndl.go.jp/api/speech?speaker=${speaker}&from=2024-12-24&recordPacking=json`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    console.log("2. Response status:", response.status);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // レスポンスの内容を確認
    const responseText = await response.text();
    console.log("3. Response text:", responseText);

    // 空のレスポンスをチェック
    if (!responseText) {
      throw new Error("Empty response from API");
    }

    // JSONとしてパース
    const data = JSON.parse(responseText);
    console.log("4. Parsed data:", data);

    return Response.json(data); // 新しい Response.json() メソッドを使用
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
