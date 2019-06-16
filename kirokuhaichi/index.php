<html>
<head>
    <meta charset="utf-8">
    <title>CSVを配置するよ</title>
</head>
<body>
	<form action="" method="post">
		やりたいこと:	<input type="radio" name="what" value="yearRanking">年度ランキング
					<input type="radio" name="what" value="competition" checked>記録会・対校戦
					<input type="radio" name="what" value="allMembersPb">全員のPB集
					<input type="radio" name="what" value="Tokyo-TechBest">工大記録
					<input type="radio" name="what" value="top50">歴代50決
		<br>
		性別:<input type="radio" name="gender" value="男子" checked>男子
			<input type="radio" name="gender" value="女子">女子
		<br>
		個人名や大会名、年度:<input required type="text" name="name" value="">
		<br>
		※大会名は<br>2018_第49回農工戦<br>のように入力しないと文句言われるぜ
		<br><br>
		<select name="event" id="event">
			<?php
			$events = array('60m','60m_追参','100m','100m_追参','200m','200m_追参','300m','400m','800m','1500m','3000m','5000m',
				'10000m','10マイル','10km','20km','30km','40km','ハーフマラソン','フルマラソン','100km',
				'100mH','100mH_追参','110mH','110mH_追参','400mH','3000mSC','5000mW','10000mW','10kmW','20kmW',
				'4×100mR','4×200mR','スウェーデンR','4×400mR',
				'走高跳','走幅跳','走幅跳_追参','三段跳','三段跳_追参','棒高跳','砲丸投','円盤投','ハンマー投','やり投','十種競技','七種競技');
				foreach ($events as $event) {
					print('<option value="'.$event.'">'.$event.'</option>');
				}
			?>
		</select>
		<br>
        <input type="submit" value="csv配置！">
        <br>
        <input type="hidden" name="mode" value="download">
    </form>

    <?php
		// this code written by utf-8
		if ( $_POST['mode'] === "download"){

			$name = $_POST['name'];
			$event = $_POST['event'];
			$what = $_POST['what'].".php";

			if ($_POST['gender'] == "男子") {
				$gender = 0;
			}else{
				$gender = 1;
			}

			$db_host = "ホストネームを入力";
			$db_user = "ユーザーネームを入力";
			$db_passwd = "パスワードを入力";
			$db_name = "データベースネームを入力";

			$db = mysqli_connect($db_host,$db_user,$db_passwd,$db_name);
			if(!$db){
				echo "Error: Unable to connect to MySQL." . PHP_EOL;
			    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
			    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
			    exit;
			}
			$name = mysqli_real_escape_string($db, $name);
			mysqli_set_charset($db,'utf8');

			if ($what == "yearRanking.php") {

				$dl_name = $name. "_".  $_POST['gender']. "_". $event. ".csv";
				require($what);#各処理ごとにphpファイルを指定

			}elseif ($what == "competition.php") {

				if(preg_match("/^[0-9]{4}_/", $name)){
					$dl_name = $name. ".csv";
					require($what);#各処理ごとにphpファイルを指定
				}else{
					print("その大会名の形式は何かおかしいぜ<br>半角数字4文字_大会名称<br>と入力頼む 	大会名称に関しては何のチェックもしてないからちゃんとした入力を頼むぞ！<br>".$name."<br>と入力してるぜ");
				}
							
			}elseif ($what = "top50.php") {

				$dl_name = $_POST['gender']. "_". $event. ".csv";
				require($what);

			}
			mysqli_close($db);
			exit();
		}

		if (isset($_POST['make'])){
			$dir = $_POST['make'];
			if (mkdir($dir, 0777, true)) {
				print("新しくディレクトリ;".$dir."を作成しといたぜ");
			}else{
				print("ディレクトリ".$dir."の作成に失敗したぜ<br>なんでそうなったかは不明だぞ");
			}
		}
	?>
</body>
</html>