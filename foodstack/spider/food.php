<?php
set_time_limit(0);
require_once('common.php');
$markets=getMarkets(); 
$countAll=0;
foreach ($markets as $item){
	$param['m']=$item['name'];
	$foods=request("http://app.95e.com/vm/getPrice2.aspx",$param);
	if(!$foods['errorCode']||$foods['data']){
		//$foods=json_decode(output($foods),true);
		if(isset($foods['data']['updateTime'])){
			if($foods['data']['updateTime']<=$item['lastDate']){
				dlog('最新数据'.$item['lastDate'].'，今天没有更新');
				echo '最新数据'.$item['lastDate'].'，今天没有更新';
				exit;
			}
		}
		$foods['data']['marketID']=$item['marketID'];
		$re=insertFood($foods['data']);
		$countAll+=$re;
		dlog($item['name'].$foods['data']['updateTime'].':'.$re);
	}
	else{
		dlog('access error');
	}
}
dlog('access '.$countAll.'recorde');
echo 'access '.$countAll.'recorde';
exit;
$sql1="delete food where createDate <date_sub(current_date(),interval 30 day)";
exec_sql($sql1.join($values,','),2);
//echo  decodeUnicode(json_encode($markets));
function insertFood($data){
	$sql="INSERT INTO food(marketID,name,minPrice,maxPrice,avgPrice,link,createDate,type,average) values ";
	$count=0;
	$price=$data['price'];
	if(!$price){
		return $count;
	}
	for ($i=0;$i<count($price);$i++) { 
		$foods=$price[$i]['foods'];
		if(!$foods){
			return $count;
		}
		$marketID=$data['marketID'];
		$foodType=getFoodType($price[$i]['name']);
		$values=array();
		foreach ($foods as $item){
			//"foods":[{"name":"白萝卜","minPrice":"0.65","avgPrice":"0.73","maxPrice":"0.80","link":784,"pinyin":"B"}
			//var_dump($item);
			$item['link']=isset($item['link'])?$item['link']:0;
			$item['name']=isset($item['name'])?$item['name']:'';
			$item['minPrice']=isset($item['minPrice'])?$item['minPrice']:0;
			$item['maxPrice']=isset($item['maxPrice'])?$item['maxPrice']:0;
			$item['avgPrice']=isset($item['avgPrice'])?$item['avgPrice']:0;
			//$item['pinyin']=isset($item['pinyin'])?$item['pinyin']:'';
			$ary=array($marketID,"'".$item['name']."'",floatval($item['minPrice']),
				floatval($item['maxPrice']),floatval($item['avgPrice']),$item['link'],"'".$data['updateTime']."'",$foodType,(int)$item['average']);
			$values[]="(".join($ary,',').")";
		}
		//echo $sql.join($values,',');
		//exit;
		if($values&&count($values)){
			exec_sql($sql.join($values,','),2);
		}
		//echo '</br>type:'.$data[$i]['name'].'</br>foods:'.count($foods).'</br>values:'.count($values).'</br>';
		$count +=count($values);
		unset($values);
	}
	return $count;
	//foods
}
function getFoodType($type){
	switch($type){
		case '蔬菜':
			return 1;
		case '水果':
			return 2;
		case '生鲜':
			return 3;
		case '水产':
			return 4;
		default:
			return 5;
	}
}
function getMarkets(){
	$sql="select b.marketID,max(b.CreateDate) as lastDate,a.`name` from market a INNER JOIN food b on a.ID=b.marketID GROUP BY b.marketID";
	//$sql="select ID as marketID ,name,'2016-03-27' as lastDate from market";
	$query=exec_sql($sql,1);
	return $query;
}
//

