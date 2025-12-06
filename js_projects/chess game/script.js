        const pieces = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
        };

        let board = [];
        let selectedSquare = null;
        let currentTurn = 'white';

        const initialBoard = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];

        function initGame() {
            board = initialBoard.map(row => [...row]);
            selectedSquare = null;
            currentTurn = 'white';
            updateTurnDisplay();
            renderBoard();
        }

        function renderBoard() {
            const boardEl = document.getElementById('board');
            boardEl.innerHTML = '';

            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const square = document.createElement('div');
                    square.className = 'square ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
                    square.dataset.row = row;
                    square.dataset.col = col;
                    
                    const piece = board[row][col];
                    if (piece) {
                        square.textContent = pieces[piece];
                    }

                    square.addEventListener('click', () => handleSquareClick(row, col));
                    boardEl.appendChild(square);
                }
            }
        }

        function handleSquareClick(row, col) {
            const piece = board[row][col];

            if (selectedSquare) {
                const [selRow, selCol] = selectedSquare;
                const selectedPiece = board[selRow][selCol];

                if (isValidMove(selRow, selCol, row, col)) {
                    board[row][col] = selectedPiece;
                    board[selRow][selCol] = '';
                    currentTurn = currentTurn === 'white' ? 'black' : 'white';
                    updateTurnDisplay();
                }

                selectedSquare = null;
                renderBoard();
            } else if (piece && isCurrentPlayerPiece(piece)) {
                selectedSquare = [row, col];
                renderBoard();
                highlightSquare(row, col);
                highlightValidMoves(row, col);
            }
        }

        function isCurrentPlayerPiece(piece) {
            return (currentTurn === 'white' && piece === piece.toUpperCase()) ||
                   (currentTurn === 'black' && piece === piece.toLowerCase());
        }

        function highlightSquare(row, col) {
            const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            square.classList.add('selected');
        }

        function highlightValidMoves(row, col) {
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (isValidMove(row, col, r, c)) {
                        const square = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                        square.classList.add('valid-move');
                    }
                }
            }
        }

        function isValidMove(fromRow, fromCol, toRow, toCol) {
            if (fromRow === toRow && fromCol === toCol) return false;
            
            const piece = board[fromRow][fromCol].toLowerCase();
            const target = board[toRow][toCol];
            
            if (target && isCurrentPlayerPiece(target)) return false;

            const rowDiff = toRow - fromRow;
            const colDiff = toCol - fromCol;

            switch (piece) {
                case 'p':
                    return isValidPawnMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff);
                case 'r':
                    return isValidRookMove(fromRow, fromCol, toRow, toCol);
                case 'n':
                    return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
                           (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
                case 'b':
                    return isValidBishopMove(fromRow, fromCol, toRow, toCol);
                case 'q':
                    return isValidRookMove(fromRow, fromCol, toRow, toCol) ||
                           isValidBishopMove(fromRow, fromCol, toRow, toCol);
                case 'k':
                    return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
                default:
                    return false;
            }
        }

        function isValidPawnMove(fromRow, fromCol, toRow, toCol, rowDiff, colDiff) {
            const piece = board[fromRow][fromCol];
            const isWhite = piece === piece.toUpperCase();
            const direction = isWhite ? -1 : 1;
            const startRow = isWhite ? 6 : 1;

            if (colDiff === 0 && !board[toRow][toCol]) {
                if (rowDiff === direction) return true;
                if (fromRow === startRow && rowDiff === 2 * direction && !board[fromRow + direction][fromCol]) {
                    return true;
                }
            }

            if (Math.abs(colDiff) === 1 && rowDiff === direction && board[toRow][toCol]) {
                return true;
            }

            return false;
        }

        function isValidRookMove(fromRow, fromCol, toRow, toCol) {
            if (fromRow !== toRow && fromCol !== toCol) return false;
            return isPathClear(fromRow, fromCol, toRow, toCol);
        }

        function isValidBishopMove(fromRow, fromCol, toRow, toCol) {
            if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
            return isPathClear(fromRow, fromCol, toRow, toCol);
        }

        function isPathClear(fromRow, fromCol, toRow, toCol) {
            const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
            const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

            let row = fromRow + rowStep;
            let col = fromCol + colStep;

            while (row !== toRow || col !== toCol) {
                if (board[row][col]) return false;
                row += rowStep;
                col += colStep;
            }

            return true;
        }

        function updateTurnDisplay() {
            document.getElementById('turn').textContent = 
                currentTurn === 'white' ? "White's Turn" : "Black's Turn";
        }

        initGame();
