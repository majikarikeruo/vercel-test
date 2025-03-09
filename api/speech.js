//1つ目の引数がフロントからデータを受け取る固有の場所になっている
export default async function handler(request) {
  try {
    const fullUrl = new URL(request.url, "http://localhost");
    const speaker = fullUrl.searchParams.get("speaker");
    const from = fullUrl.searchParams.get("from");
    const until = fullUrl.searchParams.get("until");

    console.log("1. Received params:", { speaker, from, until });

    const apiUrl = `https://kokkai.ndl.go.jp/api/speech?${new URLSearchParams({
      speaker,
      from,
      until,
      recordPacking: "json",
    })}`;

    console.log("2. Requesting URL:", apiUrl);

    // fetchの前後でログを追加
    console.log("3. Starting fetch request...");
    const response = await fetch(apiUrl);
    console.log("4. Fetch completed, status:", response.status);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    console.log("5. Starting JSON parse...");
    const data = await response.json();
    console.log("6. JSON parse completed");

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
