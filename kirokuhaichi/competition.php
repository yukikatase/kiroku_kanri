<?php
	// this code written by utf-8
	$event = explode(_, $name);
	// event[0];西暦, event[1];大会名称
	if (!file_exists("../competition/". $event[0])) {
		print($event[0]."年度の記録会・対校戦のディレクトリがまだないよ<br>新しくその年度のディレクトリを作成する？<br>あなたが入力した大会名は<br>".$name."<br>です");
		print('<form action="" method="post"><input type="submit" value="作成する"><br><input type="hidden" name="make" value="../competition/'.$event[0].'"></form>');

	}else{
		$sql = "SELECT * FROM kiroku_table
		INNER JOIN event_table ON kiroku_table.event = event_table.event
		INNER JOIN round_table ON kiroku_table.round = round_table.round
		where competition_name = '".$name."' order by event_table.id, round_table.id, kiroku_table.DNS, kiroku_table.heat_num, kiroku_table.rank";
		$result = mysqli_query($db, $sql);
		$file = fopen("../competition/". $event[0] ."/". $dl_name, "wb");


		while($field = mysqli_fetch_field($result)){#field記入
			fwrite($file, $field->name.",");
		}
		
		while ($row = mysqli_fetch_row($result)){#$jが行数 $kがfield数
			fwrite($file, "\n");

			for ($i=0; $i < mysqli_num_fields($result); $i++) { 
				fwrite($file, $row[$i].",");	
			}
		}
		fclose($file);
		print("../competition/".$event[0]."に".$dl_name."を追加しといたぜ！");
	}
?>