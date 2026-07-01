const API =
  "https://focusforge-backend-kfuh.onrender.com/recommendation";

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