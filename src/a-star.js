const ROWS = 10; // Tinggi maze
const COLS = 25; // Lebar maze

// Representasi maze (0: jalan, 1: penghalang)
const maze = [
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
];

// Fungsi heuristik (menggunakan Manhattan Distance)
function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Fungsi untuk menemukan jalur menggunakan A*
function aStar(start, end, grid) {
    const openSet = [];
    const closedSet = [];
    const cameFrom = new Map();

    const gScore = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(Infinity)
    );
    const fScore = Array.from({ length: ROWS }, () =>
        Array(COLS).fill(Infinity)
    );

    openSet.push(start);
    gScore[start.y][start.x] = 0;
    fScore[start.y][start.x] = heuristic(start, end);

    while (openSet.length > 0) {
        // Ambil node dengan nilai fScore terendah
        const current = openSet.reduce((acc, node) =>
            fScore[node.y][node.x] < fScore[acc.y][acc.x] ? node : acc
        );

        // Jika kita sudah mencapai tujuan
        if (current.x === end.x && current.y === end.y) {
            const path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = cameFrom.get(`${temp.x},${temp.y}`);
            }
            return path.reverse(); // Mengembalikan jalur dari awal ke tujuan
        }

        // Pindahkan current dari openSet ke closedSet
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);

        // Periksa semua tetangga
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
                grid[neighbor.y][neighbor.x] === 1 ||
                closedSet.some((n) => n.x === neighbor.x && n.y === neighbor.y)
            ) {
                continue;
            }

            const tentativeGScore = gScore[current.y][current.x] + 1;
            if (tentativeGScore < gScore[neighbor.y][neighbor.x]) {
                cameFrom.set(`${neighbor.x},${neighbor.y}`, current);
                gScore[neighbor.y][neighbor.x] = tentativeGScore;
                fScore[neighbor.y][neighbor.x] =
                    gScore[neighbor.y][neighbor.x] + heuristic(neighbor, end);

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

    return []; // Jika tidak ada jalur ditemukan
}

// Posisi awal (hijau) dan akhir (merah)
const start = { x: 0, y: 0 }; // (sesuaikan dengan posisi kotak hijau)
const end = { x: 24, y: 9 }; // (sesuaikan dengan posisi kotak merah)

// Cari jalur
const path = aStar(start, end, maze);

// Tampilkan jalur di console
console.log("Jalur ditemukan:", path);
