import FontFaceObserver from "fontfaceobserver";
export const fontData = ["Pretendard", "ACC 어린이 마음고운체"];
export const pretendardFont = fontData.map(
  (font) => new FontFaceObserver(font)
);
