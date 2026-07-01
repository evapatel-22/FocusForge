import axios from "axios";

const API_URL = "http://192.168.1.2:5000";

export const uploadProof = async (
  imageUri: string,
  taskName: string
) => {
  const formData = new FormData();

  formData.append("image", {
    uri: imageUri,
    name: "proof.jpg",
    type: "image/jpeg",
  } as any);

  formData.append("taskName", taskName);

  const response = await axios.post(
    `${API_URL}/verify-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};