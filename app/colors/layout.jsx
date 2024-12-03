import { Metadata } from "next";
import GradientGenerator from "@component/Generator";


export const metadata = {
  title: "Tailwind Colors",
  description: "All colors in all formats.",
};

const ColorsLayout = ({ children }) => {
  return (
    <div className="relative">
      <div className=" py-6 flex justify-center items-center">
        <section id="colors" className="scroll-mt-20">
          <GradientGenerator />
          {children}
        </section>
      </div>
    </div>
  );
};

export default ColorsLayout;
