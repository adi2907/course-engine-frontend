/**
 * ContentRenderer.jsx - Updated for Structured Backend Data
 * Renders different content types from LangGraph structured responses
 */

import React from 'react';
import CodeEditor from './CodeEditor';

const ContentRenderer = ({ 
  structuredContent,
  userResponse, 
  setUserResponse, 
  onSubmit, 
  loading,
  userId 
}) => {
  
  if (!structuredContent) {
    return (
      <div className="content-section">
        <p>Loading content...</p>
      </div>
    );
  }

  const { content_type, data, progress } = structuredContent;

  const handleSubmit = () => {
    if (userResponse.trim()) {
      onSubmit(userResponse);
    }
  };

  switch (content_type) {
    case 'explanation':
      return (
        <div className="content-section explanation-content">
          <h3>📚 {data.title}</h3>
          
          <div className="explanation-overview">
            <p><strong>Overview:</strong> {data.overview}</p>
          </div>

          <div className="key-concepts">
            <h4>Key Concepts:</h4>
            <ul>
              {data.key_concepts?.map((concept, index) => (
                <li key={index}>{concept}</li>
              ))}
            </ul>
          </div>

          <div className="detailed-explanation">
            <div dangerouslySetInnerHTML={{ __html: data.detailed_explanation?.replace(/\n/g, '<br />') }} />
          </div>

          {data.examples && data.examples.length > 0 && (
            <div className="examples-section">
              <h4>Examples:</h4>
              <ul>
                {data.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="why-matters">
            <h4>Why This Matters:</h4>
            <p>{data.why_it_matters}</p>
          </div>

          <div className="next-steps">
            <h4>Next Steps:</h4>
            <p>{data.next_steps}</p>
          </div>
          
          <div className="response-area">
            <h4>Your thoughts or questions:</h4>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Share your understanding, ask questions, or note key takeaways..."
              className="response-textarea"
              rows={4}
              disabled={loading}
            />
            <button 
              onClick={handleSubmit}
              disabled={loading || !userResponse.trim()}
              className="submit-button"
            >
              {loading ? '⏳ Processing...' : '➡️ Continue'}
            </button>
          </div>
        </div>
      );

    case 'code_exercise':
      return (
        <div className="content-section code-exercise-content">
          <h3>💻 {data.title}</h3>
          
          <div className="exercise-description">
            <p><strong>Problem:</strong> {data.problem_description}</p>
          </div>

          <div className="learning-objectives">
            <h4>Learning Objectives:</h4>
            <ul>
              {data.learning_objectives?.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="exercise-instructions">
            <h4>Instructions:</h4>
            <ol>
              {data.instructions?.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          {data.expected_output && (
            <div className="expected-output">
              <h4>Expected Output:</h4>
              <pre className="output-example">{data.expected_output}</pre>
            </div>
          )}

          {data.test_cases && data.test_cases.length > 0 && (
            <div className="test-cases">
              <h4>Test Cases:</h4>
              {data.test_cases.map((testCase, index) => (
                <div key={index} className="test-case">
                  <strong>Input:</strong> {testCase.input} → <strong>Output:</strong> {testCase.output}
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
          <h3>🎭 {data.title}</h3>
          
          <div className="scenario-context">
            <h4>Context:</h4>
            <p>{data.context}</p>
          </div>

          {data.characters && data.characters.length > 0 && (
            <div className="characters">
              <h4>Key People:</h4>
              {data.characters.map((character, index) => (
                <div key={index} className="character">
                  <strong>{character.name}</strong> ({character.role}): {character.description}
                </div>
              ))}
            </div>
          )}

          <div className="situation">
            <h4>Situation:</h4>
            <p>{data.situation}</p>
          </div>

          <div className="your-role">
            <h4>Your Role:</h4>
            <p>{data.your_role}</p>
          </div>

          <div className="decision-points">
            <h4>Key Decisions:</h4>
            <ul>
              {data.decision_points?.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="considerations">
            <h4>Consider:</h4>
            <ul>
              {data.considerations?.map((consideration, index) => (
                <li key={index}>{consideration}</li>
              ))}
            </ul>
          </div>

          <div className="success-criteria">
            <h4>Success Looks Like:</h4>
            <p>{data.success_criteria}</p>
          </div>
          
          <div className="response-area">
            <h4>How would you handle this situation?</h4>
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Describe your approach, decisions, and reasoning..."
              className="response-textarea"
              rows={6}
              disabled={loading}
            />
            <button 
              onClick={handleSubmit}
              disabled={loading || !userResponse.trim()}
              className="submit-button"
            >
              {loading ? '⏳ Evaluating...' : '📋 Submit Response'}
            </button>
          </div>
        </div>
      );

    case 'quiz':
      return (
        <div className="content-section quiz-content">
          <h3>❓ {data.title}</h3>
          
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
              {loading ? '⏳ Checking...' : '✅ Submit Answers'}
            </button>
          </div>
        </div>
      );

    case 'completion':
      return (
        <div className="content-section completion-content">
          <h3>🎉 {data.title}</h3>
          <div className="completion-message">
            <p>{data.message}</p>
          </div>
          {data.summary && (
            <div className="completion-summary">
              <h4>Summary:</h4>
              <div dangerouslySetInnerHTML={{ __html: data.summary.replace(/\n/g, '<br />') }} />
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="content-section unknown-content">
          <h3>❓ Unknown Content Type: {content_type}</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          
          <div className="response-area">
            <textarea
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Your response..."
              className="response-textarea"
              rows={4}
              disabled={loading}
            />
            <button 
              onClick={handleSubmit}
              disabled={loading || !userResponse.trim()}
              className="submit-button"
            >
              {loading ? '⏳ Processing...' : '➡️ Continue'}
            </button>
          </div>
        </div>
      );
  }
};

export default ContentRenderer;