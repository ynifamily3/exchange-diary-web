import { useContext, useEffect, useRef, useState } from "react";
import { Image as KImage, Layer, Rect, Stage, Text } from "react-konva";
import { canvasContext } from "../context/canvas";
import useImage from "use-image";
import { Stage as StageType } from "konva/lib/Stage";
import debounce from "lodash-es/debounce";

const alphabetPos: Array<{ x: number; y: number }> = [
  { x: 421, y: 396 },
  { x: 458, y: 394 },
  { x: 508, y: 389 },
  { x: 552, y: 388 },
  { x: 596, y: 387 },
  { x: 643, y: 386 },
  { x: 686, y: 387 },
  { x: 723, y: 386 },
  { x: 425, y: 432 },
  { x: 460, y: 429 },
  { x: 508, y: 426 },
  { x: 553, y: 424 },
  { x: 597, y: 421 },
  { x: 645, y: 421 },
  { x: 687, y: 421 },
  { x: 725, y: 421 },
  { x: 426, y: 469 },
  { x: 462, y: 468 },
  { x: 510, y: 465 },
  { x: 554, y: 461 },
  { x: 598, y: 459 },
  { x: 646, y: 457 },
  { x: 688, y: 458 },
  { x: 727, y: 457 },
  { x: 427, y: 502 },
  { x: 465, y: 499 },
  { x: 511, y: 497 },
  { x: 554, y: 496 },
  { x: 600, y: 495 },
  { x: 646, y: 493 },
  { x: 690, y: 492 },
  { x: 728, y: 494 },
  { x: 426, y: 529 },
  { x: 465, y: 528 },
  { x: 512, y: 524 },
  { x: 554, y: 523 },
  { x: 600, y: 521 },
  { x: 646, y: 520 },
  { x: 690, y: 521 },
  { x: 730, y: 522 },
];

const BackgroundImage = ({ imageUrl }: { imageUrl: string }) => {
  const [image] = useImage(imageUrl);
  return (
    <KImage image={image} width={220} height={300} preventDefault={false} />
  );
};

const FrontImage = ({ imageUrl }: { imageUrl: string }) => {
  const maxWidth = 197;
  const maxHeight = 147;
  const startX = 13;
  const startY = 38;

  const [image] = useImage(imageUrl);
  if (!(image?.width && image?.height)) {
    return null;
  }
  // width와 height 중 긴 쪽을 기준으로 맞춰 주고 짧은 쪽을 비율로 맞춰 준다.
  const ratio = Math.max(image.width / maxWidth, image.height / maxHeight);
  const width = image.width / ratio;
  const height = image.height / ratio;
  const x = startX + (maxWidth - width) / 2;
  const y = startY + (maxHeight - height) / 2;

  return (
    <KImage
      image={image}
      width={width}
      height={height}
      x={x}
      y={y}
      alt={"첨부 이미지"}
      preventDefault={false}
      // draggable
    />
  );
};

const DiaryCanvas = () => {
  const stageRef = useRef<StageType>(null);
  const sceneWidth = useRef<number>(220);
  const sceneHeight = useRef<number>(300);
  const { font, fontLoaded, imageUrl, inlayImageUrl, text, selectionPosition } =
    useContext(canvasContext);

  // handle window resize event
  // width, height, scale은 uncontrolled이다.
  useEffect(() => {
    const fitStageIntoParentContainer = debounce(
      () => {
        if (!stageRef.current) return;
        const containerWidth = Math.min(
          (stageRef.current.content.parentElement?.parentElement?.parentElement
            ?.offsetWidth as number) || 0,
          600
        );

        const scale = containerWidth / sceneWidth.current;
        stageRef.current.width(sceneWidth.current * scale);
        stageRef.current.height(sceneHeight.current * scale);
        stageRef.current.scale({ x: scale, y: scale });
      },
      1000,
      { leading: true }
    );
    fitStageIntoParentContainer();

    window.addEventListener("resize", fitStageIntoParentContainer, {
      passive: true,
    });
    return () => {
      window.removeEventListener("resize", fitStageIntoParentContainer);
    };
  }, []);
  const [x, sX] = useState(0);
  const [y, sY] = useState(0);
  return (
    <Stage
      ref={stageRef}
      onMouseMove={(e) => {
        const scale = stageRef.current?.scaleX() || 1;
        sX(Math.round(e.evt.offsetX / scale));
        sY(Math.round(e.evt.offsetY / scale));
      }}
    >
      <Layer>
        <BackgroundImage imageUrl={inlayImageUrl} />
        {imageUrl && <FrontImage imageUrl={imageUrl} />}
        <Text
          text={text}
          fontFamily={fontLoaded ? font : undefined}
          fontSize={16}
          x={14}
          y={190}
          wrap="char"
          width={195}
          lineHeight={1.2}
        />
        {/* cursor (blink) */}
        <Rect x={0} y={0} width={1} height={16 * 1.2} fill="black" />

        <Text text={`x: ${x}`} fontSize={12} />
        <Text text={`y: ${y}`} fontSize={12} y={12} />
      </Layer>
    </Stage>
  );
};

export default DiaryCanvas;
