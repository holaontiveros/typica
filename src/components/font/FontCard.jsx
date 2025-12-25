import { Check, Copy, Eye, FolderOpen, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import Button, { CompareButton } from '../Button';

const FontCard = ({ 
  font, 
  previewText = 'The quick brown fox jumps over the lazy dog',
  fontSize = 18,
  textColor = '#000000',
  onFontSelect,
  onFontCompare,
  onRemoveFont,
  selectedFonts = [],
  showActions = true,
  showRemove = false,
  variant = 'default', // 'default', 'comparison', 'preview'
  className,
  ...props 
}) => {
  const isInComparison = selectedFonts.length > 1 && selectedFonts.some(f => f.name === font.name);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyFontName = async () => {
    try {
      await navigator.clipboard.writeText(font.name);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy font name:', err);
    }
  };

  const handleShowInFinder = async () => {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('show_font_in_finder', { fontName: font.name });
    } catch (err) {
      console.error('Failed to show font in finder:', err);
      // Fallback: try to open system fonts folder
      try {
        const { shell } = await import('@tauri-apps/api');
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const fontsPath = isMac ? '/System/Library/Fonts/' : 'C:\\Windows\\Fonts\\';
        await shell.open(fontsPath);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    }
  };

  const baseClasses = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden";
  
  if (variant === 'comparison') {
    return (
      <div className={cn(baseClasses, className)} {...props}>
        {/* Comparison Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
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
          
          {showRemove && onRemoveFont && (
            <button
              onClick={() => onRemoveFont(font)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Remove from comparison"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Preview */}
        <div className="p-4">
          <div 
            className="leading-relaxed wrap-break-word min-h-[120px] flex items-center"
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

        {/* Font Details */}
        <div className="px-4 pb-4 space-y-2">
          <div className="text-xs">
            <span className="text-gray-500 dark:text-gray-400">CSS:</span>
            <div className="font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-1 rounded text-xs mt-1">
              font-family: '{font.name}'
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        baseClasses,
        showActions && "group hover:shadow-md transition-shadow duration-200 cursor-pointer",
        className
      )} 
      {...props}
    >
      <div className="p-4">
        {/* Font Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            {/* Font Info */}
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {font.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {font.classification}
                {font.weight && font.weight !== 'regular' && ` • ${font.weight}`}
              </span>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-1">
              {font.isDefault && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  Default
                </span>
              )}
              {font.isCommon && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  Common
                </span>
              )}
              {isInComparison && (
                <span className="text-xs bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 px-2 py-1 rounded">
                  In Comparison
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {showActions && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopyFontName}
                className={`p-1 transition-colors ${
                  copySuccess 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title={copySuccess ? 'Copied!' : 'Copy font name'}
              >
                {copySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          )}
        </div>

        {/* Preview Text */}
        <div 
          className="text-lg mb-4"
          style={{ 
            fontFamily: font.name,
            fontSize: `${fontSize}px`,
            color: textColor
          }}
        >
          {previewText}
        </div>

        {/* Action Buttons */}
        {showActions && (onFontSelect || onFontCompare) && (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleShowInFinder}
              variant="outline"
              size="xs"
              icon={<FolderOpen className="h-3 w-3" />}
              className="flex-1"
              title="Show font location in file manager"
            >
              
            </Button>
            {onFontSelect && (
              <Button
                onClick={() => onFontSelect(font)}
                variant="primary"
                size="xs"
                icon={<Eye className="h-3 w-3" />}
                className="flex-1"
              >
                Preview
              </Button>
            )}
            {onFontCompare && (
              <CompareButton
                onClick={() => onFontCompare(font)}
                inComparison={isInComparison}
                animate={!isInComparison}
                size="xs"
                icon={<Plus className="h-3 w-3" />}
                title={isInComparison ? 'Font already in comparison' : 'Add to comparison'}
                className="flex-1"
              >
                {isInComparison ? 'Added' : 'Compare'}
              </CompareButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FontCard;