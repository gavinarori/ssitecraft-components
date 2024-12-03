import React from 'react';

const SelectInput = ({
  selectId = '',
  selectOptions = [],
  labelKey = '',
  valueKey = '',
  modelValue = '',
  onModelValueChange,
}) => {
  const handleChange = (event) => {
    onModelValueChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor={selectId} className="sr-only">
        {selectId}
      </label>
      <select
        id={selectId}
        value={modelValue}
        onChange={handleChange}
        className="w-full rounded-xl border-gray-800/75 bg-gray-900 p-3 font-medium sm:text-sm"
      >
        {selectOptions.map((optionItem, itemIndex) => (
          <option
            key={itemIndex}
            value={valueKey ? optionItem[valueKey] : optionItem}
          >
            {labelKey ? optionItem[labelKey] : optionItem}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
