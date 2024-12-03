import React, { useRef, useMemo } from 'react';
import { getBackgroundImage } from '../hooks/getColor';
import { createAndDownloadImage } from '../hooks/downloadImage';
import IconTailwind from './IconTailwind';
import IconCode from './IconCode';
import IconImage from './IconImage';

const ActionSave = ({ gradientName = 'Sitecraft Gradient', gradientStyle = '', gradientType = '' }) => {
  const gradientPreview = useRef(null);

  const isStandard = useMemo(() => gradientType === 'standard', [gradientType]);
  const isMesh = useMemo(() => gradientType === 'mesh', [gradientType]);
  const isGrainy = useMemo(() => gradientType === 'grainy', [gradientType]);

  const handleTailwind = () => {
    navigator.clipboard.writeText(gradientStyle);
  };

  const handleCode = () => {
    const code = isMesh
      ? gradientStyle
      : getBackgroundImage(gradientPreview.current);
    navigator.clipboard.writeText(code);
  };

  const handleImage = () => {
    createAndDownloadImage(gradientPreview.current, gradientName);
  };

  return (
    <div>
      {/* Hidden gradient preview */}
      <div className="sr-only fixed inset-0">
        {isStandard && (
          <div ref={gradientPreview} className={`h-screen w-screen ${gradientStyle}`} />
        )}
        {isMesh && (
          <div ref={gradientPreview} className="h-screen w-screen" style={{ ...gradientStyle }} />
        )}
        {isGrainy && (
          <div ref={gradientPreview} className={`relative h-screen w-screen ${gradientStyle}`}>
            <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-25 brightness-100 contrast-150" />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        {isStandard && (
          <button
            className="rounded-xl bg-gray-800/75 p-2.5 transition-colors hover:text-pink-500"
            aria-label="Copy Tailwind CSS class names"
            onClick={handleTailwind}
          >
            <IconTailwind className="h-4 w-4" />
          </button>
        )}

        {(isStandard || isMesh) && (
          <button
            className="rounded-xl bg-gray-800/75 p-2.5 transition-colors hover:text-pink-500"
            aria-label="Copy CSS"
            onClick={handleCode}
          >
            <IconCode className="h-4 w-4" />
          </button>
        )}

        <button
          className="rounded-xl bg-gray-800/75 p-2.5 transition-colors hover:text-pink-500"
          aria-label="Download image"
          onClick={handleImage}
        >
          <IconImage className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ActionSave;
