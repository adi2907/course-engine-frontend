/**
 * App.js - DeepCoach Learning Platform
 * Updated branding and improved user experience
 */

import React, { useState, useEffect } from 'react';
import ContentRenderer from './components/ContentRenderer';
import TopicInputSection from './components/TopicInputSection';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Generate random user ID
const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

function App() {
  // Core state
  const [userId] = useState(() => generateUserId());
  const [structuredContent, setStructuredContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Input state
  const [topicInput, setTopicInput] = useState('');
  const [userResponse, setUserResponse] = useState('');
  
  // Backend status
  const [backendStatus, setBackendStatus] = useState('unknown');

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  /**
   * Check if backend is healthy
   */
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      setBackendStatus(data.status === 'healthy' ? 'healthy' : 'unhealthy');
    } catch (error) {
      setBackendStatus('error');
      console.error('Backend health check failed:', error);
    }
  };

  /**
   * Start a new learning module
   */
  const startModule = async (topic = topicInput) => {
    if (!topic || !topic.trim()) {
      setError('Please enter a topic to learn');
      return;
    }

    setLoading(true);
    setError('');
    setStructuredContent(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/start-module`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          user_id: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      console.log('Start module response:', result); // Debug log
      
      setStructuredContent(result);
      setUserResponse(''); // Clear previous response

    } catch (err) {
      setError(`Error starting module: ${err.message}`);
      console.error('Start module error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit user response and advance module
   */
  const submitResponse = async (response) => {
    if (!response || (typeof response === 'string' && !response.trim())) {
      setError('Please provide a response');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const submitResponse = await fetch(`${API_BASE_URL}/api/submit-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          response: typeof response === 'string' ? response.trim() : JSON.stringify(response)
        }),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.detail || `HTTP ${submitResponse.status}`);
      }

      const result = await submitResponse.json();
      
      console.log('Submit response result:', result); // Debug log
      
      setStructuredContent(result);
      setUserResponse(''); // Clear response for next section

    } catch (err) {
      setError(`Error submitting response: ${err.message}`);
      console.error('Submit response error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset to start new module
   */
  const resetModule = async () => {
    // Reset session on backend
    try {
      await fetch(`${API_BASE_URL}/api/reset-session/${userId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to reset backend session:', err);
    }

    // Reset frontend state
    setStructuredContent(null);
    setTopicInput('');
    setUserResponse('');
    setError('');
  };

  /**
   * Get status indicator
   */
  const getStatusIndicator = () => {
    switch (backendStatus) {
      case 'healthy':
        return <span className="status healthy">✅ DeepCoach Ready</span>;
      case 'unhealthy':
        return <span className="status unhealthy">⚠️ System Issues</span>;
      case 'error':
        return <span className="status error">❌ Connection Error</span>;
      default:
        return <span className="status unknown">🔄 Checking...</span>;
    }
  };

  /**
   * Calculate progress percentage
   */
  const getProgressPercentage = () => {
    if (!structuredContent?.progress) return 0;
    return structuredContent.progress.percentage || 0;
  };

  /**
   * Get current step info
   */
  const getCurrentStep = () => {
    if (!structuredContent?.progress) return { current: 0, total: 0 };
    const { current_index = 0, total_items = 0 } = structuredContent.progress;
    return { current: current_index + 1, total: total_items };
  };

  /**
   * Check if module is complete
   */
  const isModuleComplete = () => {
    return structuredContent?.content_type === 'completion' || 
           structuredContent?.metadata?.completed === true;
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <h1>🧠 DeepCoach</h1>
        <p>Your AI Learning Companion - Master Any Skill, Anytime</p>
        <div className="backend-status">
          {getStatusIndicator()}
          <span className="user-id">User: {userId}</span>
        </div>
      </header>

      {/* Backend connection warning */}
      {backendStatus !== 'healthy' && (
        <div className="connection-warning">
          <h3>⚠️ System Connection Issue</h3>
          <p>Make sure the DeepCoach backend is running on port 8000</p>
          <button onClick={checkBackendHealth} className="retry-button">
            🔄 Retry Connection
          </button>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="error-banner">
          <p>❌ {error}</p>
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      {/* Main content */}
      {!structuredContent ? (
        // Topic input screen with tabs
        <TopicInputSection 
          loading={loading}
          onStartModule={startModule}
        />
      ) : (
        // Active module interface
        <div className="module-interface">
          {/* Progress header */}
          <div className="progress-header">
            <div className="progress-info">
              <h2>{structuredContent.progress?.domain || 'Learning'} Module</h2>
              <p>Topic: <strong>{topicInput}</strong></p>
            </div>
            <div className="progress-bar-container">
              <div className="progress-stats">
                {isModuleComplete() ? (
                  '🎉 Complete!'
                ) : (
                  `Step ${getCurrentStep().current} of ${getCurrentStep().total}`
                )}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
            <button onClick={resetModule} className="new-topic-button">
              New Topic
            </button>
          </div>

          {/* Content area */}
          <div className="content-area">
            {isModuleComplete() ? (
              // Module complete
              <div className="completion-section">
                <ContentRenderer
                  structuredContent={structuredContent}
                  userResponse={userResponse}
                  setUserResponse={setUserResponse}
                  onSubmit={submitResponse}
                  loading={loading}
                  userId={userId}
                />
                <button onClick={resetModule} className="start-new-button">
                  Start New Topic
                </button>
              </div>
            ) : (
              // Active content
              <ContentRenderer
                structuredContent={structuredContent}
                userResponse={userResponse}
                setUserResponse={setUserResponse}
                onSubmit={submitResponse}
                loading={loading}
                userId={userId}
              />
            )}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>DeepCoach is creating your personalized learning module...</p>
          </div>
        </div>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && structuredContent && (
        <div className="debug-info">
          <details>
            <summary>Debug: Structured Content</summary>
            <pre>{JSON.stringify(structuredContent, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default App;