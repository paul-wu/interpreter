var headstate = 0;
var paternlist = ["**","__","[","`","#","$","%%","~"];
var KMP_Table = {};
var paternhead = [-1,-1,-1,-1,-1,-1,-1,-1];
function setSelectionRange(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}
	else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
}

function setCaretToPos (input, pos) {
	setSelectionRange(input, pos, pos);
}

function set(pos,value)
{
	var text = document.getElementById("wmd-input");
	text.value = text.value.substring(0,pos) + value+text.value.substring(pos);
	setCaretToPos(document.getElementById("wmd-input"), pos);
	headstate = 0;
}
function KMP_Patern_Table(patern){
	var table = [];
	var pos = 2, cnd = 0;
	table.push(-1);
	table.push(0);
	while(pos < patern.length){
		if(patern.charAt(pos-1)==patern.charAt(cnd)){
			cnd++;table.push(cnd);pos++;
		}else if(cnd > 0){
			cnd = table[cnd];
		}else{
			table.push(0);pos++;
		}
	}
	return table;
}
function action(NUM,pos)
{
	switch(NUM){
		case 0:
			set(pos,'**');
			return;
		case 1:
			set(pos,'__');
			return;
		case 2:
			set(pos,']');
			return;
		case 3:
			set(pos,'`');
			return;
		case 4:
			set(pos,'#');
			//setCaretToPos(document.getElementById("wmd-input"), pos+1);
			return;
		case 5:
			set(pos,'$');
			return;
		case 6:
			set(pos,'\n\n%%');
			setCaretToPos(document.getElementById("wmd-input"), pos+1);
			return;
		case 7:
			set(pos,'~');
			return;
		default:
			return;
	}
}

function genTable()
{
	if(headstate == 1)return;
	var i = 0;
	while(i < paternlist.len){
		KMP_Table.push(KMP_Patern_Table(paternlist[i]));
		i++;
	}
	headstate = 1;
}

function changestate(key,pos)
{
	var i = 0;
	while(i < paternhead.length){
		if(key==paternlist[i].charAt(paternhead[i]+1))paternhead[i]++;
		else
			paternhead[i] = -1;//KMP_Patern_Table(paternlist[i])[paternhead[i]+1];
		i++;
	}
	i = 0;
	while(i < paternlist.length){
		if(paternhead[i]+1 == paternlist[i].length){
			action(i,pos);
			paternhead[i] = -1;
			return;
		}
		i++;
	}
}
