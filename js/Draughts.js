define(['jquery'], function($) {

	var board = new Array(8);
	var current;
	var moves = new Array();
	var whichPawn = 2;
	var killedRed = 0,
		killedBlue = 0;

	function Draughts() {
		initBoard();
		drawBoard();
	}

	function selectPawn() {
		$(".circle").click(function() {
			var id = $(this).closest('td').attr('id');
			var coordinates = id.split("");
			if (board[coordinates[0]][coordinates[1]] != whichPawn) {
				console.log("Should chose " + whichPawn + " pawn");
				return;
			}
			setCurrentPawn(id);
			$(".selected").removeClass("selected");
			$("#" + id).addClass('selected');
		});
	}

	function markMove() {
		$(".black").click(function() {
			if (!current) {
				return;
			}
			var id = $(this).closest('td').attr('id');
			var split = id.split("");
			var value = board[split[0]][split[1]];
			if (value == 0) {
				$("#" + id).addClass("green");
				if (notExistsInArray(split[0], split[1])) {
					moves.push([split[0], split[1]]);
				}
			}
		});
	}

	function killOrMove() {
		$(".black").dblclick(function() {
			console.log('dblclick ...')
			console.log(moves)
			var y = parseInt(current[0]);
			var x = parseInt(current[1]);

			var isMoved = false;
			var killedPawns = [];
			for (var i = 0; i < moves.length; i++) {
				var moveY = moves[i][0];
				var moveX = moves[i][1];
				var diff = Math.abs(y - moveY);
				var middlePawn = [];
				if (diff == 2) { //kill pawn
					//calculate pawn position
					if (y > moveY) {
						middlePawn.push(y - 1);
					} else {
						middlePawn.push(y + 1);
					}
					if (x > moveX) {
						middlePawn.push(x - 1);
					} else {
						middlePawn.push(x + 1);
					}
					if (board[middlePawn[0]][middlePawn[1]] == oppositeToCurrent()) {
						killedPawns.push(middlePawn);
					}
				} else if (diff == 1) { //move one step
					if (moves.length == 1) {
						board[moveY][moveX] = board[y][x];
						board[y][x] = 0;
						isMoved = true;
					}
				}
				y = parseInt(moveY);
				x = parseInt(moveX);
			}
			if (killedPawns.length == moves.length) {
				for (var i = 0; i < killedPawns.length; i++) {
					var killedColor = board[killedPawns[i][0]][killedPawns[i][1]];
					board[killedPawns[i][0]][killedPawns[i][1]] = 0;
					if (killedColor == 1) {
						killedRed++;
					} else {
						killedBlue++;
					}
				}
				var last = moves[moves.length - 1];
				board[last[0]][last[1]] = board[current[0]][current[1]];
				board[current[0]][current[1]] = 0;
				isMoved = true;
			}

			if (isMoved) {
				swapPawn();
				drawBoard();
			}

		});
	}

	function registerListeners() {
		selectPawn();
		markMove();
		killOrMove();
	}

	function oppositeToCurrent() {
		return board[current[0]][current[1]] == 1 ? 2 : 1;
	}

	function swapPawn() {
		whichPawn = whichPawn == 1 ? 2 : 1;
	}

	function notExistsInArray(elem1, elem2) {
		var result = true;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i][0] == elem1 && moves[i][1] == elem2) {
				result = false;
				break;
			}
		}
		return result;
	}

	function setCurrentPawn(id) {
		current = id;
		moves = new Array();

		$(".selected").removeClass("selected");
		$(".green").removeClass("green");
	}

	function initBoard() {
		for (var i = 0; i < 8; i++) {
			board[i] = new Array(8);
			for (var j = 0; j < 8; j++) {
				board[i][j] = 0;
			}
		}
		//set red
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 8; j++) {
				board[i][j] = (j + i) % 2 == 1 ? 1 : 0;
			}
		}
		//set blue
		for (var i = 5; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				board[i][j] = (j + i) % 2 == 1 ? 2 : 0;
			}
		}
	}

	function drawBoard() {
		var html = "<table>";
		for (var i = 0; i < 8; i++) {
			html += "<tr>";
			for (var j = 0; j < 8; j++) {
				var circle = "";
				if (board[i][j] == 1) {
					circle = "<img class='circle' src='img/red.png' />";

				} else if (board[i][j] == 2) {
					circle = "<img class='circle' src='img/blue.png' />";
				}

				var color = (j + i) % 2 == 1 ? " black" : " white";

				html += "<td id='" + i + "" + j + "' class='" + color + "'>" + circle + "</td>";
			}
			html += "</tr>";
		}
		html += "</table>";
		$("#content").html(html);
		$("#nextPawn").html("<img src='img/" + (whichPawn == 1 ? "red.png" : "blue.png") + "'/>");
		drawKilledPawns();
		registerListeners();
	}

	function drawKilledPawns() {
		var html = "";
		for (var i = 0; i < killedRed; i++) {
			html += "<img class='circle' src='img/red.png' />";
		}
		$("#killed_red").html(html);

		html = "";
		for (var i = 0; i < killedBlue; i++) {
			html += "<img class='circle' src='img/blue.png' />";
		}
		$("#killed_blue").html(html);
	}

	return Draughts;

});