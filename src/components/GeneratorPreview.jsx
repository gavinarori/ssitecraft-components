import React, { useState, useRef } from 'react';
import PencilIcon from '../icons/IconPencil';
import BulbIcon from '../icons/IconBulb';

const GeneratorPreview = ({ gradientStyle = '' }) => {
  const [isDark, setIsDark] = useState(false);
  const textInputRef = useRef(null);

  const backgroundColor = isDark ? 'bg-black' : 'bg-white';

  const handleDark = () => {
    setIsDark((prev) => !prev);
  };

  const handleEdit = () => {
    textInputRef.current.focus();
  };

  return (
    <section>
      <div className="mx-auto mt-16 grid max-w-screen-xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className={`h-[300px] rounded-3xl lg:h-full lg:min-h-[400px] ${gradientStyle}`} />
        <div className={`relative flex items-center rounded-xl p-8 ${backgroundColor}`}>
          <div className="absolute inset-x-0 top-0 flex items-center justify-end p-4">
            <button
              className="rounded-xl bg-gray-800 p-2.5 text-white"
              onClick={handleEdit}
            >
              <span className="sr-only">Edit text</span>
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              className="ml-2 rounded-xl bg-gray-800 p-2.5 text-white"
              onClick={handleDark}
            >
              <span className="sr-only">
                Toggle {isDark ? 'light' : 'dark'} theme
              </span>
              <BulbIcon className="h-4 w-4" />
            </button>
          </div>
          <p
            ref={textInputRef}
            className={`min-w-full rounded bg-clip-text p-2 text-center text-2xl font-bold text-transparent ${gradientStyle}`}
            spellCheck="false"
            contentEditable="true"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec erat
            in turpis tincidunt mollis.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GeneratorPreview;

