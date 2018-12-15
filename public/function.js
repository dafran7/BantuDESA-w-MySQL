var current = 0;

// tombol filter
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("button");

// searchbar
var input  = document.getElementById('cari');

// kalo sayembara tidak ditemukan
var gaada = "<br><h2>Sayembara Tidak Ditemukan</h2>";

// isi
var isi = document.getElementById('isi');

const button1 = document.getElementById('btnall');
const button2 = document.getElementById('btninfrastruktur');
const button3 = document.getElementById('btnpakan');
const button4 = document.getElementById('btnpangan');
const button5 = document.getElementById('btnpariwisata');

button1.addEventListener('click', function(e) {
	if(current != 0){
		btns[current].className = btns[current].className.replace(" is-active", "");
		this.className += " is-active";
	  	filterSelection("all");
	  	current = 0;
	}
});

button2.addEventListener('click', function(e) {
	if(current != 1){
		btns[current].className = btns[current].className.replace(" is-active", "");
		this.className += " is-active";
	  	filterSelection("Infrastruktur");
	  	current = 1;
	}
});

button3.addEventListener('click', function(e) {
	if(current != 2){
		btns[current].className = btns[current].className.replace(" is-active", "");
		this.className += " is-active";
	  	filterSelection("Pakan");
	  	current = 2;
	}
});

button4.addEventListener('click', function(e) {
	if(current != 3){
		btns[current].className = btns[current].className.replace(" is-active", "");
		this.className += " is-active";
	  	filterSelection("Pangan");
	  	current = 3;
	}
});

button5.addEventListener('click', function(e) {
	if(current != 4){
		btns[current].className = btns[current].className.replace(" is-active", "");
		this.className += " is-active";
	  	filterSelection("Pariwisata");
	  	current = 4;
	}
});

filterSelection("all");
function filterSelection(c) {
	var cards, i, hit=0;
	cards = document.getElementsByClassName("filterDiv");
	isi.innerHTML = isi.innerHTML.replace(gaada, "");
	if (c == "all") c = "";
	for (i = 0; i < cards.length; i++) {
	if(cards[i].className.indexOf(c) > -1){
		cards[i].style.display = "block";
		}
		else {
			cards[i].style.display = "none";
			hit++;
		}
	}
	if(hit == cards.length){
		isi.innerHTML += gaada;
	}
}

input.addEventListener("keyup", function(e){
	var x = this.value.toUpperCase();
	var y, hit=0;
	isi.innerHTML = isi.innerHTML.replace(gaada, "");
	cards = document.getElementsByClassName('filterDiv');
	for (i = 0; i < cards.length; i++) {
		y = cards[i].getElementsByTagName('h3')[0].innerText;
	    if(y.toUpperCase().indexOf(x) > -1){
	    	cards[i].style.display = "block";
	    }
	    else{
	    	cards[i].style.display = "none";
	    	hit++;
	    }
	}
	if(hit == cards.length){
		isi.innerHTML += gaada;
	}
});