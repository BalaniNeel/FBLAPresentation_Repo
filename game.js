class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.currentJob = null;
        this.player = null;
        this.gameObjects = [];
        this.tasks = [];
        
        this.stats = {
            money: 0,
            energy: 100,
            time: 9 * 60, // 9:00 AM in minutes
            hadCoffee: false
        };
        
        this.keys = {};
        this.mouse = { x: 0, y: 0, clicked: false };

        this.moveFrameCounter = 0;
        this.stillFrameCounter = 0;

        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showJobSelector();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            // E key triggers interaction like left click
            if (e.key.toLowerCase() === 'e' && !this.mouse.clicked) {
                this.mouse.clicked = true;
                setTimeout(() => {
                    this.mouse.clicked = false;
                }, 100);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse controls
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', (e) => {
            this.mouse.clicked = true;
            setTimeout(() => {
                this.mouse.clicked = false;
            }, 100);
        });
        
        // Job selection
        document.querySelectorAll('.job-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.startJob(btn.dataset.job);
            });
        });
        
        // Back button
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showJobSelector();
        });
    }
    
    showJobSelector() {
        document.getElementById('jobSelector').style.display = 'block';
        document.getElementById('gameUI').style.display = 'none';
        this.currentJob = null;
        this.gameObjects = [];
        this.tasks = [];
        this.resetStats();
    }
    
    startJob(jobType) {
        document.getElementById('jobSelector').style.display = 'none';
        document.getElementById('gameUI').style.display = 'block';
        
        this.currentJob = jobType;
        this.resetStats();
        this.setupJob(jobType);
        this.updateUI();
    }
    
    resetStats() {
        this.stats = {
            money: 0,
            energy: 100,
            time: 9 * 60, // 9:00 AM
            hadCoffee: false
        };
    }
    
    setupJob(jobType) {
        this.gameObjects = [];
        this.tasks = [];
        
        // Create player
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            size: 20,
            speed: 3,
            color: '#4caf50',
            carrying: null
        };
        
        switch(jobType) {
            case 'chef':
                this.setupChefJob();
                break;
            case 'office':
                this.setupOfficeJob();
                break;
            case 'farmer':
                this.setupFarmerJob();
                break;
        }
    }
    
    setupChefJob() {
        document.getElementById('jobTitle').textContent = '👨‍🍳 Chef';
        
        // Create kitchen layout
        this.gameObjects.push(
            // Stove
            { x: 100, y: 100, width: 80, height: 60, type: 'stove', color: '#ff6b6b' },
            { x: 200, y: 100, width: 80, height: 60, type: 'stove', color: '#ff6b6b' },
            
            // Counter
            { x: 300, y: 100, width: 100, height: 60, type: 'counter', color: '#8b4513' },
            { x: 400, y: 100, width: 100, height: 60, type: 'counter', color: '#8b4513' },
            
            // Sink
            { x: 500, y: 100, width: 80, height: 60, type: 'sink', color: '#4fc3f7' },
            
            // Serving area
            { x: 650, y: 100, width: 100, height: 60, type: 'serving', color: '#ffd54f' },
            
            // Fridge
            { x: 100, y: 300, width: 80, height: 100, type: 'fridge', color: '#e0e0e0' },
            
            // Tables
            { x: 200, y: 400, width: 80, height: 80, type: 'table', color: '#8d6e63' },
            { x: 350, y: 400, width: 80, height: 80, type: 'table', color: '#8d6e63' },
            { x: 500, y: 400, width: 80, height: 80, type: 'table', color: '#8d6e63' }
        );
        
        // Add initial ingredients
        this.addIngredient('tomato', 150, 350);
        this.addIngredient('lettuce', 250, 350);
        this.addIngredient('meat', 350, 350);
        
        // Add tasks
        this.tasks.push(
            { id: 1, description: 'Cook 3 meals', completed: false, progress: 0, target: 3 },
            { id: 2, description: 'Serve customers', completed: false, progress: 0, target: 5 },
            { id: 3, description: 'Clean dishes', completed: false, progress: 0, target: 2 }
        );
    }
    
    setupOfficeJob() {
        document.getElementById('jobTitle').textContent = '👨‍💼 Office Worker';
        
        // Create office layout
        this.gameObjects.push(
            // Desks
            { x: 100, y: 100, width: 120, height: 80, type: 'desk', color: '#795548' },
            { x: 300, y: 100, width: 120, height: 80, type: 'desk', color: '#795548' },
            { x: 500, y: 100, width: 120, height: 80, type: 'desk', color: '#795548' },
            
            // Computer terminals
            { x: 140, y: 110, width: 40, height: 30, type: 'computer', color: '#2196f3' },
            { x: 340, y: 110, width: 40, height: 30, type: 'computer', color: '#2196f3' },
            { x: 540, y: 110, width: 40, height: 30, type: 'computer', color: '#2196f3' },
            
            // Printer
            { x: 650, y: 200, width: 60, height: 60, type: 'printer', color: '#9e9e9e' },
            
            // Coffee machine
            { x: 100, y: 300, width: 60, height: 80, type: 'coffee', color: '#6d4c41' },
            
            // Meeting table
            { x: 300, y: 350, width: 200, height: 120, type: 'meeting', color: '#98FF98' },
            
            // Filing cabinet
            { x: 600, y: 400, width: 80, height: 100, type: 'filing', color: '#757575' },

            // Breakroom
            { x: 20, y: 450, width: 100, height: 80, type: 'breakroom', subtype: 'break room', color: '#FFD699' }
        );

        // Breakroom tracking
        this.breakroomTime = 0;
        this.breakroomUsed = false;
        
        // Add documents
        this.addDocument('report', 200, 200);
        this.addDocument('email', 400, 200);
        this.addDocument('spreadsheet', 300, 250);
        
        // Add tasks
        this.tasks.push(
            { id: 1, description: 'Answer 5 emails', completed: false, progress: 0, target: 5 },
            { id: 2, description: 'Complete reports', completed: false, progress: 0, target: 3 },
            { id: 3, description: 'Attend meeting', completed: false, progress: 0, target: 1 }
        );
    }
    
    setupFarmerJob() {
        document.getElementById('jobTitle').textContent = '👨‍🌾 Farmer';
        
        // Create farm layout
        this.gameObjects.push(
            // Fields
            { x: 50, y: 100, width: 150, height: 150, type: 'field', color: '#8bc34a' },
            { x: 250, y: 100, width: 150, height: 150, type: 'field', color: '#8bc34a' },
            { x: 450, y: 100, width: 150, height: 150, type: 'field', color: '#8bc34a' },
            
            // Barn
            { x: 650, y: 50, width: 120, height: 150, type: 'barn', color: '#d84315' },
            
            // Well
            { x: 100, y: 350, width: 60, height: 60, type: 'well', color: '#0277bd' },
            
            // Tool shed
            { x: 250, y: 350, width: 80, height: 80, type: 'tools', color: '#ff9800' },
            
            // Market stall
            { x: 450, y: 350, width: 100, height: 80, type: 'market', color: '#fdd835' },
            
            // Animal pen
            { x: 600, y: 300, width: 150, height: 150, type: 'pen', color: '#795548' }
        );
        
        // Add crops
        this.addCrop('wheat', 100, 150);
        this.addCrop('corn', 300, 150);
        this.addCrop('carrot', 500, 150);
        
        // Add animals
        this.addAnimal('chicken', 650, 350);
        this.addAnimal('cow', 700, 380);
        
        // Add tasks
        this.tasks.push(
            { id: 1, description: 'Harvest crops', completed: false, progress: 0, target: 5 },
            { id: 2, description: 'Feed animals', completed: false, progress: 0, target: 3 },
            { id: 3, description: 'Sell produce', completed: false, progress: 0, target: 4 }
        );
    }
    
    addIngredient(type, x, y) {
        this.gameObjects.push({
            x, y,
            width: 20,
            height: 20,
            type: 'ingredient',
            subtype: type,
            color: this.getIngredientColor(type)
        });
    }
    
    addDocument(type, x, y) {
        this.gameObjects.push({
            x, y,
            width: 50,
            height: 60,
            type: 'document',
            subtype: type,
            color: '#f5f5f5'
        });
    }
    
    addCrop(type, x, y) {
        this.gameObjects.push({
            x, y,
            width: 30,
            height: 30,
            type: 'crop',
            subtype: type,
            growth: 0,
            maxGrowth: 100,
            color: this.getCropColor(type)
        });
    }
    
    addAnimal(type, x, y) {
        this.gameObjects.push({
            x, y,
            width: 25,
            height: 25,
            type: 'animal',
            subtype: type,
            fed: false,
            color: this.getAnimalColor(type)
        });
    }
    
    getIngredientColor(type) {
        const colors = {
            tomato: '#ff6347',
            lettuce: '#90ee90',
            meat: '#8b4513'
        };
        return colors[type] || '#ffffff';
    }
    
    getCropColor(type) {
        const colors = {
            wheat: '#ffd700',
            corn: '#ffff00',
            carrot: '#ff8c00'
        };
        return colors[type] || '#ffffff';
    }
    
    getAnimalColor(type) {
        const colors = {
            chicken: '#ffffff',
            cow: '#8b4513'
        };
        return colors[type] || '#ffffff';
    }
    
    update() {
        if (!this.currentJob) return;
        
        // Update player movement
        this.updatePlayer();
        
        // Update time
        this.stats.time += 0.02; // Slow time progression
        if (this.stats.time >= 17 * 60) { // 5:00 PM
            this.endDay();
        }
        
        // Job-specific updates
        switch(this.currentJob) {
            case 'chef':
                this.updateChefJob();
                break;
            case 'office':
                this.updateOfficeJob();
                break;
            case 'farmer':
                this.updateFarmerJob();
                break;
        }
        
        this.updateUI();
    }
    
    updatePlayer() {
        let dx = 0, dy = 0;

        // Only allow movement if energy > 0
        if (this.stats.energy > 0) {
            if (this.keys['w'] || this.keys['arrowup']) dy = -this.player.speed;
            if (this.keys['s'] || this.keys['arrowdown']) dy = this.player.speed;
            if (this.keys['a'] || this.keys['arrowleft']) dx = -this.player.speed;
            if (this.keys['d'] || this.keys['arrowright']) dx = this.player.speed;

            // Check boundaries
            this.player.x = Math.max(this.player.size/2, Math.min(this.width - this.player.size/2, this.player.x + dx));
            this.player.y = Math.max(this.player.size/2, Math.min(this.height - this.player.size/2, this.player.y + dy));
        }

        // Energy drain/recovery based on movement
        if (dx !== 0 || dy !== 0) {
            // Moving - drain energy
            this.stillFrameCounter = 0;
            this.moveFrameCounter++;
            if (this.moveFrameCounter >= 30) { // ~0.5 second at 60fps
                this.stats.energy = Math.max(0, this.stats.energy - 1);
                this.moveFrameCounter = 0;
            }
        } else {
            // Standing still - recover energy
            this.moveFrameCounter = 0;
            this.stillFrameCounter++;
            if (this.stillFrameCounter >= 300) { // ~5 seconds at 60fps
                this.stats.energy = Math.min(100, this.stats.energy + 1);
                this.stillFrameCounter = 0;
            }
        }

        // Ensure energy never goes below 0
        if (this.stats.energy < 0) {
            this.stats.energy = 0;
        }

        // Check interactions
        if (this.mouse.clicked) {
            this.checkInteractions();
        }
    }
    
    checkInteractions() {
        for (let obj of this.gameObjects) {
            if (this.isColliding(this.player, obj)) {
                this.handleInteraction(obj);
            }
        }
    }
    
    isColliding(player, obj) {
        return player.x < obj.x + obj.width &&
               player.x + player.size > obj.x &&
               player.y < obj.y + obj.height &&
               player.y + player.size > obj.y;
    }
    
    handleInteraction(obj) {
        switch(this.currentJob) {
            case 'chef':
                this.handleChefInteraction(obj);
                break;
            case 'office':
                this.handleOfficeInteraction(obj);
                break;
            case 'farmer':
                this.handleFarmerInteraction(obj);
                break;
        }
    }
    
    handleChefInteraction(obj) {
        switch(obj.type) {
            case 'ingredient':
                if (!this.player.carrying) {
                    this.player.carrying = obj.subtype;
                    this.removeObject(obj);
                }
                break;
            case 'stove':
                if (this.player.carrying) {
                    this.stats.energy -= 5;
                    this.player.carrying = 'cooked_' + this.player.carrying;
                }
                break;
            case 'serving':
                if (this.player.carrying && this.player.carrying.startsWith('cooked_')) {
                    this.stats.money += 10;
                    this.updateTaskProgress(1, 1);
                    this.updateTaskProgress(2, 1);
                    this.player.carrying = null;
                }
                break;
            case 'sink':
                this.updateTaskProgress(3, 1);
                this.stats.energy -= 2;
                break;
        }
    }
    
    handleOfficeInteraction(obj) {
        switch(obj.type) {
            case 'document':
                if (!this.player.carrying) {
                    this.player.carrying = obj.subtype;
                    this.removeObject(obj);
                }
                break;
            case 'computer':
                if (this.player.carrying === 'email') {
                    this.updateTaskProgress(1, 1);
                    this.stats.money += 5;
                    this.player.carrying = null;
                } else if (this.player.carrying === 'report' || this.player.carrying === 'spreadsheet') {
                    this.updateTaskProgress(2, 1);
                    this.stats.money += 8;
                    this.player.carrying = null;
                }
                break;
            case 'meeting':
                const meetingTask = this.tasks.find(t => t.id === 3);
                if (!meetingTask || !meetingTask.completed) {
                    this.updateTaskProgress(3, 1);
                    this.stats.money += 15;
                    this.stats.energy -= 60;
                }
                break;
            case 'coffee':
                if (!this.stats.hadCoffee) {
                    this.stats.energy = Math.min(100, this.stats.energy + 20);
                    this.stats.hadCoffee = true;
                }
                break;
        }
    }
    
    handleFarmerInteraction(obj) {
        switch(obj.type) {
            case 'crop':
                if (obj.growth >= obj.maxGrowth) {
                    this.stats.money += 5;
                    this.updateTaskProgress(1, 1);
                    obj.growth = 0;
                }
                break;
            case 'animal':
                if (!obj.fed) {
                    obj.fed = true;
                    this.updateTaskProgress(2, 1);
                    this.stats.energy -= 5;
                }
                break;
            case 'market':
                this.updateTaskProgress(3, 1);
                this.stats.money += 12;
                break;
            case 'well':
                // Water crops
                for (let crop of this.gameObjects.filter(o => o.type === 'crop')) {
                    crop.growth = Math.min(crop.maxGrowth, crop.growth + 20);
                }
                break;
        }
    }
    
    updateChefJob() {
        // Randomly spawn new ingredients
        if (Math.random() < 0.005) {
            const types = ['tomato', 'lettuce', 'meat'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.addIngredient(type, 100 + Math.random() * 200, 320 + Math.random() * 60);
        }
    }
    
    updateOfficeJob() {
        // Randomly spawn new documents (max 5)
        const documentCount = this.gameObjects.filter(o => o.type === 'document').length;
        if (documentCount < 5 && Math.random() < 0.001) {
            const types = ['report', 'email', 'spreadsheet'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.addDocument(type, 150 + Math.random() * 400, 180 + Math.random() * 100);
        }

        // Update meeting table color based on task completion
        const meetingTask = this.tasks.find(t => t.id === 3);
        const meetingTable = this.gameObjects.find(o => o.type === 'meeting');
        if (meetingTable) {
            meetingTable.color = meetingTask && meetingTask.completed ? '#5d4037' : '#98FF98';
        }

        // Breakroom logic
        const breakroom = this.gameObjects.find(o => o.type === 'breakroom');
        if (breakroom && !this.breakroomUsed) {
            // Check if player is inside breakroom
            const inBreakroom = this.player.x >= breakroom.x &&
                               this.player.x <= breakroom.x + breakroom.width &&
                               this.player.y >= breakroom.y &&
                               this.player.y <= breakroom.y + breakroom.height;

            // Check if player is standing still
            const isMoving = this.keys['w'] || this.keys['arrowup'] ||
                            this.keys['s'] || this.keys['arrowdown'] ||
                            this.keys['a'] || this.keys['arrowleft'] ||
                            this.keys['d'] || this.keys['arrowright'];

            if (inBreakroom && !isMoving) {
                this.breakroomTime++;
                // Every 60 frames (~1 second), gain 1 energy
                if (this.breakroomTime % 60 === 0) {
                    this.stats.energy = Math.min(100, this.stats.energy + 1);
                }
                // After 1200 frames (~20 seconds), kick player out
                if (this.breakroomTime >= 1200) {
                    this.breakroomUsed = true;
                    breakroom.color = '#FF6666'; // Red
                    // Teleport player outside breakroom
                    this.player.x = breakroom.x + breakroom.width + this.player.size;
                    this.player.y = breakroom.y + breakroom.height / 2;
                }
            }
            // Timer persists - don't reset when leaving
        }

        // Block entry if breakroom is used
        if (breakroom && this.breakroomUsed) {
            const wouldEnter = this.player.x >= breakroom.x - this.player.size/2 &&
                              this.player.x <= breakroom.x + breakroom.width + this.player.size/2 &&
                              this.player.y >= breakroom.y - this.player.size/2 &&
                              this.player.y <= breakroom.y + breakroom.height + this.player.size/2;
            if (wouldEnter) {
                // Push player out
                this.player.x = Math.max(this.player.x, breakroom.x + breakroom.width + this.player.size/2);
            }
        }
    }
    
    updateFarmerJob() {
        // Grow crops
        for (let crop of this.gameObjects.filter(o => o.type === 'crop')) {
            crop.growth = Math.min(crop.maxGrowth, crop.growth + 0.1);
        }
        
        // Animals get hungry again
        if (Math.random() < 0.002) {
            for (let animal of this.gameObjects.filter(o => o.type === 'animal')) {
                animal.fed = false;
            }
        }
    }
    
    updateTaskProgress(taskId, amount) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            task.progress += amount;
            if (task.progress >= task.target) {
                task.completed = true;
                this.stats.money += 20; // Bonus for completing task
            }
        }
    }
    
    removeObject(obj) {
        const index = this.gameObjects.indexOf(obj);
        if (index > -1) {
            this.gameObjects.splice(index, 1);
        }
    }
    
    endDay() {
        alert(`Day ended! Money earned: $${this.stats.money}`);
        this.showJobSelector();
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (!this.currentJob) return;
        
        // Draw game objects
        for (let obj of this.gameObjects) {
            this.ctx.fillStyle = obj.color;
            this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
            
            // Draw object type labels
            this.ctx.fillStyle = '#000000';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(obj.subtype || obj.type, obj.x + obj.width/2, obj.y + obj.height/2);
        }
        
        // Draw player
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(
            this.player.x - this.player.size/2,
            this.player.y - this.player.size/2,
            this.player.size,
            this.player.size
        );
        
        // Draw what player is carrying
        if (this.player.carrying) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                this.player.carrying,
                this.player.x,
                this.player.y - this.player.size/2 - 5
            );
        }
    }
    
    updateUI() {
        // Update stats
        document.getElementById('money').textContent = `$${this.stats.money}`;
        document.getElementById('energy').textContent = `${Math.round(this.stats.energy)}%`;
        
        // Update time
        const hours = Math.floor(this.stats.time / 60);
        const minutes = Math.floor(this.stats.time % 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : hours;
        document.getElementById('time').textContent = 
            `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
        // Update tasks
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        for (let task of this.tasks) {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task ${task.completed ? 'completed' : ''}`;
            taskDiv.textContent = `${task.description} (${task.progress}/${task.target})`;
            taskList.appendChild(taskDiv);
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new Game();
});
