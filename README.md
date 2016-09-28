
INTRODUCTION
=======

This is a simple interpreter which convert markup language
(like `Markdown`) to CSS/HTML code, we use it for blog and
 online forum typesetting. The interpreter is a bit different
 from `Markdown` interpreter since the implements of some
features are based on our own perspective. For example
, we add up a tag to reflect the font attribute, which we 
think is necessary for blog typesetting.

The whole project was writen in Javascript, we didn't reference any other js libraries except MathJax, since to convert the LaTeX formula to CSS/HTML code is not a trivial job. Most of our algorithm are recursive, since which is more
intuitive for top-down parse method and more robust for the
compiler.(But, one of the drawback by using recursive function in javascript is that it may cause 'Maximum call size 
exceed' issue when the input string been too long.)


PROJECT STRUCTURE
=======

The project has four main parts, as follow:

1. compile.js //This is the kernel of our interpreter

2. codeformate.js //This js implements code highlights

3. completion.js //This js implements tag completion

4. API.js //The interface of our interpreter


The data flow of our interpreter are as follow:

1. Get source text from HTML textarea and sent it to cimpiler

2. The compiler parse the text, and add HTML/CSS tags to the
   semantic blocks it has matched. If the compiler match a 
   `codeblock`, it will call the `formate` function in codeformate.js and get the highlighted code back. When the parsing completed, the compiler will return the HTML code as 
   a string.

3. The function in API.js then will using `innerHTML` attribute to write our result HTML code to the target place of
    the HTML page.

To test the program, just open the testhtml.html in chrome or
firfox, we do not support ie since the `innerHTML` attribute
of the elements in ie are READ ONLY. You can test at ([here](http://128.171.61.25/blog/))

LICENCE
=====

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


CONTACT
=====

If you are interested in this project and want to contribute to it, 
please fork it on github.

Author: Wu Changlong

E-mail:changlong1993@gmail.com


