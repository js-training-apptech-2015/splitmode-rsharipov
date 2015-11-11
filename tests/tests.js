(function(){

describe('logic', function() {
    beforeEach(module('logic'));

    it('should see the service', inject(['GameLogic', function($service) {
        expect($service).not.toBe(null);
    }]));
    
    it('parsing state', inject(['GameLogic', function($service) {
        expect($service.initialState()).toEqual({
          userScore: 0,
          cpuScore: 0,
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