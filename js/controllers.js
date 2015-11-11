angular.module('tic-tac-toe', ['logic', 'ui.bootstrap'])
.controller("GameController", [ '$scope', 'SinglePlayer', 'MultiPlayer', '$uibModal', function($scope, singlePlayer, multiPlayer, $uibModal) {

	var gameLogic;

	function setLogic(newLogic) {
		gameLogic = newLogic;
		$scope.state = newLogic.initialState();
		$scope.player1Label = newLogic.player1Label;
		$scope.player2Label = newLogic.player2Label;
	}

	setLogic(singlePlayer);

	function showModal(messageToBeShown) {
		$uibModal.open({ 
			templateUrl: 'templates/modal.html',
			controller: 'ModalController',
			resolve: {
				message: function() {
					return messageToBeShown;
				}
			}
		})
	}
	
	function gameOverHandler(gameOverMessage) {
		showModal(gameOverMessage)
	}
	
	this.newGame = function() {
		$scope.state = gameLogic.initialState();
	}

	this.setMode = function(mode) {
		if (mode == "singleplayer") {
			setLogic(singlePlayer);
		}
		else {
			setLogic(multiPlayer);
		}
	}
	
	this.clickedOn = function(row, column) {
		gameLogic.makeMoveAt($scope.state, row, column, gameOverHandler);
	}
}]);

angular.module('tic-tac-toe').controller('ModalController', ['$scope', 'message', function($scope, message) {
	$scope.modalMessage = message;
}]);