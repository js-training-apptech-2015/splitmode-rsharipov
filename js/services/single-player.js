angular.module("logic").service("SinglePlayer", ['CommonLogic', '$timeout', function (common, $timeout) {

	const USER_MARK = 'X';
	const AI_MARK = '0';
	const AI_TURN_TIMEOUT = 500;
	const BOARD_RESET_TIMEOUT = 2000;
	const EASY = "easy";
	const MEDIUM = "medium";
	const HARD = "hard";

	var statesCache = {}
	
	$timeout(forceCacheBuild, 50);

	function forceCacheBuild() {
		findHardMove(initialState());	
	}
	
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
	
	function findMove(state) {
		if (state.difficulty == EASY) {
			console.log("Finding EASY move")
			return findEasyMove(state);
		}
		if (state.difficulty == MEDIUM) {
			console.log("Finding MEDIUM move")
			return findMediumMove(state);
		}
		if (state.difficulty == HARD) {
			console.log("Finding HARD move")
			return findHardMove(state);
		}
	}
	
	function findEasyMove(state) {	   
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
		var move = nextMoves[parseInt(Math.random() * nextMoves.length, 10)];
		move.result = -move.result;
		return move;
	}
	
	function findMediumMove(state) {
		if (Math.random() < 0.2) {
			return findEasyMove(state);
		}
		return findHardMove(state);		
	}

	function findHardMove(state) {	   
		var cacheKey = common.asString(state.board, state.mine);
		if (cacheKey in statesCache) {
			return statesCache[cacheKey];
		}	
		if (common.isWinningFor(state.board, state.mine)) {
			return statesCache[cacheKey] = {result: 1, distance: 0};
		}
		if (common.isWinningFor(state.board, common.invert(state.mine))) {
			return statesCache[cacheKey] = {result: -1, distance: 0};
		}
		var nextMoves = calculateNextMoves(state);
		if (nextMoves.length == 0) {
			return statesCache[cacheKey] = {result: 0, distance: 0};
		}
		var bestMove = {result: 2};
		for (var i = 0; i < nextMoves.length; ++i) {
			var move = findHardMove(nextMoves[i].state);
			if (bestMove.result > move.result || bestMove.result == move.result && bestMove.distance > move.distance) {
				bestMove.result = move.result;
				bestMove.move = nextMoves[i].move;
				bestMove.distance = move.distance + 1;
			}
		}
		bestMove.result = -bestMove.result;
		return statesCache[cacheKey] = bestMove;
	}

	function initialState() {
		return {
			player1Score: 0,
			player2Score: 0,
			currentPlayer: 1,
			difficulty: MEDIUM,
			// counter that allows recursive locking of user's move
			userIsForbiddenToMakeAMove: 0,
			board: common.parseState('X_________').board
		}
	}
	
	function resetBoard(state) {
		state.board = initialState().board;
		state.currentPlayer = initialState().currentPlayer;
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
			resetBoard(state);
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
		state.currentPlayer = common.invertPlayer(state.currentPlayer);
		
		var best = findMove({mine: AI_MARK, board: board, difficulty: state.difficulty});
		
		delayForbiddingMoves(state, function () {
			if (typeof(best.move) != 'undefined') {
				board[best.move[0]][best.move[1]] = AI_MARK;
				state.currentPlayer = common.invertPlayer(state.currentPlayer);
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
		player2Label: 'CPU',
		EASY: EASY,
		MEDIUM: MEDIUM,
		HARD: HARD
	}
}]);
