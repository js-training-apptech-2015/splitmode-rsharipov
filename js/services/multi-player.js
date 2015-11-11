angular.module("logic").service("MultiPlayer", [ '$timeout', function($timeout) {

    const PLAYER1_MARK = 'X';
    const PLAYER2_MARK = '0';

    function invert(ch) {
        return ch == '0' ? 'X' : '0';
    }

	function parseState(string) {
		if (!string.match("^[X0_]{10}$")) {
			throw "state must be represented as 10-character string of 'X', 'O' and '_'"
		}
		var board = []
		for (var i = 0; i < 3; ++i) {
			board.push([]);
			for (var j = 0; j < 3; ++j) {
				board[i].push(string.charAt(1 + i * 3 + j));
			}
		}
		return {
			mine: string.charAt(0),
			board: board
		}
	}

	function initialState() {
        return {
            player1Score: 0,
            player2Score: 0,
            // counter that allows recursive locking of user's move
            userIsForbiddenToMakeAMove: 0,
            currentMark: PLAYER1_MARK,
            board: parseState('X_________').board
        }
    }

	function getLine(board, startRow, startCol, dirRow, dirCol) {
		var result = ""
		for (var i = 0; i < 3; ++i) {
			result += board[startRow + i * dirRow][startCol + i * dirCol];
		}
		return result;
	}

	function getWinningLine(mine) {
        return mine + mine + mine;
    }

    function isWinningFor(board, mine) {
        var winning = getWinningLine(mine);
        return getLine(board, 0, 0, 0, 1) == winning ||
            getLine(board, 1, 0, 0, 1) == winning ||
            getLine(board, 2, 0, 0, 1) == winning ||
            getLine(board, 0, 0, 1, 0) == winning ||
            getLine(board, 0, 1, 1, 0) == winning ||
            getLine(board, 0, 2, 1, 0) == winning ||
            getLine(board, 0, 0, 1, 1) == winning ||
            getLine(board, 0, 2, 1, -1) == winning;
    }

	function noMoreMoves(board) {
		for (var i = 0; i < 3; ++i) {
			for (var j = 0; j < 3; ++j) {
				if (board[i][j] == '_') {
					return false;
				}
			}
		}
		return true;
	}

    function makeMoveAt(state, row, column, gameOverHandler) {
        if (state.board[row][column] == '_') {
            state.board[row][column] = state.currentMark;
            state.currentMark = invert(state.currentMark);
        }
	    if (isWinningFor(state.board, PLAYER1_MARK)) {
		    state.player1Score += 2;
		    state.board = initialState().board;
		    gameOverHandler('Player 1 wins')
		    return;
	    }
	    if (isWinningFor(state.board, PLAYER2_MARK)) {
		    state.player2Score += 2;
		    state.board = initialState().board;
		    gameOverHandler('Player 2 wins')
		    return;
	    }
	    if (noMoreMoves(state.board)) {
		    state.player1Score++;
		    state.player2Score++;
		    state.board = initialState().board;
		    gameOverHandler('It\'s a tie')
		    return;
	    }
    }

    return {
        makeMoveAt: makeMoveAt,
        initialState: initialState,
	    player1Label: 'First player',
	    player2Label: 'Second player'
    }
}]);