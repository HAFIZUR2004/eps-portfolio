import React from "react";
import { MdOutlineTimer } from "react-icons/md";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { SiFiles } from "react-icons/si";
import { Handshake } from "lucide-react";

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
    title: "600+ Completed Projects",
    description:
      "Successfully completed over 500+ projects with a strong focus on quality, accuracy, and client satisfaction.",
    icon: <SiFiles className="w-5 h-5" />,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    number: "02",
    title: "Fast Turnaround Time",
    description:
      "Receive your completed evacuation plan quickly without compromising on quality or attention to detail.",
    icon: <MdOutlineTimer className="w-5 h-5" />,
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    number: "03",
    title: "Unlimited Revisions Until Approved",
    description:
      "We make revisions as needed to ensure the final plan fully meets your requirements and expectations.",
    icon: <IoDocumentAttachOutline className="w-5 h-5" />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    number: "04",
    title: "After-Sales Support",
    description:
      "Our support doesn't end at delivery—we're available to assist with updates, questions, and future modifications whenever needed.",
    icon: <Handshake className="w-5 h-5" />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];

export default function WhyChooseMe() {
  return (
    <section className="bg-black text-white py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side Text Content */}
        <div className="lg:col-span-4 space-y-1 text-left">
          
          {/* Transparent PNG Image Badge */}
          <div className="inline-block">
            <img 
              src="/hell-Photoroom.png" 
              alt="Why Choose Me?" 
              className="h-14 md:h-16 w-auto object-contain block"
            />
          </div>

          <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed pt-1">
            From residential buildings to commercial facilities, we provide clear,
            code-compliant evacuation plans with fast delivery and reliable support.
          </p>
        </div>

        {/* Right Side Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {features.map((item) => (
            <div
              key={item.number}
              className="bg-white text-black p-4 rounded-xl relative shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon & Large Number */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-lg ${item.iconBg} ${item.iconColor}`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-gray-300 select-none">
                    {item.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-gray-500 leading-normal font-medium">
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