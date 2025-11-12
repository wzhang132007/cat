// Enhanced Chemistry Simulation with Solution Selection and Result Beakers
class ChemistrySimulation {
    constructor() {
        this.selectedSolution = null;
        this.selectedBeakers = [];
        this.beakerContents = {}; // Track what solution is in each beaker
        this.isAnimating = false;
        this.resultBeakerCounter = 0; // Counter for result beakers
        this.resultBeakers = {}; // Track result beaker contents

        // Define reaction outcomes based on solution combinations
        this.reactionMatrix = {
            'acid-base': ['neutralization', 'heat-release', 'color-change'],
            'acid-salt': ['gas-release', 'color-change', 'no-reaction'],
            'acid-water': ['dilution', 'heat-release', 'no-reaction'],
            'acid-oxygen': ['oxidation', 'color-change', 'no-reaction'],
            'acid-hydrogen': ['reduction', 'gas-release', 'no-reaction'],
            'base-salt': ['precipitation', 'color-change', 'no-reaction'],
            'base-water': ['dilution', 'heat-release', 'no-reaction'],
            'base-oxygen': ['oxidation', 'color-change', 'no-reaction'],
            'base-hydrogen': ['reduction', 'no-reaction', 'gas-release'],
            'salt-water': ['dissolution', 'no-reaction', 'no-reaction'],
            'salt-oxygen': ['no-reaction', 'oxidation', 'no-reaction'],
            'salt-hydrogen': ['no-reaction', 'reduction', 'no-reaction'],
            'water-oxygen': ['dissolution', 'no-reaction', 'no-reaction'],
            'water-hydrogen': ['dissolution', 'no-reaction', 'no-reaction'],
            'hydrogen-oxygen': ['explosive-combustion', 'explosive-combustion', 'explosive-combustion'],
            // Keep old names as aliases
            'acid-organic': ['oxidation', 'color-change', 'no-reaction'],
            'acid-indicator': ['reduction', 'gas-release', 'no-reaction'],
            'base-organic': ['oxidation', 'color-change', 'no-reaction'],
            'base-indicator': ['reduction', 'no-reaction', 'gas-release'],
            'salt-organic': ['no-reaction', 'oxidation', 'no-reaction'],
            'salt-indicator': ['no-reaction', 'reduction', 'no-reaction'],
            'water-organic': ['dissolution', 'no-reaction', 'no-reaction'],
            'water-indicator': ['dissolution', 'no-reaction', 'no-reaction'],
            'organic-indicator': ['explosive-combustion', 'explosive-combustion', 'explosive-combustion'],
        };

        this.init();
    }

    init() {
        this.beakerContainers = document.querySelectorAll('.beaker-container');
        this.solutionOptions = document.querySelectorAll('.solution-option');
        this.mixBtn = document.getElementById('mix-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.resultMessage = document.getElementById('result-message');
        this.particleContainer = document.getElementById('particle-container');
        this.resultBeakersContainer = document.getElementById('result-beakers');

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Solution selection
        this.solutionOptions.forEach(option => {
            option.addEventListener('click', () => this.selectSolution(option));
        });

        // Beaker clicking (for filling and selecting)
        this.beakerContainers.forEach(container => {
            container.addEventListener('click', () => this.handleBeakerClick(container));
        });

        // Mix button
        this.mixBtn.addEventListener('click', () => this.mixBeakers());

        // Reset button
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    selectSolution(option) {
        if (this.isAnimating) return;

        const solutionType = option.dataset.solution;

        // Toggle selection
        if (this.selectedSolution === solutionType) {
            this.selectedSolution = null;
            option.classList.remove('selected');
        } else {
            // Deselect all
            this.solutionOptions.forEach(opt => opt.classList.remove('selected'));
            // Select this one
            this.selectedSolution = solutionType;
            option.classList.add('selected');
        }

        this.updateInstructions();
    }

    handleBeakerClick(container) {
        if (this.isAnimating) return;

        const beakerName = container.dataset.beaker;

        // If a solution is selected and beaker is empty, fill it
        if (this.selectedSolution && !this.beakerContents[beakerName]) {
            this.fillBeaker(container, beakerName);
        }
        // If beaker is filled, toggle selection for mixing
        else if (this.beakerContents[beakerName]) {
            this.toggleBeakerSelection(container, beakerName);
        }
    }

    async fillBeaker(container, beakerName) {
        // Fill the beaker with selected solution
        this.beakerContents[beakerName] = this.selectedSolution;

        const liquid = container.querySelector('.liquid');
        const fillIndicator = container.querySelector('.fill-indicator');

        // Add solution class to liquid
        liquid.className = `liquid ${this.selectedSolution}`;

        // Animate pour
        container.classList.add('pouring');
        container.classList.add('filled');

        // Update fill indicator
        fillIndicator.textContent = this.capitalize(this.selectedSolution);

        await this.delay(500);

        container.classList.remove('pouring');

        // Deselect the solution after filling
        this.solutionOptions.forEach(opt => opt.classList.remove('selected'));
        this.selectedSolution = null;

        this.updateInstructions();
    }

    toggleBeakerSelection(container, beakerName) {
        // Toggle selection for mixing
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
        const canMix = this.selectedBeakers.length === 2 &&
                       this.selectedBeakers.every(b => this.beakerContents[b] || this.resultBeakers[b]);
        this.mixBtn.disabled = !canMix;

        // Update main beaker states
        this.beakerContainers.forEach(container => {
            const beakerName = container.dataset.beaker;

            // Disable beakers that can't be selected
            if (this.selectedBeakers.length === 2 &&
                !this.selectedBeakers.includes(beakerName)) {
                container.classList.add('disabled');
            } else if (this.beakerContents[beakerName]) {
                container.classList.remove('disabled');
            }
        });

        // Update result beaker states
        const resultBeakerContainers = document.querySelectorAll('.result-beaker-container');
        resultBeakerContainers.forEach(container => {
            const beakerName = container.dataset.beaker;

            // Disable beakers that can't be selected
            if (this.selectedBeakers.length === 2 &&
                !this.selectedBeakers.includes(beakerName)) {
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

    updateInstructions() {
        const instruction = document.querySelector('.instruction');
        if (this.selectedSolution) {
            instruction.textContent = 'Click an empty beaker to fill it with ' + this.capitalize(this.selectedSolution);
        } else {
            instruction.textContent = 'Step 1: Select a solution and click a beaker to fill it | Step 2: Select two filled beakers to mix';
        }
    }

    async mixBeakers() {
        if (this.selectedBeakers.length !== 2 || this.isAnimating) return;

        this.isAnimating = true;
        this.mixBtn.disabled = true;

        // Get selected beaker containers
        const selectedContainers = Array.from(this.beakerContainers).filter(
            container => this.selectedBeakers.includes(container.dataset.beaker)
        ).concat(
            Array.from(document.querySelectorAll('.result-beaker-container')).filter(
                container => this.selectedBeakers.includes(container.dataset.beaker)
            )
        );

        // Get solution types
        const solution1 = this.beakerContents[this.selectedBeakers[0]] || this.resultBeakers[this.selectedBeakers[0]];
        const solution2 = this.beakerContents[this.selectedBeakers[1]] || this.resultBeakers[this.selectedBeakers[1]];

        // Show mixing animation
        selectedContainers.forEach(container => {
            container.classList.add('mixing');
        });

        await this.delay(400);

        // Remove mixing class
        selectedContainers.forEach(container => {
            container.classList.remove('mixing');
        });

        // Create transfer particles animation
        await this.createTransferAnimation(selectedContainers);

        // Empty the source beakers
        selectedContainers.forEach(container => {
            const beakerName = container.dataset.beaker;
            delete this.beakerContents[beakerName];
            delete this.resultBeakers[beakerName];

            const liquid = container.querySelector('.liquid');
            if (liquid) {
                liquid.className = 'liquid';
            }

            const fillIndicator = container.querySelector('.fill-indicator');
            if (fillIndicator) {
                fillIndicator.textContent = 'Empty';
            }

            container.classList.remove('filled', 'selected');
        });

        // Clear selection
        this.selectedBeakers = [];

        // Get reaction based on solution combination
        const reaction = this.getReactionForCombination(solution1, solution2);

        // Create result beaker with the combined solution
        await this.createResultBeaker(solution1, solution2, reaction);

        this.isAnimating = false;
        this.updateUI();
    }

    getReactionForCombination(sol1, sol2) {
        // Sort solutions alphabetically to match matrix keys
        const sorted = [sol1, sol2].sort();
        const key = sorted.join('-');

        // Get possible reactions for this combination
        const possibleReactions = this.reactionMatrix[key] || ['no-reaction', 'no-reaction', 'no-reaction'];

        // Randomly select one
        const randomIndex = Math.floor(Math.random() * possibleReactions.length);
        return possibleReactions[randomIndex];
    }

    async triggerReaction(reaction, containers) {
        // Map reaction types to visual effects
        const reactionEffects = {
            'neutralization': () => this.colorReaction(containers, 'Neutralization Reaction!'),
            'heat-release': () => this.energyBurstReaction(containers, 'Exothermic Reaction - Heat Released!'),
            'color-change': () => this.colorReaction(containers, 'Color Change Observed!'),
            'gas-release': () => this.energyBurstReaction(containers, 'Gas Evolution Detected!'),
            'dilution': () => this.noReaction(containers, 'Dilution - No Reaction'),
            'esterification': () => this.colorReaction(containers, 'Ester Formation!'),
            'precipitation': () => this.colorReaction(containers, 'Precipitate Formed!'),
            'saponification': () => this.energyBurstReaction(containers, 'Soap Formation!'),
            'dissolution': () => this.noReaction(containers, 'Solution Formed'),
            'separation': () => this.noReaction(containers, 'Phase Separation'),
            'no-reaction': () => this.noReaction(containers, 'No Significant Reaction'),
            'energy-burst': () => this.energyBurstReaction(containers, 'Vigorous Reaction!'),
            'oxidation': () => this.colorReaction(containers, 'Oxidation Reaction!'),
            'reduction': () => this.colorReaction(containers, 'Reduction Reaction!'),
            'explosive-combustion': () => this.explosiveCombustion(containers)
        };

        const effectFunction = reactionEffects[reaction] || reactionEffects['no-reaction'];
        await effectFunction();
    }

    async explosiveCombustion(containers) {
        // ULTRA DRAMATIC explosion for hydrogen + oxygen

        // Add screen shake
        document.body.classList.add('explosion-shake');

        // Create flash overlay
        const flash = document.createElement('div');
        flash.classList.add('flash-overlay');
        document.body.appendChild(flash);

        setTimeout(() => flash.remove(), 800);

        containers.forEach(container => {
            container.classList.add('energy-burst');

            // Add crack effect to beaker
            const glass = container.querySelector('.beaker-glass');
            if (glass) {
                glass.classList.add('cracked');
                setTimeout(() => glass.classList.remove('cracked'), 1200);
            }
        });

        // Create MASSIVE multi-wave particle burst
        containers.forEach((container, index) => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // First wave - immediate massive burst
            this.createParticleBurst(centerX, centerY, 80);

            // Create shockwave
            this.createShockwave(centerX, centerY);

            // Second wave - delayed
            setTimeout(() => {
                this.createParticleBurst(centerX, centerY, 60);
                this.createShockwave(centerX, centerY);
            }, 150);

            // Third wave - final burst
            setTimeout(() => {
                this.createParticleBurst(centerX, centerY, 40);
            }, 300);

            // Add debris/smoke particles
            this.createDebrisParticles(centerX, centerY, 30);
        });

        this.resultMessage.textContent = '💥💥💥 EXPLOSIVE COMBUSTION - H₂ + O₂ → H₂O + ENERGY! 💥💥💥';
        this.resultMessage.style.color = '#e74c3c';
        this.resultMessage.style.fontWeight = 'bold';
        this.resultMessage.style.fontSize = '1.4rem';
        this.resultMessage.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.5)';

        await this.delay(1000);

        containers.forEach(container => {
            container.classList.remove('energy-burst');
        });

        document.body.classList.remove('explosion-shake');

        // Reset message styling
        this.resultMessage.style.fontWeight = '400';
        this.resultMessage.style.fontSize = '1.2rem';
        this.resultMessage.style.textShadow = 'none';
    }

    createShockwave(centerX, centerY) {
        const shockwave = document.createElement('div');
        shockwave.classList.add('shockwave');
        shockwave.style.left = `${centerX - 25}px`;
        shockwave.style.top = `${centerY - 25}px`;
        document.body.appendChild(shockwave);

        setTimeout(() => shockwave.remove(), 800);
    }

    createDebrisParticles(centerX, centerY, count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.classList.add('particle');

                // Random angle and distance for debris
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 150;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                // Larger debris particles
                const size = 12 + Math.random() * 8;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;

                particle.style.left = `${centerX}px`;
                particle.style.top = `${centerY}px`;
                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);

                // Smoke/debris colors (gray, black, orange)
                const debrisColors = [
                    'radial-gradient(circle, #666 0%, #333 100%)',
                    'radial-gradient(circle, #999 0%, #555 100%)',
                    'radial-gradient(circle, #ff8800 0%, #ff4400 100%)',
                    'radial-gradient(circle, #ffaa00 0%, #ff6600 100%)'
                ];
                particle.style.background = debrisColors[Math.floor(Math.random() * debrisColors.length)];

                this.particleContainer.appendChild(particle);

                setTimeout(() => particle.remove(), 800);
            }, i * 20);
        }
    }

    async energyBurstReaction(containers, message) {
        // Add energy burst class
        containers.forEach(container => {
            container.classList.add('energy-burst');
        });

        // Create particle burst effect
        containers.forEach(container => {
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            this.createParticleBurst(centerX, centerY, 20);
        });

        this.resultMessage.textContent = message;
        this.resultMessage.style.color = '#f39c12';

        await this.delay(600);

        containers.forEach(container => {
            container.classList.remove('energy-burst');
        });
    }

    async colorReaction(containers, message) {
        // Add color reaction class
        containers.forEach(container => {
            container.classList.add('color-reaction');
        });

        this.resultMessage.textContent = message;
        this.resultMessage.style.color = '#9b59b6';

        await this.delay(600);

        containers.forEach(container => {
            container.classList.remove('color-reaction');
        });
    }

    async noReaction(containers, message) {
        // Add no reaction class
        containers.forEach(container => {
            container.classList.add('no-reaction');
        });

        this.resultMessage.textContent = message;
        this.resultMessage.style.color = '#95a5a6';

        await this.delay(500);

        containers.forEach(container => {
            container.classList.remove('no-reaction');
        });
    }

    createParticleBurst(centerX, centerY, particleCount) {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 80 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            const colors = [
                'radial-gradient(circle, #ffd700 0%, #ff6b6b 100%)',
                'radial-gradient(circle, #ff6b6b 0%, #ff8c42 100%)',
                'radial-gradient(circle, #42ff8c 0%, #4287ff 100%)',
                'radial-gradient(circle, #ff42e8 0%, #ffd700 100%)'
            ];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            this.particleContainer.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    async createTransferAnimation(sourceContainers) {
        // Create transfer particles from source beakers to result zone
        const resultZone = document.querySelector('.result-beakers');
        const resultRect = resultZone.getBoundingClientRect();
        const targetX = resultRect.left + resultRect.width / 2;
        const targetY = resultRect.top + resultRect.height / 2;

        sourceContainers.forEach((container, index) => {
            const rect = container.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            // Create multiple transfer particles
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.classList.add('transfer-particle');

                    const liquid = container.querySelector('.liquid');
                    const computedStyle = window.getComputedStyle(liquid);
                    particle.style.background = computedStyle.background;

                    particle.style.left = `${startX}px`;
                    particle.style.top = `${startY}px`;

                    document.body.appendChild(particle);

                    // Animate to target
                    const duration = 600;
                    const startTime = Date.now();

                    const animate = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function
                        const eased = 1 - Math.pow(1 - progress, 3);

                        const currentX = startX + (targetX - startX) * eased;
                        const currentY = startY + (targetY - startY) * eased;

                        particle.style.left = `${currentX}px`;
                        particle.style.top = `${currentY}px`;
                        particle.style.opacity = 1 - progress;

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            particle.remove();
                        }
                    };

                    animate();
                }, i * 50 + index * 100);
            }
        });

        await this.delay(800);
    }

    async createResultBeaker(solution1, solution2, reaction) {
        // Remove placeholder if it exists
        const placeholder = this.resultBeakersContainer.querySelector('.result-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // Increment counter and create new beaker ID
        this.resultBeakerCounter++;
        const beakerId = `R${this.resultBeakerCounter}`;

        // Determine result solution type based on combination
        const resultSolution = this.getResultSolution(solution1, solution2, reaction);

        // Store result beaker content
        this.resultBeakers[beakerId] = resultSolution;

        // Create beaker HTML
        const beakerHTML = `
            <div class="result-beaker-container" data-beaker="${beakerId}">
                <div class="beaker">
                    <div class="beaker-glass">
                        <div class="liquid ${resultSolution}"></div>
                        <div class="reflection"></div>
                    </div>
                    <div class="beaker-base"></div>
                </div>
                <div class="label">${beakerId}: ${this.capitalize(solution1)} + ${this.capitalize(solution2)}</div>
                <div class="selection-indicator"></div>
            </div>
        `;

        this.resultBeakersContainer.insertAdjacentHTML('beforeend', beakerHTML);

        // Get the new beaker container
        const newBeaker = this.resultBeakersContainer.lastElementChild;

        // Add click event listener
        newBeaker.addEventListener('click', () => this.handleResultBeakerClick(newBeaker));

        await this.delay(500);

        // Trigger reaction effect on the result beaker
        await this.triggerResultReaction(reaction, newBeaker);
    }

    getResultSolution(sol1, sol2, reaction) {
        // Determine result color based on reaction type
        const reactionColorMap = {
            'neutralization': 'water',
            'heat-release': 'oxygen',
            'color-change': 'hydrogen',
            'gas-release': 'base',
            'dilution': 'water',
            'esterification': 'oxygen',
            'precipitation': 'salt',
            'saponification': 'base',
            'dissolution': 'water',
            'separation': 'oxygen',
            'no-reaction': 'water',
            'energy-burst': 'acid',
            'oxidation': 'oxygen',
            'reduction': 'hydrogen',
            'explosive-combustion': 'water'  // H2 + O2 -> H2O
        };

        return reactionColorMap[reaction] || 'water';
    }

    async triggerResultReaction(reaction, beakerContainer) {
        // Determine if it should explode or color change
        const explosiveReactions = ['energy-burst', 'gas-release', 'heat-release', 'saponification', 'explosive-combustion'];
        const colorChangeReactions = ['color-change', 'neutralization', 'esterification', 'precipitation', 'oxidation', 'reduction'];

        if (reaction === 'explosive-combustion') {
            // ULTRA MASSIVE explosion for hydrogen + oxygen result beaker

            // Add screen shake
            document.body.classList.add('explosion-shake');

            // Create flash overlay
            const flash = document.createElement('div');
            flash.classList.add('flash-overlay');
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 800);

            beakerContainer.classList.add('exploding');

            // Add crack effect
            const glass = beakerContainer.querySelector('.beaker-glass');
            if (glass) {
                glass.classList.add('cracked');
                setTimeout(() => glass.classList.remove('cracked'), 1500);
            }

            // Get position
            const rect = beakerContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Multiple waves of MASSIVE explosions
            // Wave 1 - Immediate huge burst
            this.createParticleBurst(centerX, centerY, 100);
            this.createShockwave(centerX, centerY);

            // Wave 2 - Secondary explosion
            setTimeout(() => {
                this.createParticleBurst(centerX, centerY, 80);
                this.createShockwave(centerX, centerY);
            }, 200);

            // Wave 3 - Tertiary explosion
            setTimeout(() => {
                this.createParticleBurst(centerX, centerY, 60);
                this.createShockwave(centerX, centerY);
            }, 400);

            // Wave 4 - Final burst
            setTimeout(() => {
                this.createParticleBurst(centerX, centerY, 40);
            }, 600);

            // Massive debris cloud
            this.createDebrisParticles(centerX, centerY, 50);

            this.resultMessage.textContent = '💥💥💥 EXPLOSIVE COMBUSTION - Water Formed with MASSIVE Energy Release! 💥💥💥';
            this.resultMessage.style.color = '#e74c3c';
            this.resultMessage.style.fontWeight = 'bold';
            this.resultMessage.style.fontSize = '1.4rem';
            this.resultMessage.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.5)';

            await this.delay(1500);
            beakerContainer.classList.remove('exploding');
            document.body.classList.remove('explosion-shake');

            // Reset message styling
            this.resultMessage.style.fontWeight = '400';
            this.resultMessage.style.fontSize = '1.2rem';
            this.resultMessage.style.textShadow = 'none';
        } else if (explosiveReactions.includes(reaction)) {
            // Explosion animation
            beakerContainer.classList.add('exploding');

            // Create particle burst
            const rect = beakerContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            this.createParticleBurst(centerX, centerY, 25);

            this.resultMessage.textContent = '💥 Vigorous Reaction - Explosion!';
            this.resultMessage.style.color = '#e74c3c';

            await this.delay(800);
            beakerContainer.classList.remove('exploding');
        } else if (colorChangeReactions.includes(reaction)) {
            // Color change animation
            beakerContainer.classList.add('color-changing');

            const messages = {
                'oxidation': '🔥 Oxidation Reaction - Oxygen Transfer!',
                'reduction': '⚡ Reduction Reaction - Electron Transfer!',
                'color-change': '🌈 Solution Color Changing!',
                'neutralization': '○ Neutralization Complete!',
                'esterification': '🧪 Ester Formation!',
                'precipitation': '⬇️ Precipitate Formed!'
            };

            this.resultMessage.textContent = messages[reaction] || '🌈 Solution Color Changing!';
            this.resultMessage.style.color = '#9b59b6';

            await this.delay(1000);
            beakerContainer.classList.remove('color-changing');
        } else {
            // Mild reaction
            this.resultMessage.textContent = '○ Solution Formed';
            this.resultMessage.style.color = '#95a5a6';
            await this.delay(500);
        }
    }

    handleResultBeakerClick(container) {
        if (this.isAnimating) return;

        const beakerName = container.dataset.beaker;

        // If selecting for mixing
        if (this.resultBeakers[beakerName]) {
            this.toggleBeakerSelection(container, beakerName);
        }
    }

    reset() {
        if (this.isAnimating) return;

        // Clear all selections
        this.selectedSolution = null;
        this.selectedBeakers = [];
        this.beakerContents = {};
        this.resultBeakers = {};
        this.resultBeakerCounter = 0;

        // Remove all classes from solution options
        this.solutionOptions.forEach(opt => opt.classList.remove('selected'));

        // Remove all classes from beakers and reset liquids
        this.beakerContainers.forEach(container => {
            container.classList.remove('selected', 'disabled', 'mixing', 'energy-burst',
                                       'color-reaction', 'no-reaction', 'pouring', 'filled');

            const liquid = container.querySelector('.liquid');
            liquid.className = 'liquid';

            const fillIndicator = container.querySelector('.fill-indicator');
            fillIndicator.textContent = 'Empty';
        });

        // Clear result beakers
        this.resultBeakersContainer.innerHTML = '<div class="result-placeholder">Mix two beakers to see the result here!</div>';

        // Clear result message
        this.resultMessage.textContent = '';

        // Clear particles
        this.particleContainer.innerHTML = '';

        // Update UI
        this.updateUI();
        this.updateInstructions();
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChemistrySimulation();
});
