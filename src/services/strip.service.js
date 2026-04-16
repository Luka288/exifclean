import Piexif from "piexifjs";
import { handleHeic } from "./heic.service";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function removeMetadata(file) {
  const isHeic =
    file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic";

  let dataUrl;

  if (isHeic) {
    const converted = await handleHeic(file);
    dataUrl = await fileToDataUrl(converted.blob);
  } else if (file.type === "image/jpeg") {
    dataUrl = await fileToDataUrl(file);
  } else {
    dataUrl = await convertToJpeg(file);
  }

  const stripped = Piexif.remove(dataUrl);

  const blob = await dataUrlToBlob(stripped);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `stripped_${file.name}.jpg`;
  a.click();

  URL.revokeObjectURL(url);
}
