import { useState } from "react";
import { EditProfileTab } from "./edit-profile-tab";
import { LearningOverviewTab } from "./learning-overview-tab";
import { SecurityTab } from "./security-tab";

type TabValue = "overview" | "profile" | "security";

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<TabValue>("overview");

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="glass-card rounded-xl p-1 flex space-x-2 overflow-x-auto no-scrollbar bg-white/55 backdrop-blur-md border border-white/20">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-none px-6 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "text-[#004b5d] bg-[#f1f3f9]/80 shadow-sm"
              : "text-[#3f484c] hover:text-[#004b5d] hover:bg-[#f1f3f9]/30"
          }`}
        >
          Tổng quan học tập
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-none px-6 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "text-[#004b5d] bg-[#f1f3f9]/80 shadow-sm"
              : "text-[#3f484c] hover:text-[#004b5d] hover:bg-[#f1f3f9]/30"
          }`}
        >
          Hồ sơ cá nhân
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex-none px-6 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "security"
              ? "text-[#004b5d] bg-[#f1f3f9]/80 shadow-sm"
              : "text-[#3f484c] hover:text-[#004b5d] hover:bg-[#f1f3f9]/30"
          }`}
        >
          Bảo mật
        </button>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === "overview" ? <LearningOverviewTab /> : null}
        {activeTab === "profile" ? <EditProfileTab /> : null}
        {activeTab === "security" ? <SecurityTab /> : null}
      </div>
    </div>
  );
}

