import { useState } from "react";
import Square from "./components/Square";

function App() {
    const ROWS = 10;
    const COLS = 25;

    const blackSquares = [
        2, 8, 14, 21, 25, 27, 32, 41, 46, 50, 61, 62, 63, 95, 98, 100, 103, 109,
        115, 118, 125, 126, 127, 131, 141, 143, 150, 153, 157, 158, 162, 166,
        177, 180, 189, 191, 199, 203, 217, 222, 225, 226, 238, 240, 243, 245,
    ];

    const maze = Array.from({ length: ROWS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) =>
            blackSquares.includes(row * COLS + col + 1) ? 1 : 0
        )
    );

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [path, setPath] = useState([]);
    const [status, setStatus] = useState("Shoot the starting point.");

    function heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    function aStar(start, end, grid) {
        const openSet = [start];
        const cameFrom = new Map();
        const gScore = Array.from({ length: ROWS }, () =>
            Array(COLS).fill(Infinity)
        );
        const fScore = Array.from({ length: ROWS }, () =>
            Array(COLS).fill(Infinity)
        );

        gScore[start.y][start.x] = 0;
        fScore[start.y][start.x] = heuristic(start, end);

        while (openSet.length > 0) {
            const current = openSet.reduce((acc, node) =>
                fScore[node.y][node.x] < fScore[acc.y][acc.x] ? node : acc
            );

            if (current.x === end.x && current.y === end.y) {
                const path = [];
                let temp = current;
                while (temp) {
                    path.push(temp);
                    temp = cameFrom.get(`${temp.x},${temp.y}`);
                }
                return path.reverse();
            }

            openSet.splice(openSet.indexOf(current), 1);

            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x, y: current.y - 1 },
            ];

            for (const neighbor of neighbors) {
                if (
                    neighbor.x < 0 ||
                    neighbor.y < 0 ||
                    neighbor.x >= COLS ||
                    neighbor.y >= ROWS ||
                    grid[neighbor.y][neighbor.x] === 1
                ) {
                    continue;
                }

                const tentativeGScore = gScore[current.y][current.x] + 1;
                if (tentativeGScore < gScore[neighbor.y][neighbor.x]) {
                    cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
                    gScore[neighbor.y][neighbor.x] = tentativeGScore;
                    fScore[neighbor.y][neighbor.x] =
                        gScore[neighbor.y][neighbor.x] +
                        heuristic(neighbor, end);

                    if (
                        !openSet.some(
                            (n) => n.x === neighbor.x && n.y === neighbor.y
                        )
                    ) {
                        openSet.push(neighbor);
                    }
                }
            }
        }

        return [];
    }

    function handleSquareClick(row, col) {
        if (maze[row][col] === 1) return;

        if (!start) {
            setStart({ x: col, y: row });
            setStatus("Shoot the final point.");
        } else if (!end) {
            setEnd({ x: col, y: row });
            const foundPath = aStar(start, { x: col, y: row }, maze);
            setPath(foundPath);
            setStatus("This is the final result.");
        }
    }

    function resetMaze() {
        setStart(null);
        setEnd(null);
        setPath([]);
        setStatus("Shoot the starting point.");
    }

    return (
        <div className="container">
            <div className="status">{status}</div>
            <div className="maze">
                {Array.from({ length: ROWS * COLS }, (_, index) => {
                    const row = Math.floor(index / COLS);
                    const col = index % COLS;
                    let color = "white";

                    if (start && start.x === col && start.y === row)
                        color = "green";
                    else if (end && end.x === col && end.y === row)
                        color = "red";
                    else if (blackSquares.includes(index + 1)) color = "black";
                    else if (
                        path.some((node) => node.x === col && node.y === row)
                    )
                        color = "#0d54fe";

                    return (
                        <Square
                            key={index}
                            color={color}
                            onClick={() => handleSquareClick(row, col)}
                        />
                    );
                })}
            </div>
            <button className="reset" onClick={resetMaze}>
                Reset the maze
            </button>
        </div>
    );
}

export default App;
