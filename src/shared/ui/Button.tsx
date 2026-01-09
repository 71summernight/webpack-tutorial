import { type ComponentPropsWithoutRef } from 'react';

type ButtonOwnProps = {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
};

type ButtonProps = ButtonOwnProps & Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonOwnProps>;

type ButtonComponent = React.FC<ButtonProps>;
const Button: ButtonComponent = ({ children, onClick, className = '', text, size = 'md', ...rest }) => {
  return (
    <button
      className={`bg-primary text-white rounded-md hover:bg-primary/80 ${className} ${size === 'sm' ? 'px-2 py-1 text-sm' : size === 'md' ? 'px-4 py-2 text-base' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base'}`}
      onClick={onClick}
      {...rest}
    >
      {text || children}
    </button>
  );
};

export default Button;
