angular.module("logic", []).service("CommonLogic", function () {
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

	return {
		invert: function (ch) {
			return ch == '0' ? 'X' : '0';
		},
		parseState: function (string) {
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
		},
		isWinningFor: function (board, mine) {
			var winning = getWinningLine(mine);
			return getLine(board, 0, 0, 0, 1) == winning ||
				getLine(board, 1, 0, 0, 1) == winning ||
				getLine(board, 2, 0, 0, 1) == winning ||
				getLine(board, 0, 0, 1, 0) == winning ||
				getLine(board, 0, 1, 1, 0) == winning ||
				getLine(board, 0, 2, 1, 0) == winning ||
				getLine(board, 0, 0, 1, 1) == winning ||
				getLine(board, 0, 2, 1, -1) == winning;
		},
		noMoreMoves: function (board) {
			for (var i = 0; i < 3; ++i) {
				for (var j = 0; j < 3; ++j) {
					if (board[i][j] == '_') {
						return false;
					}
				}
			}
			return true;
		}


	}
});