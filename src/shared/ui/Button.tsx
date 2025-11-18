type ButtonProps = {
  children?: React.ReactNode;
  onClick: () => void;
  className?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
};

const Button = ({ children, onClick, className = '', text, size = 'md' }: ButtonProps) => {
  return (
    <button
      className={`bg-primary text-white rounded-md hover:bg-primary/80 ${className} ${size === 'sm' ? 'px-2 py-1 text-sm' : size === 'md' ? 'px-4 py-2 text-base' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base'}`}
      onClick={onClick}
    >
      {text || children}
    </button>
  );
};

export default Button;
