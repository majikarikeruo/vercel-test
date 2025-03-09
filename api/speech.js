//1つ目の引数がフロントからデータを受け取る固有の場所になっている
export default async function handler(request) {
  //バックエンドのルート定義
  console.log(1, request.params);
  console.log(2, request.query);

  try {
    // URLSearchParamsを使って、検索用のクエリパラメータ（speaker、from、until）を設定
    const { searchParams } = new URL(request.url);
    const speaker = searchParams.get("speaker");
    const from = searchParams.get("from");
    const until = searchParams.get("until");

    console.log(3, speaker, from, until);
    //APIにリクエストを送信
    const response = await fetch(`https://kokkai.ndl.go.jp/api/speech?speaker=${speaker}&from=${from}&until=${until}&recordPacking=json`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    //APIから返ってきたデータを取得
    const data = await response.json();
    console.log(4, data);
    //フロントにデータを返す
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
      timeout: 30000,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
