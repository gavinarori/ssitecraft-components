 "use client"
import { useEffect, useState, useMemo } from 'react';
import { createColorClasses } from '../hooks/createColors';
import { getDirections } from '../hooks/getDirections';
import GeneratorControls from './GeneratorControls';
import GeneratorSelect from './GeneratorSelect';
import GeneratorPreview from './GeneratorPreview';

const GradientGenerator = () => {
  const [currentDirection, setCurrentDirection] = useState('');
  const [currentFrom, setCurrentFrom] = useState('');
  const [currentVia, setCurrentVia] = useState('');
  const [currentTo, setCurrentTo] = useState('');

  const fromColors = useMemo(() => createColorClasses('from'), []);
  const viaColors = useMemo(() => createColorClasses('via'), []);
  const toColors = useMemo(() => createColorClasses('to'), []);

  const gradientStyle = useMemo(() => {
    return currentDirection
      ? `${currentDirection} ${currentFrom} ${currentVia} ${currentTo}`
      : `${currentFrom} ${currentVia} ${currentTo}`;
  }, [currentDirection, currentFrom, currentVia, currentTo]);

  const directionOptions = useMemo(() => getDirections(), []);

  useEffect(() => {
    handleRandomiser();
  }, []);

  const getRandom = (itemArray) => {
    return itemArray[Math.floor(Math.random() * itemArray.length)];
  };

  const handleRandomiser = () => {
    setCurrentDirection(getRandom(directionOptions).css);
    setCurrentFrom(getRandom(fromColors));
    setCurrentVia(getRandom(viaColors));
    setCurrentTo(getRandom(toColors));
  };


  return (
    <div className=' mb-8'>


      <GeneratorControls
        gradientStyle={gradientStyle}
        gradientType="standard"
        onRandomise={handleRandomiser}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <GeneratorSelect
            value={currentDirection}
            onChange={(val) => setCurrentDirection(val)}
            selectId="Direction"
            selectOptions={directionOptions}
            labelKey="name"
            valueKey="css"
          />

          <GeneratorSelect
            value={currentFrom}
            onChange={(val) => setCurrentFrom(val)}
            selectId="From"
            selectOptions={fromColors}
          />

          <GeneratorSelect
            value={currentVia}
            onChange={(val) => setCurrentVia(val)}
            selectId="Via"
            selectOptions={viaColors}
          />

          <GeneratorSelect
            value={currentTo}
            onChange={(val) => setCurrentTo(val)}
            selectId="To"
            selectOptions={toColors}
          />
        </div>
      </GeneratorControls>

      <GeneratorPreview gradientStyle={gradientStyle} />
    </div>
  );
};

export default GradientGenerator;
