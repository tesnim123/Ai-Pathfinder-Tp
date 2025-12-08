import { Play, BookOpen } from "lucide-react";
import MazeImage from "../assets/Gemini_Generated_Image_tnjow7tnjow7tnjo (1).png";

const scrollToMaze = () => {
    const mazeSection = document.getElementById('maze-visualizer');
    mazeSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLearn = () => {
    const learnSection = document.getElementById('algorithms-info');
    learnSection?.scrollIntoView({ behavior: 'smooth' });
  };

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <h1 className="gradient-text text-5xl font-bold">
                Maze Solver Visualizer
              </h1>
              <p className="text-xl text-slate-600">
                Explore the maze using BFS, DFS, and A* algorithms. Visualize paths and compare performances.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 relative z-10">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
                onClick={scrollToMaze}
              >
                <Play className="w-5 h-5" />
                Start Visualizing
              </button>

              <button
                className="flex items-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 border border-slate-200 transition-transform"
                onClick={scrollToLearn}
              >
                <BookOpen className="w-5 h-5" />
                Learn the Algorithms
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 relative z-10">
              <div>
                <div className="text-3xl font-bold text-blue-600">3</div>
                <div className="text-sm text-slate-500">Algorithms</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-slate-500">Interactive</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600">Real-time</div>
                <div className="text-sm text-slate-500">Visualization</div>
              </div>
            </div>
          </div>

          {/* Right side - Maze illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 pointer-events-none"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <img
                src={MazeImage}
                alt="Maze illustration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-teal-300 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
    </div>
  );
}
