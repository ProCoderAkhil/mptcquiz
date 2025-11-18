interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden shadow-inner">
      <div 
        className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;
