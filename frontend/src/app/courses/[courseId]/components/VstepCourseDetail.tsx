"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { CourseHero } from "./CourseHero";
import { CourseProgress } from "./CourseProgress";
import { ContinueLearningCard } from "./ContinueLearningCard";
import { ModuleList } from "./ModuleList";
import { CourseSidebar } from "./CourseSidebar";
import { VSTEP_MODULES } from "../data/vstepModules";
import type { CourseModule } from "@/types";

interface VstepCourseDetailProps {
  courseId: string;
  modules?: CourseModule[];
}

export function VstepCourseDetail({ courseId, modules = [] }: VstepCourseDetailProps) {
  const displayModules = modules.length > 0 ? modules : VSTEP_MODULES;

  // Mock active learning state
  const [currentModule] = useState("Grammar Foundation");
  const [currentLesson] = useState("Bài 3: Simple Sentences");
  const [completedLessonsCount] = useState(28);
  const [totalLessonsCount] = useState(80);
  const [progressPercent] = useState(35);

  const handleContinueLearning = () => {
    alert(`Chuyển hướng đến bài học tiếp theo: "${currentLesson}" thuộc module "${currentModule}"`);
  };

  return (
    <div className="relative min-h-screen">
      {/* Ambient background decoration */}
      <div className="fixed inset-0 bg-grid pointer-events-none -z-10" />
      <div className="gradient-blob bg-primary/10 w-[500px] h-[500px] -top-48 -left-48" />
      <div className="gradient-blob bg-[#520fbc]/10 w-[400px] h-[400px] bottom-0 -right-24" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <div className="flex items-center">
          <Link
            href="/courses"
            className="group flex items-center gap-1.5 text-sm font-bold text-text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Quay lại danh sách khóa học
          </Link>
        </div>

        {/* 1. Hero Banner */}
        <CourseHero onContinueLearning={handleContinueLearning} />

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Area (2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 2. Overall Progress Tracker */}
            <CourseProgress
              percent={progressPercent}
              completedLessons={completedLessonsCount}
              totalLessons={totalLessonsCount}
            />

            {/* 3. Continue Learning */}
            <ContinueLearningCard
              moduleTitle={currentModule}
              lessonTitle={currentLesson}
              onContinue={handleContinueLearning}
            />

            {/* 4. Modules Checklist Grid */}
            <ModuleList modules={displayModules} courseId={courseId} />
          </div>

          {/* Sidebar Area (1 column) */}
          <div className="lg:col-span-1">
            <CourseSidebar
              percent={progressPercent}
              currentModule={currentModule}
              currentLesson={currentLesson}
              onContinue={handleContinueLearning}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
