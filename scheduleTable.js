//���̃R�[�h��Shift-JIS�ŕۑ����Ă�������

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
	let th = setScheduleTableHead(data);//tablehead���͂����
	//���Z���Ƃ̃^�C�������܂����ƒ�������֐�
	data = adjustRecord(data);
	data = setEventTitle(data);
	let rowspan = setRowspan(data);
	rows.push(th);
	createScheduleRows(data, rows, th.length);
	rowsToScheduleTable(rows, rowspan, tableId);
}

function setScheduleTableHead(data) {
	let table_head = ["���","�I��","�g","����","�L�^","���l"];
	let table_head_wind = ["���","�I��","�g","����","�L�^","��","���l"];
	let table_head_marason = ["���","�I��","����","�L�^","���l"];
	let table_head_ekiden = ["���", "���O", "��ԋL�^", "�����L�^", "���l"];
	let table_heads = [table_head, table_head_wind, table_head_marason, table_head_ekiden];
	let thNum = 0;
	//0:���Ȃ� 1:������ 2:�w�`
	if(data[1][EVENT_NUM].indexOf("�w�`") != -1){
		thNum = 3;
	}else if(data[1][COMPETITION].indexOf("�}���\��") != -1){
		thNum = 2;
	}else{
		for(let i = 1; i < data.length; i++){

			//���֌W
			if(wind_events.indexOf(data[i][EVENT_NUM]) != -1){
				thNum = 1;
				//���Ɋւ��钲�� �ڂ�����js�t�@�C��������
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
	for(let i = 1; i < data.length; i++) {//i�͍s�ł�
		let tempRow = [];//�e�s����ō���Ă�
		tempRow.push(data[i][EVENT_NUM]);
		tempRow.push(data[i][NAME_NUM]);

		if(thLen != 5 && data[i][EVENT_NUM].indexOf("��") == -1 && data[i][EVENT_NUM].indexOf("��") == -1 && data[i][EVENT_NUM].indexOf("��") == -1){//�}���\���ȊO�͑g���K�v
			tempRow.push(data[i][HEAT_NUM]+"�g");
		}else if(thLen != 5){
			tempRow.push('-');
		}

		if(data[i][DNS_NUM] == "1"){//DNS�̂Ƃ�
			tempRow.push("-");
			tempRow.push(data[i][REASON_NUM]);
			tempRow.push("-");

		}else{
			if(data[i][EVENT_NUM].indexOf("��") == -1 && data[i][EVENT_NUM].indexOf("��") == -1 && data[i][EVENT_NUM].indexOf("��") == -1){
				tempRow.push(data[i][RANK_NUM]);
			}else if(data[i][RANK_NUM]=="-1��"){
				tempRow.push("-");				
			}else{
				tempRow.push(data[i][RANK_NUM]);
			}
			tempRow.push(data[i][RECORD_H]);

			//data�̒��ɕ��������ڂ�����ꍇ
			if(thLen == 7){
				if(data[i][WIND_NUM] == "0"){
					tempRow.push("-");
				}else{
					tempRow.push(data[i][WIND_NUM]);
				}
			}
		}
		if(data[i][COMMENT_NUM] == "0"){//���l���Ȃ��Ƃ�
			tempRow.push("-");
		}else{
			tempRow.push(data[i][COMMENT_NUM]);
		}
		rows.push(tempRow);		
	}
}

function rowsToScheduleTable(data, rowspans, tableId){
	// �\�̍쐬�J�n
    let rows=[];
    let table = document.createElement("table");
    table.style.padding = "16px";
    table.style.cssText = "border-collapse: separate";
    // �\��2�����z��̗v�f���i�[
    let k = 0;
    let l = rowspans[k];

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

            if(j == 0 && i > 0){//��̘A��
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

            if(i==0){// �w�i�F�̐ݒ�
                cell.style.backgroundColor = "#8822FF"; // �w�b�_�s
            }else{         
                cell.style.backgroundColor = "#0"; // �w�b�_�s�ȊO
            }
            cell.style.border = "1px solid black";
        }
    }
    // �w�肵��div�v�f�ɕ\��������
    document.getElementById(tableId).appendChild(table);

}