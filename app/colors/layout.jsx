import { Metadata } from "next";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "./page-header"
import GradientGenerator from "@component/Generator";


export const metadata = {
  title: "Tailwind Colors",
  description: "All colors in all formats.",
};

const ColorsLayout = ({ children }) => {
  return (
    <div className="relative">
       <PageHeader>
        <PageHeaderHeading>Tailwind CSS Gradient & Color Generator</PageHeaderHeading>
        <PageHeaderDescription>
        Create beautiful gradients and explore Tailwind CSS colors in HSL, RGB, and HEX formats. Customize, preview, and copy with ease for your next project.
        </PageHeaderDescription>
      </PageHeader>
      <div className=" py-6 flex justify-center items-center">
        <section id="colors" className="scroll-mt-20 border-l-2 border-gray-200">
          <GradientGenerator />
          {children}
        </section>
      </div>
    </div>
  );
};

export default ColorsLayout;
