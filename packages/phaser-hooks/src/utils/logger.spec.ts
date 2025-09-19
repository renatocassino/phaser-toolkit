import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  logStateInit, 
  logStateGet, 
  logStateSet, 
  logValidator, 
  logEventListenerAdd, 
  logEventListenerRemove, 
  logClearListeners, 
  logError, 
  logWarning, 
  logInfo 
} from './logger';

describe('Logger Functions', () => {
  let consoleGroupCollapsedSpy: ReturnType<typeof vi.spyOn>;
  let consoleGroupEndSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock console methods
    consoleGroupCollapsedSpy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Dracula-themed colored logging', () => {
    it('should log with beautiful Dracula colors', () => {
      logStateInit('test-key', { value: 42 });
      
      // Verify the log was called with the correct number of arguments (7 total)
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify the colors are applied correctly
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleLogSpy).toHaveBeenCalledWith('🔧 Key:', 'test-key');
      expect(consoleLogSpy).toHaveBeenCalledWith('📦 Initial Value:', { value: 42 });
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should log state operations with Dracula colors', () => {
      logStateGet('test-key', { value: 100 });
      
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleLogSpy.mock.calls[0];
      expect(callArgs).toHaveLength(4); // message + 3 style arguments + value
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![2]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![3]).toContain('color: #059669'); // Green for operation
      
      // Verify the value is logged directly
      expect(callArgs![4]).toEqual({ value: 100 });
    });

    it('should log state updates with Dracula colors', () => {
      const oldValue = { value: 50 };
      const newValue = { value: 75 };
      
      logStateSet('test-key', oldValue, newValue);
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleLogSpy).toHaveBeenCalledWith('🔄 Changed:', true);
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should detect when values are unchanged', () => {
      const sameValue = { value: 50 };
      
      logStateSet('test-key', sameValue, sameValue);
      
      expect(consoleLogSpy).toHaveBeenCalledWith('🔄 Changed:', false);
    });
  });

  describe('Validator logging with Dracula colors', () => {
    it('should log valid validation with Dracula colors', () => {
      logValidator('test-key', { value: 50 }, true);
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Result:', true);
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should log invalid validation with Dracula colors', () => {
      logValidator('test-key', { value: -10 }, 'Value must be positive');
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Result:', 'Value must be positive');
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });
  });

  describe('Event listener logging with Dracula colors', () => {
    it('should log event listener addition with Dracula colors', () => {
      const callback = vi.fn();
      logEventListenerAdd('test-key', 'change', callback);
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleLogSpy).toHaveBeenCalledWith('🎯 Callback:', 'spy');
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should log event listener removal with Dracula colors', () => {
      const callback = vi.fn();
      const namedCallback = Object.assign(callback, { name: 'myCallback' });
      logEventListenerRemove('test-key', 'change', namedCallback);
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleLogSpy).toHaveBeenCalledWith('🎯 Callback:', 'myCallback');
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should log clearing all listeners with Dracula colors', () => {
      logClearListeners('test-key');
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleLogSpy).toHaveBeenCalledWith('🧹 Action:', 'Removing all event listeners');
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });
  });

  describe('Error and warning logging with Dracula colors', () => {
    it('should log errors with Dracula colors', () => {
      const error = new Error('Test error');
      const context = { key: 'test-key', operation: 'test-op' };
      
      logError('TEST_OPERATION', error, context);
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('💥 Error:', error);
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should log warnings with Dracula colors', () => {
      const context = { key: 'test-key' };
      
      logWarning('DEPRECATED_FEATURE', 'This feature is deprecated', context);
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleWarnSpy).toHaveBeenCalledWith('📢 Message:', 'This feature is deprecated');
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });

    it('should log info messages with Dracula colors', () => {
      const context = { key: 'test-key' };
      
      logInfo('INFO_OPERATION', 'This is an info message', context);
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      expect(callArgs).toHaveLength(7);
      
      // Verify Dracula colors
      expect(callArgs![1]).toContain('color: #bd93f9'); // Dracula purple for timestamp
      expect(callArgs![3]).toContain('color: #2563eb'); // Blue for library name
      expect(callArgs![5]).toContain('color: #059669'); // Green for operation
      
      expect(consoleLogSpy).toHaveBeenCalledWith('📢 Message:', 'This is an info message');
      expect(consoleGroupEndSpy).toHaveBeenCalled();
    });
  });

  describe('Timestamp formatting', () => {
    it('should include timestamp in all log messages', () => {
      logStateInit('test-key', 'test-value');
      
      expect(consoleGroupCollapsedSpy).toHaveBeenCalledTimes(1);
      const callArgs = consoleGroupCollapsedSpy.mock.calls[0];
      
      // Verify timestamp format (now starts with %c)
      expect(callArgs![0]).toMatch(/^%c\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}\]%c/);
      expect(callArgs).toHaveLength(7); // 1 message + 6 style arguments
    });
  });
});