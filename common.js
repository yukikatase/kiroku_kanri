//このコードはShift-JISで保存してください
//Field種目の"等"も付けちゃいます
function adjustRecord(data) {
	for(let i = 1; i < data.length; i++){
		let kindOfRecord = changeRecord[eventToKind[data[i][EVENT_NUM]]];
		if(kindOfRecord <= 1){//記録が秒 ミリ秒やm cmなど二つの単位の場合

			if(data[i][RECORD_CS].length == 1){//記録の一番小さい単位が一桁の場合0を前に追加
				data[i][RECORD_CS] = "0" + data[i][RECORD_CS];
			}

			if(data[i][ELECTRIC] == 0 && kindOfRecord == 0){//手動のとき用
				data[i][RECORD_CS] = data[i][RECORD_CS].slice(0, 1);
			}
			
			if(data[i][RECORD_M] != 0){//400mなどで記録が一分を超えた時の特別措置
				data[i][RECORD_S] = String(Number(data[i][RECORD_S]) + Number(data[i][RECORD_M]*60));
			}

			data[i][RECORD_H] = data[i][RECORD_S] + kiroku[kindOfRecord][0] + data[i][RECORD_CS];


			if(kindOfRecord == 1){//Field種目ならRankに等をつける
				data[i][RANK_NUM] = data[i][RANK_NUM] + "等";
			}else{
				data[i][RANK_NUM] = data[i][RANK_NUM] + "着";
			}

		}else if(kindOfRecord >= 2 && kindOfRecord <= 3){//記録が分 秒 ミリ秒や時 分 秒など三つの単位の場合

			if(data[i][2 + RECORD_CS - kindOfRecord].length == 1){//記録の秒が一桁の場合0を前に追加
				data[i][2 + RECORD_CS - kindOfRecord] = "0" + data[i][2 + RECORD_CS - kindOfRecord];			
			}

			if(data[i][2 + RECORD_S - kindOfRecord].length == 1){//記録の分が一桁の場合0を前に追加
				data[i][2 + RECORD_S - kindOfRecord] = "0" + data[i][2 + RECORD_S - kindOfRecord];
			}

			if(data[i][ELECTRIC] == 0){
				data[i][kindOfRecord + 11] = data[i][kindOfRecord + 11].slice(0, 1);
			}
			
			data[i][RECORD_H] = data[i][13 - kindOfRecord] + kiroku[kindOfRecord][0] + 
				data[i][14 - kindOfRecord] + kiroku[kindOfRecord][1] + data[i][15 - kindOfRecord];
			data[i][RANK_NUM] = data[i][RANK_NUM] + "着"

		}else if(kindOfRecord == 4){//10kmの場合

			if(data[i][RECORD_S].length == 1){//記録の秒が一桁の場合0を前に追加
				data[i][RECORD_S] = "0" + data[i][RECORD_S];
			}

			if(data[i][RECORD_H] != 0){//記録が1時間を超えた時の特別措置

				if(data[i][RECORD_M].length == 1){//記録の分が一桁の場合0を前に追加
					data[i][RECORD_M] = "0" + data[i][RECORD_M];
				}

				data[i][RECORD_H] = data[i][RECORD_H] + ":" +data[i][RECORD_M] + "\'" + data[i][RECORD_S];
			}else{
				data[i][RECORD_H] = data[i][RECORD_M] + "\'" + data[i][RECORD_S];
			}

			data[i][RANK_NUM] = data[i][RANK_NUM] + "着";
		}
	}
	return data;
}

//風速が+の場合、dataの風速の前にに"+"を連結
//風速が一桁の場合、dataの風速の後ろに"0"を追加
function adjustWind(wind) {
	if(wind[0] != "-"){//風速が-ではないとき+記号を文字列の先頭に追加
		wind = "+"  + wind;
	}
	if(wind.length == 2){//風速の数字が一桁のとき(+1mなど)文字列の後ろに.0を追加		
		wind = wind + ".0";
	}
	return wind;
}

function setEventTitle(data) {	
	for(let i = 1; i < data.length; i++){
		//競技名に女子を連結
		if(data[i][GENDER_NUM] == 1){
			data[i][EVENT_NUM] = "女子" + data[i][EVENT_NUM];
		}else{
			data[i][EVENT_NUM] = "男子" + data[i][EVENT_NUM];
		}
		//記録会以外は競技名にラウンドを書き込む
		if(data[i][ROUND_NUM] != "記録会"){
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

//ここから定数
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
	"ハーフマラソン":3,
	"フルマラソン": 3,
	"5000mW":   2,
	"10000mW":  2,
	"20kmW":    3,
	"100mH":    0,
	"110mH": 	0,
	"400mH": 	1,
	"3000mSC": 	2,
	"走高跳": 	4,
	"走幅跳": 	5,
	"三段跳": 	5,
	"棒高跳": 4,
	"砲丸投": 	4,
	"円盤投": 	4,
	"やり投": 	4,
	"ハンマー投":	4,
	"十種競技": 	6,
	"4×100mR": 	1,
	"4×400mR": 	2,
	"駅伝": 		6
}

const changeRecord ={
	0: 0,//短距離
	1: 0,//400m(風なしで秒表記)
	2: 2,//中距離
	3: 3,//長距離(時間)
	4: 1,//風なしfield
	5: 1,//風ありfield
	6: 4//10km
}

//そのうち上の二つの配列をひとまとまりにしたい

const wind_events = ["60m", "100m", "100mH", "110mH", "200m", "走幅跳", "三段跳"];

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