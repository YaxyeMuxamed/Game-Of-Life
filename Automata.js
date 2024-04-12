class Automata {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.automata = this.initializeAutomata(this.width, this.height);
        this.tickCount = 0;
        this.ticks = 0;
        this.speed = 60; // Initial simulation speed from the UI.
        
        this.randomize(); // Randomly populate the automata.
    }

    initializeAutomata(width, height) {
        return Array.from({ length: width }, () =>
            Array.from({ length: height }, () => 0));
    }

    randomize() {
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                this.automata[col][row] = Math.floor(Math.random() * 2);
            }
        }
    }

    countNeighbors(col, row) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue; // Skip the cell itself.
                // Wrap around the edges.
                const x = (col + i + this.width) % this.width;
                const y = (row + j + this.height) % this.height;
                count += this.automata[x][y];
            }
        }
        return count;
    }

    update() {
        this.speed = parseInt(document.getElementById("speed").value);
        let speedAdjustment = 120 - this.speed;
        if (this.tickCount++ >= speedAdjustment) {
            this.tickCount = 0;
            this.ticks++;
            let next = this.initializeAutomata(this.width, this.height);
            for (let col = 0; col < this.width; col++) {
                for (let row = 0; row < this.height; row++) {
                    const liveNeighbors = this.countNeighbors(col, row);
                    const cell = this.automata[col][row];
                    if (cell === 1 && (liveNeighbors === 2 || liveNeighbors === 3)) {
                        next[col][row] = 1; // Cell lives.
                    } else if (cell === 0 && liveNeighbors === 3) {
                        next[col][row] = 1; // Cell becomes alive.
                    } // Otherwise, cell dies or remains dead.
                }
            }
            this.automata = next;
        }
        document.getElementById('ticks').innerHTML = "Ticks: " + this.ticks;
    }

    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas.
        for (let col = 0; col < this.width; col++) {
            for (let row = 0; row < this.height; row++) {
                ctx.fillStyle = this.automata[col][row] === 1 ? 'black' : 'white';
                ctx.fillRect(col * 10, row * 10, 9, 9); // Drawing each cell with a little gap.
            }
        }
    }

    // Predefined structures. Each adds a specific pattern to the automata.
    addBlock(col, row) {
        const pattern = [[1, 1], [1, 1]];
        this.placePattern(col, row, pattern);
    }

    addBlinker(col, row, vertical = false) {
        const pattern = vertical ? [[1], [1], [1]] : [[1, 1, 1]];
        this.placePattern(col, row, pattern);
    }

    // Generic method to place a pattern on the grid.
    placePattern(col, row, pattern) {
        for (let i = 0; i < pattern.length; i++) {
            for (let j = 0; j < pattern[i].length; j++) {
                if (col + j < this.width && row + i < this.height) {
                    this.automata[col + j][row + i] = pattern[i][j];
                }
            }
        }
    }

    // Load a specific set of structures to demonstrate complex behaviors.
    loadAutomata() {
        this.automata = this.initializeAutomata(this.width, this.height); // Reset the grid.
        // Add various structures to illustrate different dynamics.
        this.addBlock(1, 1);
        this.addBlinker(5, 5);
       
    }
}
