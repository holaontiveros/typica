import React from 'react';
import { cn } from '../utils/cn';

// Base button component with all common functionality
const Button = React.forwardRef(({ 
  children,
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  active = false,
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  
  const baseClasses = "inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
  
  const variants = {
    // Primary action button (blue)
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600",
    
    // Secondary action button (gray)
    secondary: "hover:text-red border border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white!",
    
    // Success/positive action (green)
    success: "border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 focus:ring-green-500 dark:border-green-600 dark:bg-green-900 dark:text-green-400 dark:hover:bg-green-800",
    
    // Warning/attention (yellow)
    warning: "border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 focus:ring-yellow-500 dark:border-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800",
    
    // Danger/destructive (red)
    danger: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 dark:border-red-800 focus:ring-red-500",
    
    // Purple/special actions
    purple: "bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 dark:text-purple-400 dark:border-purple-800 focus:ring-purple-500",
    
    // Outline variant
    outline: "border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-300 focus:ring-gray-500",
    
    // Ghost/minimal button
    ghost: "hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-300 hover:!text-gray-900 dark:hover:!text-white",
    
    // Icon only button
    icon: "p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 hover:!text-gray-900 dark:hover:!text-white focus:ring-gray-500",
    
    // Active state for toggles
    active: active ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow" : "",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm", 
    default: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
    icon: "p-2"
  };

  const roundingClasses = {
    xs: "rounded",
    sm: "rounded", 
    default: "rounded-lg",
    lg: "rounded-lg",
    icon: "rounded-lg"
  };

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-4 w-4", 
    default: "h-4 w-4",
    lg: "h-5 w-5",
    icon: "h-5 w-5"
  };

  const variantClass = active && variant !== 'active' ? variants.active : variants[variant];
  const sizeClass = sizes[size];
  const roundingClass = roundingClasses[size];
  const iconClass = iconSizes[size];

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variantClass,
        sizeClass,
        roundingClass,
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className={cn(iconClass, children && "mr-1")}>
              {icon}
            </span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className={cn(iconClass, children && "ml-1")}>
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// Specialized button components for common patterns
export const IconButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="icon" size="icon" {...props} />
));

export const ToggleButton = React.forwardRef(({ active, children, ...props }, ref) => (
  <Button ref={ref} active={active} variant={active ? "active" : "secondary"} {...props}>
    {children}
  </Button>
));

export const ActionButton = React.forwardRef((props, ref) => (
  <Button ref={ref} variant="outline" {...props} />
));

export const FilterButton = React.forwardRef(({ active, count, children, ...props }, ref) => (
  <Button 
    ref={ref} 
    variant={active ? "primary" : "outline"} 
    className={cn(
      "w-full text-left p-3 justify-between",
      active && "bg-blue-50 dark:bg-blue-900/50 border-blue-300 dark:border-blue-600"
    )}
    {...props}
  >
    <span>{children}</span>
    {count !== undefined && (
      <span className={cn(
        "text-xs px-2 py-1 rounded-full",
        active 
          ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
          : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
      )}>
        {count}
      </span>
    )}
  </Button>
));

export const CompareButton = React.forwardRef(({ inComparison, animate, ...props }, ref) => (
  <Button 
    ref={ref}
    variant={inComparison ? "secondary" : "success"}
    disabled={inComparison}
    className={cn(
      animate && !inComparison && "animate-pulse",
      inComparison && "cursor-not-allowed"
    )}
    {...props}
  />
));

export const PresetButton = React.forwardRef(({ active, ...props }, ref) => (
  <Button 
    ref={ref}
    variant="ghost"
    size="sm"
    active={active}
    className={cn(
      "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
      active && "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
    )}
    {...props}
  />
));

export const NavigationButton = React.forwardRef(({ active, special, count, animate, ...props }, ref) => {
  let variant = "secondary";
  let className = "";
  
  if (special === "compare-ready") {
    variant = "success";
    className = "border-2 border-green-400 dark:border-green-600";
    if (animate) className += " animate-pulse";
  } else if (special === "compare-one") {
    variant = "warning"; 
    className = "border border-yellow-400 dark:border-yellow-600";
  }
  
  return (
    <Button 
      ref={ref}
      variant={active ? "active" : variant}
      active={active}
      className={cn(className)}
      {...props}
    >
      {props.children}
      {count > 0 && ` (${count})`}
    </Button>
  );
});

export default Button;