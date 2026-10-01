"use client";
import { useAcademy } from "../../../../lib/story/academy/useAcademy";
import Welcome from "../_components/modules/Welcome";
import Framework from "../_components/modules/Framework";
import Lessons from "../_components/modules/Lessons";
import Writing from "../_components/modules/Writing";
import Practice from "../_components/modules/Practice";
import Safety from "../_components/modules/Safety";
import Assessment from "../_components/modules/Assessment";

const VIEWS = { welcome: Welcome, framework: Framework, lessons: Lessons, writing: Writing, practice: Practice, safety: Safety, assessment: Assessment };

export default function ModulePage({ params }) {
  const academy = useAcademy();
  const View = VIEWS[params.module];
  if (!View) {
    return (
      <div className="sos-narrow sos-center">
        <div>
          <h1 style={{ fontSize: 34, marginBottom: 12 }}>That module isn't part of the Academy</h1>
          <a className="sos-btn" href="/story/academy">Champion Academy</a>
        </div>
      </div>
    );
  }
  return <View academy={academy} />;
}
