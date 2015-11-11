angular.module("logic").service("SinglePlayer", ['CommonLogic', '$timeout', function (common, $timeout) {

	const USER_MARK = 'X';
	const AI_MARK = '0';
	const AI_TURN_TIMEOUT = 500;
	const BOARD_RESET_TIMEOUT = 2000;

	function clone(state) {
		var newBoard = [];
		for (var i = 0; i < 3; ++i) {
			newBoard.push(state.board[i].slice());
		}
		return {mine: state.mine, board: newBoard};
	}

	function calculateNextMoves(state) {
		var nextStates = [];
		for (var i = 0; i < 3; ++i) {
			for (var j = 0; j < 3; ++j) {
				if (state.board[i][j] == '_') {
					var next = clone(state);
					next.board[i][j] = state.mine;
					next.mine = common.invert(state.mine);
					nextStates.push({
						state: next,
						move: [i, j]
					});
				}
			}
		}
		return nextStates;
	}

	function findBestMove(state) {
		if (common.isWinningFor(state.board, state.mine)) {
			return {result: 1, distance: 0};
		}
		if (common.isWinningFor(state.board, common.invert(state.mine))) {
			return {result: -1, distance: 0};
		}
		var nextMoves = calculateNextMoves(state);
		if (nextMoves.length == 0) {
			return {result: 0, distance: 0};
		}
		var bestMove = {result: 2};
		for (var i = 0; i < nextMoves.length; ++i) {
			var move = findBestMove(nextMoves[i].state);
			if (bestMove.result > move.result || bestMove.result == move.result && bestMove.distance > move.distance) {
				bestMove.result = move.result;
				bestMove.move = nextMoves[i].move;
				bestMove.distance = move.distance + 1;
			}
		}
		bestMove.result = -bestMove.result;
		return bestMove;
	}

	function initialState() {
		return {
			player1Score: 0,
			player2Score: 0,
			// counter that allows recursive locking of user's move
			userIsForbiddenToMakeAMove: 0,
			board: common.parseState('X_________').board
		}
	}

	function handleGameOver(state, overListener) {
		if (common.isWinningFor(state.board, USER_MARK)) {
			state.player1Score += 2;
			overListener('You\'re winner!©');
		}
		else if (common.isWinningFor(state.board, AI_MARK)) {
			state.player2Score += 2;
			overListener('You lose, better luck next time!');
		}
		else if (common.noMoreMoves(state.board)) {
			state.player1Score += 1;
			state.player2Score += 1;
			overListener('It\'s a tie!');
		}
		else {
			return;
		}
		delayForbiddingMoves(state, function () {
			state.board = initialState().board;
		}, BOARD_RESET_TIMEOUT);
	}

	function makeMoveAt(state, i, j, overListener) {
		if (state.userIsForbiddenToMakeAMove != 0) {
			return;
		}
		var board = state.board;
		if (board[i][j] != '_') {
			return;
		}
		board[i][j] = USER_MARK;
		var best = findBestMove({mine: AI_MARK, board: board});
		delayForbiddingMoves(state, function () {
			if (typeof(best.move) != 'undefined') {
				board[best.move[0]][best.move[1]] = AI_MARK;
			}
			handleGameOver(state, overListener);
		}, AI_TURN_TIMEOUT);
	}

	function delayForbiddingMoves(state, action, delayTime) {
		++state.userIsForbiddenToMakeAMove;
		$timeout(function () {
			action();
			--state.userIsForbiddenToMakeAMove;
		}, delayTime);
	}

	return {
		makeMoveAt: makeMoveAt,
		initialState: initialState,
		player1Label: 'You',
		player2Label: 'CPU'
	}
}]);