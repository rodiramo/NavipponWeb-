import React from "react";

const MultiSelectCheckbox = ({ options, selectedValues, onChange }) => {
  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    const isChecked = event.target.checked;

    let newSelectedValues;
    if (isChecked) {
      newSelectedValues = [...selectedValues, value];
    } else {
      newSelectedValues = selectedValues.filter((selectedValue) => selectedValue !== value);
    }

    onChange(newSelectedValues);
  };

  return (
    <div className="multi-select-checkbox">
      {options.map((option) => (
        <div key={option.value} className="checkbox-option">
          <label>
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={handleCheckboxChange}
            />
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default MultiSelectCheckbox;