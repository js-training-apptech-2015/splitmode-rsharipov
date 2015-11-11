angular.module('tic-tac-toe', ['logic', 'ui.bootstrap']).controller("GameController", [ '$scope', 'GameLogic', '$uibModal', function($scope, gameLogic, $uibModal) {
	
	$scope.state = gameLogic.initialState();
	
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
  
  function gameOverHandler(whoWon) {
    if (whoWon == gameLogic.USER_WON) {
      showModal('You\'re winner!©')
    }
    if (whoWon == gameLogic.AI_WON) {
      showModal('You lose, better luck next time!')
    }
    if (whoWon == gameLogic.TIE) {
      showModal('It\'s a tie!')
    }
  }
  
  this.newGame = function() {
    $scope.state = gameLogic.initialState();
  }
  
	this.clickedOn = function(i, j) {
    gameLogic.makeMoveAt($scope.state, i, j, gameOverHandler);
	}
}]);

angular.module('tic-tac-toe').controller('ModalController', ['$scope', 'message', function($scope, message) {
  $scope.modalMessage = message;
}]);