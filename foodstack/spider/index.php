<?php
//require_once('common.php');$markets=request("http://app.95e.com/vm/getMarkets.aspx",[]);//echo  decodeUnicode(json_encode($markets)); if(!$markets['errorCode']||$markets['data']){
 	//echo  decodeUnicode(json_encode($markets)); 	exec_sql('delete from province;TRUNCATE TABLE province;',1); 	echo insertProvince($markets['data']); 	exec_sql('delete from market;TRUNCATE TABLE market;',1);  	foreach ($markets['data'] as $item){  		insertMarkets($item);  	}  	
 } echo '</br>access successful'; 
function insertProvince($data){	$sql="INSERT INTO province(name) values ";	$values=array();	foreach ($data as $item){		$values[]="('".$item['name']."')";	}	exec_sql($sql.join($values,','),1);	return count($values);
}function insertMarkets($data){	$sql="INSERT INTO market(provinceID,name,type,updated) values ";	$provinceID=getProvincecode($data['name']);	$values=array();	$markets=$data['markets'];	for ($i=0;$i<count($markets);$i++) { 		$values[]="(".$provinceID.",'".$markets[$i]."',".getTypecode([$data['type'][$i]]).",".(int)$data['updated'][$i].")";	}	echo $sql.join($values,',');	exec_sql($sql.join($values,','),2);	//foods}
function getTypecode($type){	switch($type){		case '批发':			return 1;		case '农贸':			return 2;		default:			return 3;	}}function getTypecode($type){	switch($type){		case '批发':			return 1;		case '农贸':			return 2;		default:			return 3;	}}function getProvincecode($province){	$sql="select * from province where name='".$province."'";    $query=exec_sql($sql,1);	return $query[0]['ID'];}
//
function getFailOrder($table,$sel,$lotteryID,$issue){
    $sql="select ".$sel." from ".$table." where lotteryID=".$lotteryID." and state in(0,8,11) and issue<".$issue;
    $query=exec_sql($sql,1);
    return $query;
}

//修改数据库表
function updateData($table,$arr1,$arr2){
    $set1=implode(',',$arr1);
    $set2=' and '.implode(' and ', $arr2);
    $sql="update ".$table." set ".$set1." where 1=1 ".$set2;

    exec_sql($sql,2);
}