export default function pathToFirebaseURL(path: string) {
  return `https://firebasestorage.googleapis.com/v0/b/exora-platform.firebasestorage.app/o/${encodeURIComponent(path)}?alt=media`
}