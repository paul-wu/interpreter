var head = 0;
var symbol = [' ','.','\n','\r','\t',',','\'','\"','.','(','[','<',')',']','>','+','-','=','~','`',';',':','|','!','#','%','^','&','*','/','\\','{','}','?'];
var codetype = ["int","char","float","double","long","bool","short","string","boolen","byte"];
var token = ["def","if","for","as","is","with","False","True","not","or","print","open","close","import","while","return","elif","else","yield","global","lambada","assert","except","break","pass","nonlocal","default","from","del","continue","raise","except","class",""];
var token_c = ["if","for","else","typedef","NULL","true","false","struct","unsigned","return","namespace","auto","break","case","switch","do","while","continue","const","goto","extern","signed","static","register","void","volatile","export","union"];
var token_cpp_c = ["delete","friend","explicit","using","namespace","tmeplate","this","virtual","catch","const_cast","enum","multable","throw","protected","class","private","public","inline","dynamic_cast","asm","const_cast","new"];
var token_java = ["if","for","while","new","private","public","class","protected","Native","import","implements","instanceof","interface","return","static","switch","case","throw","throws","transient","try","abstract","assert","break","case","catch","const","true","false","null","continue","void","strictfp","null","goto","package","super","this","default","else","volatile","finally"];
var token_javascript_java = ["in","function","var","with","motive"];

var spanid = 100;
function checksymbol(input)
{
	for(var i=0;i < symbol.length;i++){
		if(symbol[i] == input)return true;
	}
	return false;
}
function nextliteral(input,start)
{
	var i = start;
	while(i < input.length){
		if(checksymbol(input.charAt(i)))break;
		i++;
	}
	return i;
}
function nextsubstring(input,start,patern)
{
	var next = start;
	while(next < input.length){
		if(input.substring(next,next+patern.length) == patern && input.charAt(next - 1)!='\\')return next;
		next++;
	}
	return next;
}
function nextquato(input,start,quato)
{
	var next = start;
	while(next < input.length){
		if(input.charAt(next) == "\\"){
			next += 2;
			continue;
		}
		if(input.charAt(next) == quato)return next;
		next++;
	}
	return next;
}
function checktoken(input,token_){
	for(var i = 0;i < token_.length;i++){
		if(token_[i] == input)return true;
	}
	return false;
}
function setcolor(input,color){
	return "<span id=\""+spanid+++"\" style =\"color:#"+color+"\">"+input+"</span>";
}
function grammer_Clike(input,type,currenthead)
{
	var result = "";
	if(currenthead >= input.length){
		return result;
	}
	if(checksymbol(input.charAt(currenthead))){
		if(currenthead + 1 < input.length && input.substring(currenthead,currenthead+2) == "//"){
			var nexline = nextnewline(input,currenthead+2);
			result += setcolor(input.substring(currenthead,nexline),"009100");
			result += grammer_Clike(input,type,nexline);
		}else if(currenthead+1<input.length && input.substring(currenthead,currenthead+2) == "/*"){
			var next = nextsubstring(input,currenthead+2,"*/");
			result += setcolor(input.substring(currenthead,next+2),"009100");
			result += grammer_Clike(input,type,next+2);
		}else if(input.charAt(currenthead) == "\'" || input.charAt(currenthead) == "\""){
			var next = nextquato(input,currenthead+1,input.charAt(currenthead));
			result += setcolor(input.substring(currenthead,next+1),"66B3FF");
			result += grammer_Clike(input,type,next+1);
		}else if(input.charAt(currenthead) == '#'){
			var nexline = nextnewline(input,currenthead+1);
			result += setcolor(input.substring(currenthead,nexline),"5B5B5B");
			result += grammer_Clike(input,type,nexline);
		}else{
			result += input.charAt(currenthead);
			result += grammer_Clike(input,type,currenthead+1);
		}
	}else{
		var next = nextliteral(input,currenthead);
		var sub = input.substring(currenthead,next);
		if(type!="js" && type!="python" && checktoken(sub,codetype)){
			result += setcolor(sub,"0000C6");
		}else if((type == "c" || type == "c++") && checktoken(sub,token_c)){
			result += setcolor(sub,"FF0000");
		}else if(type == "c++" && checktoken(sub,token_cpp_c)){
			result += setcolor(sub,"FF0000");
		}else if((type == "java" || type == "js") && checktoken(sub,token_java)){
			result += setcolor(sub,"FF0000");
		}else if(type == "js" && checktoken(sub,token_javascript_java)){
			result += setcolor(sub,"FF0000");
		}else if(next<input.length && input.charAt(next)=="("){
			result += setcolor(sub,"930000");
		}else if(type == "xml"){
			result += setcolor(sub,"930000");
		}else{
			result += sub;
		}
		result += grammer_Clike(input,type,next);
	}
	return result;
}

function grammer(input)
{
	var result = "";
	if(head >= input.length){
		return result;
	}
	if(checksymbol(input.charAt(head))){
		if(head + 4 <= input.length && input.substring(head,head+3) == "\'\'\'"){
			result += setcolor(comment1(input),"000093");
			result += grammer(input);	
		}else if(input.charAt(head) == '#'){
			result += setcolor(comment(input),"000093");
			result += grammer(input);
		}else if(input.charAt(head) == '\'' || input.charAt(head) == '\"'){
			head++;
			var quate = input.charAt(head-1);
			result += setcolor(quate+inquate(input,quate)+quate,"009900");
			result += grammer(input);
		}else{
			result += input.substring(head,head+1);
			head++;
			result += grammer(input);
		}
	}else{
		var next = nextliteral(input,head);
		var sub = input.substring(head,next);
		if(checktoken(sub,token)){
			result += setcolor(sub,"FF0000");
			head = next;
			result += grammer(input);
		}else if(input.charAt(next) == '('){
			result += setcolor(sub,"660066");
			head = next;
			result += grammer(input);
		}else{
			result += sub;
			head = next;
			result += grammer(input);
		}
	}
	return result;
}
function grammer_XML(input,currenthead)
{
	var result = "";
	if(currenthead >= input.length){
		return result;
	}
	if(currenthead+6<input.length && input.substring(currenthead,currenthead+7)=='&lt;!--'){
		var next = nextsubstring(input,currenthead+7,'-->');
		result += setcolor(input.substring(currenthead,next+3),"5B5B5B");
		result += grammer_XML(input,next+3);
	}else if(currenthead+3<input.length && input.substring(currenthead,currenthead+4) == "&lt;"){
		var nextclose = nextsubstring(input,currenthead+4,">");
		var nextopen = nextsubstring(input,currenthead+4,"&lt;");
		if(nextclose > nextopen){
			result += input.substring(currenthead,nextopen);
			result += grammer_XML(input,nextopen);
			return result;
		}
		if(input.charAt(currenthead+4)=="/"){
			var next = nextsubstring(input,currenthead+5,">");
			result += setcolor(input.substring(currenthead,next+1),"FF0000");
			result += grammer_XML(input,next+1);
		}else{
			var next = nextsubstring(input,currenthead," ");
			//var next1 = nextsubstring(input,currenthead,">");
			if(next > nextclose){
				result += setcolor(input.substring(currenthead,nextclose+1),"FF0000");
				result += grammer_XML(input,nextclose+1);
				return result;
			}
			result += setcolor(input.substring(currenthead,next),"FF0000");
			//var nextclose = nextsubstring(input,next+1,">");
			result += grammer_Clike(" "+input.substring(next+1,nextclose),"xml",0);
			result += setcolor(">","FF0000");
			result += grammer_XML(input,nextclose+1);
		}
	}else{
		result += input.substring(currenthead,currenthead+1);
		result += grammer_XML(input,currenthead+1);
	}
	return result;
}
function inquate(input,tok)
{
	var result = "";
	if(head >= input.length)return result;
	if((input.charAt(head) == tok || input.charAt(head) == '\n') && input.charAt(head-1) != '\\'){
		head++;
		return result;
	}
	head++;
	result += input.substring(head-1,head);
	result += inquate(input,tok);
	return result;
}
function comment(input)
{
	var i =head;
	while(i < input.length){
		if(input.charAt(i) == '\n' || input.charAt(i) == '\r')break;
		i++;
	}
	var result = input.substring(head,i);
	head = i;
	return result;
}
function comment1(input)
{
	var i = head + 4;
	while(i < input.length){
		if(i+4 < input.length && input.substring(i,i+3) == '\'\'\'')break;
		i++;
	}
	var result = "";
	if(i+4 <= input.length)
		result += input.substring(head,i+4);
	else
		result += input.substring(head);
	head = i+4;
	return result;
}
function formate(input,codetype)
{
	head = 0;
	var result = "";
	if(codetype == ""){
		codetype = autodetect(input);
	}
	if(codetype == "python")
		result = grammer(input);
	else if(codetype == "c" || codetype == "java" || codetype == "c++" || codetype == "js"){
		result = grammer_Clike(input,codetype,0);
	}else if(codetype == "xml" || codetype == "html" || codetype == "xhtml"){
		result = grammer_XML(input,0);
	}else
		result = input;
	return result;
}
function codeselction(tag)
{
	return "<span style =\"color:white;background-color:lightblue\">"+tag+"</span>";
}

function autodetect(input)
{
	var a = input.search(/[\ |\n|""]def\ /);
	if(a!=-1)return "python";
	if((input.search(/\{[.]*\}/)!=-1 || input.search(/\/\//)!=-1||input.search(/\/\*[.]*\*\//)!=-1)){
		if(input.search(/namespace/)!=-1 || input.search(/>>/)!=-1||input.search(/<</)!=-1)return "c++";
		if(input.search(/class/)!=-1){
			if(input.search(/boolean/)!=-1 || input.search(/import/)!=-1 || input.search(/package/)!=-1 && input.search(/#include/)==-1)return "java";
			return "c++";
		}
		if(input.search(/function/)!=-1 || input.search(/var/) != -1)return "js";
		return "c";
	}
	return "";
}

function replaceall(input,tag)
{
	if(typeof(input)=="undefined")return;
	tag = tag.split(' ')[0];
	var i = 0;
	var result = "";
	while(i < input.length){
		if(input.charAt(i) == "<"){
			var next = nextsubstring(input,i,">");
			result += input.substring(i,next+1);
			i = next + 1;
			continue;
		}
		if(checksymbol(input.charAt(i))){
			result += input.charAt(i);
			i++;
			continue;
		}
		var next = nextliteral(input,i);
		if(input.substring(i,next) == tag){
			result += codeselction(tag);
		}else{
			result += input.substring(i,next);
		}
		i = next;
	}
	return result;
}

