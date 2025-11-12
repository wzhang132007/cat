// Chemistry Simulation Logic
class ChemistrySimulation {
    constructor() {
        this.selectedBeakers = [];
        this.isAnimating = false;
        this.reactions = ['energy-burst', 'color-reaction', 'no-reaction'];

        this.init();
    }

    init() {
        this.beakerContainers = document.querySelectorAll('.beaker-container');
        this.mixBtn = document.getElementById('mix-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.resultMessage = document.getElementById('result-message');
        this.particleContainer = document.getElementById('particle-container');

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Beaker selection
        this.beakerContainers.forEach(container => {
            container.addEventListener('click', () => this.selectBeaker(container));
        });

        // Mix button
        this.mixBtn.addEventListener('click', () => this.mixBeakers());

        // Reset button
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    selectBeaker(container) {
        if (this.isAnimating) return;

        const beakerName = container.dataset.beaker;

        // Toggle selection
        if (this.selectedBeakers.includes(beakerName)) {
            // Deselect
            this.selectedBeakers = this.selectedBeakers.filter(b => b !== beakerName);
            container.classList.remove('selected');
        } else {
            // Select (max 2)
            if (this.selectedBeakers.length < 2) {
                this.selectedBeakers.push(beakerName);
                container.classList.add('selected');
            }
        }

        this.updateUI();
    }

    updateUI() {
        // Enable/disable mix button
        this.mixBtn.disabled = this.selectedBeakers.length !== 2;

        // Update beaker states
        this.beakerContainers.forEach(container => {
            const beakerName = container.dataset.beaker;

            if (this.selectedBeakers.length === 2 && !this.selectedBeakers.includes(beakerName)) {
                container.classList.add('disabled');
            } else {
                container.classList.remove('disabled');
            }
        });

        // Clear result message when selection changes
        if (this.selectedBeakers.length !== 2) {
            this.resultMessage.textContent = '';
        }
    }

    async mixBeakers() {
        if (this.selectedBeakers.length !== 2 || this.isAnimating) return;

        this.isAnimating = true;
        this.mixBtn.disabled = true;

        // Get selected beaker containers
        const selectedContainers = Array.from(this.beakerContainers).filter(
            container => this.selectedBeakers.includes(container.dataset.beaker)
        );

        // Show mixing animation
        selectedContainers.forEach(container => {
            container.classList.add('mixing');
        });

        await this.delay(400);

        // Remove mixing class
        selectedContainers.forEach(container => {
            container.classList.remove('mixing');
        });

        await this.delay(100);

        // Randomly select a reaction
        const reaction = this.getRandomReaction();

        // Trigger the reaction
        await this.triggerReaction(reaction, selectedContainers);

        this.isAnimating = false;
    }

    getRandomReaction() {
        const randomIndex = Math.floor(Math.random() * this.reactions.length);
        return this.reactions[randomIndex];
    }

    async triggerReaction(reaction, containers) {
        switch (reaction) {
            case 'energy-burst':
                await this.energyBurstReaction(containers);
                break;
            case 'color-reaction':
                await this.colorReaction(containers);
                break;
            case 'no-reaction':
                await this.noReaction(containers);
                break;
        }
    }

    async energyBurstReaction(containers) {
        // Add energy burst class
        containers.forEach(container => {
            container.classList.add('energy-burst');
        });

        // Create particle burst effect from the center of both beakers
        containers.forEach(container => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            this.createParticleBurst(centerX, centerY, 20);
        });

        this.resultMessage.textContent = '⚡ Energy Burst Detected!';
        this.resultMessage.style.color = '#f39c12';

        await this.delay(600);

        // Remove animation class
        containers.forEach(container => {
            container.classList.remove('energy-burst');
        });
    }

    async colorReaction(containers) {
        // Add color reaction class
        containers.forEach(container => {
            container.classList.add('color-reaction');
        });

        this.resultMessage.textContent = '🌈 Color Reaction Observed!';
        this.resultMessage.style.color = '#9b59b6';

        await this.delay(600);

        // Remove animation class
        containers.forEach(container => {
            container.classList.remove('color-reaction');
        });
    }

    async noReaction(containers) {
        // Add no reaction class
        containers.forEach(container => {
            container.classList.add('no-reaction');
        });

        this.resultMessage.textContent = '○ No Significant Reaction';
        this.resultMessage.style.color = '#95a5a6';

        await this.delay(500);

        // Remove animation class
        containers.forEach(container => {
            container.classList.remove('no-reaction');
        });
    }

    createParticleBurst(centerX, centerY, particleCount) {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random angle and distance
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 80 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            // Random colors for variety
            const colors = [
                'radial-gradient(circle, #ffd700 0%, #ff6b6b 100%)',
                'radial-gradient(circle, #ff6b6b 0%, #ff8c42 100%)',
                'radial-gradient(circle, #42ff8c 0%, #4287ff 100%)',
                'radial-gradient(circle, #ff42e8 0%, #ffd700 100%)'
            ];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            this.particleContainer.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    reset() {
        if (this.isAnimating) return;

        // Clear selections
        this.selectedBeakers = [];

        // Remove all classes from beakers
        this.beakerContainers.forEach(container => {
            container.classList.remove('selected', 'disabled', 'mixing', 'energy-burst', 'color-reaction', 'no-reaction');
        });

        // Clear result message
        this.resultMessage.textContent = '';

        // Clear particles
        this.particleContainer.innerHTML = '';

        // Update UI
        this.updateUI();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChemistrySimulation();
});
