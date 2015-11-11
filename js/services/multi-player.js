angular.module("logic").service("MultiPlayer", ['CommonLogic', '$timeout', function (common, $timeout) {

	const PLAYER1_MARK = 'X';
	const PLAYER2_MARK = '0';

	function initialState() {
		return {
			currentPlayer: 1,
			player1Score: 0,
			player2Score: 0,
			// counter that allows recursive locking of user's move
			userIsForbiddenToMakeAMove: 0,
			currentMark: PLAYER1_MARK,
			board: common.parseState('X_________').board
		}
	}

	function resetGame(state) {
		state.board = initialState().board
		state.currentMark = PLAYER1_MARK
		state.currentPlayer = 1
	}

	function makeMoveAt(state, row, column, gameOverHandler) {
		if (state.board[row][column] == '_') {
			state.board[row][column] = state.currentMark;
			state.currentMark = common.invert(state.currentMark);
			state.currentPlayer = common.invertPlayer(state.currentPlayer);
		}
		if (common.isWinningFor(state.board, PLAYER1_MARK)) {
			state.player1Score += 2;
			resetGame(state);
			gameOverHandler('Player 1 wins')
			return;
		}
		if (common.isWinningFor(state.board, PLAYER2_MARK)) {
			state.player2Score += 2;
			resetGame(state);
			gameOverHandler('Player 2 wins')
			return;
		}
		if (common.noMoreMoves(state.board)) {
			state.player1Score++;
			state.player2Score++;
			resetGame(state);
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