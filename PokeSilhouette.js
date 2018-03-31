var PokeSilhouette = (function() {

  let cardWidth = 122.5;
  let cardHeight = 171;

	let library = {};

  library.cardArray = [];

	function GetCardData(cardName,callBack)
  {
  	var xhttp = new XMLHttpRequest();
  	xhttp.onreadystatechange = function()
    {
    	if (this.readyState == 4 && this.status == 200)
      {
      	callBack(JSON.parse(this.responseText));       
    	}
  	};
  	xhttp.open('GET', 'https://api.pokemontcg.io/v1/cards?name='+ cardName, true);
  	xhttp.send();
  }
  
  library.DrawCardArray = function(offSetX, offSetY)
  {
      let xStart = (offSetX ? - cardWidth/2 : 0);
      let yStart = (offSetY ? - cardHeight/2 : 0);

      let c=document.createElement('canvas');
      c.width = 800;
      c.height = 800;

      let ctx=c.getContext("2d");
      for(let y = 0; y < library.cardArray.length; y++)
          for(let x = 0; x < library.cardArray[y].length; x++)
              ctx.drawImage(library.cardArray[y][x], xStart + x*cardWidth, yStart + y*cardHeight,cardWidth,cardHeight);    

      return c;
  }

  library.DrawSilhouette = function(mask,offSetX, offSetY)
  {
    var c = document.createElement('canvas');
    c.width = 800;
    c.height = 800;

    var ctx=c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
 
    let img = PokeSilhouette.DrawCardArray(offSetX, offSetY);
    ctx.drawImage(mask, 0, 0, 600 , 530);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(img, 0 , 0);

    return c;
  }


	library.FindCards = function(cardName)
  {
		  GetCardData(cardName,function(data){        

        let outputDiv = document.getElementById("findCards");
        outputDiv.innerHTML = "";

        data.cards.forEach(function(element) 
        {
          console.log(element);
          let image = document.createElement("img");
          image.setAttribute("src", element.imageUrl);
          outputDiv.appendChild(image);
        });


      });
  }

  return library;
  
})();
