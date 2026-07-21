import React, { useState, useEffect, useRef } from 'react';
import { Calculator, History, Trash2, HelpCircle, Sun, Moon, Delete } from 'lucide-react';
import './calculators.css';

interface HistoryItem {
  id: string;
  equation: string;
  result: string;
  timestamp: Date;
}

export const StandardCalculator: React.FC = () => {
  const [mode, setMode] = useState<'standard' | 'scientific'>('standard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isRad, setIsRad] = useState(false); // Radians vs Degrees

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
      if (digit === '.' && display.includes('.')) return;
      setDisplay(prev => prev + digit);
    }
  };

  // Handle operation inputs (+, -, *, /, ^, mod)
  const handleOperator = (op: string) => {
    const currentNum = parseFloat(display);
    if (isNaN(currentNum)) return;

    if (operatorRef.current && !shouldResetDisplayRef.current) {
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

  // Perform basic & scientific binary calculations
  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×':
      case '*': return a * b;
      case '÷':
      case '/': return b === 0 ? 0 : a / b;
      case 'x^y':
      case '^': return Math.pow(a, b);
      case 'mod': return a % b;
      default: return b;
    }
  };

  // Factorial utility
  const factorial = (n: number): number => {
    if (n < 0) return 0;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= Math.min(n, 150); i++) res *= i;
    return res;
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

    prevValRef.current = null;
    operatorRef.current = null;
    shouldResetDisplayRef.current = true;
  };

  // Single operand functions
  const handleFunction = (func: string) => {
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
      case 'x^3':
        result = val * val * val;
        desc = `cube(${val})`;
        break;
      case 'sqrt':
        if (val < 0) return;
        result = Math.sqrt(val);
        desc = `sqrt(${val})`;
        break;
      case '+/-':
        result = -val;
        setDisplay(result.toString());
        return;
      case '%':
        if (prevValRef.current !== null && operatorRef.current) {
          result = (prevValRef.current * val) / 100;
        } else {
          result = val / 100;
        }
        setDisplay(result.toString());
        return;
      // Scientific Unary Functions
      case 'sin':
        result = isRad ? Math.sin(val) : Math.sin((val * Math.PI) / 180);
        desc = `sin(${val}${isRad ? '' : '°'})`;
        break;
      case 'cos':
        result = isRad ? Math.cos(val) : Math.cos((val * Math.PI) / 180);
        desc = `cos(${val}${isRad ? '' : '°'})`;
        break;
      case 'tan':
        result = isRad ? Math.tan(val) : Math.tan((val * Math.PI) / 180);
        desc = `tan(${val}${isRad ? '' : '°'})`;
        break;
      case 'log':
        if (val <= 0) return;
        result = Math.log10(val);
        desc = `log(${val})`;
        break;
      case 'ln':
        if (val <= 0) return;
        result = Math.log(val);
        desc = `ln(${val})`;
        break;
      case '10^x':
        result = Math.pow(10, val);
        desc = `10^(${val})`;
        break;
      case 'e^x':
        result = Math.exp(val);
        desc = `e^(${val})`;
        break;
      case 'abs':
        result = Math.abs(val);
        desc = `abs(${val})`;
        break;
      case 'n!':
        result = factorial(val);
        desc = `fact(${val})`;
        break;
      case 'pi':
        setDisplay(Math.PI.toString());
        return;
      case 'e':
        setDisplay(Math.E.toString());
        return;
      default:
        return;
    }

    setEquation(desc);
    setDisplay(result.toString());
    shouldResetDisplayRef.current = true;
  };

  // Clear types
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
  }, [display, equation, isRad]);

  // Theme-based class mappings
  const themeClasses = {
    wrapper: theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800',
    case: theme === 'dark' 
      ? 'bg-slate-900/90 border-slate-800 shadow-2xl shadow-black/60' 
      : 'bg-white/90 border-slate-200 shadow-xl shadow-slate-200/50',
    displayArea: theme === 'dark' ? 'bg-black/40 border-slate-800/60' : 'bg-slate-100/60 border-slate-200/60',
    displayText: theme === 'dark' ? 'text-white' : 'text-slate-900',
    equationText: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    keyDigit: theme === 'dark' 
      ? 'bg-slate-800/80 hover:bg-slate-700/90 text-white border-slate-800/30' 
      : 'bg-white hover:bg-slate-100/80 text-slate-800 border-slate-100 shadow-sm',
    keyFunc: theme === 'dark'
      ? 'bg-slate-800/40 hover:bg-slate-700/60 text-slate-300'
      : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600',
    keyOperator: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/10',
    keyClear: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20',
    keyEquals: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white shadow-md shadow-orange-500/20',
    memoryRow: theme === 'dark' ? 'bg-slate-950/40 border-slate-800/60 text-slate-400' : 'bg-slate-50/50 border-slate-200/60 text-slate-500',
    helpBox: theme === 'dark' ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-100/50 border-slate-200 text-slate-500',
    drawer: theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  };

  return (
    <div className="calc-wrapper transition-all duration-300 py-6" style={{ maxWidth: mode === 'scientific' ? 620 : 400 }}>
      {/* Header */}
      <div className="calc-header flex items-center justify-between gap-4 mb-5 px-1">
        <div className="flex items-center gap-3">
          <div className="calc-header-icon bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 p-2.5 rounded-2xl transition-transform hover:scale-105 duration-200">
            <Calculator size={22} />
          </div>
          <div>
            <h2 className="calc-header-title text-slate-800 font-extrabold text-xl tracking-tight">Smart Calculator</h2>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Standard & Scientific</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className={`p-2 rounded-xl border transition-all ${
              theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          {/* Mode Switcher */}
          <div className={`p-0.5 rounded-xl flex items-center border ${
            theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setMode('standard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'standard' 
                  ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-sm' 
                  : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setMode('scientific')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'scientific' 
                  ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-sm' 
                  : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Scientific
            </button>
          </div>

          {/* History Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-xl border transition-all ${
              showHistory 
                ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' 
                : theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="History Log"
          >
            <History size={15} />
          </button>
        </div>
      </div>

      {/* Main Glassmorphic Calculator Case */}
      <div className={`relative overflow-hidden border rounded-3xl transition-all duration-300 backdrop-blur-lg ${themeClasses.case}`}>
        
        {/* Main Display Area */}
        <div className={`px-6 py-6 border-b flex flex-col items-end justify-end h-36 relative transition-colors ${themeClasses.displayArea}`}>
          {mode === 'scientific' && (
            <button
              onClick={() => setIsRad(!isRad)}
              className={`absolute left-5 top-5 px-2.5 py-1 rounded-lg text-[9px] font-black border transition-colors ${
                theme === 'dark' 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isRad ? 'RAD' : 'DEG'}
            </button>
          )}

          <div className={`text-xs font-bold h-5 overflow-hidden text-right w-full tracking-wider opacity-70 ${themeClasses.equationText}`}>
            {equation}
          </div>
          <div className={`text-4xl font-black text-right w-full overflow-x-auto whitespace-nowrap scrollbar-none py-1 tracking-tight ${themeClasses.displayText}`}>
            {display}
          </div>
        </div>

        {/* Memory Row */}
        <div className={`flex justify-between px-5 py-2.5 border-b text-[10px] font-bold select-none transition-colors ${themeClasses.memoryRow}`}>
          <div className="flex gap-5">
            {(['MC', 'MR', 'M+', 'M-', 'MS'] as const).map(action => (
              <button
                key={action}
                onClick={() => handleMemory(action)}
                disabled={action === 'MR' && memory === null}
                className={`transition-colors uppercase tracking-wider ${
                  action === 'MR' && memory === null 
                    ? 'opacity-25 cursor-not-allowed' 
                    : theme === 'dark' ? 'hover:text-orange-400 text-slate-300' : 'hover:text-orange-500 text-slate-600'
                }`}
              >
                {action}
              </button>
            ))}
          </div>
          {memory !== null && (
            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full font-mono ${
              theme === 'dark' ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'
            }`}>
              M = {memory}
            </span>
          )}
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row">
          {/* Scientific Block - Left Side */}
          {mode === 'scientific' && (
            <div className={`grid grid-cols-5 md:grid-cols-3 gap-1.5 p-4 border-b md:border-b-0 md:border-r md:w-[280px] shrink-0 ${
              theme === 'dark' ? 'bg-slate-900/30 border-slate-800/60' : 'bg-slate-50/50 border-slate-200/60'
            }`}>
              <button onClick={() => handleFunction('sin')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>sin</button>
              <button onClick={() => handleFunction('cos')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>cos</button>
              <button onClick={() => handleFunction('tan')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>tan</button>
              
              <button onClick={() => handleFunction('ln')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>ln</button>
              <button onClick={() => handleFunction('log')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>log</button>
              <button onClick={() => handleOperator('x^y')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>xʸ</button>
              
              <button onClick={() => handleFunction('x^3')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>x³</button>
              <button onClick={() => handleFunction('10^x')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>10ˣ</button>
              <button onClick={() => handleFunction('e^x')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>eˣ</button>
              
              <button onClick={() => handleFunction('abs')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>|x|</button>
              <button onClick={() => handleFunction('pi')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>π</button>
              <button onClick={() => handleFunction('e')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>e</button>
              
              <button onClick={() => handleOperator('mod')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>mod</button>
              <button onClick={() => handleFunction('n!')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>n!</button>
              <button onClick={() => handleFunction('1/x')} className={`py-3 text-xs font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>¹/x</button>
            </div>
          )}

          {/* Standard Block - Right Side */}
          <div className="grid grid-cols-4 gap-1.5 p-4 flex-1 select-none">
            {/* Row 1 */}
            <button onClick={() => handleFunction('%')} className={`py-3 sm:py-4 text-xs sm:text-sm font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>%</button>
            <button onClick={() => handleClear('CE')} className={`py-3 sm:py-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all active:scale-95 duration-100 ${themeClasses.keyClear}`}>CE</button>
            <button onClick={() => handleClear('C')} className={`py-3 sm:py-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all active:scale-95 duration-100 ${themeClasses.keyClear}`}>C</button>
            <button onClick={() => handleClear('backspace')} className={`py-3 sm:py-4 text-xs sm:text-sm font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 flex items-center justify-center ${themeClasses.keyFunc}`}>
              <Delete size={16} />
            </button>

            {/* Row 2 */}
            <button onClick={() => handleFunction('x^2')} className={`py-3 sm:py-4 text-xs sm:text-sm font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>x²</button>
            <button onClick={() => handleFunction('sqrt')} className={`py-3 sm:py-4 text-xs sm:text-sm font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>²√x</button>
            <button onClick={() => handleFunction('+/-')} className={`py-3 sm:py-4 text-xs sm:text-sm font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyFunc}`}>+/−</button>
            <button onClick={() => handleOperator('÷')} className={`py-3 sm:py-4 text-base font-black rounded-xl transition-all active:scale-95 duration-100 ${themeClasses.keyOperator}`}>÷</button>

            {/* Row 3 */}
            <button onClick={() => handleDigit('7')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>7</button>
            <button onClick={() => handleDigit('8')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>8</button>
            <button onClick={() => handleDigit('9')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>9</button>
            <button onClick={() => handleOperator('×')} className={`py-3 sm:py-4 text-base font-black rounded-xl transition-all active:scale-95 duration-100 ${themeClasses.keyOperator}`}>×</button>

            {/* Row 4 */}
            <button onClick={() => handleDigit('4')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>4</button>
            <button onClick={() => handleDigit('5')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>5</button>
            <button onClick={() => handleDigit('6')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>6</button>
            <button onClick={() => handleOperator('-')} className={`py-3 sm:py-4 text-base font-black rounded-xl transition-all active:scale-95 duration-100 ${themeClasses.keyOperator}`}>−</button>

            {/* Row 5 */}
            <button onClick={() => handleDigit('1')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>1</button>
            <button onClick={() => handleDigit('2')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>2</button>
            <button onClick={() => handleDigit('3')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>3</button>
            <button onClick={() => handleOperator('+')} className={`py-3 sm:py-4 text-base font-black rounded-xl transition-all active:scale-95 duration-100 ${themeClasses.keyOperator}`}>+</button>

            {/* Row 6 */}
            <button disabled className="py-3 sm:py-4 rounded-xl opacity-0 cursor-default"></button>
            <button onClick={() => handleDigit('0')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>0</button>
            <button onClick={() => handleDigit('.')} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl border border-transparent transition-all active:scale-95 duration-100 ${themeClasses.keyDigit}`}>.</button>
            <button onClick={handleEquals} className={`py-3 sm:py-4 text-sm sm:text-base font-extrabold rounded-xl transition-all active:scale-95 duration-100 flex items-center justify-center ${themeClasses.keyEquals}`}>=</button>
          </div>
        </div>

        {/* History Drawer Overlay */}
        {showHistory && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-20 flex justify-end">
            <div className={`w-72 border-l h-full flex flex-col animate-slide-in ${themeClasses.drawer}`}>
              <div className="px-5 py-4 border-b flex items-center justify-between bg-slate-50/10">
                <span className="font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <History size={14} className="text-orange-500" /> Calculation Log
                </span>
                <button
                  onClick={() => setHistory([])}
                  disabled={history.length === 0}
                  className={`text-slate-400 hover:text-rose-500 rounded p-1 transition-colors ${history.length === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                  title="Clear history log"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-24 text-xs text-slate-400 font-medium">
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
                      className={`w-full text-right p-3.5 rounded-2xl transition-all border block group hover:border-orange-500/30 ${
                        theme === 'dark' 
                          ? 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950/80' 
                          : 'bg-slate-50 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-[10px] text-slate-400 font-semibold truncate group-hover:text-orange-500 mb-1 tracking-wider">{item.equation}</p>
                      <p className={`text-base font-extrabold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{item.result}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`mt-4 flex items-start gap-2.5 text-[11px] p-3.5 border rounded-2xl leading-relaxed ${themeClasses.helpBox}`}>
        <HelpCircle size={15} className="text-orange-500 mt-0.5 shrink-0" />
        <div>
          <p>
            Supports keyboard shortcuts! You can type numbers, operators <code className="bg-slate-200/40 px-1 py-0.2 rounded font-semibold font-mono text-orange-500">+-*/</code>, percent <code className="bg-slate-200/40 px-1 py-0.2 rounded font-semibold font-mono text-orange-500">%</code>, enter or <code className="bg-slate-200/40 px-1 py-0.2 rounded font-semibold font-mono text-orange-500">=</code>, backspace to delete, and <code className="bg-slate-200/40 px-1 py-0.2 rounded font-semibold font-mono text-orange-500">Esc</code> to clear.
          </p>
          {mode === 'scientific' && (
            <p className="mt-1 font-medium">
              Trig functions (sin, cos, tan) can be solved in either Degrees or Radians by toggling the mode indicator.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
