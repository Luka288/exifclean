import exifr from "exifr";

const TRASH_KEYS = new Set([
  "makerNote",
  "SubjectArea",
  "SubSecTimeDigitized",
  "SubSecTimeOriginal",
  "ModifyDate",
  "OffsetTime",
  "OffsetTimeDigitized",
  "OffsetTimeOriginal",
  "DeviceManufacturer",
  "LensInfo",
  "CompositeImage",
  "PrimaryPlatform",
  "ProfileClass",
  "ProfileConnectionSpace",
  "ProfileCopyright",
  "ProfileDescription",
  "ProfileVersion",
  "ProfileCreator",
  "RenderingIntent",
  "ProfileCMMType",
  "ProfileFileSignature",
  "ColorSpace",
  "BlueMatrixColumn",
  "BlueTRC",
  "GreenMatrixColumn",
  "GreenTRC",
  "RedMatrixColumn",
  "RedTRC",
  "ChromaticAdaptation",
  "MediaWhitePoint",
  "ThumbnailHeight",
  "ThumbnailWidth",
  "DeviceModel",
  "ProfileDateTime",
]);

export async function extractMetadata(file) {
  const metadata = await exifr.parse(file, true, {
    gps: true,
  });

  return Object.fromEntries(
    Object.entries(metadata).filter(
      ([key, val]) =>
        !TRASH_KEYS.has(key) && val !== undefined && !isBinaryData(val),
    ),
  );
}

function isBinaryData(val) {
  return ArrayBuffer.isView(val);
}
