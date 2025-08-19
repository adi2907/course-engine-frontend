/**
 * TopicInputSection.jsx - Enhanced with bigger topics and trending section
 */

import React, { useState } from 'react';

const TopicInputSection = ({ loading, onStartModule }) => {
  const [activeTab, setActiveTab] = useState('topic');
  const [topicInput, setTopicInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedTopic, setExtractedTopic] = useState('');

  // Enhanced trending topics - bigger, more substantial learning modules
  const trendingTopics = [
    {
      title: 'LangGraph Tutorial',
      description: 'Master workflow orchestration with LangChain\'s graph framework',
      category: 'AI/ML',
      estimatedTime: '45-60 min'
    },
    {
      title: 'MCP Server Development',
      description: 'Build Model Context Protocol servers for AI integrations',
      category: 'Development',
      estimatedTime: '50-65 min'
    },
    {
      title: 'FastAPI Production Deployment',
      description: 'Deploy scalable Python APIs with Docker and cloud platforms',
      category: 'DevOps',
      estimatedTime: '55-70 min'
    },
    {
      title: 'React Server Components',
      description: 'Next.js App Router with server-side rendering strategies',
      category: 'Frontend',
      estimatedTime: '40-55 min'
    },
    {
      title: 'Vector Database Fundamentals',
      description: 'Embeddings, similarity search, and RAG implementations',
      category: 'AI/ML',
      estimatedTime: '45-60 min'
    },
    {
      title: 'Kubernetes Microservices',
      description: 'Container orchestration and service mesh architecture',
      category: 'DevOps',
      estimatedTime: '60-75 min'
    },
    {
      title: 'Advanced TypeScript Patterns',
      description: 'Generic constraints, mapped types, and conditional types',
      category: 'Development',
      estimatedTime: '50-65 min'
    },
    {
      title: 'Product Management Strategy',
      description: 'Roadmap planning, user research, and feature prioritization',
      category: 'Business',
      estimatedTime: '40-55 min'
    }
  ];

  // Hardcoded topic mappings for demo
  const getTopicFromContent = (type, content) => {
    if (type === 'pdf') {
      return 'Self-refine iterative refinement with LLMs';
    } else if (type === 'youtube') {
      return 'LangGraph workflow orchestration';
    }
    return content;
  };

  // Simulate content processing
  const simulateProcessing = async (type, content) => {
    setIsProcessing(true);
    setExtractedTopic('');
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const topic = getTopicFromContent(type, content);
    setExtractedTopic(topic);
    setIsProcessing(false);
    
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

  const handleTrendingTopicClick = (topic) => {
    setTopicInput(topic.title);
  };

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
                placeholder="e.g., LangGraph tutorial, Kubernetes deployment, React hooks..."
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
            
            {/* Trending Topics Section */}
            <div className="trending-topics">
              <div className="trending-header">
                <h4>🔥 Trending Topics</h4>
                <p>Popular learning modules our AI tutors are creating</p>
              </div>
              <div className="trending-grid">
                {trendingTopics.map((topic, index) => (
                  <div 
                    key={index}
                    onClick={() => handleTrendingTopicClick(topic)}
                    className="trending-topic-card"
                    disabled={loading}
                  >
                    <div className="trending-topic-header">
                      <h5>{topic.title}</h5>
                      <span className="topic-category">{topic.category}</span>
                    </div>
                    <p className="topic-description">{topic.description}</p>
                    <div className="topic-meta">
                      <span className="estimated-time">
                        ⏱️ {topic.estimatedTime}
                      </span>
                      <span className="start-indicator">
                        Start →
                      </span>
                    </div>
                  </div>
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
                <small>🔗 Try this LangGraph video: 
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