const API = "http://192.168.1.2:5000/graph/save-task";

export async function saveGraphTask(
  uid: string,
  name: string,
  taskName: string
) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid,
      name,
      taskName,
    }),
  });

  return await response.json();
}