import { useContext } from "react";
import { Image, Layer, Stage, Text } from "react-konva";
import { canvasContext } from "../context/canvas";
import useImage from "use-image";

const BackgroundImage = () => {
  const [image] = useImage("/diary.png");
  return (
    <Image
      image={image}
      width={800}
      height={603}
      scale={{ x: 0.625, y: 0.625 }}
      alt={""}
      // x={-230}
      y={50}
    />
  );
};

const FrontImage = ({ imageUrl }: { imageUrl: string }) => {
  const [image] = useImage(imageUrl);
  return (
    <Image
      image={image}
      width={image?.width || 300}
      height={image?.height || 300}
      scale={{ x: 0.625, y: 0.625 }}
      alt={""}
      draggable
    />
  );
};

const DiaryCanvas = () => {
  const { font, fontLoaded, imageUrl, inlayImageUrl, text } =
    useContext(canvasContext);
  console.log("-->", imageUrl);
  return (
    <Stage width={500} height={500}>
      <Layer>
        <BackgroundImage />
        <Text
          draggable
          text={text}
          fontFamily={fontLoaded ? font : undefined}
          fontSize={24}
        />
        {imageUrl && <FrontImage imageUrl={imageUrl} />}
      </Layer>
    </Stage>
  );
};

export default DiaryCanvas;
