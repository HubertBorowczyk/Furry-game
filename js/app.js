document.addEventListener('DOMContentLoaded', function () {
	var Furry = function (x, y, direction) {
		this.x = 0;
		this.y = 0;
		this.direction = direction;

		this.move = function () {
			switch (this.direction) {
				case 'left':
					this.x--;
					break;
				case 'right':
					this.x++;
					break;
				case 'up':
					this.y--;
					break;
				case 'down':
					this.y++;
					break;
				default:
					return false;
					break;
			}
		}
	}

	var Coin = function () {
		this.x = Math.floor(Math.random() * 10);
		this.y = Math.floor(Math.random() * 10);
	}

	var Game = function () {
		this.boardContainer = document.getElementById('container');
		this.board          = document.querySelectorAll('#board div');
		this.userInfoDiv    = document.querySelectorAll('.userInfo');
		this.gameOverDiv    = document.getElementById('gameOver');
		this.gameOverP      = document.querySelectorAll('#gameOver p');
		this.intervalTime   = 300;
		this.furry = new Furry();
		this.coin = new Coin();
		this.score = 0;
		this.level = 1;

		this.setIndex = function (x, y) {
			return x + y * 10;
		}

		this.showUserInfo = function () {
			this.userInfoDiv[0].innerHTML = this.level;
			this.userInfoDiv[1].innerHTML = this.score;
		}

		this.showFurry = function () {
			for (var i = 0; i < this.board.length; i++) {
				this.board[i].classList.remove('furry');
			}
			if (this.furry.x >= 0 && this.furry.y >= 0) {
				this.board[this.setIndex(this.furry.x, this.furry.y)].classList.add('furry');
			} else {
				this.furry.noWallnoPain();
			}
		}

		this.showCoin = function () {
			this.board[this.setIndex(this.coin.x, this.coin.y)].classList.add('coin');
		}

		var self = this;

		this.setDirection = function (e) {
			e.preventDefault();
			switch (e.which) {
				case 37:
					self.furry.direction = 'left';
					break;
				case 38:
					self.furry.direction = 'up';
					break;
				case 39:
					self.furry.direction = 'right';
					break;
				case 40:
					self.furry.direction = 'down';
					break;
				default:
					return false;
					break;
			}
		}

		this.gameStep = function () {
			self.furry.move();
			self.gameOver();
			self.furryGetsCoin();
			self.showFurry();
			document.addEventListener('keydown', function (e) {
				self.setDirection(e);
			});
		}
	}

	var game = new Game();
	game.showFurry();
	game.showCoin();
	game.showUserInfo();
	var gameHandle = setInterval(game.gameStep, game.intervalTime);

	Game.prototype.furryGetsCoin = function () {
		if ((this.furry.x === this.coin.x) && (this.furry.y === this.coin.y)) {
			this.board[this.setIndex(this.coin.x, this.coin.y)].classList.remove('coin');
			this.score++;
			this.coin = new Coin();
			this.showCoin();
			if (this.score % 10 === 0) {
				this.intervalTime = this.intervalTime - (this.intervalTime / 100 * 20);
				this.level++;
				clearInterval(gameHandle);
				gameHandle = setInterval(game.gameStep, game.intervalTime);
			}
		} else {
			return false;
		}
		this.showUserInfo();
	}

	Game.prototype.gameOver = function () {
		if (this.furry.x < 0 || this.furry.x > 9 || this.furry.y < 0 || this.furry.y > 9) {
			clearInterval(gameHandle);
			this.boardContainer.classList.add('blurred');
			this.gameOverDiv.style.display = 'block';
			this.gameOverP[1].innerHTML = 'Zdobyłeś ' + this.score + ' punktów';
		}
	}
});
