<?php
require_once('common.php');
$count=-1;
$last=getMaxId();
$values=array('stack'=>[],'stackextension'=>[]);
$start=$last+1;
$interval=1000;
if(@$_REQUEST['start']){
	$start=$_REQUEST['start'];
}
if(@$_REQUEST['end']){
	$end=$_REQUEST['end'];
}else{
	$end=$start+$interval;
}
$baseUrl='http://api.douguo.net/recipe/detail/';
$header=['version: 607.2'];
try {
	$mh = curl_multi_init();
	for($i=$start;$i<=$end;$i++){
		$conn[$i] = curl_init($baseUrl.$i);
		//curl_setopt($conn[$i], CURLOPT_POST, 1);
		curl_setopt($conn[$i], CURLOPT_PROTOCOLS, CURLPROTO_HTTP);
		curl_setopt($conn[$i], CURLOPT_HTTPHEADER, $header);
		//curl_setopt($conn[$i], CURLOPT_HEADER ,0);
		curl_setopt($conn[$i], CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($conn[$i], CURLOPT_CONNECTTIMEOUT,60);
		curl_setopt($conn[$i], CURLOPT_RETURNTRANSFER,1);  // 设置不将爬取代码写到浏览器，而是转化为字符串
		curl_multi_add_handle ($mh,$conn[$i]);
	}
	do {
		curl_multi_exec($mh,$active);
	} while ($active);
	 
	for($i=$start;$i<=$end;$i++){
		try {
			$data = curl_multi_getcontent($conn[$i]); // 获得爬取的代码字符串
			if(!$data){
				continue;
			}
			
			$retArr=json_decode($data,true);
			if($retArr['state']=='fail'||!$retArr['result']['recipe']['cook_id']){
				//fwrite($st,'id='.$i.'没有记录\r\n');
				continue;
			}
			insertFood($values,$retArr['result']['recipe'],$end,$count);
		} catch (Exception $e) {
			dlog('error','['.$baseUrl.$i.']'.$e->getMessage());
		}
	} // 获得数据变量，并写入文件
	
	for($i=$start;$i<=$end;$i++){
		curl_multi_remove_handle($mh,$conn[$i]);
		curl_close($conn[$i]);
	}
	curl_multi_close($mh);
	//fclose($st);
	print 'stack startID :'.$start.'</br>';
	print 'stack endID :'.getMaxId().'</br>';
	print 'access '.$count.'</br>';
	dlog('stack startID',$start);
	dlog('stack endID',getMaxId());
	dlog('access',$count);
	exit;
}
catch (Exception $e){
	dlog('error','['.$baseUrl.$i.']'.$e->getMessage());
	exit();
}
function insertFood(&$values,$item,$max,&$count){
	//var_dump($item);
	//exit;
	//`ID`,`title`,`pic`,`thump` ,`photo` ,`tags` t,`comment` t,`step` ,`time` ,`class`,`clicks` ,`material` ,`minor`,`creatTime`
	//,`recommended`,`act_des` ,`author` ,`favo_count`,`vc`
	if(@count($values['stack'])>15||(int)$item['cook_id']==$max){
		//$sql="INSERT INTO food_dg(`ID`,`title`,`pic`,`thump` ,`photo` ,`tips`,`tags`,`comment`,`step` ,`time` ,`class`,`clicks` ,`material` ,`minor`,`creatTime`,`recommended`,`act_des` ,`author` ,`favo_count`,`vc`) values ";
		$sqlStack="INSERT INTO stack (ID,`title`,`pic` , `clicks` ,`favo_count`,`vc`,`createTime` , `comment` ,`tags`,`keys`) values ";
		$sqlStackextension="INSERT INTO stackextension (`stackID`,`thump`,`photo` ,`step`,`time` ,`class` ,`minor`,`material` ,`recommended` ,`act_des` ,`author` ,`tips`) values ";
		//'57', '鲜虾豆腐', 'http://cp1.douguo.net/upload/recipe/7/2/f/170_72b32a1f754ba1c09b3695e0cb6cde7f.jpg', '38104', '1001', '49553', '[{\"title\":\"嫩豆腐\",\"note\":\"80克\"},{\"title\":\"虾仁\",\"note\":\"15克\",\"mpid\":\"1167\"}]', '0', '', '[]', '嫩豆腐80克虾仁15克1167鲜虾豆腐');
		$strStack= $sqlStack.join($values['stack'],',');
		exec_sql($strStack,2);
		$strStackextension= $sqlStackextension.join($values['stackextension'],',');
		exec_sql($strStackextension,2);	
		//fwrite($st,$str.'\r\n');
		$values=array('stack'=>[],'stackextension'=>[]);
		//exit;
		return;
	}
	//satck
	$keys=exTractText(exTractText(preg_replace("/[^\x{4e00}-\x{9fa5}]/iu",'',$item['title']),$item['tags'],'text'),$item['major'],'title');
	$ary1=array($item['cook_id'],
			"'".$item['title']."'",
			"'".$item['image']."'",
			$item['clicks'],
			$item['favo_counts'],
			$item['vc'],
			"'".$item['create_time']."'",
			"'".$item['cookstory']."'",
			"'".json_encode($item['tags'],JSON_UNESCAPED_UNICODE)."'",
			"'".$keys."'"
			);
	$values['stack'][]="(".join($ary1,',').")";
	//sactk extension
	//`stackID`,`thump`,`photo` ,`step`,`time` ,`class` ,`minor`,`creatTime` ,`recommended` ,`act_des` ,`author` ,`tips`
	$ary2=array($item['cook_id'],
			"'".$item['thumb_path']."'",
			"'".$item['photo_path']."'",
			"'".trim(json_encode($item['cookstep'],JSON_UNESCAPED_UNICODE),JSON_UNESCAPED_UNICODE)."'",
			"'".$item['cook_time']."'",
			"'".$item['cook_difficulty']."'",
			"'".trim(json_encode($item['minor'],JSON_UNESCAPED_UNICODE),JSON_UNESCAPED_UNICODE)."'",
			"'".trim(json_encode($item['major'],JSON_UNESCAPED_UNICODE),JSON_UNESCAPED_UNICODE)."'",
			$item['recommended'],
			"'".$item['act_des']."'",
			"'".$item['author']."'",
			"'".$item['tips']."'"
	);
	$count+=1;
	$values['stackextension'][]="(".join($ary2,',').")";
}
function getMaxId(){
	$sql="select max(ID) as last from stack";
	$query=exec_sql($sql,1);
	return $query[0]['last'];
}
function exTractText($title,$array,$field){
	$re=$title;
	if(count($array)<1){
		return $re;
	}
	for($i=0;$i<count($array);$i++){
		strstr($title, $array[$i][$field])||$re.=trim($array[$i][$field]);
	}
	return $re;
}
?>
