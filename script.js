document.addEventListener('DOMContentLoaded', () => {
    const history = document.getElementById('history');
    const current = document.getElementById('current');
    const buttons = document.querySelectorAll('.btn');
    const advancedToggle = document.getElementById('advancedToggle');
    const advancedPanel = document.getElementById('advancedPanel');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;
    let memory = 0;
    
    // Initialize calculator
    function init() {
      current.textContent = currentInput;
    }
    
    // Clear all values
    function clearAll() {
      currentInput = '0';
      previousInput = '';
      operation = null;
      history.textContent = '';
      current.textContent = currentInput;
    }
    
    // Handle number input
    function inputNumber(number) {
      if (resetScreen) {
        currentInput = '0';
        resetScreen = false;
      }
      
      if (currentInput === '0' && number !== '.') {
        currentInput = number;
      } else if (number === '.' && !currentInput.includes('.')) {
        currentInput += number;
      } else if (number !== '.') {
        currentInput += number;
      }
      
      current.textContent = currentInput;
    }
    
    // Handle operator input
    function inputOperator(op) {
      if (operation !== null) {
        calculate();
      }
      
      previousInput = currentInput;
      operation = op;
      history.textContent = `${previousInput} ${getOperatorSymbol(op)}`;
      resetScreen = true;
    }
    
    // Get operator symbol for display
    function getOperatorSymbol(op) {
      switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        case '%': return '%';
        default: return op;
      }
    }
    
    // Calculate result
    function calculate() {
      let result;
      const prev = parseFloat(previousInput);
      const current = parseFloat(currentInput);
      
      if (isNaN(prev) || isNaN(current)) return;
      
      switch (operation) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          result = prev / current;
          break;
        case '%':
          result = prev % current;
          break;
        default:
          return;
      }
      
      currentInput = String(result);
      operation = null;
      history.textContent = `${previousInput} ${getOperatorSymbol(operation)} ${currentInput} =`;
      current.textContent = formatResult(result);
    }
    
    // Format result for display
    function formatResult(result) {
      // Handle very large or small numbers with exponential notation
      if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-15 && result !== 0)) {
        return result.toExponential(4);
      }
      
      // Convert to string and limit decimal places
      let formatted = String(result);
      if (formatted.includes('.')) {
        const parts = formatted.split('.');
        if (parts[1].length > 10) {
          return parseFloat(result.toFixed(10)).toString();
        }
      }
      
      return formatted;
    }
    
    // Backspace function
    function backspace() {
      if (currentInput.length === 1 || (currentInput.length === 2 && currentInput[0] === '-')) {
        currentInput = '0';
      } else {
        currentInput = currentInput.slice(0, -1);
      }
      current.textContent = currentInput;
    }
    
    // Advanced functions
    function handleAdvancedFunction(func) {
      const num = parseFloat(currentInput);
      let result;
      
      switch(func) {
        case 'sqrt':
          if (num < 0) {
            current.textContent = 'Error';
            resetScreen = true;
            return;
          }
          result = Math.sqrt(num);
          history.textContent = `√(${num})`;
          break;
        case 'power':
          result = Math.pow(num, 2);
          history.textContent = `${num}²`;
          break;
        case 'power3':
          result = Math.pow(num, 3);
          history.textContent = `${num}³`;
          break;
        case '1/x':
          if (num === 0) {
            current.textContent = 'Error';
            resetScreen = true;
            return;
          }
          result = 1 / num;
          history.textContent = `1/(${num})`;
          break;
        case 'mc':
          memory = 0;
          return;
        case 'mr':
          result = memory;
          break;
        case 'm+':
          memory += num;
          return;
        case 'm-':
          memory -= num;
          return;
      }
      
      currentInput = String(result);
      current.textContent = formatResult(result);
      resetScreen = true;
    }
    
    // Handle button clicks
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 200);
        
        const value = button.dataset.value;
        
        if (!isNaN(value) || value === '.') {
          inputNumber(value);
        } else if (['+', '-', '*', '/', '%'].includes(value)) {
          inputOperator(value);
        } else if (value === '=') {
          calculate();
        } else if (value === 'clear') {
          clearAll();
        } else if (value === 'backspace') {
          backspace();
        } else if (['sqrt', 'power', 'power3', '1/x', 'mc', 'mr', 'm+', 'm-'].includes(value)) {
          handleAdvancedFunction(value);
        }
      });
    });
    
    // Toggle advanced panel
    advancedToggle.addEventListener('click', () => {
      advancedPanel.classList.toggle('show');
      advancedToggle.textContent = advancedPanel.classList.contains('show') ? 'Basic Mode' : 'Advanced Mode';
    });
    
    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
      const key = event.key;
      const button = document.querySelector(`button[data-key="${key}"]`);
      
      if (button) {
        event.preventDefault();
        button.click();
      }
    });
    
    // Initialize calculator
    init();
  });