"use client";
import LessonChat from "../_components/LessonChat";
import Snapshot from "../_components/Snapshot";
import OddsVisual from "../_components/OddsVisual";

const ODDS = { Component: OddsVisual, match: /trillion/i, fromStep: "unique" };

export default function LessonOne() {
  return <LessonChat lessonId="unit1-lesson1" Done={Snapshot} inline={ODDS} />;
}
