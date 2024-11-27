var stat = 0;
var codelist = [];
var preid = 0;
var prekey = 0;
var listundo = ["","","","","","","","","",""];
var undohead = 0;
//document.onkeydown = record;
function record(){
	prekey = event.keyCode;
	if(event.ctrlKey&&window.event.keyCode==81){
		undohead = (undohead+9)%10;
		document.getElementById("wmd-input").value = listundo[undohead];
	}
	if(event.ctrlKey&&window.event.keyCode==113){
		undohead = (undohead+1)%10;
		document.getElementById("wmd-input").value = listundo[undohead];
	}
	if(prekey == 27){
		var input = document.getElementById('wmd-input');
		var start = input.selectionStart;
		var end = input.selectionEnd;
		if(start == end)return;
		set(end,'~');
		set(start,'[]~');
		setCaretToPos(document.getElementById("wmd-input"), start+1);
	}
	if(prekey == 113){
		var input = document.getElementById('wmd-input');
		var start = input.selectionStart;
		var end = input.selectionEnd;
		if(start == end)return;
		set(end,'**');
		set(start,'**');
		setCaretToPos(document.getElementById("wmd-input"), end+4);	
	}
	if(prekey == 115){
		var input = document.getElementById('wmd-input');
		var start = input.selectionStart;
		var end = input.selectionEnd;
		input.value = input.value.substring(0,start) + "&nbsp;" + input.value.substring(end);
		setCaretToPos(document.getElementById("wmd-input"), start+6);	
	}
}

function call()
{
	if(prekey == 8){
		return;
	}
	undohead = (undohead+1)%10;
	listundo[undohead] = document.getElementById('wmd-input').value;
	var pos = document.getElementById('wmd-input').selectionEnd;
	var key = document.getElementById('wmd-input').value.charAt(pos-1);
	changestate(key,pos);
}

function run(runlate) {
    codelist = [];
    preid = 0;
    var input = document.getElementById("wmd-input").value;
    result = compile(input);
    document.getElementById("output").innerHTML = result;

    if (runlate) {
        MathJax.typesetPromise([document.getElementById("output")])
            .then(() => {
                console.log("MathJax typesetting complete.");
            })
            .catch((err) => {
                console.error("MathJax typesetting error:", err);
            });
    }

    stat = 0;
    var i = 0;
    while (i <= getIDNum()) {
        var code = document.getElementById(i.toString());
        // Ensure the element exists before accessing its content
        if (code) {
            stat = 1;
            codelist.push(code.innerHTML);
        }
        i++;
    }
}


function check(input){
	var i = 0;
	while(i<input.length){
		if(input.charCodeAt(i) < '0'.charCodeAt(0) || input.charCodeAt(i) > '9'.charCodeAt(0))return false;
		i++;
	}
	return true;
}
function getstyle()
{
	var result = "<style>";
	var stylelist = document.getElementsByTagName('style');
	var i = 0;
	while(i < stylelist.length){
		result += stylelist[i].innerText;
		i++;
	}
	result += "<\/style>";
	return result;
}
function gethtmlcode(input) {
	var mywindow1 = window.open("","MsgWindow","width=700,height=550");
	var body = "<textarea id=\"wmd-input\" class=\"wmd-input\" name=\"post-text\" style=\"width:100%;height:100%;\"></textarea>";
	mywindow1.document.write(body);
	var value = "";
	value += getstyle();
	value += "<div style=\"width:700px;height:100%;float:left;\"><span style=\"font-family: Microsoft YaHei;LINE-HEIGHT: 150%\"><p id=\"output\">"+input+"<\/p><\/span><\/div><\/body>";
	mywindow1.document.getElementById('wmd-input').value=value;
}

function print_page(input) {
	var mywindow = window.open("","MsgWindow","width=750,height=600%");
	var body = "";
	body += getstyle();
	body += "<div style=\"width:700px;height:100%;float:left;\"><span style=\"font-family: Microsoft YaHei;LINE-HEIGHT: 150%\"><p id=\"output\">"+input+"<\/p><\/span><\/div><\/body>";
	mywindow.document.write(body);
}
$(function(){
	$(document.body).bind('mouseup', function(e){
		if(stat == 0)return;
		var selection;
		if (window.getSelection) {
			selection = window.getSelection();
		} else if (document.selection) {
			selection = document.selection.createRange();
		}
		var id = e.target.id;
		if(!check(id)){
			var code = document.getElementById(preid.toString());
				if(code && stat == 1)
						{
					code.innerHTML = codelist[preid];
					stat = 2;
				}
			return;
		}
		var tem = 0;
		tem = id;
		var tag = selection.toString();
		var ele = document.getElementById(id);
		if(id >= 100){
			ele = ele.parentNode;
			id = ele.id;
			tem = id;
		}
		if(ele == null)return;
		if(id != preid)document.getElementById(preid.toString()).innerHTML = codelist[preid];
		var text = replaceall(codelist[tem],tag);
		ele.innerHTML = text;
		preid = tem;
		stat = 1;
		});
});
