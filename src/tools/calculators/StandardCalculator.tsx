import React, { useState, useEffect, useRef } from 'react';
import { Calculator, History, Trash2, HelpCircle } from 'lucide-react';
import './calculators.css';

interface HistoryItem {
  id: string;
  equation: string;
  result: string;
  timestamp: Date;
}

export const StandardCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Calculator logic states
  const prevValRef = useRef<number | null>(null);
  const operatorRef = useRef<string | null>(null);
  const shouldResetDisplayRef = useRef(false);

  // Clear memory, memory recall, memory add, memory subtract, memory store
  const handleMemory = (action: 'MC' | 'MR' | 'M+' | 'M-' | 'MS') => {
    const currentNum = parseFloat(display);
    if (isNaN(currentNum)) return;

    switch (action) {
      case 'MC':
        setMemory(null);
        break;
      case 'MR':
        if (memory !== null) {
          setDisplay(memory.toString());
          shouldResetDisplayRef.current = true;
        }
        break;
      case 'M+':
        setMemory(prev => (prev !== null ? prev + currentNum : currentNum));
        shouldResetDisplayRef.current = true;
        break;
      case 'M-':
        setMemory(prev => (prev !== null ? prev - currentNum : -currentNum));
        shouldResetDisplayRef.current = true;
        break;
      case 'MS':
        setMemory(currentNum);
        shouldResetDisplayRef.current = true;
        break;
    }
  };

  // Handle digit input
  const handleDigit = (digit: string) => {
    if (shouldResetDisplayRef.current || display === '0') {
      setDisplay(digit);
      shouldResetDisplayRef.current = false;
    } else {
      // Prevent double decimals
      if (digit === '.' && display.includes('.')) return;
      setDisplay(prev => prev + digit);
    }
  };

  // Handle operation inputs (+, -, *, /)
  const handleOperator = (op: string) => {
    const currentNum = parseFloat(display);
    if (isNaN(currentNum)) return;

    if (operatorRef.current && !shouldResetDisplayRef.current) {
      // Perform intermediate calculation
      const result = calculate(prevValRef.current || 0, currentNum, operatorRef.current);
      setDisplay(result.toString());
      prevValRef.current = result;
    } else {
      prevValRef.current = currentNum;
    }

    operatorRef.current = op;
    setEquation(`${prevValRef.current} ${op}`);
    shouldResetDisplayRef.current = true;
  };

  // Perform basic calculation
  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×':
      case '*': return a * b;
      case '÷':
      case '/': return b === 0 ? 0 : a / b;
      default: return b;
    }
  };

  // Handle equals
  const handleEquals = () => {
    const currentNum = parseFloat(display);
    if (isNaN(currentNum) || !operatorRef.current || prevValRef.current === null) return;

    const op = operatorRef.current;
    const prev = prevValRef.current;
    const result = calculate(prev, currentNum, op);

    const fullEquation = `${prev} ${op} ${currentNum} =`;
    setEquation(fullEquation);
    setDisplay(result.toString());

    // Add to history
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      equation: fullEquation,
      result: result.toString(),
      timestamp: new Date()
    };
    setHistory(prevHist => [newItem, ...prevHist]);

    // Reset logic states
    prevValRef.current = null;
    operatorRef.current = null;
    shouldResetDisplayRef.current = true;
  };

  // Single operand functions (1/x, x^2, sqrt, negation, percentage)
  const handleFunction = (func: '1/x' | 'x^2' | 'sqrt' | '+/-' | '%') => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let result = 0;
    let desc = '';

    switch (func) {
      case '1/x':
        if (val === 0) return;
        result = 1 / val;
        desc = `1/(${val})`;
        break;
      case 'x^2':
        result = val * val;
        desc = `sqr(${val})`;
        break;
      case 'sqrt':
        if (val < 0) return;
        result = Math.sqrt(val);
        desc = `sqrt(${val})`;
        break;
      case '+/-':
        result = -val;
        setDisplay(result.toString());
        return; // Doesn't require setting equation
      case '%':
        if (prevValRef.current !== null && operatorRef.current) {
          result = (prevValRef.current * val) / 100;
        } else {
          result = val / 100;
        }
        setDisplay(result.toString());
        return;
    }

    setEquation(desc);
    setDisplay(result.toString());
    shouldResetDisplayRef.current = true;
  };

  // Clear entry / Clear all / Backspace
  const handleClear = (type: 'CE' | 'C' | 'backspace') => {
    if (type === 'CE') {
      setDisplay('0');
    } else if (type === 'C') {
      setDisplay('0');
      setEquation('');
      prevValRef.current = null;
      operatorRef.current = null;
      shouldResetDisplayRef.current = false;
    } else if (type === 'backspace') {
      if (shouldResetDisplayRef.current) return;
      setDisplay(prev => {
        if (prev.length <= 1 || prev === '0') return '0';
        return prev.slice(0, -1);
      });
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') e.preventDefault();

      if (/[0-9.]/.test(e.key)) {
        handleDigit(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        let op = e.key;
        if (op === '*') op = '×';
        if (op === '/') op = '÷';
        handleOperator(op);
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleClear('backspace');
      } else if (e.key === 'Escape') {
        handleClear('C');
      } else if (e.key === '%') {
        handleFunction('%');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, equation]);

  return (
    <div className="calc-wrapper" style={{ maxWidth: 440 }}>
      {/* Header */}
      <div className="calc-header">
        <div className="calc-header-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
          <Calculator size={22} />
        </div>
        <div className="flex-1">
          <h2 className="calc-header-title">Standard Calculator</h2>
          <p className="calc-header-desc">Standard mathematical calculations & history</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`p-1.5 rounded-lg transition-colors ${showHistory ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
          title="History"
        >
          <History size={20} />
        </button>
      </div>

      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col">
        {/* Main Display Area */}
        <div className="bg-slate-50/50 px-5 py-6 border-b border-slate-100 flex flex-col items-end justify-end h-32 select-all">
          <div className="text-xs text-slate-400 font-medium h-5 overflow-hidden text-right w-full tracking-wide">
            {equation}
          </div>
          <div className="text-3xl font-extrabold text-slate-800 text-right w-full overflow-x-auto whitespace-nowrap scrollbar-thin py-1 tracking-tight">
            {display}
          </div>
        </div>

        {/* Memory Row */}
        <div className="flex justify-between px-3 py-1 bg-slate-50/30 border-b border-slate-100 text-xs font-semibold text-slate-500">
          {(['MC', 'MR', 'M+', 'M-', 'MS'] as const).map(action => (
            <button
              key={action}
              onClick={() => handleMemory(action)}
              disabled={action === 'MR' && memory === null}
              className={`px-3 py-1.5 rounded hover:bg-slate-100/80 transition-colors ${action === 'MR' && memory === null ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {action}
            </button>
          ))}
          <span className="flex items-center text-[10px] text-slate-400 select-none">
            {memory !== null ? `M = ${memory}` : ''}
          </span>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-1 p-3 bg-slate-50/10">
          {/* Row 1 */}
          <button onClick={() => handleFunction('%')} className="py-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">%</button>
          <button onClick={() => handleClear('CE')} className="py-4 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">CE</button>
          <button onClick={() => handleClear('C')} className="py-4 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">C</button>
          <button onClick={() => handleClear('backspace')} className="py-4 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-mono">⌫</button>

          {/* Row 2 */}
          <button onClick={() => handleFunction('1/x')} className="py-4 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">¹/x</button>
          <button onClick={() => handleFunction('x^2')} className="py-4 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">x²</button>
          <button onClick={() => handleFunction('sqrt')} className="py-4 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">²√x</button>
          <button onClick={() => handleOperator('÷')} className="py-4 text-lg font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">÷</button>

          {/* Row 3 */}
          <button onClick={() => handleDigit('7')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">7</button>
          <button onClick={() => handleDigit('8')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">8</button>
          <button onClick={() => handleDigit('9')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">9</button>
          <button onClick={() => handleOperator('×')} className="py-4 text-lg font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">×</button>

          {/* Row 4 */}
          <button onClick={() => handleDigit('4')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">4</button>
          <button onClick={() => handleDigit('5')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">5</button>
          <button onClick={() => handleDigit('6')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">6</button>
          <button onClick={() => handleOperator('-')} className="py-4 text-xl font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">−</button>

          {/* Row 5 */}
          <button onClick={() => handleDigit('1')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">1</button>
          <button onClick={() => handleDigit('2')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">2</button>
          <button onClick={() => handleDigit('3')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">3</button>
          <button onClick={() => handleOperator('+')} className="py-4 text-lg font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">+</button>

          {/* Row 6 */}
          <button onClick={() => handleFunction('+/-')} className="py-4 text-sm font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">+/−</button>
          <button onClick={() => handleDigit('0')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">0</button>
          <button onClick={() => handleDigit('.')} className="py-4 text-lg font-bold text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">.</button>
          <button onClick={handleEquals} className="py-4 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md shadow-blue-500/20">=</button>
        </div>

        {/* History Drawer Overlay */}
        {showHistory && (
          <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-sm z-20 flex justify-end">
            <div className="w-64 bg-white border-l border-slate-200 h-full flex flex-col animate-slide-in">
              <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-700 text-sm flex items-center gap-1.5">
                  <History size={15} /> Calculation History
                </span>
                <button
                  onClick={() => setHistory([])}
                  disabled={history.length === 0}
                  className={`text-slate-400 hover:text-rose-500 rounded p-1 transition-colors ${history.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  title="Clear history"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {history.length === 0 ? (
                  <div className="text-center py-16 text-xs text-slate-400 font-medium">
                    No calculations recorded yet.
                  </div>
                ) : (
                  history.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setDisplay(item.result);
                        setEquation(item.equation);
                        shouldResetDisplayRef.current = true;
                      }}
                      className="w-full text-right p-2 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100/50 group block"
                    >
                      <p className="text-[10px] text-slate-400 font-semibold truncate group-hover:text-slate-500 mb-0.5">{item.equation}</p>
                      <p className="text-sm font-extrabold text-slate-700 truncate">{item.result}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-[11px] text-slate-400/90 bg-slate-50/50 p-2 border border-slate-100 rounded-lg">
        <HelpCircle size={13} className="text-slate-400/70 mt-0.5 flex-shrink-0" />
        <p className="leading-normal">
          Supports keyboard shortcuts! You can type numbers, operators <code className="bg-slate-200/50 px-1 py-0.5 rounded text-slate-600 font-semibold font-mono">+-*/</code>, percent <code className="bg-slate-200/50 px-1 py-0.5 rounded text-slate-600 font-semibold font-mono">%</code>, enter or <code className="bg-slate-200/50 px-1 py-0.5 rounded text-slate-600 font-semibold font-mono">=</code>, backspace to delete, and <code className="bg-slate-200/50 px-1 py-0.5 rounded text-slate-600 font-semibold font-mono">Esc</code> to clear.
        </p>
      </div>
    </div>
  );
};
