/**
 * ContentRenderer.jsx - Updated with Contextual Questions
 * Renders different content types with targeted questions instead of generic response box
 */

import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

const ContentRenderer = ({ 
  structuredContent,
  userResponse, 
  setUserResponse, 
  onSubmit, 
  loading,
  userId 
}) => {
  
  // State for contextual questions
  const [questionResponses, setQuestionResponses] = useState({});
  
  if (!structuredContent) {
    return (
      <div className="content-section">
        <p>Loading content...</p>
      </div>
    );
  }

  const { content_type, data, progress } = structuredContent;

  /**
   * Handle contextual question responses
   */
  const handleQuestionResponse = (questionIndex, response) => {
    setQuestionResponses(prev => ({
      ...prev,
      [questionIndex]: response
    }));
  };

  /**
   * Submit contextual questions or continue
   */
  const handleContextualSubmit = () => {
    if (data.contextual_questions && data.contextual_questions.length > 0) {
      // Submit question responses
      const responses = {
        type: 'contextual_questions',
        questions: data.contextual_questions.map((q, index) => ({
          question: q.question,
          user_response: questionResponses[index] || '',
          question_type: q.question_type
        }))
      };
      onSubmit(JSON.stringify(responses));
    } else {
      // No questions, just continue
      onSubmit("Section completed");
    }
  };

  /**
   * Check if user has answered required questions
   */
  const hasAnsweredRequiredQuestions = () => {
    if (!data.contextual_questions || data.contextual_questions.length === 0) {
      return true; // No questions required
    }
    
    return data.contextual_questions.every((q, index) => {
      const response = questionResponses[index];
      return response && response.trim().length > 0;
    });
  };

  /**
   * Render a contextual question
   */
  const renderContextualQuestion = (question, index) => {
    const response = questionResponses[index] || '';
    
    switch (question.question_type) {
      case 'multiple_choice':
        return (
          <div key={index} className="contextual-question multiple-choice">
            <h5>Question {index + 1}:</h5>
            <p className="question-text">{question.question}</p>
            <div className="question-options">
              {question.options?.map((option, optionIndex) => (
                <label key={optionIndex} className="question-option">
                  <input 
                    type="radio" 
                    name={`contextual-question-${index}`}
                    value={optionIndex}
                    checked={response === optionIndex.toString()}
                    onChange={(e) => handleQuestionResponse(index, e.target.value)}
                  />
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </label>
              ))}
            </div>
          </div>
        );
      
      case 'short_answer':
        return (
          <div key={index} className="contextual-question short-answer">
            <h5>Question {index + 1}:</h5>
            <p className="question-text">{question.question}</p>
            <textarea
              value={response}
              onChange={(e) => handleQuestionResponse(index, e.target.value)}
              placeholder={question.placeholder || "Type your answer here..."}
              className="question-textarea"
              rows={3}
            />
          </div>
        );
      
      case 'reflection':
        return (
          <div key={index} className="contextual-question reflection">
            <h5>Reflection {index + 1}:</h5>
            <p className="question-text">{question.question}</p>
            <textarea
              value={response}
              onChange={(e) => handleQuestionResponse(index, e.target.value)}
              placeholder={question.placeholder || "Share your thoughts..."}
              className="question-textarea"
              rows={3}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  /**
   * Parse text content and render code blocks simply
   */
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Split content by code blocks (looking for ```python or ``` patterns)
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith('```')) {
        // Extract the code content (remove ``` markers)
        const codeContent = part.replace(/```(\w+)?\n?/g, '').replace(/```$/g, '');
        
        return (
          <div key={index} className="inline-code-block">
            <pre className="code-content">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      } else {
        // Regular text content - convert newlines to <br> and handle inline code
        const textWithLineBreaks = part
          .split('\n')
          .map((line, lineIndex) => (
            <span key={lineIndex}>
              {line}
              {lineIndex < part.split('\n').length - 1 && <br />}
            </span>
          ));
        
        return <span key={index}>{textWithLineBreaks}</span>;
      }
    });
  };

  /**
   * Render inline code snippets (single backticks)
   */
  const renderInlineCode = (text) => {
    if (!text) return null;
    
    const parts = text.split(/(`[^`]+`)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const codeContent = part.slice(1, -1); // Remove backticks
        return (
          <code key={index} className="inline-code">
            {codeContent}
          </code>
        );
      }
      return part;
    });
  };

  switch (content_type) {
    case 'explanation':
      return (
        <div className="content-section explanation-content">
          <h3>📚 {data.title?.replace(/^(📚\s*)?/g, '')}</h3>
          
          <div className="explanation-overview">
            <div className="overview-label">Overview:</div>
            <div className="overview-text">{data.overview}</div>
          </div>

          <div className="key-concepts-box">
            <div className="key-concepts-title">🔑 Key Concepts:</div>
            <ul className="key-concepts-list">
              {data.key_concepts?.map((concept, index) => (
                <li key={index}>{concept}</li>
              ))}
            </ul>
          </div>

          <div className="detailed-explanation">
            <div className="formatted-content">
              {renderFormattedContent(data.detailed_explanation)}
            </div>
          </div>

          {data.examples && data.examples.length > 0 && (
            <div className="examples-box">
              <h4>💡 Examples:</h4>
              <ul>
                {data.examples.map((example, index) => (
                  <li key={index}>{renderInlineCode(example)}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="why-matters-box">
            <h4>🎯 Why This Matters:</h4>
            <p>{data.why_it_matters}</p>
          </div>

          <div className="next-steps-box">
            <h4>🚀 Next Steps:</h4>
            <p>{data.next_steps}</p>
          </div>
          
          {/* NEW: Contextual Questions Section */}
          {data.contextual_questions && data.contextual_questions.length > 0 && (
            <div className="contextual-questions-section">
              <h4>🤔 Check Your Understanding:</h4>
              <p className="questions-intro">
                Let's make sure you've grasped the key concepts before moving on:
              </p>
              
              <div className="questions-container">
                {data.contextual_questions.map((question, index) => 
                  renderContextualQuestion(question, index)
                )}
              </div>
              
              <button 
                onClick={handleContextualSubmit}
                disabled={loading || !hasAnsweredRequiredQuestions()}
                className="submit-button"
              >
                {loading ? 'Processing...' : 'Continue to Next Section'}
              </button>
              
              {!hasAnsweredRequiredQuestions() && (
                <p className="questions-hint">
                  Please answer all questions above to continue.
                </p>
              )}
            </div>
          )}
          
          {/* Fallback if no contextual questions */}
          {(!data.contextual_questions || data.contextual_questions.length === 0) && (
            <div className="simple-continue">
              <button 
                onClick={handleContextualSubmit}
                disabled={loading}
                className="submit-button"
              >
                {loading ? 'Loading...' : 'Continue to Next Section'}
              </button>
            </div>
          )}
        </div>
      );

    case 'code_exercise':
      return (
        <div className="content-section code-exercise-content">
          <h3>💻 {data.title?.replace(/^(💻\s*)?/g, '')}</h3>
          
          <div className="exercise-description">
            <div className="exercise-label">Problem:</div>
            <div className="exercise-text">{data.problem_description}</div>
          </div>

          <div className="learning-objectives">
            <h4>🎯 Learning Objectives:</h4>
            <ul>
              {data.learning_objectives?.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="exercise-instructions">
            <h4>📋 Instructions:</h4>
            <ol>
              {data.instructions?.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          {data.expected_output && (
            <div className="expected-output">
              <h4>🎯 Expected Output:</h4>
              <div className="output-example-container">
                <pre className="output-example">{data.expected_output}</pre>
              </div>
            </div>
          )}

          {data.test_cases && data.test_cases.length > 0 && (
            <div className="test-cases">
              <h4>🧪 Test Cases:</h4>
              {data.test_cases.map((testCase, index) => (
                <div key={index} className="test-case">
                  <strong>Input:</strong> <code className="inline-code">{testCase.input}</code> → <strong>Output:</strong> <code className="inline-code">{testCase.output}</code>
                </div>
              ))}
            </div>
          )}

          {data.hints && data.hints.length > 0 && (
            <div className="hints-section">
              <h4>💡 Hints:</h4>
              <ul>
                {data.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="code-exercise-area">
            <CodeEditor
              title="Code Exercise"
              initialCode={data.starter_code || '# Write your solution here\nprint("Hello, World!")'}
              height="400px"
              onCodeChange={setUserResponse}
              showSubmitButton={true}
              onSubmitCode={onSubmit}
              loading={loading}
              userId={userId}
            />
          </div>
        </div>
      );

    case 'scenario':
      return (
        <div className="content-section scenario-content">
          <h3>🎭 {data.title?.replace(/^(🎭\s*)?/g, '')}</h3>
          
          <div className="scenario-context">
            <h4>🏢 Context:</h4>
            <p>{data.context}</p>
          </div>

          {data.characters && data.characters.length > 0 && (
            <div className="characters">
              <h4>👥 Key People:</h4>
              {data.characters.map((character, index) => (
                <div key={index} className="character">
                  <strong>{character.name}</strong> ({character.role}): {character.description}
                </div>
              ))}
            </div>
          )}

          <div className="situation">
            <h4>⚡ Situation:</h4>
            <p>{data.situation}</p>
          </div>

          <div className="your-role">
            <h4>🎯 Your Role:</h4>
            <p>{data.your_role}</p>
          </div>

          <div className="decision-points">
            <h4>🤔 Key Decisions:</h4>
            <ul>
              {data.decision_points?.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="considerations">
            <h4>⚖️ Consider:</h4>
            <ul>
              {data.considerations?.map((consideration, index) => (
                <li key={index}>{consideration}</li>
              ))}
            </ul>
          </div>

          <div className="success-criteria">
            <h4>🏆 Success Looks Like:</h4>
            <p>{data.success_criteria}</p>
          </div>
          
          <div className="response-area">
            <h4>📝 How would you handle this situation?</h4>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Describe your approach, decisions, and reasoning..."
              className="response-textarea"
              rows={6}
              disabled={loading}
            />
            <button 
              onClick={() => onSubmit(userResponse)}
              disabled={loading || !userResponse.trim()}
              className="submit-button"
            >
              {loading ? 'Evaluating...' : 'Submit Response'}
            </button>
          </div>
        </div>
      );

    case 'quiz':
      return (
        <div className="content-section quiz-content">
          <h3>❓ {data.title?.replace(/^(❓\s*)?/g, '')}</h3>
          
          <div className="quiz-instructions">
            <p>{data.instructions}</p>
            <p><strong>Passing Score:</strong> {data.passing_score}%</p>
            {data.time_limit_minutes && (
              <p><strong>Time Limit:</strong> {data.time_limit_minutes} minutes</p>
            )}
          </div>

          <div className="quiz-questions">
            {data.questions?.map((question, qIndex) => (
              <div key={qIndex} className="quiz-question">
                <h4>Question {qIndex + 1}:</h4>
                <p>{question.question}</p>
                <div className="quiz-options">
                  {question.options?.map((option, oIndex) => (
                    <label key={oIndex} className="quiz-option">
                      <input 
                        type="radio" 
                        name={`question-${qIndex}`} 
                        value={oIndex}
                        onChange={(e) => {
                          // Update response to include selected answers
                          const answers = userResponse ? JSON.parse(userResponse || '{}') : {};
                          answers[qIndex] = parseInt(e.target.value);
                          setUserResponse(JSON.stringify(answers));
                        }}
                      />
                      {String.fromCharCode(65 + oIndex)}. {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="response-area">
            <button 
              onClick={() => onSubmit(userResponse || '{}')}
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Checking...' : 'Submit Answers'}
            </button>
          </div>
        </div>
      );

    case 'completion':
      return (
        <div className="content-section completion-content">
          <h3>🎉 {data.title?.replace(/^(🎉\s*)?/g, '')}</h3>
          <div className="completion-message">
            <p>{data.message}</p>
          </div>
          {data.summary && (
            <div className="completion-summary">
              <h4>📋 Summary:</h4>
              <div className="formatted-content">
                {renderFormattedContent(data.summary)}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="content-section unknown-content">
          <h3>Unknown Content Type: {content_type}</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          
          <div className="response-area">
            <button 
              onClick={() => onSubmit("Content viewed")}
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </div>
      );
  }
};

export default ContentRenderer;