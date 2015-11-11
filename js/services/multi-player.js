angular.module("logic").service("MultiPlayer", ['CommonLogic', '$timeout', function (common, $timeout) {

	const PLAYER1_MARK = 'X';
	const PLAYER2_MARK = '0';

	function initialState() {
		return {
			player1Score: 0,
			player2Score: 0,
			// counter that allows recursive locking of user's move
			userIsForbiddenToMakeAMove: 0,
			currentMark: PLAYER1_MARK,
			board: common.parseState('X_________').board
		}
	}

	function makeMoveAt(state, row, column, gameOverHandler) {
		if (state.board[row][column] == '_') {
			state.board[row][column] = state.currentMark;
			state.currentMark = common.invert(state.currentMark);
		}
		if (common.isWinningFor(state.board, PLAYER1_MARK)) {
			state.player1Score += 2;
			state.board = initialState().board;
			gameOverHandler('Player 1 wins')
			return;
		}
		if (common.isWinningFor(state.board, PLAYER2_MARK)) {
			state.player2Score += 2;
			state.board = initialState().board;
			gameOverHandler('Player 2 wins')
			return;
		}
		if (common.noMoreMoves(state.board)) {
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