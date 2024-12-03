import React from 'react';
import ActionSave from '../icons/ActionSave';
import IconRefresh from '../icons/IconRefresh';

const GeneratorControls = ({ gradientStyle = '', gradientType = '', onRandomise, children }) => {
  return (
    <section className="border-b border-t border-gray-800/75 bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl space-y-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3">
          <div className="flex items-center">
            <ActionSave gradientStyle={gradientStyle} gradientType={gradientType} />

            <button
              className="ml-2 rounded-xl bg-gray-800/75 p-2.5 transition-colors hover:text-pink-500"
              onClick={onRandomise}
            >
              <span className="sr-only">Generate random gradient</span>
              <IconRefresh className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 lg:col-span-2 lg:mt-0">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default GeneratorControls;
