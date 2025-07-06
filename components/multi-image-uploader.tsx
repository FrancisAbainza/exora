import { useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { MoveIcon, XIcon } from "lucide-react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Badge } from "./ui/badge";

export type ImageUpload = {
  id: string;
  url: string;
  file?: File;
};

type Props = {
  onImagesChange: (images: ImageUpload[]) => void;
  images?: ImageUpload[];
  urlFormatter: (image: ImageUpload) => string;
}

export default function MultiImageUploader({
  onImagesChange,
  images = [],
  urlFormatter,
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(images);
    const [reorderedImage] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedImage);
    onImagesChange(items);
  }

  const handleDelete = (id: string) => {
    // Reset the file input value so the user can upload the same file again
    if (uploadInputRef.current?.value) {
      uploadInputRef.current.value = ''; // Reset file input
    }

    const updatedImages = images.filter((image) => image.id !== id);
    onImagesChange(updatedImages);
  }

  return (
    <div>
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="property-images" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="relative"
                    >
                      <div key={image.id} className="flex items-center gap-3 border-1 rounded-md shadow-xs overflow-hidden mt-3 pr-3">
                        <div className="relative size-16">
                          <Image
                            src={urlFormatter(image)}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 overflow-hidden py-3">
                          <p className="break-all">{image?.file?.name || image.id}</p>
                          {index === 0 && (
                            <Badge variant={"outline"}>Featured Image</Badge>
                          )}
                        </div>
                        <button onClick={() => { handleDelete(image.id) }}>
                          <XIcon className="text-destructive" />
                        </button>
                        <MoveIcon className="text-gray-500" />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}