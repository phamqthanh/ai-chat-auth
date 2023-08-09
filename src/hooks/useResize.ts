import { RefObject, useEffect, useState } from "react";
import useBoolean from "./useBoolean";
import { clamp } from "@/utilities/clamp";
import { getPointerPosition } from "@/utilities/position";
import { ownerDocument } from "@/utilities/dom";

export function useResize(
  elementRef: RefObject<HTMLElement>,
  options?: Partial<{
    min: number;
    max: number;
    default: number;
    onResize: (width: number) => void;
    onReset: Function;
  }>
) {
  const active = useBoolean();

  function handleMouseUp() {}

  function onMouseDown(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();

    const [x, y] = getPointerPosition(e.nativeEvent);
    const element = elementRef.current;
    const initWidth = element?.clientWidth || 0;
    const doc = ownerDocument(e.currentTarget);

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;
      const [newX, newY] = getPointerPosition(e);
      const newWidth = clamp(
        Math.ceil(initWidth + newX - x),
        options?.min || 200,
        options?.max || 300
      );
      element.style.width = `${newWidth}px`;
    };
    function cleanup() {
      handleMouseUp();
      doc.removeEventListener("mousemove", handleMouseMove, false);
      doc.removeEventListener("mouseup", cleanup, false);
      doc.removeEventListener("blur", cleanup, false);
      active.setFalse();
    }
    doc.addEventListener("mousemove", handleMouseMove);
    doc.addEventListener("mouseup", cleanup, false);
    doc.addEventListener("blur", cleanup, false);

    // setInitialMouseX(e.clientX);
    // setInitialElementWidth(elementRef.current!.offsetWidth);
    active.setTrue();
  }

  function resetResize(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.preventDefault();
    elementRef.current!.style.width = "";
    options?.onReset?.();
  }

  return { onMouseDown, resetResize, handleMouseUp, isResize: active.value };
}
