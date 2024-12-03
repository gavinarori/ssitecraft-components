import { Metadata } from "next";


export const metadata = {
  title: "Tailwind Colors",
  description: "All colors in all formats.",
};

const ColorsLayout = ({ children }) => {
  return (
    <div className="relative">
      <div className="container py-6 flex justify-center items-center">
        <section id="colors" className="scroll-mt-20">
          {children}
        </section>
      </div>
    </div>
  );
};

export default ColorsLayout;
