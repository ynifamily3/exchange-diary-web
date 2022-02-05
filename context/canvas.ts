import { fontData } from "./../util/font";
import { createContext } from "react";

// 폰트 로딩 여부
// 렌더링할 폰트
// 일기장에 쓰여진 데이터
// 일기장에 첨부된 이미지 (blob url)
// 일기장 속지 (inlay image url)

export type CanvasData = {
  fontLoaded: boolean;
  font: string;
  text: string;
  imageUrl: string | null;
  inlayImageUrl: string;
  selectionPosition: number;
};

// context

export const canvasContext = createContext<CanvasData>({
  fontLoaded: false,
  font: fontData[0],
  text: "",
  imageUrl: null,
  inlayImageUrl: "diary.png",
  selectionPosition: 0,
});

// Provider
