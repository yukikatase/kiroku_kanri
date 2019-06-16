//���̃R�[�h��Shift-JIS�ŕۑ����Ă�������
//Field��ڂ�"��"���t�����Ⴂ�܂�
function adjustRecord(data) {
	for(let i = 1; i < data.length; i++){
		let kindOfRecord = changeRecord[eventToKind[data[i][EVENT_NUM]]];
		if(kindOfRecord <= 1){//�L�^���b �~���b��m cm�ȂǓ�̒P�ʂ̏ꍇ

			if(data[i][RECORD_CS].length == 1){//�L�^�̈�ԏ������P�ʂ��ꌅ�̏ꍇ0��O�ɒǉ�
				data[i][RECORD_CS] = "0" + data[i][RECORD_CS];
			}

			if(data[i][ELECTRIC] == 0 && kindOfRecord == 0){//�蓮�̂Ƃ��p
				data[i][RECORD_CS] = data[i][RECORD_CS].slice(0, 1);
			}
			
			if(data[i][RECORD_M] != 0){//400m�ȂǂŋL�^���ꕪ�𒴂������̓��ʑ[�u
				data[i][RECORD_S] = String(Number(data[i][RECORD_S]) + Number(data[i][RECORD_M]*60));
			}

			data[i][RECORD_H] = data[i][RECORD_S] + kiroku[kindOfRecord][0] + data[i][RECORD_CS];


			if(kindOfRecord == 1){//Field��ڂȂ�Rank�ɓ�������
				data[i][RANK_NUM] = data[i][RANK_NUM] + "��";
			}else{
				data[i][RANK_NUM] = data[i][RANK_NUM] + "��";
			}

		}else if(kindOfRecord >= 2 && kindOfRecord <= 3){//�L�^���� �b �~���b�⎞ �� �b�ȂǎO�̒P�ʂ̏ꍇ

			if(data[i][2 + RECORD_CS - kindOfRecord].length == 1){//�L�^�̕b���ꌅ�̏ꍇ0��O�ɒǉ�
				data[i][2 + RECORD_CS - kindOfRecord] = "0" + data[i][2 + RECORD_CS - kindOfRecord];			
			}

			if(data[i][2 + RECORD_S - kindOfRecord].length == 1){//�L�^�̕����ꌅ�̏ꍇ0��O�ɒǉ�
				data[i][2 + RECORD_S - kindOfRecord] = "0" + data[i][2 + RECORD_S - kindOfRecord];
			}

			if(data[i][ELECTRIC] == 0){
				data[i][kindOfRecord + 11] = data[i][kindOfRecord + 11].slice(0, 1);
			}
			
			data[i][RECORD_H] = data[i][13 - kindOfRecord] + kiroku[kindOfRecord][0] + 
				data[i][14 - kindOfRecord] + kiroku[kindOfRecord][1] + data[i][15 - kindOfRecord];
			data[i][RANK_NUM] = data[i][RANK_NUM] + "��"

		}else if(kindOfRecord == 4){//10km�̏ꍇ

			if(data[i][RECORD_S].length == 1){//�L�^�̕b���ꌅ�̏ꍇ0��O�ɒǉ�
				data[i][RECORD_S] = "0" + data[i][RECORD_S];
			}

			if(data[i][RECORD_H] != 0){//�L�^��1���Ԃ𒴂������̓��ʑ[�u

				if(data[i][RECORD_M].length == 1){//�L�^�̕����ꌅ�̏ꍇ0��O�ɒǉ�
					data[i][RECORD_M] = "0" + data[i][RECORD_M];
				}

				data[i][RECORD_H] = data[i][RECORD_H] + ":" +data[i][RECORD_M] + "\'" + data[i][RECORD_S];
			}else{
				data[i][RECORD_H] = data[i][RECORD_M] + "\'" + data[i][RECORD_S];
			}

			data[i][RANK_NUM] = data[i][RANK_NUM] + "��";
		}
	}
	return data;
}

//������+�̏ꍇ�Adata�̕����̑O�ɂ�"+"��A��
//�������ꌅ�̏ꍇ�Adata�̕����̌���"0"��ǉ�
function adjustWind(wind) {
	if(wind[0] != "-"){//������-�ł͂Ȃ��Ƃ�+�L���𕶎���̐擪�ɒǉ�
		wind = "+"  + wind;
	}
	if(wind.length == 2){//�����̐������ꌅ�̂Ƃ�(+1m�Ȃ�)������̌���.0��ǉ�		
		wind = wind + ".0";
	}
	return wind;
}

function setEventTitle(data) {	
	for(let i = 1; i < data.length; i++){
		//���Z���ɏ��q��A��
		if(data[i][GENDER_NUM] == 1){
			data[i][EVENT_NUM] = "���q" + data[i][EVENT_NUM];
		}else{
			data[i][EVENT_NUM] = "�j�q" + data[i][EVENT_NUM];
		}
		//�L�^��ȊO�͋��Z���Ƀ��E���h����������
		if(data[i][ROUND_NUM] != "�L�^��"){
			data[i][EVENT_NUM] = data[i][EVENT_NUM] + "-"+ data[i][ROUND_NUM];
		}
	}
	return data;
}

// function relay(data) {
// 	for (var i = 1; i < data.length; i++) {
// 		data[i][NAME_NUM] = data[i][NAME_NUM].replace(/-/g, '<br>');
// 	}
// 	return data;
// }

//��������萔
const eventToKind = {
	"60m": 		0,
	"100m": 	0,
	"200m": 	0,
	"400m": 	1,
	"800m": 	2,
	"1500m": 	2,
	"3000m": 	2,
	"5000m": 	2,
	"10000m": 	2,
	"10km": 	6,
	"20km": 	3,
	"30km": 	3,
	"40km": 	3,
	"�n�[�t�}���\��":3,
	"�t���}���\��": 3,
	"5000mW":   2,
	"10000mW":  2,
	"20kmW":    3,
	"100mH":    0,
	"110mH": 	0,
	"400mH": 	1,
	"3000mSC": 	2,
	"������": 	4,
	"������": 	5,
	"�O�i��": 	5,
	"�_����": 4,
	"�C�ۓ�": 	4,
	"�~�Փ�": 	4,
	"��蓊": 	4,
	"�n���}�[��":	4,
	"�\�틣�Z": 	6,
	"4�~100mR": 	1,
	"4�~400mR": 	2,
	"�w�`": 		6
}

const changeRecord ={
	0: 0,//�Z����
	1: 0,//400m(���Ȃ��ŕb�\�L)
	2: 2,//������
	3: 3,//������(����)
	4: 1,//���Ȃ�field
	5: 1,//������field
	6: 4//10km
}

//���̂�����̓�̔z����ЂƂ܂Ƃ܂�ɂ�����

const wind_events = ["60m", "100m", "100mH", "110mH", "200m", "������", "�O�i��"];

const kiroku = [["\""], ["m"], ["\'", "\""], [":", "\'"], ["\'"]];

const NAME_NUM = 1;
const GENDER_NUM = 2;
const COMPETITION = 3;
const PLACE = 4;
const DATE = 5;
const EVENT_NUM = 6;
const ROUND_NUM = 7;
const HEAT_NUM = 8;
const RANK_NUM = 9;
const RECORD_H = 10;
const RECORD_M = 11;
const RECORD_S = 12;
const RECORD_CS = 13;
const WIND_NUM = 14;
const ELECTRIC = 15
const DNS_NUM = 17;
const COMMENT_NUM = 19;
const REASON_NUM = 20;