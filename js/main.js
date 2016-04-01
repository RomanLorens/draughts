require.config({

	paths : {
		jquery : 'libs/jquery-2.1.1.min',
	}

});

require([ 'Draughts' ], function(Draughts) {

	new Draughts();
	
});