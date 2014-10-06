/*
 * This is the compiler of whuosc forum descriptive language
 * The language contains the following tokens:
 * ##----------------mark code blocks
 * **----------------make center blocks
 * ` ----------------hight light text
 * []----------------options
 * ~ ----------------set font
 * http://           hyper link
 * We use the top down method to parse the language
 * copyright(c)changlong wu, 2014-09.
 */
 var headreader = 0;//the head to read through the whole input text
 var state = 0;
 var state_underline = 0;
 var id = 0;
 var titleid = 0;
function expression(input)
{
	var result = "";
	if(headreader >= input.length)return result;
	if(headreader+2 < input.length && input.substring(headreader,headreader+3) == '##\n' && input.charAt(headreader-1) != '\\'){
		headreader += 3;
		result += codeblock(input,"");
		result += expression(input);
	}else if(headreader+2 < input.length && input.substring(headreader,headreader+3) == '##[' && input.charAt(headreader-1) != '\\'){
		var i = headreader + 3;
		while(i<input.length){
			if(input.charAt(i) == ']')break;
			i++;
		}
		if(i >= input.length){
			result += "##";
			headreader += 3;
			result += parseoption(input,0);
			result += expression(input);
		}else{
			var codetype = input.substring(headreader+3,i);
			if(input.charAt(i+1) == '\n')i++;
			headreader = i+1;
			result += codeblock(input,codetype);
			result += expression(input);
		}
	}else if(input.substring(headreader,headreader+1)=='`' && input.charAt(headreader -1) != '\\'){
		headreader++;
		result += highlight(input);
		result += expression(input);
	}else if(headreader+1 < input.length && input.substring(headreader,headreader+2) == '**' && input.charAt(headreader-1) != '\\'){
		if(state == 0){
			result += "<center>";
			headreader += 2;
			state = 1;
			result += expression(input);
		}else{
			result += "</center>";
			headreader += 2;
			state = 0;
			result += expression(input);
		}
	}else if(input.substring(headreader,headreader+1) == '[' && input.charAt(headreader-1) != '\\'){
		if(input.substring(headreader+1,headreader+4) == 'img'){
			headreader += 5;
			result += parseimg(input);
			result += expression(input);
		}else{
			headreader++;
			result += parseoption(input,0);
			result += expression(input);
		}
	}else if(headreader+1 < input.length && input.substring(headreader,headreader+2) == "__" && input.charAt(headreader-1) != '\\'){
		if(state_underline == 0){
			result += "<span class=hightlightchinese style=\"padding:4px;font-family:KaiTi,Consolas;font-size:17;\">";
			headreader += 2;
			state_underline = 1;
			result += expression(input);
		}else{
			result += "</span>";
			headreader += 2;
			state_underline = 0;
			result += expression(input);
		}
	}else if(headreader+4 < input.length && input.substring(headreader,headreader+4) == "http"){
		result += parsehttp(input,"");
		result += expression(input);
	}else if(input.charAt(headreader) == '~' && input.charAt(headreader-1) != '\\'){
		headreader++;
		result += parsefont(input,"i",0);
		result += expression(input);
	}else if(input.charAt(headreader) == '\n' || input.charAt(headreader) == '\r'){
		headreader++;
		result += "<br>";
		result += expression(input);
	}else if(headreader+1 < input.length && input.substring(headreader,headreader+2) == '++' && input.charAt(headreader-1) != '\\'){
		var nextline = nextnewline(input,headreader+2);
		result += "<div style=\"text-indent: 2em\">";
		var temhead = headreader;
		headreader = 0;
		result += expression(input.substring(temhead+2,nextline));
		result += "</div>";
		headreader = nextline + 1;
		result += expression(input);
	}else if(input.charAt(headreader) == '+' && input.charAt(headreader - 1) == '\n'){
		var nextline = nextnewline(input,headreader+1);
		result += "<div id=title"+titleid+++"><font id=\"\" size=\"5\">";
		var temhead = headreader;
		headreader = 0;
		result += expression(input.substring(temhead+1,nextline));
		result += "</font><div>";
		headreader = nextline + 1;
		result += expression(input);
	}else if(headreader + 2 < input.length && input.substring(headreader,headreader+3) == '===' && input.charAt(headreader - 1) == '\n'){
		var start = nextnewline(input,headreader+3)+1;
		var end = closeitem(input,start);
		result += "<ul>";
		var i = start;
		result += parseitem(input.substring(start,end),0);
		result += "</ul>";
		headreader = nextnewline(input,end)+1;
		result += expression(input);
	}else if(headreader + 2 < input.length && input.substring(headreader,headreader+3) =='---' && input.charAt(headreader - 1) == '\n'){
		var list = [0,0,0,0];
		while(headreader < input.length){
			if(input[headreader] == '-')list[0]++;
			else if(input[headreader] == ' ')list[1]++;
			else if(input[headreader] == '+')list[2]++;
			else if(input[headreader] == '\n')break;
			else if(input.substring(headreader,headreader+2) == '>>')list[3]++;
			headreader++;
		}
		var width = list[0]*2;
		width = (width>100)?100:width;
		var height = list[2];
		var dash = "solid",align = "left";
		align = (list[3]>0)?"right":"left";
		if(list[1]>0)dash = "dashed";
		if(list[2]==0)result += "<hr/>";
		else
			result += "<hr align="+align +" style=\"color:#4F4F4F;width:"+width+"%;border:"+height+"px "+dash+";\"/>";
		headreader++;
		result += expression(input);
	}else if(headreader+1 < input.length && input.substring(headreader,headreader+2) == '>>' && input.charAt(headreader-1) == '\n'){
		var next = nextnewline(input,headreader);
		result += "<span style=\"float:right\">";
		var oldhead = headreader;
		headreader = 0;
		result += expression(input.substring(oldhead+2,next));
		result += "</span>";
		headreader = next;
		result += expression(input);
	}else if(headreader+2 <input.length && input.substring(headreader,headreader+3) == '(c)' && input.charAt(headreader - 1) != '\\'){
		result += "&copy;";
		headreader += 3;
		result += expression(input);
	}else if(headreader+1 < input.length && input.substring(headreader,headreader+2)=='%%' && input.charAt(headreader-1) =='\n'){
		var next = nextsubstring(input,headreader+2,'\n');
		var option = "center";
		if(input.charAt(headreader+2) == 'l')option = "left";
		headreader = next+1;
		result += "<table style=\"border-collapse:collapse;border:1px solid;\">";
		result += parsetable(input,option);
		result += "</table>";
		headreader = nextnewline(input,headreader)+1;
		result += expression(input);
	}else if(input.charAt(headreader) == '#' && input.charAt(headreader-1) != "\\"){
		result += "<strong>";
		var next = nextsubstring(input,headreader+1,'#'),now = headreader;
		headreader = 0;
		result += expression(input.substring(now+1,next));
		result += "</strong>";
		headreader = next+1;
		result += expression(input);
	}else if(headreader + 1 < input.length && input.substring(headreader,headreader+2) == '> ' && input.charAt(headreader-1) == '\n'){
		var next = nextsubstring(input,headreader+2,"\n\n"),pre = headreader+2;
		result += "<blockquote style=\"font-size:17;font-family:Consolas, KaiTi;margin-bottom:10px;padding:10px;background-color:#eee\">";
		headreader = 0;
		result += expression(input.substring(pre,next));
		result += "</blockquote>";
		headreader = next + 2;
		result += expression(input);
	}
	else{
		result += input.substring(headreader,headreader+1);
		headreader++;
		result += expression(input);
	}
	return result;
}
function parseitem(input,start){
	var result = "";
	if(start >= input.length)return result;
	if(start + 2 < input.length && input.substring(start,start+3) == '+==' && input.charAt(start-1) == '\n'){
		result += "<ul>";
		result += parseitem(input,nextnewline(input,start+3)+1);
	}else if(start + 2 < input.length && input.substring(start,start+3) == '-==' && input.charAt(start-1) == '\n'){
		result += "</ul>";
		result += parseitem(input,nextnewline(input,nextnewline(input,start+3)+1));
	}else{
		var nextline = nextnewline(input,start);
		if(start == nextline){
			return parseitem(input,nextline+1);
		}
		result += "<li>";
		headreader = 0;
		result += expression(input.substring(start,nextline));
		result += "</li>";
		result += parseitem(input,nextline+1);
	}
	return result;
}
function parsetable(input,option)
{
	var result = "";
	var i = headreader+3;
	var trstyle = "1px solid";
	while(input.charAt(headreader) == '\n')headreader++;
	if(headreader >=input.length ||(input.charAt(headreader) == '%' && input.charAt(headreader-1) == '\n'))return result;
	if(headreader+2 < input.length && input.substring(headreader,headreader+3) == '---' && input.charAt(headreader-1) == '\n'){
		while(i < input.length){
			if(input.charAt(i) == '+')trstyle = "1px double";
			else if(input.charAt(i) == '*')trstyle = "2px solid";
			else if(input.charAt(i) == '\n')break;
			i++;
		}
		i++;
	}
	result += "<tr style=\"border-top:"+trstyle+"\">";
	var nexttd = i;
	while(i < input.length){
		if(input.charAt(i) == '\n' && input.charAt(i+1) == '\n')break;
		var next = i;
		if(input.charAt(i) == '['){
			var next = nextsubstring(input,i+1,"]")+1;
			var list = input.substring(i+1,next-1).split('*');
			if(list.length == 1){
				result += "<td align="+option+" colspan=\""+list[0]+"\"; style=\"border-left:1px solid;\">"
			}else{
				result += "<td align="+option+" colspan=\""+list[0]+"\"rowspan=\""+list[1]+"\" style=\"border-left:1px solid;\">"
			}
		}else{
			result += "<td align="+option+" style=\"border-left:1px solid\">";
		}
		headreader = 0;
		nexttd = nextsubstring(input,next," &");
		result += expression(input.substring(next,nexttd));
		result += "</td>";
		i = nexttd+2;
	}
	headreader = i+1;
	result += "</tr>";
	result += parsetable(input,option);
	return result;
}
function closeitem(input,start)
{
	var i = start;
	while(i < input.length){
		if(i + 2 < input.length && input.substring(i,i+3) == '===' && input.charAt(i-1) == '\n')return i;
		i++;
	}
	return i;
}
function nextnewline(input,start)
{
	var nextline = start;
	while(nextline < input.length){
		if(input.charAt(nextline) == '\n')return nextline;
		nextline++;
	}
	return nextline;
}

function parseimg(input)
{
	var i = headreader;
	while(i < input.length){
		if(input.charAt(i) == ' ' || input.charAt(i) == '\t' || input.charAt(i) == '\n')break;
		i++;
	}
	var result = "";
	result += "<img src=\""+input.substring(headreader,i)+"\" onload=\"javascript:if(this.width > 700){this.width=700}\"/>";
	headreader = i;
	return result;
}

function highlight(input)
{
	var i = headreader;
	while(i < input.length){
		if(input.substring(i,i+1) == '`')break;
		i++;
	}
	if(i >= input.length)return "<span style=\"color:red\">Expect '`' here!</span>";
	else{
		var result = "<code class=\"highlight\">";
		result += input.substring(headreader,i);
		headreader = i+1;
		result += "</code>";
		return result;
	}
}

function codeblock(input,codetype)
{
	var result = "<div class=\"codeblock\"><pre><code id="+id+++" name=\"codeblock\">";
	var next = nextsubstring(input,headreader,"\n##");
	var tem = formate(input.substring(headreader,next),codetype);
	//var tem = formate(codeinblocks(input),codetype);
	result += tem;
	result += "</code></pre></div>"
	if(input.charAt(next+3) == '\n'){
		headreader = next+4;
	}else
		headreader = next+3;
	return result;
}

function codeinblocks(input)
{
	if(headreader > input.length){
		return "<span style=\"color:red\">Expect \"##\" here!</span>";
	}
	var result = "";
	if(headreader+2 < input.length && input.substring(headreader,headreader+3) == "\n##" && input.charAt(headreader -1) != '\\'){
		if(input.charAt(headreader+3) == '\n'){
			headreader += 4;
		}else
			headreader += 3;
	}else{
		result += input.substring(headreader,headreader+1);
		headreader++;
		result += codeinblocks(input);
	}
	return result;
}

function parseoption(input,incode)
{
	var result = "";
	var i = headreader;
	var pre = headreader
	while(i < input.length){
		if(input.substring(i,i+1) == ']' && input.charAt(i-1) != '\\')break;
		i++;
	}
	if(i >= input.length)result += "[";
	else if(input.charAt(i+1) == '~'){
		headreader = i+2;
		result += parsefont(input,input.substring(pre,i),incode);
	}else if(incode == 1 && i+5 < input.length && input.substring(i+1,i+5) == "http")
		result += "<span style =\"color:red\">No expected \"[option]http\" here!</spam>";
	else if(i+5 < input.length && input.substring(i+1,i+5) == "http"){
		headreader = i+1;
		result += parsehttp(input,input.substring(pre,i));
	}else{
		result += "[";
	}
	return result;
}

function parsehttp(input,option)
{
	var i = headreader;
	var result = "";
	while(i < input.length){
		if(input.charAt(i) == " "||input.charAt(i) == "\t"||input.charAt(i) == "\n"||input.charAt(i) == "\r")break;
		i++;
	}
	if(option == ""){
		result += "<a style=\"text-decoration:none\" href =\""+input.substring(headreader,i)+"\">"+input.substring(headreader,i)+"</a>";
	}else{
		result += "<a style=\"text-decoration:none\" href =\""+input.substring(headreader,i)+"\">"+option+"</a>";
	}
	if(input.charAt(i) == " "||input.substring(headreader,i) == "\t")headreader = i+1;
	else
		headreader = i;
	return result;
}

function CheckColor(colo)
{
	if(colo == "red"||colo == "blue"||colo == "green"||colo == "gray"||colo == "yellow"||colo == "purple"||colo == "darkblue")return true;
	return false;
}

function parsefont(input,option,incode)
{
	if(headreader >= input.length){
		return "<span style=\"color:red\">Error! Expect '~' here!</span>";
	}
	var result = "";
	if(input.substring(headreader,headreader+1) == '~' && input.charAt(headreader -1) != '\\'){
		headreader++;
		return result;
	}else if(CheckColor(option)){
		result += "<span style=\"color:"+option+"\">";
		result += parsefont(input,"",incode);
		result += "</span>";
	}else if(option != "" && option.substring(0,1) == "#"){
		result += "<font size=\""+option.substring(1)+"\">";
		result += parsefont(input,"",incode);
		result += "</font>";
	}else if(option != "" && option.substring(0,1) == "b"){
		result += "<b>";
		result += parsefont(input,"",incode);
		result += "</b>"
	}else if(option != "" && option.substring(0,1) == "u"){
		result += "<span style=\"text-decoration:underline;\">";
		result += parsefont(input,"",incode);
		result += "</span>";
	}else if(option != ""){
		result += "<i>";
		result += parsefont(input,"",incode);
		result += "</i>";
	}else if(incode == 0 && input.substring(headreader,headreader+1) == '\n'){
		result += "<br>";
		headreader++;
		result += parsefont(input,"",incode);
	}else if(input.substring(headreader,headreader+1) == '[' && input.charAt(headreader - 1) != '\\'){
		headreader++;
		result += parseoption(input,incode);
		result += parsefont(input,"",incode);
	}else if(incode == 0 && headreader+4 < input.length && input.substring(headreader,headreader+4) == "http"){
		result += parsehttp(input,"");
		result += parsefont(input,"",incode);
	}else if(incode == 0 && input.substring(headreader,headreader+1)=='`' && input.charAt(headreader -1) != '\\'){
		headreader++;
		result += highlight(input);
		result += parsefont(input,"",incode);
	}else{
		result += input.substring(headreader,headreader+1);
		headreader++;
		result += parsefont(input,"",incode);
	}
	return result;
}

function trim(input)
{
	var result = "";
	var i = 0;
	while(i < input.length){
		if(input.charAt(i) == '\\' && i+1 < input.length && (input.charAt(i+1) == '*' || input.charAt(i+1) == '`' || input.charAt(i+1) == '~' || input.charAt(i+1) == '#' || input.charAt(i+1) == '+' || input.charAt(i+1) == '(' || input.charAt(i+1) == '_' ||input.charAt(i+1) == '['||input.charAt(i+1) == '&')){
			result += input.substring(i+1,i+2);
			i += 2;
			continue;
		}
		result += input.substring(i,i+1);
		i++;
	}
	return result;
}

function compile(input)
{
	var temp="";
	state = 0;
	headreader = 0;
	id = 0;
	state_underline = 0
	titleid = 0;
	temp += input.split("<").join("&lt;");
	var result = expression(temp);
	return trim(result);
}
function getIDNum()
{
	return id;
}
