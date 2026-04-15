import "./style.css";
import { extractMetadata } from "./services/metadata.service";
import { formatSize } from "./utils/formatSize";
import { formatKey } from "./utils/keyformat";

const fileUploadBtn = document.getElementById("fileUploadInput");
const fileInput = document.getElementById("fileInput");
const metadataSec = document.getElementById("metadata");
const demoImage = document.getElementById("demoImage");
const nav = document.querySelectorAll(".tabNav");

fileUploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async (event) => {
  const image = event.target.files[0];

  console.log(image);

  handleFile(image);
});

async function handleFile(file) {
  const metadata = await extractMetadata(file);

  metadataSec.style.display = "flex";
  demoImage.src = URL.createObjectURL(file);

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
  imageDetail.textContent = `${file.type} • ${date.toLocaleDateString()}`;

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

// formatSize(rawData.size)
