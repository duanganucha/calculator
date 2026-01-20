import React, { useState } from 'react';
import { History, Moon, Sun, X, Trash2 } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('0');
  const [previousVal, setPreviousVal] = useState('');
  const [operator, setOperator] = useState(null);
  const [resetNext, setResetNext] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Helper to format numbers with commas
  const formatNumber = (num) => {
    if (num === 'Error') return 'Error';
    if (!num) return '';
    if (num.toString().endsWith('.')) return num;
    
    const parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  const handleNum = (num) => {
    if (resetNext) {
      setInput(num.toString());
      setResetNext(false);
    } else {
      if (input === '0' && num !== '.') {
        setInput(num.toString());
      } else {
        if (num === '.' && input.includes('.')) return;
        if (input.replace(',', '').length > 9) return;
        setInput(input + num);
      }
    }
  };

  const handleOperator = (op) => {
    if (operator && !resetNext) {
      calculate();
    }
    setPreviousVal(input);
    setOperator(op);
    setResetNext(true);
  };

  const calculate = () => {
    if (!operator || !previousVal) return;

    const current = parseFloat(input.replace(/,/g, ''));
    const previous = parseFloat(previousVal.replace(/,/g, ''));
    let result = 0;

    switch (operator) {
      case '+': result = previous + current; break;
      case '-': result = previous - current; break;
      case '×': result = previous * current; break;
      case '÷': 
        if (current === 0) {
          setInput('Error');
          setOperator(null);
          setPreviousVal('');
          setResetNext(true);
          return;
        }
        result = previous / current; 
        break;
      default: return;
    }

    result = parseFloat(result.toPrecision(10));
    const resultStr = String(result);
    
    // Save to history
    const historyItem = {
      expression: `${formatNumber(previous)} ${operator} ${formatNumber(current)}`,
      result: formatNumber(resultStr)
    };
    setHistory([historyItem, ...history].slice(0, 20)); // Keep last 20 items

    setInput(resultStr);
    setPreviousVal(`${formatNumber(previous)} ${operator} ${formatNumber(current)} =`);
    setOperator(null);
    setResetNext(true);
  };

  const handleClear = () => {
    setInput('0');
    setPreviousVal('');
    setOperator(null);
    setResetNext(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleHistoryItemClick = (result) => {
    // Allows reusing a result from history
    setInput(result.replace(/,/g, ''));
    setShowHistory(false);
    setResetNext(true);
  };

  const handlePercentage = () => {
    const current = parseFloat(input);
    setInput(String(current / 100));
  };

  const handleToggleSign = () => {
    const current = parseFloat(input);
    setInput(String(current * -1));
  };

  const buttons = [
    { label: 'AC', type: 'func', action: handleClear },
    { label: '+/-', type: 'func', action: handleToggleSign },
    { label: '%', type: 'func', action: handlePercentage },
    { label: '÷', type: 'op', action: () => handleOperator('÷') },
    { label: '7', type: 'num', action: () => handleNum(7) },
    { label: '8', type: 'num', action: () => handleNum(8) },
    { label: '9', type: 'num', action: () => handleNum(9) },
    { label: '×', type: 'op', action: () => handleOperator('×') },
    { label: '4', type: 'num', action: () => handleNum(4) },
    { label: '5', type: 'num', action: () => handleNum(5) },
    { label: '6', type: 'num', action: () => handleNum(6) },
    { label: '-', type: 'op', action: () => handleOperator('-') },
    { label: '1', type: 'num', action: () => handleNum(1) },
    { label: '2', type: 'num', action: () => handleNum(2) },
    { label: '3', type: 'num', action: () => handleNum(3) },
    { label: '+', type: 'op', action: () => handleOperator('+') },
    { label: '0', type: 'num', span: 2, action: () => handleNum(0) },
    { label: '.', type: 'num', action: () => handleNum('.') },
    { label: '=', type: 'eq', action: calculate },
  ];

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      
      {/* Mobile Device Container */}
      <div className={`relative w-[360px] h-[740px] rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800 flex flex-col ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
        
        {/* Status Bar */}
        <div className="h-8 w-full flex justify-between items-center px-6 pt-3 text-xs font-medium opacity-80 z-20">
          <span>9:41</span>
          <div className="flex space-x-1.5">
            <div className="w-4 h-2.5 bg-current rounded-sm"></div>
            <div className="w-0.5 h-1.5 bg-current rounded-sm"></div>
          </div>
        </div>

        {/* Top Header Controls */}
        <div className="absolute top-12 w-full px-6 flex justify-between items-center z-20">
          {/* History Button (Left) */}
          <button 
            onClick={() => setShowHistory(true)}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-amber-500' : 'bg-gray-200 hover:bg-gray-300 text-amber-600'}`}
          >
            <History size={20} />
          </button>

          {/* Mode Switch (Right) */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* History Overlay */}
        <div className={`absolute inset-0 z-30 transition-transform duration-300 transform ${showHistory ? 'translate-y-0' : 'translate-y-full'} ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="p-6 pt-12 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold">History</span>
              <div className="flex gap-2">
                 <button onClick={clearHistory} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full">
                    <Trash2 size={20} />
                 </button>
                 <button onClick={() => setShowHistory(false)} className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                    <X size={20} />
                 </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <History size={48} className="mb-2" />
                  <p>No history yet</p>
                </div>
              ) : (
                history.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handleHistoryItemClick(item.result)}
                    className={`flex flex-col items-end p-4 rounded-xl cursor-pointer active:scale-95 transition-transform ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    <span className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.expression} =</span>
                    <span className={`text-2xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.result}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Display Area */}
        <div className="flex-1 flex flex-col justify-end items-end px-8 pb-6 space-y-2 relative z-10">
          <div className={`text-lg font-light h-8 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {previousVal} {operator && !resetNext && operator}
          </div>
          <div className="w-full flex justify-end items-end gap-2">
             <span className={`text-6xl font-light tracking-tight break-all leading-none transition-all ${input.length > 7 ? 'text-4xl' : 'text-6xl'}`}>
               {formatNumber(input)}
             </span>
          </div>
        </div>

        {/* Keypad Area */}
        <div className={`h-[60%] rounded-t-[2.5rem] p-6 pb-10 grid grid-cols-4 gap-4 relative z-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
           {buttons.map((btn, index) => {
             let btnClass = "rounded-full flex items-center justify-center text-2xl font-medium transition-all duration-200 active:scale-95 shadow-sm";
             
             if (btn.type === 'num') {
               btnClass += darkMode 
                ? " bg-gray-800 text-white hover:bg-gray-700" 
                : " bg-white text-gray-900 hover:bg-gray-50";
             } else if (btn.type === 'func') {
               btnClass += darkMode 
                ? " bg-gray-300 text-black hover:bg-gray-200" 
                : " bg-gray-300 text-black hover:bg-gray-200";
             } else if (btn.type === 'op' || btn.type === 'eq') {
               btnClass += " bg-amber-500 text-white hover:bg-amber-400";
               if (btn.type === 'op' && operator === btn.label && !resetNext) {
                  btnClass = "rounded-full flex items-center justify-center text-2xl font-medium transition-all duration-200 bg-white text-amber-500 border-2 border-amber-500"; 
               }
             }

             if (btn.span === 2) btnClass = btnClass.replace("justify-center", "justify-start pl-8");

             return (
               <button 
                 key={index}
                 onClick={btn.action}
                 className={`${btnClass} ${btn.span === 2 ? 'col-span-2 w-full aspect-[2.1/1]' : 'aspect-square'}`}
               >
                 {btn.label}
               </button>
             );
           })}
        </div>

        {/* Bottom Home Indicator */}
        <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1.5 rounded-full opacity-50 z-20 ${darkMode ? 'bg-white' : 'bg-black'}`}></div>

      </div>
    </div>
  );
}
