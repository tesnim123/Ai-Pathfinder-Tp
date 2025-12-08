import { useState, useRef } from "react";
import { HeroSection } from "./components/HeroSection";
import { MazePanel } from "./components/MazePanel";
import { AlgorithmCards } from "./components/AlgorithmCards";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { Footer } from "./components/Footer";

interface AlgorithmResult {
  algorithm: string;
  pathLength: number;
  time: number;
  visited: number;
}

export default function App() {
  const [results, setResults] = useState<AlgorithmResult[]>([]);

  // Refs for sections
  const mazeRef = useRef<HTMLDivElement>(null);
  const algorithmsRef = useRef<HTMLDivElement>(null);

  const handleResultsUpdate = (newResult: AlgorithmResult) => {
    setResults(prevResults => {
      const filtered = prevResults.filter(r => r.algorithm !== newResult.algorithm);
      return [...filtered, newResult];
    });
  };
  const handleMazeClick = () => {
  if (mazeRef.current) {
    const top = mazeRef.current.getBoundingClientRect().top + window.scrollY - 100; // adjust 100px if needed
    window.scrollTo({ top, behavior: "smooth" });
  }
};


  return (
    <div className="min-h-screen">
      <HeroSection
        
        
      />

      <div ref={mazeRef}>
        <MazePanel onResultsUpdate={handleResultsUpdate} />
      </div>

      <div ref={algorithmsRef}>
        <AlgorithmCards />
      </div>

      <ResultsDashboard results={results} />
      <Footer />
    </div>
  );
}
