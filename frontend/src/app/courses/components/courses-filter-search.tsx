"use client";

export type LevelFilter = "all" | "beginner" | "elementary" | "toeic-foundation" | "intermediate" | "advanced" | "vstep" | "reading" | "listening";
export type SkillFilter = "all" | "vocabulary" | "grammar" | "listening" | "reading" | "vstep";

interface CoursesFilterSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  levelFilter: LevelFilter;
  setLevelFilter: (level: LevelFilter) => void;
  skillFilter: SkillFilter;
  setSkillFilter: (skill: SkillFilter) => void;
}

/**
 * CoursesFilterSearch provides input search and dropdown filters for levels and skills.
 */
export function CoursesFilterSearch({
  searchTerm,
  setSearchTerm,
  levelFilter,
  setLevelFilter,
  skillFilter,
  setSkillFilter,
}: CoursesFilterSearchProps) {
  return (
    <section id="courses-section" className="scroll-mt-24">
      <div className="glass-card p-6 rounded-2xl flex flex-wrap lg:flex-nowrap gap-4 items-center shadow-md">
        <div className="flex-grow min-w-[280px] relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-text-secondary/50" aria-hidden="true">
            search
          </span>
          <input
            className="w-full bg-white/40 border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            placeholder="Tìm khóa học..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            className="bg-white/40 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-text-primary font-semibold cursor-pointer"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as LevelFilter)}
          >
            <option value="all">Tất cả trình độ</option>
            <option value="beginner">Mất gốc</option>
            <option value="elementary">Cơ bản</option>
            <option value="toeic-foundation">TOEIC 450+</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
            <option value="vstep">VSTEP</option>
            <option value="reading">Reading</option>
            <option value="listening">Listening</option>
          </select>
          <select
            className="bg-white/40 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-text-primary font-semibold cursor-pointer"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value as SkillFilter)}
          >
            <option value="all">Tất cả kỹ năng</option>
            <option value="vocabulary">Từ vựng</option>
            <option value="grammar">Ngữ pháp</option>
            <option value="listening">Nghe</option>
            <option value="reading">Đọc</option>
            <option value="vstep">VSTEP</option>
          </select>
        </div>
      </div>
    </section>
  );
}
