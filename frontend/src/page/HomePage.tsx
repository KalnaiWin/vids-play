import { defaultCategory } from "../types/constant";
import { useState } from "react";

const HomePage = () => {
  const [selectPath, setSelectPath] = useState("");

  return (
    <div className="w-full min-h-screen bg-black text-white text-sm p-5 mb-40">
      <div className="flex gap-2 items-center my-5">
        {defaultCategory.map((item) => (
          <div
            key={item.name}
            className={`py-0.5 px-2 rounded-md cursor-pointer ${selectPath === item.path ? "bg-blue-700 text-white" : "bg-blue-950 text-slate-500 hover:bg-blue-800"}`}
            onClick={() => setSelectPath(item.path)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="w-full h-140 relative rounded-xl">
        <img
          src="/src/assets/background_homepage.jpg"
          alt="background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/40 to-transparent" />
        <div className="absolute top-0 left-0 p-4">
          <div className="flex gap-3 items-center">
            <div className="uppercase text-slate-200 bg-blue-600 rounded-xl px-2 py-1 flex items-center font-semibold text-sm">
              ● Feature live
            </div>
            <p className="uppercase font-medium text-sm text-blue-300">
              Made by Phuc
            </p>
          </div>
          <div className="text-7xl font-semibold my-5 text-slate-200">
            Exploring the Far
            <span className="block">Reaches of the</span>
            <span className="block text-blue-600">Multiverse</span>
          </div>
          <div className="w-[60%] text-xl mb-8 text-slate-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum labore
            corrupti odio deserunt, nobis libero odit a, exercitationem
            laboriosam quos pariatur reiciendis asperiores veritatis culpa esse
            vero at tenetur quas?
          </div>
          <div className="flex gap-3 items-center">
            <button className="text-white bg-blue-500 px-5 py-2 rounded-full text-xl font-medium cursor-pointer hover:bg-blue-600 transition-all">
              ▶︎ Watch Now
            </button>
            <button className="text-white bg-slate-500/70 px-5 py-2 rounded-full text-xl font-medium border border-slate-500 cursor-pointer transition-all hover:bg-slate-600/70">
              ✚ Follow Channel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
