/*
   TRABALHO 1 DE APLICAÇÕES MULTIMÉDIA 2020
   GRUPO: NOME | NUMERO DE ALUNO
*/
(function () {
	var imagens = ["algarve.png", "casino.png", "chaves.png", "girl.jpg", "obidos.jpg", "panda.jpg", "vchaves.jpg", "vidago.jpg"];
	// apenas contem o nome da imagem. O resto do caminho tem que ser acrescentado.
	// sons de jogo
	const sounds = {
		somDeFundo: "",
		jogar: "",
		trade: "",
		erro: "",
		success: "",
		death: "",
		solution: ""
	};
	let nrI=6;
	let win = false;
	let nMoves=0;
	let mapa = [];
	let musicPlay=true;
	let solvedMap = [];
	let mapsolved=false;
	let numeroP = 0;
	let l=4;
	let c=4;
	let possibleMoves = [];

	//tamanho de cada celula
	var SIZE = 90;
	window.addEventListener("load", init, false);

	function init() {
		sounds.somDeFundo = document.querySelector("#somDeFundo");
		sounds.somDeFundo.volume = 0.01;
		sounds.jogar = document.querySelector("#jogar");
		sounds.baralhar = document.querySelector("#baralhar");
		sounds.erro = document.querySelector("#erro");
		sounds.success = document.querySelector("#success");
		sounds.solution = document.querySelector("#solucao");
		sounds.somDeFundo.play();
		document.getElementById("showResult").addEventListener("click",result,false);
		document.getElementById("muteOpt").addEventListener("click",sons,false);
		document.getElementById("contador").innerHTML=nMoves;
		desenharMapa(l, c, nrI);
		shuffle(15);
		checkPossibleMoves();
		resolvido(l,c,nrI);
		document.getElementById("thumbSet").addEventListener("click",(e)=>reset(e.target.alt),false);
		document.getElementById("dificuldade").addEventListener("click",(e)=>levels(e.target.alt),false);
	}

	function levels(nrPecas) {
		l=nrPecas;
		c=nrPecas;
		reset(nrI);
	}

	function reset(img) {

		for(let i=0;i<8;i++){
		if(document.getElementById("img"+i).classList.contains("selecionada")){
			document.getElementById("img"+i).classList.remove("selecionada");
		}}
		win=false;
		nrI=img;
		nMoves=0;
		document.getElementById("contador").innerHTML=nMoves;
		numeroP=0;
		let stage=document.getElementById("stage");
		while (stage.firstChild) {
			stage.firstChild.remove();
		}
		mapa=[];
		solvedMap=[];
		mapsolved=false;
		desenharMapa(l,c,nrI);
		shuffle(15);
		checkPossibleMoves();
		resolvido(l,c,nrI);
		document.getElementById("img"+img).classList.add("selecionada");

	}

	function play(e){

	if(!win){
		console.log(possibleMoves);
		let idDiv=e.currentTarget.id;
		if(possibleMoves.includes(e.currentTarget)){
			sounds.jogar.play();
			trocarPecas(idDiv,numeroP-1);
			nMoves++;
			document.getElementById("contador").innerHTML=nMoves;
			checkWin();
			checkPossibleMoves();
		}else{
			sounds.erro.play();
		}
	}
	}

	function sons(e) {
		if(musicPlay){
			musicPlay=false;
			document.getElementById("muteOpt").classList.add("viewOff");
			sounds.somDeFundo.volume = 0;

		}else{
			sounds.somDeFundo.volume = 0.01;
			document.getElementById("muteOpt").classList.remove("viewOff");
			musicPlay=true;
		}

	}

	function result(e){
		if(mapsolved){
			document.getElementById("showResult").classList.remove("viewOff");
			desenharArray(l,c,mapa);
			mapsolved=false;
		}else{
			sounds.solution.play();
			document.getElementById("showResult").classList.add("viewOff");
			desenharArray(l,c,solvedMap);
			mapsolved=true;
		}
	}
	function desenharArray(linhas,colunas,array){
		let stage=document.getElementById('stage');
		while (stage.firstChild) {
			stage.firstChild.remove();
		}

		for (let linha = 0; linha < linhas; linha++) {
			for (let coluna = 0; coluna < colunas; coluna++) {
				stage.appendChild(array[linha][coluna]);
			}
		}
	}

	function criardivsjogo(linhas, colunas) {
		tamanhodiv = (366 / colunas);
		let stage = document.getElementById("stage");
		for (let linha = 0; linha < linhas; linha++) {
			let arraycolunas = [];
			for (let coluna = 0; coluna < colunas; coluna++) {
				let cel = document.createElement("div");
				cel.id = numeroP;
				cel.style.float = "left";
				cel.style.width = tamanhodiv + "px";
				cel.style.height = tamanhodiv + "px";

				cel.addEventListener("click", play,false);

				stage.appendChild(cel);
				arraycolunas.push(cel);
				numeroP++;
			}
			mapa.push(arraycolunas);
		}
	}

	function criarArraysolucao(linhas, colunas) {
		let num = 0;
		tamanhodiv = (366 / colunas);
		for (let linha = 0; linha < linhas; linha++) {
			let arraycolunas = [];
			for (let coluna = 0; coluna < colunas; coluna++) {
				let cel = document.createElement("div");
				cel.id = num;
				cel.style.float = "left";
				cel.style.width = tamanhodiv + "px";
				cel.style.height = tamanhodiv + "px";

				cel.addEventListener("click", play,false);

				arraycolunas.push(cel);
				num++;
			}
			solvedMap.push(arraycolunas);
		}
	}

	function resolvido(linhas, colunas, imagem) {

		tamanhoImg = (366 / colunas);
		criarArraysolucao(linhas, colunas);
		let num = 0;
		for (let linha = 0; linha < linhas; linha++) {
			let colunaArr = solvedMap[linha];
			for (let coluna = 0; coluna < colunas; coluna++) {

				let celula = document.createElement("img");
				celula.classList.add("cell");
				celula.style.backgroundImage = "url('images/" + imagens[imagem] + "')";
				celula.style.backgroundPositionX = -(Math.floor(num % colunas)) * tamanhoImg + "px";
				celula.style.backgroundPositionY = -(Math.floor(num / colunas)) * tamanhoImg + "px";
				celula.style.width = tamanhoImg + "px";
				celula.style.height = tamanhoImg + "px";
				colunaArr[coluna].appendChild(celula);
				num++;
			}
		}

		while (solvedMap.firstChild) {
			solvedMap.firstChild.remove();
		}
	}


	function desenharMapa(linhas, colunas, imagem) {
		tamanhoImg = (366 / colunas);
		criardivsjogo(linhas, colunas);
		let num = 0;
		for (let linha = 0; linha < linhas; linha++) {
			let colunaArr = mapa[linha];
			for (let coluna = 0; coluna < colunas; coluna++) {

				let celula = document.createElement("img");
				celula.classList.add("cell");
				celula.style.backgroundImage = "url('images/" + imagens[imagem] + "')";
				celula.style.backgroundPositionX = -(Math.floor(num % colunas)) * tamanhoImg + "px";
				celula.style.backgroundPositionY = -(Math.floor(num / colunas)) * tamanhoImg + "px";
				celula.style.width = tamanhoImg + "px";
				celula.style.height = tamanhoImg + "px";
				colunaArr[coluna].appendChild(celula);
				num++;
			}
		}
		let colunaArr = mapa[linhas - 1];
		colunaArr[colunas - 1].firstChild.remove();
	}

	function shuffle(numero) {
		let num1;
		let num2;
		for (let x = 0; x < numero; x++) {
			num1 = Math.round(Math.random() * (numeroP - 1));
			num2 = Math.round(Math.random() * (numeroP - 1));
			if (num1 !== num2 && num1 !== 15 && num2 !== 15) {
				trocarPecas(num1, num2);

			} else
				numero--;
		}
		sounds.baralhar.play();

	}

	function checkWin() {
		let num = 0;
		let arrayVitorioso = [];
		for (let i = 0; i < mapa[0].length; i++) {
			let arrColuna = [];
			for (let j = 0; j < mapa[0].length; j++) {
				arrColuna.push(num);
				num++;
			}
			arrayVitorioso.push(arrColuna);
		}
		num = 0;
		let n = 0;


		for (let i = 0; i < mapa[0].length; i++) {
			for (let j = 0; j < mapa[0].length; j++) {
				if (parseInt(mapa[i][j].id) === arrayVitorioso[i][j]) {
					n++;
				}
				num++;
			}
		}
		if (n === (numeroP)) {
			possibleMoves=[];
			win = true;
			document.getElementById("win").classList.remove("hidden");
			document.getElementById("resetbtn").addEventListener("click",resetWithLast,false);
		}

		//criar modal e se calhar dar reset ?

	}
	function resetWithLast() {
		reset(nrI);
		sounds.success.play();
		document.getElementById("win").classList.add("hidden");
	}


	function checkPossibleMoves() {
		possibleMoves=[];
		let whiteBox = searchNoArray(numeroP - 1);


		let whiteBoxRow = whiteBox[0];
		let whiteBoxColumn = whiteBox[1];

		try {
			if (mapa[whiteBoxRow - 1][whiteBoxColumn] !== undefined) { //top
				possibleMoves.push(mapa[whiteBoxRow - 1][whiteBoxColumn]);
			}
		} catch (e) {

		}

		try {
			if (mapa[whiteBoxRow + 1][whiteBoxColumn] !== undefined) { //bottom
				possibleMoves.push(mapa[whiteBoxRow + 1][whiteBoxColumn]);
			}
		} catch (e) {

		}

		try {
			if (mapa[whiteBoxRow][whiteBoxColumn - 1] !== undefined) { //left
				possibleMoves.push(mapa[whiteBoxRow][whiteBoxColumn - 1]);
			}
		} catch (e) {

		}

		try {
			if (mapa[whiteBoxRow][whiteBoxColumn + 1] !== undefined) { //right
				possibleMoves.push(mapa[whiteBoxRow][whiteBoxColumn + 1]);
			}
		} catch (e) {

		}
	}

	function trocarPecas(first, second) {
		let img1 = document.getElementById(first).firstChild;
		let img2 = document.getElementById(second).firstChild; //imagens das divs
		let div1 = document.getElementById(first);
		let div2 = document.getElementById(second);  //divs

		if (first === numeroP - 1 || second === numeroP - 1) {
			if (first === numeroP - 1) {
				document.getElementById(second).firstChild.remove();
				document.getElementById(first).appendChild(img2);


			} else {
				document.getElementById(first).firstChild.remove();
				document.getElementById(second).appendChild(img1);
			}


		} else {

			document.getElementById(second).firstChild.remove();
			document.getElementById(first).firstChild.remove();  //remover as images das divs


			document.getElementById(first).appendChild(img2); //meter a segunda imagem na primeira div
			document.getElementById(second).appendChild(img1); //meter a primeira imagem na segunda div
			sounds.success.play();
		}


		div1.id = second;  //mudar o nome da primeira para o da segunda
		div2.id = first;  //vice versa do q está cá em cima


	}

	function searchNoArray(id) {
		let colunas = mapa[0].length;
		let temp = mapa[0];
		let linhas = temp.length;
		let rowcol = [];
		for (let row = 0; row < colunas; row++) {
			for (let column = 0; column < linhas; column++) {
				if (mapa[row][column].id == id) {
					rowcol[0] = (row);
					rowcol[1] = (column);
				}
			}
		}
		return rowcol;
	}
})();
