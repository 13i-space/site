"use client";
import LessonChat from "../_components/LessonChat";
import LessonCard from "../_components/LessonCard";
import UnitSummary from "../_components/UnitSummary";
import { getLessonBySlug, UNITS } from "../../../lib/story/lessonSteps";

// Lessons 5–22 (/story/lesson-5 …) and Unit summaries 2–7 (/story/unit-2 …).
// Lessons 1–4 and Unit 1 have their own folders and take priority over this route.
export default function StoryRoute({ params }) {
  const slug = params.slug;
  const unit = UNITS.find((u) => u.slug === slug);
  if (unit) return <UnitSummary unit={unit} />;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 34, marginBottom: 12 }}>That page isn't part of the story</h1>
          <a className="sos-btn" href="/story/my-story">My story</a>
        </div>
      </div>
    );
  }
  const Done = (props) => <LessonCard lessonId={lesson.id} {...props} />;
  return <LessonChat key={lesson.id} lessonId={lesson.id} Done={Done} />;
}
