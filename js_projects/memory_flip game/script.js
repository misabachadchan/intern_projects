
        const emojis = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎹'];
        let cards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let timer = 0;
        let timerInterval = null;
        let canFlip = true;

        function startGame() {
            cards = [...emojis, ...emojis];
            shuffleArray(cards);
            
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            timer = 0;
            canFlip = true;
            
            clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 1000);
            
            updateStats();
            renderBoard();
            
            document.getElementById('winMessage').classList.remove('show');
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function renderBoard() {
            const board = document.getElementById('gameBoard');
            board.innerHTML = '';

            cards.forEach((emoji, index) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.index = index;
                card.dataset.emoji = emoji;
                card.addEventListener('click', () => flipCard(card, index));
                board.appendChild(card);
            });
        }

        function flipCard(cardElement, index) {
            if (!canFlip) return;
            if (cardElement.classList.contains('flipped') || 
                cardElement.classList.contains('matched')) return;
            if (flippedCards.length >= 2) return;

            cardElement.classList.add('flipped');
            cardElement.textContent = cardElement.dataset.emoji;
            flippedCards.push({ element: cardElement, index: index });

            if (flippedCards.length === 2) {
                moves++;
                updateStats();
                checkMatch();
            }
        }

        function checkMatch() {
            canFlip = false;
            const [card1, card2] = flippedCards;

            if (card1.element.dataset.emoji === card2.element.dataset.emoji) {
                setTimeout(() => {
                    card1.element.classList.add('matched');
                    card2.element.classList.add('matched');
                    card1.element.classList.remove('flipped');
                    card2.element.classList.remove('flipped');
                    
                    matchedPairs++;
                    updateStats();
                    flippedCards = [];
                    canFlip = true;

                    if (matchedPairs === emojis.length) {
                        endGame();
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    card1.element.classList.remove('flipped');
                    card2.element.classList.remove('flipped');
                    card1.element.textContent = '';
                    card2.element.textContent = '';
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }

        function updateStats() {
            document.getElementById('moves').textContent = moves;
            document.getElementById('matches').textContent = `${matchedPairs}/${emojis.length}`;
        }

        function updateTimer() {
            timer++;
            document.getElementById('timer').textContent = `${timer}s`;
        }

        function endGame() {
            clearInterval(timerInterval);
            document.getElementById('winMessage').classList.add('show');
        }

        startGame();
  