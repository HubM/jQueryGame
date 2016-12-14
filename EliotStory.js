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
			gotoSection(nextSection);

			// var descValue = $(this).attr('desc');
			// alert(descValue);


		});
	});

	/*Afficher la div ayant l'identifiant correspondant à l'attribut go du
	bouton, et vérifier si cette div a un attribut action. Si oui, alors
	afficher la fonction associée dans le tableau actionsName*/
	function gotoSection(key) {
			$('div#'+key).fadeIn(1000).each(function(){

				// var DivParagraphs = $(this).children('p');
				// DivParagraphs.each(function(){
				// 	var hasDescValue = $(this).attr('desc');
				// 	if(hasDescValue == show){
				// 		$(hasDescValue).siblings('p').hide();
				// 	}
				// });

				var action = $(this).attr('action');
				if(action){
					actionsName[action]();
				}
			});
	}

	function getLife() {
		lifeStatut=3;
	}

	function loseOneLife() {
		$('#status > div > span').html(lifeStatut-=1);
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

	}

	function hit(){
			loseOneLife();
	}
});
