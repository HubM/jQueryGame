$( function() {
	/*******************************************************
							  ***************************
			  					Les variables globales
								***************************
	*******************************************************/

	//Les boutons
	var buttons = $(".section button");
	var currentDiv = buttons.parent();

	//Les infos d'Eliot
	var EliotInfos = $("#EliotInfos");
	var MorphinePilules = $('.MorphinePilules > span');
	var MorphinePilulesValue = 3;
	var StressLevel = $('.StressLevel > span');
	var StressLevelValue = 0;


	/*******************************************************
							  ***************************
			  							Initialisation
								***************************
	*******************************************************/

	//Cacher les infos d'Eliot
	$('#EliotInfos').hide();
	$('.ModifyInfos > span').hide();

	$('.MorphinePilules').click(function(e){
		if(MorphinePilulesValue > 0){
			loose10S();
		} else {
			e.preventDefault();
			MorphinePilules = 0;
		}
	});




	//Tableaux qui associe le nom d'une action avec
	//une méthode
	var actionsName = {
		"start" : startGame,
		"findMDP" : findMDP,
		"enigmeSortableEasy": enigmeSortableEasy,
		"enigmeSortableHard": enigmeSortableHard,
		"puzzleDA": puzzleDA,
		"puzzleAppartDarlene" :puzzleAppartDarlene,
	}

	//Tableau
	var impactsName = {
		"loose10S" : loose10S,
		"add10S" : add10S,
		"add20S" : add20S,
		"add30S" : add30S,
	}


	/*******************************************************
							  ***************************
			  							Fonctions
								***************************
	*******************************************************/

	//Pour chaque click sur l'un des boutons, cacher la div actuelle, puis
	//afficher la div suivante. +
	buttons.click(function() {
		$(this).each(function(){
			$(this).parent().hide();

			//Grace à l'attribut desc, on va pouvoir associer l'affichage
			// de la bonne div par rapport au bouton clicker
			var nextSection = $(this).attr('go');
			gotoSection(nextSection);

			if(nextSection == "intro"){
				window.location.href = window.location.href;
			}

			//Si le bouton a un attr impact, alors on
			//affecte associe sa valeur à une fonction associée dans le tableau
			//impactsName
			var hasImpact = $(this).attr('impact');
			if(hasImpact != undefined){
				impactsName[hasImpact]();
			}

			//vérifie si il y a	un attribut action à la div parent.
			//Si oui, alors on va exécuter l'action associée
			var action = $(this).parent('div').attr('action');
			if(action){
				actionsName[action]();
			}

			//L'attribut desc permet d'associer l'affichage du bon texte
			// par rapport au bouton précédemment clické, spécialement dans le cas
			// d'une div pouvant apparaître par différents chemins
			var desc = $(this).attr('desc');
			if(desc != undefined){
				$('div.'+desc).show().siblings('div').hide();
			}

			//Delimitation du niveau de stress maximal pour mener à bien le jeu
			if(StressLevelValue >= 90){
				endGame();
			}

			//Delimitation du niveau de stress maximal pour mener à bien le jeu
			if(nextSection == "GameOver"){
				$('.stress-death').hide();
			}


		});
	});

	/*Afficher la div ayant l'identifiant correspondant à l'attribut go du
	bouton, et vérifier si cette div a un attribut action. Si oui, alors
	afficher la fonction associée dans le tableau actionsName*/
	function gotoSection(key) {
			$('div#'+key).fadeIn(1000).each(function(){
				var action = $(this).attr('action');
				if(action){
					actionsName[action]();
				}
			});
	}

	/*Initialiser les valeurs par défault du niveau de stress et de pilules*/
	function startGame() {
		$('#ReveilBrutal').children().not('.infos_begin').hide();
		$('.infos_begin > button').click(function(e){
			e.preventDefault();
			$(this).parent().hide();
			$('#ReveilBrutal').children().not('.infos_begin').fadeIn();
		});
		$('#EliotInfos').show();
		$(StressLevel).html(StressLevelValue);
		$(MorphinePilules).html(MorphinePilulesValue);
	}

	/*Fonction lorsque le jouer a perdu d'une mort liée au stress.*/
	function endGame(){
		$('div').hide();
		var gameOver = $('#GameOver');
		gameOver.children('.normal-death').hide();
		gameOver.fadeIn(500);
	}

	/*Fonction lors d'une prise de de pillule de Morphine*/
	function loose10S(){
		$('.ModifyInfos > span:first-of-type').fadeIn().fadeOut(1000);
		StressLevelValue -= 10;
		StressLevel.html(StressLevelValue);
		MorphinePilulesValue -= 1;
		MorphinePilules.html(MorphinePilulesValue);
	}

	function add10S(){
		$('.ModifyInfos > span:nth-of-type(2)').fadeIn().fadeOut(1000);
		StressLevelValue += 10;
		StressLevel.html(StressLevelValue);
	}


	function add20S(){
		$('.ModifyInfos > span:nth-of-type(3)').fadeIn().fadeOut(1000);
		StressLevelValue += 20;
		StressLevel.html(StressLevelValue);
	}

	function add30S(){
		$('.ModifyInfos > span:last-of-type').fadeIn().fadeOut(1000);
		StressLevelValue += 30;
		StressLevel.html(StressLevelValue);
	}

	//Cette fonction va permettre de tester les valeurs rentrées par le joueur,
	//Elle va également limiter le nombre d'essai à 3. Si dans ces 3 essais le MDP est
	//trouvé, alors les boutons d'actions s'affichent, sinon le joueur perd
	function findMDP(){
		$('#ChercherMDP > button').hide();
		var nbEssais = 3;
		$('#sendMDP').click(function(e){
			var MDPProposition = $('#findMDPInput').val();
			nbEssais -= 1;
			e.preventDefault();
			//Vérifier si il reste encore des essais au joueur
			if(nbEssais > 0){
				//Si mdp = leavemehere
				if(MDPProposition == "leavemehere"){
					MorphinePilulesValue += 1;
					MorphinePilules.html(MorphinePilulesValue);
					$('#ChercherMDP > form').fadeOut();
					$('button').fadeIn();
				}else{
					alert('il vous reste ' + nbEssais + ' chance(s)');
				}
		 	}else{
		 		$('div').hide();
				$('#GameOver').fadeIn();
				$('button').show();
			}
		});
	}

	//Cette fonction correspond au jeu final qui sauve Darlene. Ici c'est la version facile.
	//Utilisant le plugin sortable de jquery UI, le but est de remettre de l'ordre dans les
	//différentes propositions pour débloquer le bouton qui sauve Darlene
	function enigmeSortableEasy(){
		$('#SuivreEnigme > button').hide();
		$('.SDSEnigme > ul').sortable( {
			update: function(event,ui){
				var Order = $(this).sortable('toArray');
				console.log(Order);
				for(var i = 1; i<Order.length; i++){
					var goodOrdre = $('#'+i).attr('id');
					if(goodOrdre == Order[i]){
						alert('all good for the number '+ i);
					}
					// alert(Order[i]);

					// if($('#'+i) == Order[i]){
					// 	alert(i + 'work');
					// }
				}
				Order.toString();

				if(Order == "1,2,3,4,5,6,7"){
					MorphinePilulesValue += 1;
					MorphinePilules.html(MorphinePilulesValue);
					$('button').show();
					$(this).fadeOut();
				}
			}
		});
	}

	//Cette fonction correspond au jeu final qui sauve Darlene. Ici c'est la version facile.
	//Utilisant le plugin sortable de jquery UI, le but est de remettre de l'ordre dans les
	//différentes propositions pour débloquer le bouton qui sauve Darlene
	function enigmeSortableHard(){
		decompteHard();
		$('#ContournerEnigme > button').hide();
		$('.SDCEnigme > ul').sortable( {
			update: function(event,ui){
				var Order = $(this).sortable('toArray').toString();
				MorphinePilulesValue += 1;
				MorphinePilules.html(MorphinePilulesValue);
				if(Order == "1,2,3,4,5"){
					$('button').show();
				}
			}
		});
	}

	//La fonction enigmeSortableHard utilise un compteur pour résoudre l'enigme.
	//Si la solution est trouvée dans le temps imparti, alors le joueur accède au niveau suivante
	//Sinon il perd la partie
	function decompteHard(){
		var time = 15;

		timer = setInterval(function(){
			if(time > 0){
				time--;
				$('.decompteHardValue').html(time);
			}
			else {
				clearInterval(timer);
				$('div').hide();
				$('#GameOver').fadeIn();
				$('button').show();
			}
		},1000);
	}

	//La fonction puzzleDA correspond à l'enigme Puzzle pour lire le message de
	//la Dark Army. Le but est de recomposer le puzzle pour pouvoir voir le contenu du message
	function puzzleDA(){
		$('#MessageDA > button, #MessageDA > h2').hide();
		//Les paramètres du puzzleDA
		var mySettingsPuzzle1 = {
				rows:3,
				cols: 3,
				hole: 5,
				shuffle: true,
				numbers: false,
				control: {
						toggleNumbers: false,
						counter: false,
						timer: false
				},
				animation: {
						shuffleRounds: 1,
						slidingSpeed: 100,
						shuffleSpeed: 200
				},

				success: {
					 fadeOriginal: false,    // cross-fade original image [true|false]
					 callback: function(){
						 $('.imgPuzzleMessageDA').fadeOut();
						 $('#MessageDA > button, #MessageDA > h2').fadeIn(500);
					 },    // callback a user-defined function [function]
					 callbackTimeout: 300    // time in ms after which the callback is called
		 },
		};
    $('.imgPuzzleMessageDA').jqPuzzle(mySettingsPuzzle1);
	}


	//La fonction puzzleDA correspond à l'enigme Puzzle pour lire le message de
	//la Dark Army. Le but est de recomposer le puzzle pour pouvoir voir le contenu du message
	function puzzleAppartDarlene(){
		$('#RepondreMessagePortableDarlene > button, #RepondreMessagePortableDarlene > h2').hide();
		//Les paramètres du puzzleDA
		var mySettingsPuzzle2 = {
				rows:4,
				cols: 3,
				hole: 5,
				shuffle: true,
				numbers: false,
				control: {
						toggleNumbers: false,
						counter: false,
						timer: false
				},
				animation: {
						shuffleRounds: 1,
						slidingSpeed: 100,
						shuffleSpeed: 200
				},

				success: {
					 fadeOriginal: false,    // cross-fade original image [true|false]
					 callback: function(){
						 $('.imgPuzzleMessageDA').fadeOut();
						 $('#RepondreMessagePortableDarlene > button, #RepondreMessagePortableDarlene > h2').fadeIn(500);
					 },    // callback a user-defined function [function]
					 callbackTimeout: 300    // time in ms after which the callback is called
		 },
		};
    $('.imgPuzzlePortableDarlene').jqPuzzle(mySettingsPuzzle2);
	}














});
