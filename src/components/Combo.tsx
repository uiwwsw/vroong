// import { MouseEvent } from 'react';

import useDebounce from '#/useDebounce';
import { ChangeEvent, ReactNode, SelectHTMLAttributes, useMemo, useState } from 'react';
import Label from '@/Label';
import useTheme, { WithTheme } from '#/useTheme';
import mergeClassName from '#/mergeClassName';
import useRipple from '#/useRipple';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value'>, WithTheme {
  children?: ReactNode;
  placeholder?: string;
  debounce?: number;
  defaultValue?: string;
  options?: {
    disabled?: boolean;
    value: string;
    label: string;
  }[];
}
const Select = ({
  children,
  placeholder = '선택해주세요.',
  defaultValue = '',
  debounce = 0,
  onChange,
  options,
  className,
  componentName = 'slt',
  themeColor,
  themeSize,
  ...props
}: SelectProps) => {
  const theme = useTheme({ componentName, themeColor, themeSize });
  const { Ripple, ...rippleProps } = useRipple();
  const [value, setValue] = useState(defaultValue);
  const memoOption = useMemo<SelectProps['options']>(
    () => [{ value: '', label: placeholder ?? '', disabled: true }, ...(options ?? [])],
    [options, placeholder],
  );
  const isPlaceholder = useMemo(() => value === '', [value]);
  const debounceChange = useDebounce(onChange, debounce);
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    debounceChange(e);
    e.target.blur();
  };
  return (
    <label {...rippleProps} className={mergeClassName(theme, className, isPlaceholder && 'slt--placeholder')}>
      <select {...props} className="peer" value={value} onChange={handleChange}>
        {memoOption?.map((option) => (
          <option key={option.value} disabled={option.disabled} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {children ? (
        <Label themeColor={themeColor} themeSize={themeSize}>
          {children}
        </Label>
      ) : null}
      <i className="slt__caret" />
      <i className="ripple--wrap">{Ripple}</i>
    </label>
  );
};

export default Select;
