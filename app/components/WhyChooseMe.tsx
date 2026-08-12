import React from "react";
import { FolderCheck, Clock, RefreshCw, Handshake } from "lucide-react";

interface FeatureCard {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const features: FeatureCard[] = [
  {
    number: "01",
    title: "500+ Completed Projects",
    description:
      "Successfully completed over 500+ projects with a strong focus on quality, accuracy, and client satisfaction.",
    icon: <FolderCheck className="w-6 h-6" />,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    number: "02",
    title: "Fast Turnaround Time",
    description:
      "Receive your completed evacuation plan quickly without compromising on quality or attention to detail.",
    icon: <Clock className="w-6 h-6" />,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    number: "03",
    title: "Unlimited Revisions Until Approved",
    description:
      "We make revisions as needed to ensure the final plan fully meets your requirements and expectations.",
    icon: <RefreshCw className="w-6 h-6" />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    number: "04",
    title: "After-Sales Support",
    description:
      "Our support doesn't end at delivery—we're available to assist with updates, questions, and future modifications whenever needed.",
    icon: <Handshake className="w-6 h-6" />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];

export default function WhyChooseMe() {
  return (
    <section className="bg-black text-white py-20 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Side Text Content */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Red Hand-drawn Circle Badge Effect */}
          <div className="inline-block relative">
            <span className="relative z-10 text-2xl md:text-3xl font-extrabold px-4 py-1.5 border-2 border-red-600 rounded-[50%] tracking-tight">
              Why Choose Me?
            </span>
          </div>

          <p className="text-base md:text-lg text-gray-200 font-semibold leading-relaxed">
            From residential buildings to commercial facilities, we provide clear,
            code-compliant evacuation plans with fast delivery and reliable support.
          </p>
        </div>

        {/* Right Side Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {features.map((item) => (
            <div
              key={item.number}
              className="bg-white text-black p-6 rounded-2xl relative shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon & Large Number */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`p-3 rounded-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-3xl font-extrabold text-gray-200 select-none">
                    {item.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}