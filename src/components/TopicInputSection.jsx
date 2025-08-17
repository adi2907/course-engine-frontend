/**
 * TopicInputSection.jsx - Multi-input interface for topic, PDF, and YouTube
 */

import React, { useState } from 'react';

const TopicInputSection = ({ loading, onStartModule }) => {
  const [activeTab, setActiveTab] = useState('topic');
  const [topicInput, setTopicInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedTopic, setExtractedTopic] = useState('');

  // Hardcoded topic mappings for demo
  const getTopicFromContent = (type, content) => {
    if (type === 'pdf') {
      return 'Self-refine iterative refinement with LLMs';
    } else if (type === 'youtube') {
      // Any YouTube URL leads to LangGraph tutorial for demo
      return 'LangGraph workflow orchestration';
    }
    return content;
  };

  // Simulate content processing
  const simulateProcessing = async (type, content) => {
    setIsProcessing(true);
    setExtractedTopic('');
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const topic = getTopicFromContent(type, content);
    setExtractedTopic(topic);
    setIsProcessing(false);
    
    // Auto-start after showing extracted topic
    setTimeout(() => {
      onStartModule(topic);
    }, 1500);
  };

  const handleTopicSubmit = () => {
    if (topicInput.trim()) {
      onStartModule(topicInput.trim());
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      simulateProcessing('pdf', file.name);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleYouTubeSubmit = () => {
    if (youtubeUrl.trim()) {
      simulateProcessing('youtube', youtubeUrl);
    }
  };

  const exampleTopics = [
    'Python list comprehensions',
    'Agile project management', 
    'JavaScript async/await',
    'Database normalization',
    'Team leadership skills',
    'Machine learning basics',
    'React state management',
    'SQL query optimization'
  ];

  if (isProcessing) {
    return (
      <div className="topic-input-section">
        <div className="processing-content">
          <div className="processing-spinner">
            <div className="spinner"></div>
          </div>
          <h3>🔍 Analyzing content...</h3>
          <p>Extracting key concepts and learning objectives</p>
        </div>
      </div>
    );
  }

  if (extractedTopic) {
    return (
      <div className="topic-input-section">
        <div className="extracted-topic">
          <div className="success-icon">✅</div>
          <h3>Content Analysis Complete!</h3>
          <div className="detected-topic">
            <span className="label">Detected Topic:</span>
            <span className="topic">{extractedTopic}</span>
          </div>
          <p>Generating your personalized learning module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="topic-input-section">
      <h2>What would you like to master today?</h2>
      
      {/* Tab Navigation */}
      <div className="input-tabs">
        <button 
          className={`tab-button ${activeTab === 'topic' ? 'active' : ''}`}
          onClick={() => setActiveTab('topic')}
          disabled={loading}
        >
          📝 Topic
        </button>
        <button 
          className={`tab-button ${activeTab === 'pdf' ? 'active' : ''}`}
          onClick={() => setActiveTab('pdf')}
          disabled={loading}
        >
          📄 PDF
        </button>
        <button 
          className={`tab-button ${activeTab === 'youtube' ? 'active' : ''}`}
          onClick={() => setActiveTab('youtube')}
          disabled={loading}
        >
          🎥 YouTube
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'topic' && (
          <div className="topic-tab">
            <div className="topic-input-container">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleTopicSubmit()}
                placeholder="e.g., Python functions, Project management, React hooks..."
                className="topic-input"
                disabled={loading}
              />
              <button 
                onClick={handleTopicSubmit}
                disabled={loading || !topicInput.trim()}
                className="start-button"
              >
                {loading ? 'Creating Your Module...' : 'Start Learning'}
              </button>
            </div>
            
            {/* Example topics */}
            <div className="example-topics">
              <h4>Popular learning topics:</h4>
              <div className="topic-examples">
                {exampleTopics.map((topic, index) => (
                  <button 
                    key={index}
                    onClick={() => setTopicInput(topic)}
                    className="example-topic"
                    disabled={loading}
                    type="button"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pdf' && (
          <div className="pdf-tab">
            <div className="upload-area">
              <div className="upload-icon">📄</div>
              <h3>Upload a PDF Document</h3>
              <p>We'll analyze your document and create a personalized course</p>
              
              <label className="upload-button">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={loading}
                  style={{ display: 'none' }}
                />
                📤 Choose PDF File
              </label>
              
              {uploadedFile && (
                <div className="uploaded-file">
                  <span>Selected: {uploadedFile.name}</span>
                </div>
              )}
              
              <div className="demo-note">
                <small>💡 Demo: Upload any PDF to generate a course on "Self-refine iterative refinement with LLMs"</small>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'youtube' && (
          <div className="youtube-tab">
            <div className="youtube-input-container">
              <div className="youtube-icon">🎥</div>
              <h3>YouTube Video URL</h3>
              <p>Provide a YouTube link and we'll create a course from the content</p>
              
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleYouTubeSubmit()}
                placeholder="https://www.youtube.com/watch?v=..."
                className="youtube-input"
                disabled={loading}
              />
              
              <button 
                onClick={handleYouTubeSubmit}
                disabled={loading || !youtubeUrl.trim()}
                className="start-button"
              >
                {loading ? 'Analyzing Video...' : 'Generate Course'}
              </button>
              
              <div className="youtube-example">
                <small>📝 Try this LangGraph video: 
                  <button 
                    className="example-url"
                    onClick={() => setYoutubeUrl('https://www.youtube.com/watch?v=CnXdddeZ4tQ')}
                    disabled={loading}
                  >
                    https://www.youtube.com/watch?v=CnXdddeZ4tQ
                  </button>
                </small>
              </div>
              
              <div className="demo-note">
                <small>💡 Demo: LangGraph videos will generate workflow orchestration courses</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicInputSection;