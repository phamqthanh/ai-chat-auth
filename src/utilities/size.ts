export function calculateSize(data: any) {
  const size = new TextEncoder().encode(JSON.stringify(data)).length;
  const kiloBytes = size / 1024;
  const megaBytes = kiloBytes / 1024;
  return {
    size,
    kiloBytes,
    megaBytes,
  };
}
