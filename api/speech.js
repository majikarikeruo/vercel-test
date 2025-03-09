//1つ目の引数がフロントからデータを受け取る固有の場所になっている
export default async function handler(request) {
  try {
    const fullUrl = new URL(request.url, "http://localhost");
    const speaker = fullUrl.searchParams.get("speaker");
    const from = fullUrl.searchParams.get("from");
    const until = fullUrl.searchParams.get("until");

    console.log("1. Received params:", { speaker, from, until });

    const response = await fetch(`https://kokkai.ndl.go.jp/api/speech?speaker=${speaker}&from=${from}&until=${until}&recordPacking=json`);

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

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
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
