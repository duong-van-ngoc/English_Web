import type { VstepModule } from "../data/vstepModules";
import { ModuleCard } from "./ModuleCard";

interface ModuleListProps {
  modules: VstepModule[];
  courseId: string;
}

export function ModuleList({ modules, courseId }: ModuleListProps) {
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
