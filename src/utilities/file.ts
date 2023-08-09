export interface RenderImageItem {
  src: string;
  name: string;
  lastModified: number;
  id?: number;
  file: string | File;
}
const imagesRender = new Map<string, RenderImageItem>();

type IMGType = File | string;
function fileToBlob(files?: IMGType | FileList | Array<IMGType>): RenderImageItem[] {
  if (!files) return [];
  const images: RenderImageItem[] = [];
  const f = Array.isArray(files) || files instanceof FileList ? files : [files];
  for (let i = 0; i < f.length; i++) {
    const file = f[i];
    if (typeof file === "string") {
      images.push({ src: file, name: "file_number_" + i, lastModified: Date.now(), file });
      continue;
    }

    const key = file.name + "_" + file.lastModified;
    if (imagesRender.has(key)) {
      images.push(imagesRender.get(key)!);
      continue;
    }

    imagesRender.set(key, {
      src: URL.createObjectURL(file),
      name: file.name,
      lastModified: file.lastModified,
      file,
    });
    images.push(imagesRender.get(key)!);
  }
  return images;
}

function readFileFromSystem(
  accept: string,
  callback: (file: File) => void,
  isMultiple?: false
): void;
function readFileFromSystem(
  accept: string,
  callback: (files: FileList) => void,
  isMultiple: true
): void;
function readFileFromSystem(accept: string, callback: any, isMultiple?: boolean) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.multiple = Boolean(isMultiple);
  input.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLInputElement;

    if (target.files) {
      if (isMultiple) callback(target.files);
      else callback(target.files[0]);
    }
  });
  input.click();
}
export { fileToBlob, readFileFromSystem };
