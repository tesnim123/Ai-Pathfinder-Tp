import { Waves, GitBranch, Target } from "lucide-react";

const algorithms = [
  {
    name: "BFS",
    title: "Breadth-First Search",
    icon: Waves,
    color: "blue",
    description: "Explores the maze level by level, guaranteeing the shortest path in unweighted graphs.",
    pros: [
      "Guarantees shortest path",
      "Complete and optimal",
      "Good for unweighted graphs"
    ],
    cons: [
      "High memory usage",
      "Slower than A* for large mazes",
      "Explores many unnecessary nodes"
    ],
    useCases: [
      "Finding shortest path",
      "Web crawlers",
      "Social network analysis"
    ]
  },
  {
    name: "DFS",
    title: "Depth-First Search",
    icon: GitBranch,
    color: "purple",
    description: "Explores as far as possible along each branch before backtracking. Fast but doesn't guarantee shortest path.",
    pros: [
      "Low memory usage",
      "Simple implementation",
      "Fast for deep solutions"
    ],
    cons: [
      "Doesn't guarantee shortest path",
      "Can get stuck in deep branches",
      "May miss closer solutions"
    ],
    useCases: [
      "Maze generation",
      "Topological sorting",
      "Detecting cycles"
    ]
  },
  {
    name: "A*",
    title: "A* Search",
    icon: Target,
    color: "teal",
    description: "Uses heuristics to intelligently explore the most promising paths first. Optimal and efficient.",
    pros: [
      "Optimal and complete",
      "Very efficient with good heuristic",
      "Explores fewer nodes"
    ],
    cons: [
      "Requires heuristic function",
      "More complex to implement",
      "Memory intensive"
    ],
    useCases: [
      "Pathfinding in games",
      "GPS navigation",
      "Robotics"
    ]
  }
];

export function AlgorithmCards() {
  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200"
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200"
    },
    teal: {
      gradient: "from-teal-500 to-teal-600",
      bg: "bg-teal-50",
      text: "text-teal-600",
      border: "border-teal-200"
    }
  };

  return (
    <div id="algorithms-info" className="max-w-7xl mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="gradient-text mb-4">Algorithm Deep Dive</h2>
        <p className="text-lg text-slate-600">
          Understand how each algorithm works and when to use them
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {algorithms.map((algo) => {
          const Icon = algo.icon;
          const colors = colorClasses[algo.color as keyof typeof colorClasses];
          
          return (
            <div
              key={algo.name}
              className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200 card-hover"
            >
              {/* Header */}
              <div className="space-y-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className={`text-sm ${colors.text} mb-1`}>
                    {algo.name}
                  </div>
                  <h3 className="text-slate-800">{algo.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-600 mb-6 text-sm">
                {algo.description}
              </p>

              {/* Pros */}
              <div className="mb-4">
                <h4 className="text-green-600 mb-2 text-sm">✓ Pros</h4>
                <ul className="space-y-1">
                  {algo.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-slate-600 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-green-500">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="mb-6">
                <h4 className="text-red-600 mb-2 text-sm">✗ Cons</h4>
                <ul className="space-y-1">
                  {algo.cons.map((con, index) => (
                    <li key={index} className="text-sm text-slate-600 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-red-500">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
                <h4 className={`${colors.text} mb-2 text-sm`}>Use Cases</h4>
                <ul className="space-y-1">
                  {algo.useCases.map((useCase, index) => (
                    <li key={index} className="text-sm text-slate-600 pl-4 relative before:content-['→'] before:absolute before:left-0">
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
