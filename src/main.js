import "./style.css";
import { extractMetadata } from "./services/metadata.service";
import { formatSize } from "./utils/formatSize";
import { formatKey } from "./utils/keyformat";
import { handleHeic } from "./services/heic.service";

const fileUploadBtn = document.getElementById("fileUploadInput");
const fileInput = document.getElementById("fileInput");
const metadataSec = document.getElementById("metadata");
const demoImage = document.getElementById("demoImage");
const nav = document.querySelectorAll(".tabNav");
const upload = document.getElementById("upload");

fileUploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (event) => {
  const image = event.target.files[0];

  console.log(image);

  handleFile(image);
});

upload.addEventListener("dragover", (e) => {
  e.preventDefault();
  upload.classList.add("drag-drop");
});

upload.addEventListener("dragleave", (e) => {
  if (!upload.contains(e.relatedTarget)) {
    upload.classList.remove("drag-drop");
  }
});

upload.addEventListener("drop", (e) => {
  e.preventDefault();
  upload.classList.remove("drag-drop");

  const file = e.dataTransfer.files[0];

  if (!file) return;

  handleFile(file);
});

async function handleFile(file) {
  showLoading();

  const isHeic =
    file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic";

  let previewUrl;
  let metadata;

  if (isHeic) {
    const converted = await handleHeic(file);

    previewUrl = converted.url;

    metadata = await extractMetadata(converted.blob);
  } else {
    previewUrl = URL.createObjectURL(file);
    metadata = await extractMetadata(file);
  }

  metadataSec.style.display = "flex";
  demoImage.src = previewUrl;
  hideLoading();

  nav.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      nav.forEach((t) => t.classList.remove("active"));
      e.currentTarget.classList.add("active");
    });
  });

  handleUI(file, metadata);
}

function handleUI(file, metadata) {
  const imageTitle = document.getElementById("imageTitle");
  const imageDetail = document.getElementById("imageDetail");
  const data = document.querySelector(".data");

  const date = new Date(file.lastModified);

  imageTitle.textContent = file.name;
  imageDetail.textContent = file.type
    ? `${file.type} • ${date.toLocaleDateString()}`
    : date.toLocaleDateString();

  data.innerHTML = "";

  const ul = document.createElement("ul");

  const displayData = {
    name: file.name,
    type: file.type,
    size: formatSize(file.size),
    lastModified: date.toLocaleDateString(),
  };

  Object.entries(displayData)
    .filter(([key, val]) => val !== "")
    .forEach(([key, value]) => {
      const li = document.createElement("li");

      const keySpan = document.createElement("span");
      keySpan.textContent = `${formatKey(key)}: `;

      const valueText = document.createTextNode(value) ?? null;

      li.appendChild(keySpan);
      li.appendChild(valueText);
      ul.appendChild(li);
    });

  data.appendChild(ul);
}

function showLoading() {
  document.querySelector(".overlay").style.display = "flex";
}

function hideLoading() {
  document.querySelector(".overlay").style.display = "none";
}
