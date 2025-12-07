import React from 'react';
import { Type, Palette, Sliders, RotateCcw, Trash2 } from 'lucide-react';

const ControlPanel = ({ 
  previewText, 
  onPreviewTextChange, 
  fontSize, 
  onFontSizeChange, 
  textColor, 
  onTextColorChange,
  onClearSelection,
  selectedFonts 
}) => {

  const presetTexts = [
    'The quick brown fox jumps over the lazy dog',
    'Typography is the art and technique of arranging type',
    'Almost before we knew it, we had left the ground',
    'Pack my box with five dozen liquor jugs',
    'How vexingly quick daft zebras jump!',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'abcdefghijklmnopqrstuvwxyz',
    '1234567890 !@#$%^&*()',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  ];

  const presetColors = [
    '#000000', // Black
    '#ffffff', // White
    '#374151', // Dark Gray
    '#6B7280', // Gray
    '#EF4444', // Red
    '#F59E0B', // Orange
    '#10B981', // Green
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F97316', // Orange
    '#84CC16', // Lime
    '#06B6D4', // Cyan
  ];

  const handlePresetText = (text) => {
    onPreviewTextChange(text);
  };

  const handleResetText = () => {
    onPreviewTextChange('The quick brown fox jumps over the lazy dog');
  };

  const handleResetSettings = () => {
    onPreviewTextChange('The quick brown fox jumps over the lazy dog');
    onFontSizeChange(24);
    onTextColorChange('#000000');
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
          <Sliders className="h-4 w-4 mr-2" />
          Controls
        </h3>
        <button
          onClick={handleResetSettings}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 
                   flex items-center space-x-1"
          title="Reset all settings"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preview Text */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Type className="h-4 w-4 inline mr-1" />
          Preview Text
        </label>
        
        <textarea
          value={previewText}
          onChange={(e) => onPreviewTextChange(e.target.value)}
          placeholder="Enter text to preview..."
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder-gray-500 dark:placeholder-gray-400 resize-vertical min-h-[80px]"
        />

        {/* Quick Text Presets */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Quick presets:</div>
          <div className="grid grid-cols-1 gap-1">
            {presetTexts.slice(0, 5).map((text, index) => (
              <button
                key={index}
                onClick={() => handlePresetText(text)}
                className="text-left text-xs p-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                         rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors truncate"
                title={text}
              >
                {text}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleResetText}
            className="w-full text-xs p-2 bg-blue-600 dark:bg-blue-700 text-white 
                     rounded border border-blue-700 dark:border-blue-600 
                     hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Reset to default
          </button>
        </div>
      </div>

      {/* Font Size Slider */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Font Size: <span className="font-mono text-blue-600 dark:text-blue-400">{fontSize}px</span>
        </label>
        
        <div className="space-y-2">
          <input
            type="range"
            min="10"
            max="100"
            value={fontSize}
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer
                     slider:bg-blue-500 slider:rounded-full"
          />
          
          {/* Size Presets */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>10px</span>
            <div className="flex space-x-2">
              {[12, 16, 24, 32, 48, 72].map(size => (
                <button
                  key={size}
                  onClick={() => onFontSizeChange(size)}
                  className={`px-2 py-1 rounded transition-colors ${
                    fontSize === size 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <span>100px</span>
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          <Palette className="h-4 w-4 inline mr-1" />
          Text Color
        </label>
        
        <div className="space-y-3">
          {/* Color Input */}
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer 
                       bg-white dark:bg-gray-700"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="#000000"
            />
          </div>

          {/* Color Presets */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preset colors:</div>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map(color => (
                <button
                  key={color}
                  onClick={() => onTextColorChange(color)}
                  className={`w-8 h-8 rounded border-2 transition-all ${
                    textColor === color 
                      ? 'border-blue-500 dark:border-blue-400 scale-110' 
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Fonts Actions */}
      {selectedFonts && selectedFonts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Selection Actions
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {selectedFonts.length} font{selectedFonts.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <button
            onClick={onClearSelection}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm 
                     bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 
                     border border-red-200 dark:border-red-800 rounded-lg
                     hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Selection</span>
          </button>
        </div>
      )}

      {/* Settings Summary */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Current Settings</div>
          <div className="flex justify-between">
            <span>Font size:</span>
            <span className="font-mono">{fontSize}px</span>
          </div>
          <div className="flex justify-between">
            <span>Text color:</span>
            <span className="font-mono">{textColor}</span>
          </div>
          <div className="flex justify-between">
            <span>Text length:</span>
            <span>{previewText.length} chars</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;