<?php 
	$gradient['canvas'] = '180deg, rgb(4, 12, 6), rgb(8, 25, 12), rgb(16, 40, 20), rgb(8, 25, 12), rgb(4, 12, 6)';
	$width['canvas'] = 320;
	$height['canvas'] = 240;
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Robot Riot</title>
		<meta name="viewport" content="target-densitydpi=device-dpi; width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;">
		<meta encoding="utf-8">
		<script src="jquery.min.js" language="javascript"></script>
		<script src="vout.js" language="javascript"></script>
		<script src="vector.js" language="javascript"></script>
		<script src="polygon.js" language="javascript"></script>
		<script src="sensor.js" language="javascript"></script>
		<script src="robot.js" language="javascript"></script>
		<script src="robots.js" language="javascript"></script>
		<style>
			* {
				font-family:				sans-serif;
				font-size:					10px;				
			}
			body, html {
				height: 					100%; 
				width:						100%;
				margin: 					0;
				padding: 					0;
				overflow: 					hidden;
			}
			
			input:checked{				
				border: 					1px solid #0f0;
			}
			
			input[type=number]{
				border-radius:				3px 3px 3px 3px;
				-moz-border-radius:			3px 3px 3px 3px;
				-o-border-radius:			3px 3px 3px 3px;
				-webkit-border-radius:		3px 3px 3px 3px;
				font-weight:				800;
				background:					#421;
				color:						#f84;
				border:						1px inset #222;
				box-sizing:					border-box;
				display: 					inline-block;
				width:						48px;
				height: 					18px;
				line-height:				12px;
				font-size:					8px;
				text-align: 				center;
				margin-left: 				4px;
				float:						right;
			}
			h2 {
				font-size:					12px;
				font-weight:				800;
				margin: 					0;
				padding-left:				4px;
			}
			hr {
				opacity:					0.35;
				margin:						0;
				width:						100%;
			}
			input{
				outline:					none;
				height:						12px;
			}
			nav:hover {
				opacity:					1.0;
				left:						0;
			}
			nav {
				cursor:						pointer;
				color: 						#fc0;
				border-radius:				5px 5px 5px 5px;
				-moz-border-radius:			5px 5px 5px 5px;
				-o-border-radius:			5px 5px 5px 5px;
				-webkit-border-radius:		5px 5px 5px 5px;
				box-shadow:					0px 2px 8px rgba(16,16,16, 64);
				opacity:					0;
				height:						100%;
				left:						-120px;
				display: 					inline-block;
				position: 					fixed;
				clear: 						none;
				width: 						128px;
				padding-left: 				2px;				
				background: 				#333;				
				vertical-align:				middle;
				transition:					opacity 500ms linear, left 400ms linear;
			}
			canvas {
				image-rendering: 			pixelated;
				width:						100%;
				height:						100%;
				background:					linear-gradient(<?=$gradient['canvas']?>); 
				background:					-moz-linear-gradient(<?=$gradient['canvas']?>); 
				background:					-o-linear-gradient(<?=$gradient['canvas']?>); 
				background:					-webkit-linear-gradient(<?=$gradient['canvas']?>); 
			}
		</style>
	<head>
	<body>
		<nav></nav>
		<canvas id="vout" width="<?=$width['canvas']?>" height="<?=$height['canvas']?>"></canvas>
	</body>
	
</html>