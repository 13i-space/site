"use client";
import LessonChat from "../_components/LessonChat";
import StagesCard from "../_components/StagesCard";
import LifeTimeline from "../_components/LifeTimeline";

const Timeline = ({ step }) => (
  <div style={{ marginTop: 22 }}>
    <LifeTimeline compact refresh={step} />
  </div>
);

export default function LessonTwo() {
  return <LessonChat lessonId="unit1-lesson2" Done={StagesCard} Below={Timeline} />;
}
