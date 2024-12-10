const SelectInput = ({
  selectId = '',
  selectOptions = [],
  labelKey = '',
  valueKey = '',
  value = '',
  onChange,
}) => {
  const handleChange = (event) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor={selectId} className="sr-only">
        {selectId}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={handleChange}
        className="w-full rounded-xl border-gray-200 bg-white text-black p-3 font-medium sm:text-sm"
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
