<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%@ page import="java.net.InetAddress,java.net.UnknownHostException" %>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />

		<!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
		Remove this if you use the .htaccess -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

		<title>中国象棋</title>
		<meta name="description" content="" />
		<meta name="author" content="Administrator" />

		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="stylesheet" type="text/css" href="css/public.css">
		<link rel="stylesheet" type="text/css" href="css/chinesechess.css">

		<script type="text/javascript" src="js/jquery-1.4.2.js"></script>
		<script type="text/javascript" src="js/canvaswrapper.js"></script>
		<script type="text/javascript" src="js/canvascomponent.js"></script>
		<script type="text/javascript" src="js/component.js"></script>
		<script type="text/javascript" src="js/ResourceManager.js"></script>
		<script type="text/javascript" src="js/loadres.js"></script>
		<script type="text/javascript" src="js/chinesechess.js"></script>
		<script type="text/javascript" src="js/canvaschesspanel.js"></script>
	</head>

	<body>
		<div>
			<header></header>
			<nav></nav>
			
			<div id="info-loading"></div>
			<section id="players">
				<ul>									
				</ul>
				<p id='piece_type'></p>
				<p id='tips'></p>
			</section>	
			<section id="chess_frame">				
			</section>
			
			<%
				{
				InetAddress addr;
				String SERVER_IP="", PROXY_SERVER_IP="";
				try {
					addr = InetAddress.getLocalHost();
					PROXY_SERVER_IP = addr.getHostAddress().toString();
					SERVER_IP = PROXY_SERVER_IP;
					String hostname = addr.getHostName().toString();//获得本机名称	
					System.out.println("PROXY_SERVER_IP:\t" + PROXY_SERVER_IP + "\tPROXY_NAME:\t" + hostname);
				} catch (UnknownHostException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				%>				
				<input type="hidden" id="PROXY_SERVER_IP" value= "<%=PROXY_SERVER_IP%>">
				<%}%>

			<script type="text/javascript">
				DownloadControler.doDownload();						
			</script>

			<footer>				
			</footer>
		</div>
	</body>
</html>
