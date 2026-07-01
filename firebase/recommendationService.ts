const API =
  "http://192.168.1.2:5000/recommendation";

export async function getRecommendation(
  uid: string
) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
    },
    body: JSON.stringify({
      uid,
    }),
  });

  return await response.json();
}