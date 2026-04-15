import heic2any from "heic2any";

export async function handleHeic(file) {
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  const blob = Array.isArray(result) ? result[0] : result;

  return {
    blob,
    url: URL.createObjectURL(blob),
  };
}
