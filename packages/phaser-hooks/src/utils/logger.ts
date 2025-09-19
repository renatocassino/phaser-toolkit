/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
/**
 * Professional logging utility for phaser-hooks
 * Provides structured, searchable logs with datetime and library identification
 */

export type LogContext = {
  key?: string;
  operation?: string;
  oldValue?: unknown;
  newValue?: unknown;
  validator?: string;
  error?: Error | string;
  [key: string]: unknown;
};

/**
 * Formats datetime for consistent logging
 */
const formatDateTime = (): string => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').replace('Z', '');
};

/**
 * Creates a searchable prefix for phaser-hooks logs with colors
 */
const createLogPrefix = (operation?: string): string => {
  const timestamp = formatDateTime();
  const libName = '%c[phaser-hooks]%c'; // Blue color for library name
  const operationStr = operation ? ` %c${operation}%c` : '';
  return `%c[${timestamp}]%c ${libName}${operationStr}`;
};

/**
 * Creates CSS styles for the colored prefix
 */
const createLogStyles = (operation?: string): string[] => {
  const styles = [
    'color: #bd93f9; font-weight: bold;', // Dracula purple for timestamp
    'color: inherit;', // Reset after timestamp
    'color: #2563eb; font-weight: bold;', // Blue for [phaser-hooks]
    'color: inherit;', // Reset after library name
  ];
  
  if (operation) {
    styles.push(
      'color: #059669; font-weight: bold;', // Green for operation
      'color: inherit;' // Reset after operation
    );
  }
  
  return styles;
};

/**
 * Log state initialization
 */
export const logStateInit = (key: string, initialValue: unknown): void => {
  const prefix = createLogPrefix('STATE_INIT');
  const styles = createLogStyles('STATE_INIT');
  console.groupCollapsed(`${prefix} Initializing state "${key}"`, ...styles);
  console.log('🔧 Key:', key);
  console.log('📦 Initial Value:', initialValue);
  console.log('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};

/**
 * Log state value retrieval
 */
export const logStateGet = (key: string, value: unknown): void => {
  const prefix = createLogPrefix('STATE_GET');
  const styles = createLogStyles('STATE_GET');
  console.log(`${prefix} Getting state "${key}":`, ...styles, value);
};

/**
 * Log state value update
 */
export const logStateSet = (key: string, oldValue: unknown, newValue: unknown): void => {
  const prefix = createLogPrefix('STATE_SET');
  const styles = createLogStyles('STATE_SET');
  console.groupCollapsed(`${prefix} Updating state "${key}"`, ...styles);
  console.log('🔑 Key:', key);
  console.log('📤 Old Value:', oldValue);
  console.log('📥 New Value:', newValue);
  console.log('🔄 Changed:', oldValue !== newValue);
  console.log('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};

/**
 * Log validator execution
 */
export const logValidator = (key: string, value: unknown, result: boolean | string): void => {
  const prefix = createLogPrefix('VALIDATOR');
  const styles = createLogStyles('VALIDATOR');
  const isValid = result === true;
  const status = isValid ? '✅ VALID' : '❌ INVALID';
  
  console.groupCollapsed(`${prefix} ${status} Validating "${key}"`, ...styles);
  console.log('🔍 Key:', key);
  console.log('📊 Value:', value);
  console.log('✅ Result:', result);
  console.log('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};

/**
 * Log event listener registration
 */
export const logEventListenerAdd = (key: string, event: string, callback: Function): void => {
  const prefix = createLogPrefix('EVENT_ADD');
  const styles = createLogStyles('EVENT_ADD');
  console.groupCollapsed(`${prefix} Adding listener for "${key}"`, ...styles);
  console.log('🔑 Key:', key);
  console.log('📡 Event:', event);
  console.log('🎯 Callback:', callback.name || 'anonymous');
  console.log('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};

/**
 * Log event listener removal
 */
export const logEventListenerRemove = (key: string, event: string, callback: Function): void => {
  const prefix = createLogPrefix('EVENT_REMOVE');
  const styles = createLogStyles('EVENT_REMOVE');
  console.groupCollapsed(`${prefix} Removing listener for "${key}"`, ...styles);
  console.log('🔑 Key:', key);
  console.log('📡 Event:', event);
  console.log('🎯 Callback:', callback.name || 'anonymous');
  console.log('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};

/**
 * Log clearing all listeners
 */
export const logClearListeners = (key: string): void => {
  const prefix = createLogPrefix('CLEAR_LISTENERS');
  const styles = createLogStyles('CLEAR_LISTENERS');
  console.groupCollapsed(`${prefix} Clearing all listeners for "${key}"`, ...styles);
  console.log('🔑 Key:', key);
  console.log('🧹 Action:', 'Removing all event listeners');
  console.log('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};

/**
 * Log error with context
 */
export const logError = (operation: string, error: Error | string, context?: LogContext): void => {
  const prefix = createLogPrefix(operation);
  const styles = createLogStyles(operation);
  console.groupCollapsed(`${prefix} ERROR`, ...styles);
  console.error('🚨 Operation:', operation);
  console.error('💥 Error:', error);
  if (context) {
    console.error('📋 Context:', context);
  }
  console.error('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};

/**
 * Log warning with context
 */
export const logWarning = (operation: string, message: string, context?: LogContext): void => {
  const prefix = createLogPrefix(operation);
  const styles = createLogStyles(operation);
  console.groupCollapsed(`${prefix} WARNING`, ...styles);
  console.warn('⚠️ Operation:', operation);
  console.warn('📢 Message:', message);
  if (context) {
    console.warn('📋 Context:', context);
  }
  console.warn('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};

/**
 * Log info message
 */
export const logInfo = (operation: string, message: string, context?: LogContext): void => {
  const prefix = createLogPrefix(operation);
  const styles = createLogStyles(operation);
  console.groupCollapsed(`${prefix} INFO`, ...styles);
  console.log('ℹ️ Operation:', operation);
  console.log('📢 Message:', message);
  if (context) {
    console.log('📋 Context:', context);
  }
  console.log('⏰ Timestamp:', formatDateTime());
  console.groupEnd();
};