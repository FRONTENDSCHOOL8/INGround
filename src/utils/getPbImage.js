const PB_URL = import.meta.env.VITE_PB_URL;

export default function getPbImage({ collectionId, id, photo }) {
  return `${PB_URL}/api/files/${collectionId}/${id}/${photo}`;
}
