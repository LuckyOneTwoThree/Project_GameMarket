import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
}

interface CustomDropdownProps {
  options: (string | DropdownOption)[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 辅助函数：获取选项的显示文本
  const getOptionLabel = (option: string | DropdownOption): string => {
    return typeof option === 'string' ? option : option.label;
  };

  // 辅助函数：获取选项的值
  const getOptionValue = (option: string | DropdownOption): string => {
    return typeof option === 'string' ? option : option.value;
  };

  // 辅助函数：获取选项的图标
  const getOptionIcon = (option: string | DropdownOption): string | undefined => {
    return typeof option === 'object' ? option.icon : undefined;
  };

  // 获取当前选中的选项
  const currentOption = options.find(option => getOptionValue(option) === value);
  const currentLabel = currentOption ? getOptionLabel(currentOption) : value;
  const currentIcon = currentOption ? getOptionIcon(currentOption) : undefined;

  return (
    <div className={`custom-dropdown ${className}`} ref={dropdownRef}>
      <div 
        className={`dropdown-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentIcon && (
          <div className="dropdown-icon">
            <img src={currentIcon} alt={currentLabel} width="24" height="24" />
          </div>
        )}
        <span className="dropdown-value">{currentLabel}</span>
        <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => {
            const optionValue = getOptionValue(option);
            const optionLabel = getOptionLabel(option);
            const optionIcon = getOptionIcon(option);
            
            return (
              <div
                key={optionValue}
                className={`dropdown-item ${optionValue === value ? 'active' : ''}`}
                onClick={() => {
                  onChange(optionValue);
                  setIsOpen(false);
                }}
              >
                {optionIcon && (
                  <div className="dropdown-item-icon">
                    <img src={optionIcon} alt={optionLabel} width="20" height="20" />
                  </div>
                )}
                <span className="dropdown-item-label">{optionLabel}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;