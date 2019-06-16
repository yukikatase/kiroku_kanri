//���̃R�[�h��Shift-JIS�ŕۑ����Ă�������
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
	let rows =�@[];
	let th = setRecordTableHead(data);//tablehead���͂����
	rows.push(th);
	//���Z���Ƃ̃^�C�������܂����ƒ�������֐�
	data = adjustRecord(data);
	createRankingRows(data, rows, th.length);
	rowsToRecotdTable(rows, event_name);
}

function setRecordTableHead(data) {
	let table_head = ["����","�V","�L�^","���O","��","�ꏊ","��"];
	let table_head_wind = ["����","�V","�L�^","��","���O","��","�ꏊ","��"];
	let table_heads = [table_head, table_head_wind];
	let thNum = 0;//0:���Ȃ� 1:������
	for(let i = 1; i < data.length; i++){
		if(wind_events.indexOf(data[i][EVENT_NUM]) != -1){//���֌W
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
	for(let i = 1; i < data.length; i++) {//ranking��ʂ���\������Ă� i�͍s�ł�
		let tempRow = [];//�e�s����ō���Ă�
		if(kiroku==data[i][RECORD_H]){
			tempRow.push("");//����
			if(today.getFullYear()==data[i][DATE].slice(0,4)){
				tempRow.push("��");
			}else{
				tempRow.push("");
			}
			tempRow.push("");
		}else{
			tempRow.push(String(i));//����
			if(today.getFullYear()==data[i][DATE].slice(0,4)){
				tempRow.push("��");
			}else{
				tempRow.push("");
			}
			tempRow.push(data[i][RECORD_H]);
			doujuni=String(i);
			kiroku=data[i][RECORD_H];
		}

		if(thLen == 8){//data�̒��ɕ��������ڂ�����ꍇ
			if(data[i][WIND_NUM]==-100){
				tempRow.push("�s��");
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
    // �\�̍쐬�J�n
    let rows=[];
    let table = document.createElement("table");
    table.style.cssText = "border-collapse: separate; font-size: 12pt";
    // �\��2�����z��̗v�f���i�[
    for(i = 0; i < data.length; i++){
        rows.push(table.insertRow(-1));  // �s�̒ǉ�
        for(j = 0; j < data[0].length; j++){        
            let cell = rows[i].insertCell(-1);
            if(data[i][j].indexOf("--") != -1){ //�����[
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

            if(i==0){// �w�i�F�̐ݒ�
                cell.style.backgroundColor = "#4987F2"; // �w�b�_�s
            }else if(i%2==0){         
                cell.style.backgroundColor = "#C2D4F2"; // �����s
            }else{
            	cell.style.backgroundColor = "#0";	    // ��s
            }
            cell.style.border = "1px solid black";
        }
    }

    if(data.length == 1){
    	rows.push(table.insertRow(-1));  // �s�̒ǉ�
    	for(j = 0; j < data[0].length; j++){        
            let cell = rows[i].insertCell(-1);
            if(j==2){
	            cell.appendChild(document.createTextNode("�܂��L�^������܂���"));
            }else{
           		cell.appendChild(document.createTextNode("-"));
            }
            cell.style.textAlign = "center";

            cell.style.backgroundColor = "#0"; // �w�b�_�s�ȊO

            cell.style.border = "1px solid black";
        }
    }
    // �w�肵��div�v�f�ɕ\��������
    document.getElementById(tableId).appendChild(table);
}