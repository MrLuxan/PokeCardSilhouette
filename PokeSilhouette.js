var PokeSilhouette = (function() {

  let library = {};

  let cardWidth = 122.5;
  let cardHeight = 171;
  let lastSearch = {};

  library.backgroundData = {};
  library.maskData = {};
  library.cardArray = [];

  library.SelectionCallBack;


  let applyXOffset = function(){return document.getElementById("xHalfCard").checked};
  let applyYOffset = function(){return document.getElementById("yHalfCard").checked};
  let cardImageOutput = function(){return document.getElementById("findCards");};
  let showForground = function(){return document.getElementById("showForeground").checked};
  let showSilhouette = function(){return document.getElementById("showSilhouette").checked};

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
  
  library.DrawCardArray = function()
  {
      let xStart = (applyXOffset() ? - cardWidth/2 : 0);
      let yStart = (applyYOffset() ? - cardHeight/2 : 0);

      let c = document.createElement('canvas');
      c.width = 800;
      c.height = 800;

      let ctx = c.getContext("2d");
      for(let y = 0; y < library.cardArray.length; y++)
          for(let x = 0; x < library.cardArray[y].length; x++)
              ctx.drawImage(library.cardArray[y][x], xStart + x*cardWidth, yStart + y*cardHeight,cardWidth,cardHeight);    

      return c;
  }

  library.DrawSilhouette = function()
  {
    let c = document.createElement('canvas');
    c.width = 800;
    c.height = 800;

    let ctx=c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
 
    let cards = PokeSilhouette.DrawCardArray();

    if(showSilhouette())
    {
      ctx.drawImage(library.maskData.image, 0, 0, 600 , 530);
      ctx.globalCompositeOperation = 'source-in';
    }
    ctx.drawImage(cards, 0 , 0);

    return c;
  }

  library.DoDraw = function()
  {
    let c = document.createElement('canvas');
    c.width = 800;
    c.height = 800;

    let ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
 
    let img = PokeSilhouette.DrawSilhouette();

    if(showForground())
      ctx.drawImage(library.backgroundData.image , 0 ,0 );

    ctx.drawImage(img, 150 , 150);

    return c;
  }

	library.FindCards = function(cardName)
  {
		  GetCardData(cardName,function(data){        

        let outputDiv = cardImageOutput();
        outputDiv.innerHTML = "";

        data.cards.forEach(function(element) 
        {
          lastSearch[element.id] = element;
          let image = document.createElement("img");
          image.setAttribute("src", element.imageUrl);
          image.dataset.cardId = element.id;
          element.image = image;
          image.onclick = function(){library.SelectionCallBack(element);};
          outputDiv.appendChild(image);
        });
      });
  }

  return library;
  
})();
