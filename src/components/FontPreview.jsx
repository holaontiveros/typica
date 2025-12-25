import React from 'react';
import { Copy, Download, Share2, Info, Plus } from 'lucide-react';

const FontPreview = ({ font, previewText, fontSize, textColor, selectedFonts = [], onFontCompare }) => {
  const handleCopyText = () => {
    navigator.clipboard.writeText(previewText);
  };

  const handleCopyFontName = () => {
    navigator.clipboard.writeText(font.name);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Font Preview: ${font.name}`,
        text: `Check out this font: ${font.name}`,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`Font: ${font.name} - ${window.location.href}`);
    }
  };

  const fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72, 96];
  const sampleTexts = [
    'The quick brown fox jumps over the lazy dog',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '1234567890 !@#$%^&*()',
    'Typography is the art and technique of arranging type.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Almost before we knew it, we had left the ground.'
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1" style={{ fontFamily: font.name }}>
            {font.name}
          </h2>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded capitalize">
              {font.classification}
            </span>
            {font.weight && font.weight !== 'regular' && (
              <span className="bg-purple-100 dark:bg-purple-700 px-2 py-1 rounded capitalize">
                {font.weight}
              </span>
            )}
            {font.isDefault && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                System Default
              </span>
            )}
            {font.isCommon && (
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                Common Font
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {/* Comparison Status and Button */}
          {selectedFonts.length > 1 ? (
            selectedFonts.slice(1).some(f => f.name === font.name) ? (
              <span className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-100 dark:bg-green-900 
                           text-green-800 dark:text-green-200 rounded-lg">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>In Comparison</span>
              </span>
            ) : (
              <button
                onClick={() => onFontCompare && onFontCompare(font)}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 
                         text-white rounded-lg transition-colors cursor-pointer"
                title="Add to comparison"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add to Compare</span>
              </button>
            )
          ) : (
            <button
              onClick={() => onFontCompare && onFontCompare(font)}
              className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 
                       text-white rounded-lg transition-colors cursor-pointer"
              title="Add to comparison"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add to Compare</span>
            </button>
          )}
          <button
            onClick={handleCopyFontName}
            className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                     rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="Copy font name"
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy Name</span>
          </button>
          
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                     rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="Copy preview text"
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copy Text</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                     rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            title="Share font"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Preview ({fontSize}px)
        </div>
        <div 
          className="leading-relaxed wrap-break-word"
          style={{ 
            fontFamily: font.name,
            fontSize: `${fontSize}px`,
            color: textColor,
            lineHeight: '1.4'
          }}
        >
          {previewText}
        </div>
      </div>

      {/* Font Sizes Showcase */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2" />
          Size Variations
        </h3>
        <div className="space-y-4">
          {fontSizes.map(size => (
            <div key={size} className="flex items-baseline space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 w-12 shrink-0">
                {size}px
              </div>
              <div 
                className="flex-1 text-gray-900 dark:text-white wrap-break-word"
                style={{ 
                  fontFamily: font.name,
                  fontSize: `${size}px`,
                  color: textColor
                }}
              >
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Character Set Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Character Set Preview
        </h3>
        <div className="grid gap-4">
          {sampleTexts.map((text, index) => (
            <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {index === 0 && 'Pangram'}
                {index === 1 && 'Uppercase Letters'}
                {index === 2 && 'Lowercase Letters'}
                {index === 3 && 'Numbers & Symbols'}
                {index === 4 && 'Typography Quote'}
                {index === 5 && 'Lorem Ipsum'}
                {index === 6 && 'Sample Text'}
              </div>
              <div 
                className="text-lg text-gray-900 dark:text-white leading-relaxed wrap-break-word"
                style={{ 
                  fontFamily: font.name,
                  color: textColor
                }}
              >
                {text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Font Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Font Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Font Family</div>
            <div className="font-mono text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
              {font.name}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Classification</div>
            <div className="text-sm text-gray-900 dark:text-white capitalize">
              {font.classification}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Font Weight</div>
            <div className="text-sm text-gray-900 dark:text-white capitalize">
              {font.weight || 'regular'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">CSS Font Stack</div>
            <div className="font-mono text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded">
              font-family: "{font.name}", {font.classification};
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Fallbacks</div>
            <div className="text-sm text-gray-900 dark:text-white">
              {font.classification === 'serif' && 'Times, Times New Roman, serif'}
              {font.classification === 'sans-serif' && 'Arial, Helvetica, sans-serif'}
              {font.classification === 'monospace' && 'Courier, Courier New, monospace'}
              {font.classification === 'cursive' && 'cursive'}
              {font.classification === 'fantasy' && 'fantasy'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontPreview;