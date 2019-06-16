<?php
	// this code written by utf-8
	if (!file_exists("../ranking/". $name)) {
		print($name."年度のrankingディレクトリがまだないよ<br>新しくその年度のディレクトリを作成する？");
		print('<form action="" method="post"><input type="submit" value="作成する"><br><input type="hidden" name="make" value="ranking/'.$name.'"></form>');

	}else{
		$event2 = explode("_", $event);
		// 例:100m_追参
		if(sizeof($event2)==2){
			$wind = "> 2";
		}else{
			$wind = "<= 2";
		}

		if(strpos($event2[0], "跳") || strpos($event2[0], "投") || strpos($event2[0], "種")){
			$desc = "desc";
		}else{
			$desc = "asc";
		}

		// $sql = "SELECT * FROM kiroku_table where event = '走高跳' and year(date) = '2019' and wind <= 2 and official = 1 and dns != 1 and gender = 0 order by record_h asc, record_m asc, record_s desc, record_cs desc";
		$sql = "SELECT * FROM kiroku_table where event = '".$event2[0]."' and year(date) = '".$name."' and wind ".$wind." and official = 1 and dns != 1 and gender = ".$gender." order by record_h asc, record_m asc, record_s ".$desc.", record_cs ".$desc;
		

		$file = fopen("../ranking/". $name ."/". $dl_name, "wb");

		$result = mysqli_query($db, $sql);
		$buf = NULL;

		while($field = mysqli_fetch_field($result)){
			fwrite($file, $field->name.",");
			$buf = $buf.$field->name.",";
		}

		$name_arr = array();
		$kiroku = array();

		while ($row = mysqli_fetch_row($result)) {
			if (count($name_arr) == 9) {
				array_push($kiroku, $row[10]);
				array_push($kiroku, $row[11]);
				array_push($kiroku, $row[12]);
				array_push($kiroku, $row[13]);
			}
	
			if(count($name_arr) >= 10){
				if($kiroku[0]!=$row[10] || $kiroku[1]!=$row[11] || $kiroku[2]!=$row[12] || $kiroku[3]!=$row[13]){
					break;
				}
			}

			if (in_array($row[1], $name_arr)) {
				continue;
			}else{
				fwrite($file, "\n");
				$buf = $buf."\n";
				array_push($name_arr, $row[1]);
				for ($i=0; $i < mysqli_num_fields($result); $i++) { 
					fwrite($file, $row[$i].",");
					$buf = $buf.$row[$i].",";
				}
			}
		}
		fclose($file);
		print("../ranking/".$name."に".$dl_name."を追加しといたぜ！");
	}	
?>