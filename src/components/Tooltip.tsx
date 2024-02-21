import { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Smooth from './Smooth';
import useTheme, { WithTheme } from '#/useTheme';
interface TooltipProps extends WithTheme {
  children?: ReactNode;
  slot?: ReactNode;
  timeout?: number;
}
const Tooltip = ({ slot, children, timeout = 0, componentName = 'tooltip', ...props }: TooltipProps) => {
  const theme = useTheme({ ...props, componentName });
  const ref = useRef<HTMLElement>(null);
  const sto = useRef(0);
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState<
    { top?: number; right?: number; bottom?: number; left?: number } | undefined
  >();
  const handleEnter = () => {
    if (!ref.current) return;
    clearTimeout(sto.current);
    const { innerWidth, innerHeight } = window;
    const { top, right, bottom, left } = ref.current.getBoundingClientRect();
    const y = innerHeight / 2 > (bottom - top) / 2 + top;
    const x = innerWidth / 2 > (right - left) / 2 + left;
    setShow(true);
    setPosition({
      [x ? 'left' : 'right']: x ? right : innerWidth - left,
      [y ? 'top' : 'bottom']: y ? bottom : innerHeight - top,
    });
  };
  const handleLeave = () => (sto.current = setTimeout(() => setShow(false), 500));
  useEffect(() => {
    if (!show || !timeout) return;
    const sti = setTimeout(() => setShow(false), timeout);
    return () => clearTimeout(sti);
  }, [timeout, show]);
  return (
    <i className="inline-block not-italic" ref={ref} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {slot}
      {createPortal(
        <Smooth type="zoom" style={position}>
          {show && <div className={theme}>{children}</div>}
        </Smooth>,
        document.body,
      )}
    </i>
  );
};

export default Tooltip;
