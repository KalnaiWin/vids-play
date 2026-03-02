import { useState } from "react";
import { typeVideo } from "../../types/constant";

export interface UserProps {
  userId: string;
}

const ListTabVideo = () => {
  const [activeTab, setActiveTab] = useState("homepage");

  const currentTab = typeVideo.find((tab) => tab.path === activeTab);
  const ActiveComponent = currentTab?.component;

  return (
    <div>
      <div className="flex gap-5">
        {typeVideo.map((type) => (
          <div
            key={type.path}
            className={`
              relative pb-2 cursor-pointer transition-all duration-300
              ${
                activeTab === type.path
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500 border-b-2 border-transparent"
              }
            `}
            onClick={() => setActiveTab(type.path)}
          >
            {type.name}
          </div>
        ))}
      </div>

      <div className="mt-5 mb-20 text-white">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default ListTabVideo;
