import type { VstepModule } from "../data/vstepModules";
import type { CourseModule } from "@/types";
import { ModuleCard } from "./ModuleCard";

interface ModuleListProps {
  modules: (VstepModule | CourseModule)[];
  courseId: string;
}

export function ModuleList({ modules, courseId }: ModuleListProps) {
  if (!modules || modules.length === 0) {
    return (
      <div id="modules-section" className="space-y-6 scroll-mt-24">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Nội dung khóa học
          </h2>
        </div>
        <div className="glass-panel rounded-2xl p-8 text-center text-sm text-text-secondary border border-dashed border-primary/25 bg-white/45">
          Khóa học này chưa có module học tập nào. Vui lòng quay lại sau.
        </div>
      </div>
    );
  }

  return (
    <div id="modules-section" className="space-y-6 scroll-mt-24">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          Nội dung khóa học
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Học theo thứ tự lộ trình từ cơ bản tới nâng cao để đạt kết quả B1-B2 tốt nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} courseId={courseId} />
        ))}
      </div>
    </div>
  );
}
