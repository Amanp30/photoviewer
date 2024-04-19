export default function confirmImages(imgs) {
  const imagesArray = Array.from(imgs);
  return imagesArray.filter((img) => img.tagName.toLowerCase() === "img");
}
