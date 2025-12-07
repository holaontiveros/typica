import React, { useState } from 'react';
import { X, Copy, Download, RotateCcw } from 'lucide-react';

const FontComparison = ({ fonts, previewText, fontSize, textColor, onRemoveFont }) => {
  const [comparisonText, setComparisonText] = useState(previewText);

  const handleRemoveFont = (font) => {
    if (onRemoveFont) {
      onRemoveFont(font);
    }
  };

  const handleCopyComparison = () => {
    const comparisonData = fonts.map(font => `${font.name}: "${comparisonText}"`).join('\n');
    navigator.clipboard.writeText(comparisonData);
  };

  const handleResetText = () => {
    setComparisonText(previewText);
  };

  const sampleTexts = [
    'The quick brown fox jumps over the lazy dog',
    'Typography is the art and technique of arranging type',
    'Almost before we knew it, we had left the ground',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz',
    '1234567890 !@#$%^&*()',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Font Comparison
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Comparing {fonts.length} font{fonts.length !== 1 ? 's' : ''} side by side
            {fonts.length < 6 && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                • Add {6 - fonts.length} more font{6 - fonts.length !== 1 ? 's' : ''} from the grid
              </span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={handleResetText}
            className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Reset to default text"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset Text</span>
          </button>
          
          <button
            onClick={handleCopyComparison}
            className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900 
                     text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800
                     rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy Comparison</span>
          </button>
        </div>
      </div>

      {/* Text Input for Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Comparison Text
        </label>
        <textarea
          value={comparisonText}
          onChange={(e) => setComparisonText(e.target.value)}
          placeholder="Enter text to compare across fonts..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-500 dark:placeholder-gray-400 resize-vertical min-h-[80px]"
        />
        
        {/* Quick Text Options */}
        <div className="mt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick options:</div>
          <div className="flex flex-wrap gap-2">
            {sampleTexts.map((text, index) => (
              <button
                key={index}
                onClick={() => setComparisonText(text)}
                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 
                         rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {text.length > 30 ? text.substring(0, 30) + '...' : text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Font Comparison Grid */}
      <div className={`grid gap-6 ${
        fonts.length === 1 ? 'grid-cols-1' :
        fonts.length === 2 ? 'grid-cols-1 lg:grid-cols-2' :
        fonts.length === 3 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' :
        fonts.length === 4 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' :
        fonts.length === 5 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
      }`}>
        {fonts.map((font, index) => (
          <div 
            key={`${font.name}-${index}`}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            {/* Font Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {font.name}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {font.classification}
                  {font.weight && font.weight !== 'regular' && ` • ${font.weight}`}
                  {font.isDefault && ' • Default'}
                </div>
              </div>
              
              <button
                onClick={() => handleRemoveFont(font)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove from comparison"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Font Preview */}
            <div className="p-4">
              <div 
                className="leading-relaxed break-words min-h-[120px] flex items-center"
                style={{ 
                  fontFamily: font.name,
                  fontSize: `${fontSize}px`,
                  color: textColor,
                  lineHeight: '1.4'
                }}
              >
                {comparisonText}
              </div>
            </div>

            {/* Font Details */}
            <div className="px-4 pb-4 space-y-2">
              <div className="text-xs">
                <span className="text-gray-500 dark:text-gray-400">CSS:</span>
                <div className="font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-1 rounded text-xs mt-1">
                  font-family: "{font.name}";
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Size Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Size Comparison
        </h3>
        
        <div className="space-y-6">
          {[16, 24, 32, 48].map(size => (
            <div key={size} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {size}px
              </div>
              <div className="space-y-3">
                {fonts.map((font, index) => (
                  <div key={`${font.name}-${size}-${index}`} className="flex items-baseline space-x-4">
                    <div className="w-32 text-sm text-gray-600 dark:text-gray-300 truncate flex-shrink-0">
                      {font.name}
                    </div>
                    <div 
                      className="flex-1"
                      style={{ 
                        fontFamily: font.name,
                        fontSize: `${size}px`,
                        color: textColor,
                        lineHeight: '1.2'
                      }}
                    >
                      {comparisonText.length > 50 
                        ? 'The quick brown fox jumps over the lazy dog' 
                        : comparisonText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Character Set Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Character Set Comparison
        </h3>
        
        <div className="space-y-6">
          {[
            { label: 'Uppercase', text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            { label: 'Lowercase', text: 'abcdefghijklmnopqrstuvwxyz' },
            { label: 'Numbers', text: '1234567890' },
            { label: 'Symbols', text: '!@#$%^&*()[]{}|;:,.<>?' }
          ].map(({ label, text }) => (
            <div key={label} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {label}
              </div>
              <div className="space-y-3">
                {fonts.map((font, index) => (
                  <div key={`${font.name}-${label}-${index}`} className="flex items-center space-x-4">
                    <div className="w-32 text-sm text-gray-600 dark:text-gray-300 truncate flex-shrink-0">
                      {font.name}
                    </div>
                    <div 
                      className="flex-1 font-normal"
                      style={{ 
                        fontFamily: font.name,
                        fontSize: '18px',
                        color: textColor
                      }}
                    >
                      {text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {fonts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Copy className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No fonts to compare
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select fonts from the grid to compare them side by side
          </p>
        </div>
      )}
    </div>
  );
};

export default FontComparison;