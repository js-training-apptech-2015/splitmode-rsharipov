angular.module("logic", []).service("GameLogic", [ '$timeout', function($timeout) {
  
  const USER_MARK = 'X';
  const AI_MARK = '0';
  const AI_TURN_TIMEOUT = 500;
  const BOARD_RESET_TIMEOUT = 2000;
  
  function parseState(string) {
		if (!string.match("^[X0_]{10}$")) {
			throw "state must be represented as 10-character string of 'X', 'O' and '_'"
		}
		board = []
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
	
	function clone(state) {
		var newBoard = [];
		for (var i = 0; i < 3; ++i) {
			newBoard.push(state.board[i].slice());
		}
		return { mine: state.mine, board: newBoard };
	}

	function invert(ch) {
		return ch == '0' ? 'X' : '0';
	}

	function calculateNextMoves(state) {
		var nextStates = [];
		for (var i = 0; i < 3; ++i) {
			for (var j = 0; j < 3; ++j) {
				if (state.board[i][j] == '_') {
					var next = clone(state);		
					next.board[i][j] = state.mine;
					next.mine = invert(state.mine);
					nextStates.push({
						state: next,
						move: [i, j]
					});
				}
			}
		}	
		return nextStates;
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

	function findBestMove(state) {
		if (isWinningFor(state.board, state.mine)) {
			return { result: 1, distance: 0 };
		}
		if (isWinningFor(state.board, invert(state.mine))) {
			return { result: -1, distance: 0 };
		}
		var nextMoves = calculateNextMoves(state);
		if (nextMoves.length == 0) {
			return { result: 0, distance: 0 };
		}
		var bestMove = { result: 2 };
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
      userScore: 0,
      cpuScore: 0,
      board: parseState('X_________').board
    }
  }
  
  function noMoreMoves(board) {
    return calculateNextMoves({
      board: board,
      mine: 'X'
    }).length == 0;
  }
  
  var USER_WON = "UserWon", AI_WON = "AiWon", TIE = "Tie";
  
  function handleGameOver(state, overListener) {
    if (isWinningFor(state.board, USER_MARK)) {
      ++state.userScore;
      overListener(USER_WON);      
    }
    else if (isWinningFor(state.board, AI_MARK)) {
      ++state.cpuScore;
      overListener(AI_WON);
    }
    else if (noMoreMoves(state.board)) {
      overListener(TIE);
    }
    else {
      return;
    }
    $timeout(function() {
      state.board = initialState().board;
    }, BOARD_RESET_TIMEOUT);    
  }
  
  var userCanMakeMove = true;
  
  function makeMoveAt(state, i, j, overListener) {
	if (!userCanMakeMove) {
		return;
	}	
    var board = state.board;
  	if (board[i][j] != '_') {
		return;
	}
	board[i][j] = USER_MARK;
	var best = findBestMove({ mine: AI_MARK, board: board });    
	
	userCanMakeMove = false;
    $timeout(function() {
      if (typeof(best.move) != 'undefined') {
        board[best.move[0]][best.move[1]] = AI_MARK;
      }
      handleGameOver(state, overListener);
	  userCanMakeMove = true;
    }, AI_TURN_TIMEOUT);
  }
  
  return {
    makeMoveAt: makeMoveAt,
    initialState: initialState,
    USER_WON: USER_WON,
    AI_WON: AI_WON,
    TIE: TIE
  }
}]);