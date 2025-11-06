// hooks/useInjectionStatus.ts
import { useEffect, useState } from 'react';

export const useInjectionStatus = (): { isInjected: boolean | null, isChecking: boolean } => {
  const [isInjected, setIsInjected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkInjection = (): void => {
      try {
        const tabId = chrome.devtools.inspectedWindow.tabId;
        
        chrome.runtime.sendMessage(
          { type: 'CHECK_INJECTED', tabId },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('Error checking injection:', chrome.runtime.lastError);
              setIsInjected(false);
            } else {
              const injected = response?.injected || false;
              
              // Log quando mudar de estado
              if (isInjected === false && injected === true) {
                console.log('✅ Extension activated successfully!');
              }
              
              setIsInjected(injected as boolean);
            }
            setIsChecking(false);
          }
        );
      } catch (error) {
        console.error('Failed to check injection status:', error);
        setIsInjected(false);
        setIsChecking(false);
      }
    };

    checkInjection();

    // Check mais frequente quando não está injetado
    const intervalTime = isInjected ? 5000 : 1000;
    const interval = setInterval(checkInjection, intervalTime);
    
    return () => clearInterval(interval);
  }, [isInjected]);

  return { isInjected, isChecking };
}
