var PokeSilhouette = (function() {

  let library = {};

  let CardSize = {
  	Width: 245,
  	Height: 342,
  	CardScale: 0.5,
  	get Size() { return {Width : this.Width , Height : this.Height}; },
  	get DrawSize() { return {Width : this.Width * this.CardScale , Height : this.Height * this.CardScale}; }
  }

  let UI = {
  	get CardsWide(){return document.getElementById("cardsxPicker").value;},
  	get CardsHeigh(){return document.getElementById("cardsyPicker").value;},
    get CardsxOffest(){return document.getElementById("cardsxOffest").value;},
    get CardsyOffest(){return document.getElementById("cardsyOffest").value;},
  	get ShowForground(){return document.getElementById("showForeground").checked;},
  	get ShowSilhouette(){return document.getElementById("showSilhouette").checked;},
  	get OutputCanvas(){return document.getElementById("silhouetteCanvas");},
  	get SilhouetteScale(){return document.getElementById("silhouetteScale").value / 100;},
  	get ForegroundScale(){return document.getElementById("foregroundScale").value / 100;}
  }

  let lastSearch = {};
  let MouseOver = null;

  library.backgroundData = {};
  library.maskData = {};

  library.fillcard;
  library.cardArray = [];

  library.SelectionCallBack;


  let cardImageOutput = function(){return document.getElementById("findCards");};

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
  
  library.SetMouseOver = function(location)
  {
  	MouseOver = (location != null ? {x : location[0] * CardSize.DrawSize.Width, y : location[1] * CardSize.DrawSize.Height} : null);  	
  }

  function DrawCardArray()
  {
      let xStart = 0;
      let yStart = 0;

      let c = document.createElement('canvas');
      c.width = UI.OutputCanvas.width;
      c.height = UI.OutputCanvas.height;

      let ctx = c.getContext("2d");
      for(let y = 0; y < UI.CardsHeigh; y++)
      {
          for(let x = 0; x < UI.CardsWide; x++)
          {
          	let image = library.cardArray[y][x] != null ? library.cardArray[y][x] : library.fillcard;
            ctx.drawImage(image, xStart + x * CardSize.DrawSize.Width, yStart + y * CardSize.DrawSize.Height, CardSize.DrawSize.Width, CardSize.DrawSize.Height);
          }
      }

      return c;
  }

  library.DrawSilhouette = function()
  {
    let c = document.createElement('canvas');
    c.width = UI.OutputCanvas.width;
    c.height = UI.OutputCanvas.height;

    let ctx=c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
 
    let cards = DrawCardArray();

    if(UI.ShowSilhouette)
    {
      ctx.drawImage(library.maskData.image, 0, 0, library.maskData.image.width * UI.SilhouetteScale, library.maskData.image.height * UI.SilhouetteScale);
      ctx.globalCompositeOperation = 'source-in';
    }
    ctx.drawImage(cards, 0 , 0);

    return c;
  }

  library.DoDraw = function()
  {
    let c = document.createElement('canvas');
    c.width = UI.OutputCanvas.width;
    c.height = UI.OutputCanvas.height;

    let ctx = c.getContext("2d");

    let img = PokeSilhouette.DrawSilhouette();

    if(UI.ShowForground)
      ctx.drawImage(library.backgroundData.image , 0 ,0, library.backgroundData.image.width * UI.ForegroundScale, library.backgroundData.image.height * UI.ForegroundScale);

    ctx.drawImage(img, UI.CardsxOffest , UI.CardsyOffest);

    OutputImage(c);    
  }

  function OutputImage(img)
  {
  	let c = UI.OutputCanvas;
    let ctx = c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.drawImage(img, 0 , 0);

    if(MouseOver != null)
    {
		  ctx.fillStyle = '#0000005e';		
    	ctx.strokeStyle = '#ffffff';

    	ctx.fillRect((parseInt(MouseOver.x) + parseInt(UI.CardsxOffest)), MouseOver.y, CardSize.DrawSize.Width, CardSize.DrawSize.Height);
    	ctx.strokeRect((parseInt(MouseOver.x) + parseInt(UI.CardsxOffest)), MouseOver.y, CardSize.DrawSize.Width ,CardSize.DrawSize.Height);
    }
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



  for(let y = 0; y < 5; y++)
    library.cardArray.push([null,null,null,null,null,null,null]);

  return library;
  
})();
