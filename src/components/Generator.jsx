"use client"

import { useEffect, useState, useMemo, useRef } from 'react';
import { createColorClasses } from '../hooks/createColors';
import { primaryDirections, conicDirections, radialDirections } from '../data/assests/directionOptions';
import { getBackgroundColor, getBackgroundImage, convertToRgba } from '../hooks/getColor';
import GeneratorControls from './GeneratorControls';
import GeneratorSelect from './GeneratorSelect';
import GeneratorPreview from './GeneratorPreview';

const GradientGenerator = () => {
  const [currentDirection, setCurrentDirection] = useState('');
  const [currentFrom, setCurrentFrom] = useState('');
  const [currentVia, setCurrentVia] = useState('');
  const [currentTo, setCurrentTo] = useState('');
  const [gradientColors, setGradientColors] = useState([]);

  const previewRef = useRef(null);

  const fromColors = useMemo(() => createColorClasses('from'), []);
  const viaColors = useMemo(() => createColorClasses('via'), []);
  const toColors = useMemo(() => createColorClasses('to'), []);

  const gradientStyle = useMemo(() => {
    return `${currentDirection} ${currentFrom} ${currentVia} ${currentTo}`.trim();
  }, [currentDirection, currentFrom, currentVia, currentTo]);

  const directionOptions = useMemo(() => [...primaryDirections, ...conicDirections, ...radialDirections], []);

  useEffect(() => {
    handleRandomiser();
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      const backgroundColor = getBackgroundColor(previewRef.current);
      const backgroundImage = getBackgroundImage(previewRef.current);
      
      if (backgroundImage !== 'none') {
        // Extract colors from the gradient
        const colors = backgroundImage.match(/rgba?$$[\d\s,\.]+$$/g) || [];
        setGradientColors(colors.map(convertToRgba));
      } else {
        setGradientColors([convertToRgba(backgroundColor)]);
      }
    }
  }, [gradientStyle]);

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
    <div className='mb-8'>
      <GeneratorControls
        gradientStyle={gradientStyle}
        gradientType="standard"
        onRandomise={handleRandomiser}
        gradientColors={gradientColors}
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
      <GeneratorPreview gradientStyle={gradientStyle} ref={previewRef} />
    </div>
  );
};

export default GradientGenerator;

