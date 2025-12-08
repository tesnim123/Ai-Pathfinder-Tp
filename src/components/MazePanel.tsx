import { useState, useEffect } from "react";
import { Play, RotateCcw, Grid3x3, Zap, Pause } from "lucide-react";

type CellType = 'empty' | 'wall' | 'start' | 'end' | 'explored' | 'path' | 'current';

interface Cell {
  row: number;
  col: number;
  type: CellType;
}

interface MazePanelProps {
  onResultsUpdate?: (results: any) => void;
}

export function MazePanel({ onResultsUpdate }: MazePanelProps) {
  const [gridSize, setGridSize] = useState(20);
  const [algorithm, setAlgorithm] = useState("BFS");
  const [speed, setSpeed] = useState(50);
  const [showExplored, setShowExplored] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ row: 1, col: 1 });
  const [endPos, setEndPos] = useState({ row: gridSize - 2, col: gridSize - 2 });
  const [stats, setStats] = useState({
    status: 'Ready',
    nodesVisited: 0,
    pathLength: 0,
    time: 0
  });

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, [gridSize]);

  const initializeGrid = () => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < gridSize; row++) {
      const gridRow: Cell[] = [];
      for (let col = 0; col < gridSize; col++) {
        let type: CellType = 'empty';
        if (row === startPos.row && col === startPos.col) type = 'start';
        else if (row === endPos.row && col === endPos.col) type = 'end';
        gridRow.push({ row, col, type });
      }
      newGrid.push(gridRow);
    }
    setGrid(newGrid);
    setStats({ status: 'Ready', nodesVisited: 0, pathLength: 0, time: 0 });
  };

  const handleCellClick = (row: number, col: number) => {
    if (isRunning) return;
    
    const newGrid = [...grid];
    const cell = newGrid[row][col];
    
    if (cell.type === 'start' || cell.type === 'end') return;
    
    cell.type = cell.type === 'wall' ? 'empty' : 'wall';
    setGrid(newGrid);
  };

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    handleCellClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDrawing || isRunning) return;
    handleCellClick(row, col);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const generateMaze = () => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < gridSize; row++) {
      const gridRow: Cell[] = [];
      for (let col = 0; col < gridSize; col++) {
        let type: CellType = 'empty';
        
        // Add random walls (30% chance)
        if (Math.random() < 0.3 && !(row === startPos.row && col === startPos.col) && !(row === endPos.row && col === endPos.col)) {
          type = 'wall';
        }
        
        if (row === startPos.row && col === startPos.col) type = 'start';
        else if (row === endPos.row && col === endPos.col) type = 'end';
        
        gridRow.push({ row, col, type });
      }
      newGrid.push(gridRow);
    }
    setGrid(newGrid);
  };

  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    initializeGrid();
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getNeighbors = (row: number, col: number): [number, number][] => {
    const neighbors: [number, number][] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        neighbors.push([newRow, newCol]);
      }
    }
    return neighbors;
  };

  const reconstructPath = (cameFrom: Map<string, string>, current: string): string[] => {
    const path: string[] = [current];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current)!;
      path.unshift(current);
    }
    return path;
  };

  const bfs = async () => {
    const startTime = Date.now();
    const queue: [number, number][] = [[startPos.row, startPos.col]];
    const visited = new Set<string>();
    const cameFrom = new Map<string, string>();
    visited.add(`${startPos.row},${startPos.col}`);
    
    let nodesVisited = 0;

    while (queue.length > 0 && !isPaused) {
      const [row, col] = queue.shift()!;
      nodesVisited++;

      if (row === endPos.row && col === endPos.col) {
        // Found the end!
        const pathKeys = reconstructPath(cameFrom, `${row},${col}`);
        await visualizePath(pathKeys);
        const time = Date.now() - startTime;
        setStats({ status: 'Complete', nodesVisited, pathLength: pathKeys.length, time });
        
        if (onResultsUpdate) {
          onResultsUpdate({
            algorithm: 'BFS',
            pathLength: pathKeys.length,
            time,
            visited: nodesVisited
          });
        }
        return;
      }

      const neighbors = getNeighbors(row, col);
      for (const [nRow, nCol] of neighbors) {
        const key = `${nRow},${nCol}`;
        if (!visited.has(key) && grid[nRow][nCol].type !== 'wall') {
          visited.add(key);
          queue.push([nRow, nCol]);
          cameFrom.set(key, `${row},${col}`);
          
          if (showExplored && !(nRow === endPos.row && nCol === endPos.col)) {
            const newGrid = [...grid];
            newGrid[nRow][nCol] = { ...newGrid[nRow][nCol], type: 'explored' };
            setGrid(newGrid);
            await sleep(speed);
          }
        }
      }

      setStats(prev => ({ ...prev, nodesVisited, status: 'Running...' }));
    }

    setStats(prev => ({ ...prev, status: 'No path found' }));
  };

  const dfs = async () => {
    const startTime = Date.now();
    const stack: [number, number][] = [[startPos.row, startPos.col]];
    const visited = new Set<string>();
    const cameFrom = new Map<string, string>();
    
    let nodesVisited = 0;

    while (stack.length > 0 && !isPaused) {
      const [row, col] = stack.pop()!;
      const key = `${row},${col}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      nodesVisited++;

      if (row === endPos.row && col === endPos.col) {
        const pathKeys = reconstructPath(cameFrom, `${row},${col}`);
        await visualizePath(pathKeys);
        const time = Date.now() - startTime;
        setStats({ status: 'Complete', nodesVisited, pathLength: pathKeys.length, time });
        
        if (onResultsUpdate) {
          onResultsUpdate({
            algorithm: 'DFS',
            pathLength: pathKeys.length,
            time,
            visited: nodesVisited
          });
        }
        return;
      }

      if (showExplored && !(row === endPos.row && col === endPos.col) && !(row === startPos.row && col === startPos.col)) {
        const newGrid = [...grid];
        newGrid[row][col] = { ...newGrid[row][col], type: 'explored' };
        setGrid(newGrid);
        await sleep(speed);
      }

      const neighbors = getNeighbors(row, col);
      for (const [nRow, nCol] of neighbors) {
        const nKey = `${nRow},${nCol}`;
        if (!visited.has(nKey) && grid[nRow][nCol].type !== 'wall') {
          cameFrom.set(nKey, key);
          stack.push([nRow, nCol]);
        }
      }

      setStats(prev => ({ ...prev, nodesVisited, status: 'Running...' }));
    }

    setStats(prev => ({ ...prev, status: 'No path found' }));
  };

  const heuristic = (row: number, col: number): number => {
    return Math.abs(row - endPos.row) + Math.abs(col - endPos.col);
  };

  const aStar = async () => {
  const startTime = Date.now();
  const startKey = `${startPos.row},${startPos.col}`;
  const endKey = `${endPos.row},${endPos.col}`;

  // FIX: copy of the grid to avoid stale state
  const walkable = grid.map(row => row.map(cell => cell.type !== "wall"));

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, string>();

  const openSet = new Set<string>([startKey]);
  const closedSet = new Set<string>();

  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(startPos.row, startPos.col));

  let nodesVisited = 0;

  while (openSet.size > 0 && !isPaused) {
    let current = "";
    let lowest = Infinity;

    for (const node of openSet) {
      const f = fScore.get(node) ?? Infinity;
      if (f < lowest) {
        lowest = f;
        current = node;
      }
    }

    const [row, col] = current.split(",").map(Number);
    nodesVisited++;

    if (current === endKey) {
      const path = reconstructPath(cameFrom, current);
      await visualizePath(path);
      const time = Date.now() - startTime;

      setStats({ status: "Complete", nodesVisited, pathLength: path.length, time });
      onResultsUpdate?.({ algorithm: "A*", pathLength: path.length, time, visited: nodesVisited });

      return;
    }

    openSet.delete(current);
    closedSet.add(current);

    if (showExplored && current !== startKey && current !== endKey) {
      const newGrid = [...grid];
      newGrid[row][col] = { ...newGrid[row][col], type: "explored" };
      setGrid(newGrid);
      await sleep(speed);
    }

    const neighbors = getNeighbors(row, col);
    const currentG = gScore.get(current) ?? Infinity;

    for (const [nr, nc] of neighbors) {
      const key = `${nr},${nc}`;

      if (!walkable[nr][nc] || closedSet.has(key)) continue;

      const tentativeG = currentG + 1;

      if (tentativeG < (gScore.get(key) ?? Infinity)) {
        cameFrom.set(key, current);
        gScore.set(key, tentativeG);
        fScore.set(key, tentativeG + heuristic(nr, nc));
        openSet.add(key);
      }
    }

    setStats(prev => ({ ...prev, nodesVisited, status: "Running..." }));
  }

  setStats(prev => ({ ...prev, status: "No path found" }));
};


  const visualizePath = async (pathKeys: string[]) => {
    for (const key of pathKeys) {
      const [row, col] = key.split(',').map(Number);
      if (!(row === startPos.row && col === startPos.col) && !(row === endPos.row && col === endPos.col)) {
        const newGrid = [...grid];
        newGrid[row][col] = { ...newGrid[row][col], type: 'path' };
        setGrid(newGrid);
        await sleep(speed / 2);
      }
    }
  };

  const startSearch = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setIsPaused(false);
    initializeGrid(); // Clear previous search
    await sleep(100);

    if (algorithm === 'BFS') {
      await bfs();
    } else if (algorithm === 'DFS') {
      await dfs();
    } else if (algorithm === 'A*') {
      await aStar();
    }

    setIsRunning(false);
  };

  const getCellColor = (cell: Cell) => {
    switch (cell.type) {
      case 'start':
        return 'bg-gradient-to-br from-green-400 to-green-500 shadow-lg';
      case 'end':
        return 'bg-gradient-to-br from-red-400 to-red-500 shadow-lg';
      case 'wall':
        return 'bg-slate-800';
      case 'explored':
        return 'bg-blue-300 animate-pulse';
      case 'path':
        return 'bg-yellow-400 shadow-md';
      case 'current':
        return 'bg-purple-500 animate-pulse';
      default:
        return 'bg-white border border-slate-200 hover:bg-slate-100';
    }
  };

  return (
    <div id="maze-visualizer" className="max-w-7xl mx-auto px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="gradient-text mb-4">Interactive Maze Visualizer</h2>
        <p className="text-lg text-slate-600">
          Generate a maze, select an algorithm, and watch it solve the puzzle in real-time
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
        <div className="grid grid-cols-[1fr_320px] gap-8">
          {/* Maze Grid */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border-2 border-slate-200">
              <div 
                className="grid gap-1 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  maxWidth: '600px'
                }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {grid.flat().map((cell) => {
                  const key = `${cell.row}-${cell.col}`;
                  return (
                    <div
                      key={key}
                      className={`aspect-square rounded-sm transition-all ${
                        !isRunning && cell.type !== 'start' && cell.type !== 'end' ? 'cursor-pointer' : ''
                      } ${getCellColor(cell)}`}
                      onMouseDown={() => handleMouseDown(cell.row, cell.col)}
                      onMouseEnter={() => handleMouseEnter(cell.row, cell.col)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-500 rounded"></div>
                  <span className="text-slate-600">Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-500 rounded"></div>
                  <span className="text-slate-600">End</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-800 rounded"></div>
                  <span className="text-slate-600">Wall</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-slate-600">Explored</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-slate-600">Path</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs">Click and drag to draw walls</p>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm text-slate-600">Grid Size</label>
              <select
                value={gridSize}
                onChange={(e) => {
                  setGridSize(Number(e.target.value));
                  setEndPos({ row: Number(e.target.value) - 2, col: Number(e.target.value) - 2 });
                }}
                disabled={isRunning}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
              >
                <option value={10}>10 x 10</option>
                <option value={15}>15 x 15</option>
                <option value={20}>20 x 20</option>
                <option value={25}>25 x 25</option>
                <option value={30}>30 x 30</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-slate-600">Algorithm</label>
              <div className="space-y-2">
                {["BFS", "DFS", "A*"].map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setAlgorithm(algo)}
                    disabled={isRunning}
                    className={`w-full px-4 py-3 rounded-xl transition-all ${
                      algorithm === algo
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-200"></div>

            <div className="space-y-3">
              <button 
                onClick={generateMaze}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <Grid3x3 className="w-5 h-5" />
                Generate Maze
              </button>
              <button 
                onClick={startSearch}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isRunning ? 'Running...' : 'Start Search'}
              </button>
              <button 
                onClick={reset}
                disabled={isRunning}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>

            <div className="h-px bg-slate-200"></div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Speed
                </label>
                <span className="text-sm text-slate-500">{speed}ms</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                disabled={isRunning}
                className="w-full accent-purple-500"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showExplored}
                onChange={(e) => setShowExplored(e.target.checked)}
                disabled={isRunning}
                className="w-5 h-5 accent-purple-500 rounded"
              />
              <span className="text-sm text-slate-700">Show explored nodes</span>
            </label>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-slate-800">{stats.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nodes visited:</span>
                  <span className="text-slate-800">{stats.nodesVisited}</span>
                </div>
                <div className="flex justify-between">
                  <span>Path length:</span>
                  <span className="text-slate-800">{stats.pathLength}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="text-slate-800">{stats.time}ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}