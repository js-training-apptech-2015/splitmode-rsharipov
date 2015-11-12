(function(){

describe('logic', function() {
    beforeEach(module('logic'));

    it('should see the service', inject(['SinglePlayer', function($service) {
        expect($service).not.toBe(null);
    }]));
    
    it('parsing state', inject(['SinglePlayer', function($service) {
        expect($service.initialState()).toEqual({
          player1Score: 0,
          player2Score: 0,
		  currentPlayer: 1,
		  userIsForbiddenToMakeAMove: 0,
          board: [
            ['_', '_', '_'],
            ['_', '_', '_'],
            ['_', '_', '_']
          ]
        });
    }]));
    
    // TODO: write tests for makeMoveAt
});

})();