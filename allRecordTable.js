//このコードはShift-JISで保存してください
function allRecordTable(event_name) {
	$.get(event_name + ".csv")
		.done(function(data){
			Papa.parse(data,{
				complete: function(result){
					createRankingTable(event_name, result.data);
				}
			}
		)
	})
}

function createRankingTable(event_name, data) {
	let rows =　[];
	let th = setRecordTableHead(data);//tableheadがはいるよ
	rows.push(th);
	//競技ごとのタイムをうまいこと調整する関数
	data = adjustRecord(data);
	createRankingRows(data, rows, th.length);
	rowsToRecotdTable(rows, event_name);
}

function setRecordTableHead(data) {
	let table_head = ["順位","新","記録","名前","大会名","場所","日"];
	let table_head_wind = ["順位","新","記録","風","名前","大会名","場所","日"];
	let table_heads = [table_head, table_head_wind];
	let thNum = 0;//0:風なし 1:風あり
	for(let i = 1; i < data.length; i++){
		if(wind_events.indexOf(data[i][EVENT_NUM]) != -1){//風関係
			thNum = 1;
			data[i][WIND_NUM] = adjustWind(data[i][WIND_NUM]);			
		}
	}
	return table_heads[thNum];	
}

function createRankingRows(data, rows, thLen){
	let kiroku = 0;
	let doujuni = 1;
	let today = new Date();
	console.log(today.getFullYear());
	for(let i = 1; i < data.length; i++) {//ranking一位から表を作ってく iは行です
		let tempRow = [];//各行これで作ってく
		if(kiroku==data[i][RECORD_H]){
			tempRow.push("");//順位
			if(today.getFullYear()==data[i][DATE].slice(0,4)){
				tempRow.push("↑");
			}else{
				tempRow.push("");
			}
			tempRow.push("");
		}else{
			tempRow.push(String(i));//順位
			if(today.getFullYear()==data[i][DATE].slice(0,4)){
				tempRow.push("↑");
			}else{
				tempRow.push("");
			}
			tempRow.push(data[i][RECORD_H]);
			doujuni=String(i);
			kiroku=data[i][RECORD_H];
		}

		if(thLen == 8){//dataの中に風がある種目がある場合
			if(data[i][WIND_NUM]==-100){
				tempRow.push("不明");
			}else{
				tempRow.push(data[i][WIND_NUM]);
			}
		}
		tempRow.push(data[i][NAME_NUM]);
		tempRow.push(data[i][COMPETITION].slice(5));
		tempRow.push(data[i][PLACE]);
		tempRow.push(data[i][DATE]);
		rows.push(tempRow);	
	}
}


function rowsToRecotdTable(data, tableId){
    // 表の作成開始
    let rows=[];
    let table = document.createElement("table");
    table.style.cssText = "border-collapse: separate; font-size: 12pt";
    // 表に2次元配列の要素を格納
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

            if(i==0){// 背景色の設定
                cell.style.backgroundColor = "#4987F2"; // ヘッダ行
            }else if(i%2==0){         
                cell.style.backgroundColor = "#C2D4F2"; // 偶数行
            }else{
            	cell.style.backgroundColor = "#0";	    // 奇数行
            }
            cell.style.border = "1px solid black";
        }
    }

    if(data.length == 1){
    	rows.push(table.insertRow(-1));  // 行の追加
    	for(j = 0; j < data[0].length; j++){        
            let cell = rows[i].insertCell(-1);
            if(j==2){
	            cell.appendChild(document.createTextNode("まだ記録がありません"));
            }else{
           		cell.appendChild(document.createTextNode("-"));
            }
            cell.style.textAlign = "center";

            cell.style.backgroundColor = "#0"; // ヘッダ行以外

            cell.style.border = "1px solid black";
        }
    }
    // 指定したdiv要素に表を加える
    document.getElementById(tableId).appendChild(table);
}