// App.tsx
import { type ReactElement } from 'react';
import { useInjectionStatus } from './hooks/use-inject-status';
import { LoadingScreen } from './components/loading-screen';
import { ActivationInstructions } from './components/activation-instructions';
import { Inspector } from './components/inspector';

export const App = (): ReactElement => {
  const { isInjected, isChecking } = useInjectionStatus();

  // Loading state
  if (isChecking) {
    return <LoadingScreen />;
  }

  // Not injected - show instructions
  if (!isInjected) {
    return <ActivationInstructions />;
  }

  // Injected - show main inspector
  return <Inspector />;
}

export default App;
