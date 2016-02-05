﻿<!DOCTYPE html>

<html>
	<head>
		<meta charset="UTF-8">
		<meta name="keywords" content="art, depth, perception, art with depth, moving, images, pixelart, depth perception, depthperception">
		<meta name="description" content="A collection of art that shows depth when moved over with a mouse">
		<meta name="author" content="Damjan Roškar">
		<title>Depth Perception - Art with depth... literally</title>
		<link href='http://fonts.googleapis.com/css?family=VT323' rel='stylesheet' type='text/css'>
		<style>
			body{ background-color:#000000; }
			h1{ color:#EFDFAF; text-align:center; font-family:"VT323",cursive; font-size:42px; }
			hr{ border-color:#DFBF5F; }
			.tableText { width:341px; text-align:center; color:#EFDFAF; font-family:"VT323",cursive; font-size:24px; }
			.personals { color:#DFBF5F; }
			a:link { color:#EFDFAF; }
			a:visited { color:#EFDFAF; }
			a{ text-decoration:none; }
			.navtd{ width:100px; }
			#personalUrl { color:#DFBF5F; color:#DFBF5F; border-bottom:2px solid #DFBF5F; }
			#navigationTable{ margin-left:auto; margin-right: auto; text-align: center; color:#EFDFAF; font-family:"VT323",cursive; font-size:24px; }
			#footer{ color:#EFDFAF; }
			#canvasDiv{ width:1394px; margin-left:auto; margin-right:auto; }
			#AL{ margin-top:auto; margin-bottom:auto; margin-right:20px; }
			#AR{ margin-top:auto; margin-bottom:auto; margin-left:20px; }
			#shareDiv { text-align:center; margin-top:50px; color:#EFDFAF; font-family:"VT323",cursive; font-size:24px; }
			#textBoxShare { background-color:#000000; border: 1px solid #EFDFAF; width:240px; color:#EFDFAF; border-radius:3px; text-align:center; }
		</style>
	</head>

	<body>
		<a style="text-decoration:none" href="http://www.damjanroskar.com/depth-perception/" ><h1>Depth Perception</h1></a>
		
		<table id="navigationTable">
			<tr>
				<td class="navtd"><a href="submit.html" >Submit art</a></td>
				<td class="navtd"><a href="about.html" >About</a></td>
				<td class="navtd"><a href="contact.html" >Contact</a></td>
			</tr>
		</table>
		
		<br>
			
		<div id="canvasDiv">
			<table>
				<tr>
					<td><img id="AL" src="images/arrowL.jpg" alt="ArrowLeft"></td>
					<td><canvas id="MyCanvas" width="1024" height="576" onmousemove="mouseOv(event)" ></canvas></td>
					<td><img id="AR" src="images/arrowR.jpg" alt="ArrowRight"></td>
				</tr>
				<tr>
					<td></td>
					
					<td>
						<table id="innerTable">
							<tr >
								<td class="tableText" >Title: <span id="title" class="personals" ></span></td>
								<td class="tableText" >Author: <span id="author" class="personals" ></span></td>
								<td class="tableText" >Website: <a id="personalUrl" class="link" ><span  id="website" class="personals" ></span></a></td>
							</tr>
						</table>
					</td>
					
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td><div id="shareDiv" >Share this image: <input id="textBoxShare" type="text" onfocus="this.select()" onMouseUp="return false" value="" ></div></td>
					<td></td>
				</tr>
			</table>
		</div>
		<div id="footer" >

			<br>
			<br>
			<hr>
			by <a href="http://www.damjanroskar.com">D. Roskar</a>
		</div>
		
		<?php
			$data;
			$count = 0;
			$pieces;
			$loadCount = 0;
			$loaded = false;
			$file = fopen("data.txt", "r") or exit ("Unable to open file!");
			while(!feof($file))
			{
				$words[$count] = explode(";", fgets($file));
				$count++;
			}
			fclose($file);
		?>
		
		<script>
			var c = document.getElementById("MyCanvas");
			var ctx = c.getContext("2d");
			
			var page = 0;
			var pageFlipped = true;
			var maxPages = "<?php echo $count; ?>";
			
			var imgAL = new Image();
			
			var img1 = new Image();
			var img2 = new Image();
			var img3 = new Image();
			var img4 = new Image();
			var img5 = new Image();
			var img6 = new Image();
			var img7 = new Image();
			var img8 = new Image();
			var img9 = new Image();
			var img10 = new Image();
			
			var layer1X;
			var layer1Y;
			
			var layer2X;
			var layer2Y;
			
			var layer3X;
			var layer3Y;
			
			var layer4X;
			var layer4Y;
			
			var layer5X;
			var layer5Y;
			
			var layer6X;
			var layer6Y;
			
			var layer7X;
			var layer7Y;
			
			var layer8X;
			var layer8Y;
			
			var layer9X;
			var layer9Y;
			
			var layer10X;
			var layer10Y;
			
			var frontImage;
			var offsetX;
			var offsetY;

			var touchedFirst = false;
			var touched = false;
			
			var textBShare = document.getElementById("textBoxShare");
			
			
			//data managment
			function dataSet(title, author, website, url, layer1, layer2, layer3, layer4, layer5, layer6, layer7, layer8, layer9, layer10, limit, frontImageIndex){
				this.title = title;
				this.author = author;
				this.website = website;
				this.url = url;
				this.layer1 = layer1;	//factor - ideal size - max move distance: 0.025	1050x591	12.8x7.2
				this.layer2 = layer2;	//factor - ideal size - max move distance: 0.05		1076x605	25.6x14.4
				this.layer3 = layer3;	//factor - ideal size - max move distance: 0.075	1101x620	38.4x21.6
				this.layer4 = layer4;	//factor - ideal size - max move distance: 0.1		1127x634	51.2x28.8
				this.layer5 = layer5;	//factor - ideal size - max move distance: 0.125	1152x648	64x36
				this.layer6 = layer6;	//factor - ideal size - max move distance: 0.15		1178x663	76.8x43.2
				this.layer7 = layer7;	//factor - ideal size - max move distance: 0.175	1204x677	89.6x50.4
				this.layer8 = layer8;	//factor - ideal size - max move distance: 0.2		1229x692	102.4x57.6
				this.layer9 = layer9;	//factor - ideal size - max move distance: 0.225	1255x706	115.2x64.8
				this.layer10 = layer10;	//factor - ideal size - max move distance: 0.25		1280x720	128x72
				this.limit = limit;
				this.frontImageIndex = frontImageIndex;
			}
			
			var dataSetList = [
				<?php for($i=0;$i<$count;$i++){ ?>
				new dataSet("<?php echo $words[$i][0]; ?>", "<?php echo $words[$i][1]; ?>", "<?php echo $words[$i][2]; ?>", "<?php echo $words[$i][3]; ?>", "<?php echo $words[$i][4]; ?>", "<?php echo $words[$i][5]; ?>", "<?php echo $words[$i][6]; ?>", "<?php echo $words[$i][7]; ?>", "<?php echo $words[$i][8]; ?>", "<?php echo $words[$i][9]; ?>", "<?php echo $words[$i][10]; ?>", "<?php echo $words[$i][11]; ?>", "<?php echo $words[$i][12]; ?>", "<?php echo $words[$i][13]; ?>", "<?php echo $words[$i][14]; ?>", "<?php echo $words[$i][15]; ?>"),
				<?php } ?>
			];
			
			//check URL for page info
			var pageRead = getUrlVars()["p"];
			if(pageRead != undefined){
				if(pageRead > "<?php echo $count - 1; ?>"){
					pageRead = "<?php echo $count - 1; ?>";
				}
			
				if(pageRead < 0){
					pageRead = 0;
				}
				page = pageRead;
			}
			else{
				page = "<?php echo --$count; ?>";
			}
			
			
			document.getElementById("AL").onclick = function(){
				page++;
				page = page%dataSetList.length;
				
				init();
			}
			
			document.getElementById("AR").onclick = function(){
				page--;
				if(page < 0){
					page = page%dataSetList.length + dataSetList.length;
				}
				else{
					page = page%dataSetList.length;
				}
				
				init();
			}
			
			// -----------------------------------------------Page Turned---------------------------------------------------------------------------------
			
			init();

			function init(){
				textBShare.value = "http://www.damjanroskar.com/depth-perception/?p=" + page;
			
				touched = false;
			
				//clear canvas
				ctx.clearRect(0, 0, c.width, c.height);
				
				//get data
				getData();
				
				//display info
				showInfo();
			}
			
			//mouseover
			function mouseOv(e){
				touchedFirst = true;
				touched = true;
				
				//get mouse position relative to canvas
				var position = getPosition(c);
				var mouseX = e.clientX - position.x;
				var mouseY = e.clientY - position.y;
				
				
				//convert to central coord sys
				mouseX -= 512;
				mouseY -= 288;
				
				layer1X = (-mouseX * 0.025) + 512;
				layer1Y = (-mouseY * 0.025) + 288;
				
				layer2X = (-mouseX * 0.05) + 512;
				layer2Y = (-mouseY * 0.05) + 288;
				
				layer3X = (-mouseX * 0.075) + 512;
				layer3Y = (-mouseY * 0.075) + 288;
				
				layer4X = (-mouseX * 0.1) + 512;
				layer4Y = (-mouseY * 0.1) + 288;
				
				layer5X = (-mouseX * 0.125) + 512;
				layer5Y = (-mouseY * 0.125) + 288;
				
				layer6X = (-mouseX * 0.15) + 512;
				layer6Y = (-mouseY * 0.15) + 288;
				
				layer7X = (-mouseX * 0.175) + 512;
				layer7Y = (-mouseY * 0.175) + 288;
				
				layer8X = (-mouseX * 0.2) + 512;
				layer8Y = (-mouseY * 0.2) + 288;
				
				layer9X = (-mouseX * 0.225) + 512;
				layer9Y = (-mouseY * 0.225) + 288;
				
				layer10X = (-mouseX * 0.25) + 512;
				layer10Y = (-mouseY * 0.25) + 288;
			}
			
			//draw image function, drawing from center
			function drawImageC(image, Xcoord, Ycoord){
				ctx.drawImage(image, Xcoord - (image.width/2), Ycoord - (image.height/2));
			}
			
			//get canvas position
			function getPosition(element) {
				var xPosition = 0;
				var yPosition = 0;
			  
				while(element) {
					xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
					yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
					element = element.offsetParent;
				}
				return { x: xPosition, y: yPosition };
			}
			
			
			//get data for page
			function getData(){
			
				img1.src = dataSetList[page].layer1;
				img2.src = dataSetList[page].layer2;
				img3.src = dataSetList[page].layer3;
				img4.src = dataSetList[page].layer4;
				img5.src = dataSetList[page].layer5;
				img6.src = dataSetList[page].layer6;
				img7.src = dataSetList[page].layer7;
				img8.src = dataSetList[page].layer8;
				img9.src = dataSetList[page].layer9;
				img10.src = dataSetList[page].layer10;
				
				
				img1.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img2.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img3.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img4.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img5.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img6.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img7.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img8.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img9.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				img10.onload = function(){
					<?php
						$loadCount++;
						if($loadCount == 10){
							$loaded = true;
						}
					?>
				}
				
				//does the data require limiting rectangles?
				if(dataSetList[page].limit == "1"){
					
					//get the front image and the offset
					switch(parseInt(dataSetList[page].frontImageIndex)){
						
						case 2:
							frontImage = img2;
							offsetX = 25.6;
							offsetY = 14.4;
							break;
							
						case 3:
							frontImage = img3;
							offsetX = 38.4;
							offsetY = 21.6;
							break;
							
						case 4:
							frontImage = img4;
							offsetX = 51.2;
							offsetY = 28.8;
							break;
							
						case 5:
							frontImage = img5;
							offsetX = 64;
							offsetY = 36;
							break;
							
						case 6:
							frontImage = img6;
							offsetX = 12.8;
							offsetY = 7.2;
							break;
							
						case 7:
							frontImage = img7;
							offsetX = 89.6;
							offsetY = 50.4;
							break;
							
						case 8:
							frontImage = img8;
							offsetX = 102.4;
							offsetY = 57.6;
							break;
							
						case 9:
							frontImage = img9;
							offsetX = 115.2;
							offsetY = 64.8;
							break;
							
						case 10:
							frontImage = img10;
							offsetX = 128;
							offsetY = 72;
							break;
							
						default:
							frontImage = img10;
							offsetX = 128;
							offsetY = 72;
					}
				}
			}
			
			//display information on website
			function showInfo(){
				document.getElementById("title").innerHTML = dataSetList[page].title;
				document.getElementById("author").innerHTML = dataSetList[page].author;
				document.getElementById("website").innerHTML = dataSetList[page].website;
				document.getElementById("personalUrl").href = dataSetList[page].url;
			}
			
			
			
			<?php if($loaded == true){ ?>
			//loop
			setInterval((function (co) {
				return function () {
				
					
					//clear canvas
					ctx.clearRect(0, 0, c.width, c.height);
					
					if(touched == false){
						//images init
						drawImageC(img1, 512, 288);
						drawImageC(img2, 512, 288);
						drawImageC(img3, 512, 288);
						drawImageC(img4, 512, 288);
						drawImageC(img5, 512, 288);
						drawImageC(img6, 512, 288);
						drawImageC(img7, 512, 288);
						drawImageC(img8, 512, 288);
						drawImageC(img9, 512, 288);
						drawImageC(img10, 512, 288);
					}
					
					if(touchedFirst == false){
						//display instruction
						//rectangle base
						ctx.fillStyle = "#000000";
						ctx.fillRect(387, 195, 250, 40);
						
						//text
						ctx.textAlign = "center";
						ctx.fillStyle = "#EFDFAF";
						ctx.font = "24px Times New Roman";
						ctx.fillText("your mouse goes here", 512, 220);
					}
					
					//draw images relative to mouse position and translation factor
					drawImageC(img1, layer1X, layer1Y);
					drawImageC(img2, layer2X, layer2Y);
					drawImageC(img3, layer3X, layer3Y);
					drawImageC(img4, layer4X, layer4Y);
					drawImageC(img5, layer5X, layer5Y);
					drawImageC(img6, layer6X, layer6Y);
					drawImageC(img7, layer7X, layer7Y);
					drawImageC(img8, layer8X, layer8Y);
					drawImageC(img9, layer9X, layer9Y);
					drawImageC(img10, layer10X, layer10Y);
					
					
					//draw limiting rectangles for last layer (if the layer is too small)
					if(dataSetList[page].limit == "1"){
						ctx.fillStyle="#000000";
						
						//left
						ctx.fillRect(0, 0, ((1024-frontImage.width)/2) + offsetX, 576);
						
						//right
						ctx.fillRect(1024, 0, -((1024-frontImage.width)/2) - offsetX, 576);
						
						//top
						ctx.fillRect(0, 0, 1024, ((576-frontImage.height)/2) + offsetY);
						
						//bottom
						ctx.fillRect(0, 576, 1024, -((576-frontImage.height)/2) - offsetY);
					}
					
				};
				
			})(ctx), 10);
			<?php } ?>
			
			function getUrlVars() {
				var vars = {};
				var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
					vars[key] = value;
				});
				return vars;
			}
			
			function shareImage(){
				alert("image shared");
			}
		
			//Analytics
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-42690593-1']);
			_gaq.push(['_trackPageview']);

			(function() {
				var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
				ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();
		</script>
	</body>
</html>