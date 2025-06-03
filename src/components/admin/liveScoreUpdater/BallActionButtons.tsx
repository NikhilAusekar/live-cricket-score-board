import React from 'react';

interface BallActionButtonsProps {
  onAction: (actionType: string, value?: number) => void;
}

export const BallActionButtons: React.FC<BallActionButtonsProps> = ({ onAction }) => {
  const commonButtonClass = "px-5 py-3 rounded-lg text-white font-semibold text-lg transition-colors duration-200";

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {/* Runs */}
      <button className={`${commonButtonClass} bg-gray-700 hover:bg-gray-800`} onClick={() => onAction('runs', 0)}>0</button>
      <button className={`${commonButtonClass} bg-green-500 hover:bg-green-600`} onClick={() => onAction('runs', 1)}>1</button>
      <button className={`${commonButtonClass} bg-green-500 hover:bg-green-600`} onClick={() => onAction('runs', 2)}>2</button>
      <button className={`${commonButtonClass} bg-green-500 hover:bg-green-600`} onClick={() => onAction('runs', 3)}>3</button>
      <button className={`${commonButtonClass} bg-blue-600 hover:bg-blue-700`} onClick={() => onAction('runs', 4)}>4</button>
      <button className={`${commonButtonClass} bg-purple-600 hover:bg-purple-700`} onClick={() => onAction('runs', 6)}>6</button>

      {/* Extras */}
      <button className={`${commonButtonClass} bg-yellow-500 hover:bg-yellow-600 text-black`} onClick={() => onAction('wide')}>Wide</button>
      <button className={`${commonButtonClass} bg-orange-500 hover:bg-orange-600`} onClick={() => onAction('noball')}>No Ball</button>
      {/* <button className={`${commonButtonClass} bg-teal-500 hover:bg-teal-600`} onClick={() => onAction('bye')}>Bye</button>
      <button className={`${commonButtonClass} bg-indigo-500 hover:bg-indigo-600`} onClick={() => onAction('legbye')}>Leg Bye</button> */}

      {/* Wicket & Undo */}
      <button className={`${commonButtonClass} bg-red-600 hover:bg-red-700 col-span-2`} onClick={() => onAction('wicket')}>Wicket</button>
      <button className={`${commonButtonClass} bg-gray-500 hover:bg-gray-600 col-span-1`} onClick={() => onAction('undo')}>Undo</button>
      {/* Add more specific wicket types like bowled, caught, run out, stumped etc. */}
      {/* This would require a modal or separate buttons for each wicket type */}
    </div>
  );
};