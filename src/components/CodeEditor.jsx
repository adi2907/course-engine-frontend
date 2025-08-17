/**
 * CodeEditor.jsx - Updated for LangGraph Integration
 * Handles both code testing (Phase 1) and response submission (Phase 2)
 */

import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ 
  initialCode = "# Write your Python code here\nprint('Hello from FastAPI backend!')",
  title = "Python Code Editor",
  height = "400px",
  readOnly = false,
  onCodeChange = null,
  showSubmitButton = false,      // NEW: Show submit for LangGraph
  onSubmitCode = null,           // NEW: Submit callback for LangGraph
  loading = false,               // NEW: Loading state from parent
  userId = null                  // NEW: User context
}) => {
  // State management
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  
  // Editor reference
  const editorRef = useRef(null);

  // Update code when initialCode changes
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  /**
   * Handle Monaco editor mounting
   */
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (!isRunning) {
        runCode();
      }
    });

    // Submit shortcut (Ctrl+Shift+Enter) - NEW
    if (showSubmitButton) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
        if (!loading && onSubmitCode) {
          onSubmitCode(code);
        }
      });
    }
  };

  /**
   * Handle code changes in the editor
   */
  const handleCodeChange = (value) => {
    const newCode = value || '';
    setCode(newCode);
    
    // Notify parent component if callback provided
    if (onCodeChange) {
      onCodeChange(newCode);
    }
  };

  /**
   * Execute code via FastAPI backend (for testing)
   */
  const runCode = async () => {
    if (!code.trim()) {
      setError('No code to execute');
      return;
    }

    setIsRunning(true);
    setOutput('');
    setError('');
    setExecutionTime(null);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          timeout: 10
        }),
      });

      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setOutput(result.output || '(No output)');
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Unknown execution error');
      }

    } catch (err) {
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      
      setOutput('');
      setError(`Network/Server Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Submit code response (for LangGraph flow) - NEW
   */
  const submitCodeResponse = () => {
    if (onSubmitCode && code.trim()) {
      onSubmitCode(code);
    }
  };

  /**
   * Clear output and errors
   */
  const clearOutput = () => {
    setOutput('');
    setError('');
    setExecutionTime(null);
  };

  /**
   * Reset code to initial state
   */
  const resetCode = () => {
    setCode(initialCode);
    clearOutput();
  };

  return (
    <div className="code-editor-container">
      {/* Header */}
      <div className="editor-header">
        <h3>{title}</h3>
        <div className="header-info">
          {executionTime !== null && (
            <span className="execution-time">
              ⏱️ {executionTime}ms
            </span>
          )}
          <span className="backend-status">
            🔗 FastAPI + LangGraph
          </span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="editor-wrapper">
        <Editor
          height={height}
          defaultLanguage="python"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly: readOnly,
            theme: 'vs-dark',
            automaticLayout: true,
          }}
        />
      </div>

      {/* Control buttons */}
      <div className="editor-controls">
        <button 
          onClick={runCode}
          disabled={isRunning || readOnly}
          className={`run-button ${isRunning ? 'running' : ''}`}
        >
          {isRunning ? '⏳ Running...' : '▶️ Test Code'}
        </button>
        
        <button onClick={clearOutput} className="clear-button">
          🗑️ Clear Output
        </button>
        
        <button onClick={resetCode} className="reset-button">
          🔄 Reset Code
        </button>

        {/* Submit button for LangGraph integration - NEW */}
        {showSubmitButton && (
          <button 
            onClick={submitCodeResponse}
            disabled={loading || !code.trim()}
            className="submit-code-button"
          >
            {loading ? '⏳ Submitting...' : '📤 Submit Solution'}
          </button>
        )}
        
        <small className="keyboard-hint">
          {showSubmitButton 
            ? 'Test: Ctrl+Enter | Submit: Ctrl+Shift+Enter'
            : 'Tip: Ctrl+Enter to run'
          }
        </small>
      </div>

      {/* Output section */}
      <div className="output-section">
        {/* Success output */}
        {output && (
          <div className="output-box">
            <h4>✅ Output:</h4>
            <pre className="output-content">{output}</pre>
          </div>
        )}

        {/* Error output */}
        {error && (
          <div className="error-box">
            <h4>❌ Error:</h4>
            <pre className="error-content">{error}</pre>
          </div>
        )}

        {/* Running indicator */}
        {isRunning && (
          <div className="running-box">
            <p>🔄 Executing Python code on FastAPI backend...</p>
          </div>
        )}

        {/* LangGraph submission guidance - NEW */}
        {showSubmitButton && !loading && (
          <div className="submission-guidance">
            <p>💡 <strong>Test your code first</strong>, then submit when ready!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;