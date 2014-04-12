var pblank=0;
var pwhite=1;
var pblack=2;

//http://www.samsoft.org.uk/reversi/strategy.htm#Positional Strategy
values = [ [99, 14, 16, 12, 12, 16, 14, 99],
           [14, 0, 4, 6, 6, 4,0, 14],
           [16, 4, 14, 10, 10, 14, 4, 16],
           [12, 6, 10, 0, 0, 10, 6, 12],
           [12, 6, 10, 0, 0, 10, 6, 12],
           [16, 4, 14, 10, 10, 14, 4, 16],
           [14,0,4, 6, 6, 4, 0, 2],
           [99, 14, 16, 12, 12, 16, 14, 99]
        ];

//baslangic matrisi olusturuluyor.
function start(){
	matrix = [ [0, 0, 0, 0, 0, 0, 0, 0],
	           [0, 0, 0, 0, 0, 0, 0, 0],
	           [0, 0, 0, 0, 0, 0, 0, 0],
	           [0, 0, 0, 1, 2, 0, 0, 0],
	           [0, 0, 0, 2, 1, 0, 0, 0],
	           [0, 0, 0, 0, 0, 0, 0, 0],
	           [0, 0, 0, 0, 0, 0, 0, 0],
	           [0, 0, 0, 0, 0, 0, 0, 0]
	           ];
    for (var i=1; i<=8; i++){
        for (var j=1; j<=8; j++){
        	setPoint(i,j, matrix[i-1][j-1]);
            }
    }
    turn=pwhite;
    findnext();
}
//siyah veya beyaz taslarin sayisi ile skor belirleniyor
function getScore(turn){
    result = 0;
    for (var i=1; i<=8; i++){
        for (var j=1; j<=8; j++){
            if (matrix[i-1][j-1] == turn){result++;}
        }
    }
    return result;
}
//noktanin hamleye uygunlugu test ediliyor
function isValid(x,y,n){
  if (x<1 || x >8 || y<1 || y> 8 || matrix[x-1][y-1]!=pblank || isCapture(x,y,n)!=true) {
      return false;
  }
  return true;
}
//hamle yapilabilecek noktalar gosteriliyor ya da gizleniyor
function showHint(){
	if(document.form.hint.checked == true){
		for(var i=1;i<=8;i++){
	        for(var j=1;j<=8;j++){
	        	if (isValid(i,j,2) && matrix[i-1][j-1]==0){
	        		eval("document.p" + i + j + ".src=\"grey.png\""); 
	            }
	        	else if(matrix[i-1][j-1]==0){
	        		eval("document.p" + i + j + ".src=\"blank.png\""); 
	        	} 
	        }
	    }
	}else if(document.form.hint.checked == false){
		for(var i=1;i<=8;i++){
	        for(var j=1;j<=8;j++){
	        	if(matrix[i-1][j-1]==0){
	        		eval("document.p" + i + j + ".src=\"blank.png\""); 
	        	} 
	        }
	    }
	}
	
}
//bir noktanýn alinip alinamayacagi biri rekursif iki fonksiyonlar belirleniyor
function isCapture(x,y,n){
    for (var a=-1;a<=1;a++){
        for(var b=-1;b<=1;b++){
            if(!(a == 0 && b == 0)){
                if(isCaptureNext(x,y,a,b,n)){
                return true;
                break;
                }
            }
        }
    }
    return false;
}

function isCaptureNext(x,y,xstep,ystep,n){
    current = n;
    next = 0;
    result = false;
    if (current == 1){ next = 2;}
    if (current == 2){ next = 1;}
    if(x+xstep+xstep < 1 || x+xstep+xstep > 8 || y+ystep+ystep < 1 || y+ystep+ystep > 8 || matrix[x+xstep-1][y+ystep-1] == pblank) { 
       return false;     
    }
    if(matrix[x+xstep-1][y+ystep-1]== next && (matrix[x+xstep+xstep-1][y+ystep+ystep-1] == current || isCaptureNext(x+xstep,y+ystep,xstep,ystep,current))) {
        return true;
    }
    return false;
}

//noktaya hamle yapilarak gerekli image guncellemesi yapiliyor
function setPoint(x,y,n){
	matrix[x-1][y-1]=n;
    pointSrc = "document.p" + x + y + ".src=";
    switch (n){
      case pwhite : 
    	  pointSrc = pointSrc + "\"white.png\"";
    	  break;
      case pblack: 
    	  pointSrc = pointSrc + "\"black.png\"";
    	  break;
      default : 
    	  pointSrc = pointSrc + "\"blank.png\"";
    }
    eval(pointSrc);

}

//hareket islemi tanimlaniyor
function move(x,y){
	n=turn;
	if(isValid(x,y,n)){
		setPoint(x,y,turn);
		for (var i=-1;i<=1;i++){
	        for(var j=-1;j<=1;j++){
	            if(!(i == 0 && j == 0)){
	                if(isCaptureNext(x,y,i,j,n)){
	                    moveNext(x,y,i,j,n);
	                }
	            }
	        }
	    }		
        findnext();
	}
}
function moveNext(x,y,xstep,ystep,n){
    current = n;
    next = 0;
    if (current==1){ next=2;}
    if (current==2){ next=1;}
    if( matrix[x+xstep-1][y+ystep-1]== next){
        setPoint(x+xstep,y+ystep,current);
        moveNext(x+xstep,y+ystep,xstep,ystep,current);
    } 
}
function moveExist(n){
    result=false;
    for(var i=1;i<=8;i++){ //++i
        for(var j=1;j<=8;j++){
                if (isValid(i,j,n)){
                    result=true;
                    return result;
                    break;
            }
        }
    }
    return result;
}
function findnext(){
    document.form.white.value=getScore(pwhite);
    document.form.black.value=getScore(pblack);
    if (turn==pwhite && moveExist(pblack)){ turn=pblack; }
    else if(turn==pblack && moveExist(pwhite)){ turn=pwhite; }
    if(!(moveExist(pwhite) || moveExist(pblack))){
        alert("Whites: " + getScore(pwhite) + "\nBlacks: " + getScore(pblack));
    }
    else {
    	maxscore=0.0;
    	maxx=0;
    	maxy=0;
//    	str="";
    	    for (var i=1;i<=8;i++){
    	        for(var j=1;j<=8;j++){
    	            currscore = getValue(i,j,pwhite);
    	            if(currscore > maxscore){
    	                maxx=i;
    	                maxy=j;
    	                maxscore = currscore;
//    	                str = str+i + ", " + j + " score: " + maxscore + '\n';
    	            }
    	        }
    	    }
    	    move(maxx,maxy,pwhite);
    }
//    alert(str);
    showHint();
}

//deger matrisi ve alinacak tas sayisi ile noktalarin degerleri tespit ediliyor
function getValue(i,j,nextturn){
    score = 0;
    if(isValid(i,j,nextturn)){
        score++;
        for (var x=-1;x<=1;x++){
            for(var y=-1;y<=1;y++){
                if(!(x == 0 && y == 0)){
                    if(isCaptureNext(i,j,x,y,nextturn)){                    	
                        score = score + getPointValue(i,j,x,y,nextturn) + values[i-1][j-1];
                    }
                }
            }
        }
    }
    return score;
}
function getPointValue(x,y,xstep,ystep,n){
    current = n;
    next = 0;
    result = 0;
    if (current == 1){ next = 2;}
    if (current == 2){ next = 1;}
    if (matrix[x+xstep-1][y+ystep-1]== next){
        result++;
        result +=  getPointValue(x+xstep,y+ystep,xstep,ystep,current);
    }
    return result;
}