import TransitionProvider from './transition-provider';

export default function Template({ children }: { children: React.ReactNode }) {
  return <TransitionProvider>{children}</TransitionProvider>;
}


