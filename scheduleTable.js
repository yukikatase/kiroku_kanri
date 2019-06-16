//このコードはShift-JISで保存してください

function scheduleTable(event_name) {
	$.get(event_name + ".csv")
		.done(function(data){
			Papa.parse(data,{
				complete: function(result){
					createScheduleTable(result.data, event_name);
				}
			}
		)
	})
}

function createScheduleTable(data, tableId) {
	let rows = [];
	let th = setScheduleTableHead(data);//tableheadがはいるよ
	//競技ごとのタイムをうまいこと調整する関数
	data = adjustRecord(data);
	data = setEventTitle(data);
	let rowspan = setRowspan(data);
	rows.push(th);
	createScheduleRows(data, rows, th.length);
	rowsToScheduleTable(rows, rowspan, tableId);
}

function setScheduleTableHead(data) {
	let table_head = ["種目","選手","組","順位","記録","備考"];
	let table_head_wind = ["種目","選手","組","順位","記録","風","備考"];
	let table_head_marason = ["種目","選手","順位","記録","備考"];
	let table_head_ekiden = ["区間", "名前", "区間記録", "総合記録", "備考"];
	let table_heads = [table_head, table_head_wind, table_head_marason, table_head_ekiden];
	let thNum = 0;
	//0:風なし 1:風あり 2:駅伝
	if(data[1][EVENT_NUM].indexOf("駅伝") != -1){
		thNum = 3;
	}else if(data[1][COMPETITION].indexOf("マラソン") != -1){
		thNum = 2;
	}else{
		for(let i = 1; i < data.length; i++){

			//風関係
			if(wind_events.indexOf(data[i][EVENT_NUM]) != -1){
				thNum = 1;
				//風に関する調整 詳しくはjsファイルを見て
				data[i][WIND_NUM] = adjustWind(data[i][WIND_NUM]);			
			}
		}
	}
	return table_heads[thNum];
}

function setRowspan(data){
	let rowspan = [];
	let tmpRowspan = 1;
	for(let i = 2; i < data.length; i++){
		if(data[i - 1][EVENT_NUM] == data[i][EVENT_NUM]){
			tmpRowspan++;
		}else{
			rowspan.push(tmpRowspan);
			tmpRowspan = 1;
		}
	}
	rowspan.push(tmpRowspan);
	return rowspan;
}

function createScheduleRows(data, rows ,thLen) {
	for(let i = 1; i < data.length; i++) {//iは行です
		let tempRow = [];//各行これで作ってく
		tempRow.push(data[i][EVENT_NUM]);
		tempRow.push(data[i][NAME_NUM]);

		if(thLen != 5 && data[i][EVENT_NUM].indexOf("跳") == -1 && data[i][EVENT_NUM].indexOf("投") == -1 && data[i][EVENT_NUM].indexOf("種") == -1){//マラソン以外は組が必要
			tempRow.push(data[i][HEAT_NUM]+"組");
		}else if(thLen != 5){
			tempRow.push('-');
		}

		if(data[i][DNS_NUM] == "1"){//DNSのとき
			tempRow.push("-");
			tempRow.push(data[i][REASON_NUM]);
			tempRow.push("-");

		}else{
			if(data[i][EVENT_NUM].indexOf("跳") == -1 && data[i][EVENT_NUM].indexOf("投") == -1 && data[i][EVENT_NUM].indexOf("種") == -1){
				tempRow.push(data[i][RANK_NUM]);
			}else if(data[i][RANK_NUM]=="-1等"){
				tempRow.push("-");				
			}else{
				tempRow.push(data[i][RANK_NUM]);
			}
			tempRow.push(data[i][RECORD_H]);

			//dataの中に風がある種目がある場合
			if(thLen == 7){
				if(data[i][WIND_NUM] == "0"){
					tempRow.push("-");
				}else{
					tempRow.push(data[i][WIND_NUM]);
				}
			}
		}
		if(data[i][COMMENT_NUM] == "0"){//備考がないとき
			tempRow.push("-");
		}else{
			tempRow.push(data[i][COMMENT_NUM]);
		}
		rows.push(tempRow);		
	}
}

function rowsToScheduleTable(data, rowspans, tableId){
	// 表の作成開始
    let rows=[];
    let table = document.createElement("table");
    table.style.padding = "16px";
    table.style.cssText = "border-collapse: separate";
    // 表に2次元配列の要素を格納
    let k = 0;
    let l = rowspans[k];

    for(i = 0; i < data.length; i++){
        rows.push(table.insertRow(-1));  // 行の追加

        for(j = 0; j < data[0].length; j++){
            let cell = rows[i].insertCell(-1);

            if(data[i][j].indexOf("--") != -1){ //リレー
            	let split = data[i][j].split("--");

            	for(let m = 0; m < split.length; m++){
            		if(m > 0){
            			cell.appendChild(document.createElement('br'));
            		}
            		cell.appendChild(document.createTextNode(split[m]));
            	}
            }else{
            	cell.appendChild(document.createTextNode(data[i][j]));
        	}
            cell.style.textAlign = "center";

            if(j == 0 && i > 0){//列の連結
            	if(l == rowspans[k]){            	
                	cell.rowSpan = l;            	
                }else{            	
                	rows[i].deleteCell(0);            	
                }            	
                l--;
                if(l == 0){            	
                	k++;
            		l = rowspans[k];            	
                }
            }

            if(i==0){// 背景色の設定
                cell.style.backgroundColor = "#8822FF"; // ヘッダ行
            }else{         
                cell.style.backgroundColor = "#0"; // ヘッダ行以外
            }
            cell.style.border = "1px solid black";
        }
    }
    // 指定したdiv要素に表を加える
    document.getElementById(tableId).appendChild(table);

}