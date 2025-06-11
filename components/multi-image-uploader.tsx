import { useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { XIcon } from "lucide-react";

export type ImageUpload = {
  id: string;
  url: string;
  file: File;
};

type Props = {
  onImagesChange: (images: ImageUpload[]) => void;
  images?: ImageUpload[];
}

export default function MultiImageUploader({
  onImagesChange,
  images = [],
}: Props) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    const newImages = files.map((file, index) => {
      return {
        id: `${Date.now()}-${index}-${file.name}`,
        url: URL.createObjectURL(file),
        file,
      }
    });

    onImagesChange([...images, ...newImages]);
  }

  const handleDelete = (id: string) => {
    // Reset the file input value so the user can upload the same file again
    if (uploadInputRef.current?.value) {
      uploadInputRef.current.value = ''; // Reset file input
    }

    const updatedImages = images.filter((image) => image.id !== id);
    onImagesChange(updatedImages);
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        className="hidden"
        ref={uploadInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
      />
      <Button
        className="w-full"
        variant="outline"
        type="button"
        onClick={() => uploadInputRef?.current?.click()}
      >
        Upload images
      </Button>
      {images.map((image) => (
        <div key={image.id} className="flex items-center gap-6 border-1 rounded-md shadow-xs overflow-hidden pr-3">
          <div className="relative size-16">
            <Image
              src={image.url}
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <p className="flex-1">{image?.file?.name || image.id}</p>
          <button onClick={() => { handleDelete(image.id) }}>
            <XIcon className="text-destructive" />
          </button>
        </div>
      ))}
    </div>
  );
}