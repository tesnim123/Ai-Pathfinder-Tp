import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Clock, Route, Eye, Database } from "lucide-react";

interface AlgorithmResult {
  algorithm: string;
  pathLength: number;
  time: number;
  visited: number;
}

interface ResultsDashboardProps {
  results: AlgorithmResult[];
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  // Use real results if available, otherwise use demo data
  const performanceData = results.length > 0 ? results.map(r => ({
    algorithm: r.algorithm,
    pathLength: r.pathLength,
    time: r.time,
    visited: r.visited,
    memory: Math.round(r.visited * 2.5) // Estimate memory based on visited nodes
  })) : [
    { algorithm: 'BFS', pathLength: 24, time: 156, visited: 342, memory: 1024 },
    { algorithm: 'DFS', pathLength: 38, time: 89, visited: 156, memory: 512 },
    { algorithm: 'A*', pathLength: 24, time: 67, visited: 98, memory: 768 }
  ];

  // Generate time series data based on results
  const generateTimeSeriesData = () => {
    if (results.length === 0) {
      return [
        { step: 0, BFS: 0, DFS: 0, 'A*': 0 },
        { step: 10, BFS: 45, DFS: 78, 'A*': 32 },
        { step: 20, BFS: 128, DFS: 134, 'A*': 67 },
        { step: 30, BFS: 234, DFS: 156, 'A*': 89 },
        { step: 40, BFS: 312, DFS: 156, 'A*': 98 },
        { step: 50, BFS: 342, DFS: 156, 'A*': 98 }
      ];
    }

    // Create time series from actual results
    const maxVisited = Math.max(...results.map(r => r.visited));
    const steps = 5;
    const data = [];
    
    for (let i = 0; i <= steps; i++) {
      const step = i * 10;
      const point: any = { step };
      
      results.forEach(result => {
        const progress = (i / steps) * result.visited;
        point[result.algorithm] = Math.round(progress);
      });
      
      data.push(point);
    }
    
    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  const metrics = [
    { 
      icon: Route, 
      label: "Path Length", 
      color: "blue",
      data: performanceData.map(d => ({ name: d.algorithm, value: d.pathLength }))
    },
    { 
      icon: Clock, 
      label: "Execution Time (ms)", 
      color: "purple",
      data: performanceData.map(d => ({ name: d.algorithm, value: d.time }))
    },
    { 
      icon: Eye, 
      label: "Nodes Visited", 
      color: "teal",
      data: performanceData.map(d => ({ name: d.algorithm, value: d.visited }))
    },
    { 
      icon: Database, 
      label: "Memory (KB)", 
      color: "pink",
      data: performanceData.map(d => ({ name: d.algorithm, value: d.memory }))
    }
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", gradient: "from-blue-500 to-blue-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", gradient: "from-purple-500 to-purple-600" },
    teal: { bg: "bg-teal-50", text: "text-teal-600", gradient: "from-teal-500 to-teal-600" },
    pink: { bg: "bg-pink-50", text: "text-pink-600", gradient: "from-pink-500 to-pink-600" }
  };

  const findBest = (metric: 'pathLength' | 'time' | 'visited' | 'memory') => {
    if (performanceData.length === 0) return '';
    return performanceData.reduce((min, d) => d[metric] < min[metric] ? d : min).algorithm;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="gradient-text mb-4">Performance Comparison</h2>
          <p className="text-lg text-slate-600">
            {results.length > 0 ? 'Real-time metrics from your maze solving sessions' : 'Run the algorithms to see performance comparisons'}
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            const colors = colorMap[metric.color as keyof typeof colorMap];
            const bestAlgo = findBest(
              metric.label.includes("Path") ? "pathLength" : 
              metric.label.includes("Time") ? "time" :
              metric.label.includes("Nodes") ? "visited" : "memory"
            );

            return (
              <div key={metric.label} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="text-sm text-slate-600 mb-1">{metric.label}</div>
                <div className="space-y-2">
                  {metric.data.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{item.name}</span>
                      <span className={`text-sm ${item.name === bestAlgo ? colors.text + ' font-semibold' : 'text-slate-700'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h3 className="text-slate-800 mb-6">Algorithm Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="algorithm" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="visited" fill="#6B9FED" name="Nodes Visited" radius={[8, 8, 0, 0]} />
                <Bar dataKey="pathLength" fill="#B8A4F5" name="Path Length" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <h3 className="text-slate-800 mb-6">Nodes Explored Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="step" stroke="#64748B" label={{ value: 'Time Steps', position: 'insideBottom', offset: -5 }} />
                <YAxis stroke="#64748B" label={{ value: 'Nodes', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFF', 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Line type="monotone" dataKey="BFS" stroke="#6B9FED" strokeWidth={3} dot={{ fill: '#6B9FED', r: 4 }} />
                <Line type="monotone" dataKey="DFS" stroke="#B8A4F5" strokeWidth={3} dot={{ fill: '#B8A4F5', r: 4 }} />
                <Line type="monotone" dataKey="A*" stroke="#6ED5D5" strokeWidth={3} dot={{ fill: '#6ED5D5', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 mt-8">
          <h3 className="text-slate-800 mb-6">Detailed Comparison Table</h3>
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-4 px-4 text-sm text-slate-600">Algorithm</th>
                  <th className="text-right py-4 px-4 text-sm text-slate-600">Path Length</th>
                  <th className="text-right py-4 px-4 text-sm text-slate-600">Execution Time</th>
                  <th className="text-right py-4 px-4 text-sm text-slate-600">Nodes Visited</th>
                  <th className="text-right py-4 px-4 text-sm text-slate-600">Memory Usage</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((algo, index) => (
                  <tr key={algo.algorithm} className={index !== performanceData.length - 1 ? 'border-b border-slate-100' : ''}>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          algo.algorithm === 'BFS' ? 'bg-blue-500' :
                          algo.algorithm === 'DFS' ? 'bg-purple-500' : 'bg-teal-500'
                        }`}></div>
                        <span>{algo.algorithm}</span>
                      </span>
                    </td>
                    <td className="text-right py-4 px-4 text-slate-700">{algo.pathLength}</td>
                    <td className="text-right py-4 px-4 text-slate-700">{algo.time}ms</td>
                    <td className="text-right py-4 px-4 text-slate-700">{algo.visited}</td>
                    <td className="text-right py-4 px-4 text-slate-700">{algo.memory}KB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {results.length === 0 && (
          <div className="text-center mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <p className="text-slate-600">
              💡 <span className="font-semibold">Tip:</span> Run different algorithms on the same maze to compare their performance here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
