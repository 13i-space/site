"use client";

import { useEffect } from "react";
import { recordStoryRead } from "../lib/trackActivity";

export default function TrackStoryRead({ number }) {
  useEffect(() => {
    recordStoryRead(number);
  }, [number]);
  return null;
}
