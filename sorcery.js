$( function() {

	//LES VARIABLES
	var buttons = $(".section button");
	var status = $("#status");
	var currentDiv = buttons.parent();
	var life = $('#status > div > span');
	var lifeStatut = 3;

	$('#status').hide();

	var actionsName = {
		"hit" : loseOneLife,
		"reset" : reset,
		"start" : startGame,
	}

	//CLICK SUR UN DES BOUTONS
	buttons.click(function() {
		$(this).each(function(){

			//effacer la div actuelle
			$(this).parent().hide();

			//aller à la div suivante
			var nextSection = $(this).attr('go');
			if(lifeStatut <= 1){
				gotoSection("intro");
			} else {
				gotoSection(nextSection);
			}

		});
	});

	function gotoSection(key) {
			$('div#'+key).fadeIn(1000).each(function(){
				var action = $(this).children('action');
				$(action).each(function(){
					actionsName[$(this).attr('name')]();
				});
			});
	}

	function getLife() {
		lifeStatut=3;
	}

	// function setLife(v) {
	// 	//...
	// }

	function loseOneLife() {
		$('#status > div > span').html(lifeStatut-=1);
		// if(lifeStatut <= 0){
		// 	$('')
		// 	gotoSection("intro");
		// }
	}

	function startGame() {
		reset();
	}

	function endGame() {
		//...
	}

	function reset(){
			getLife();
			$('#status').show();
			$('#status > div > span').html(lifeStatut);
			// currentDiv.hide();
			// alert('resetFunction');
			// $('#status').show();
			// $('#status > div > span').html(lifeStatut);
			// $(this).fadeOut();
			// currentDiv.hide();
			// $('div#intro').show();
	}

	function hit(){
			loseOneLife();
	}
});
