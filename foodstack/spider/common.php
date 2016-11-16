<?php
function exec_sql($sql, $flag)
{
	$server_address = 'localhost';
	$username='root';
	$password='12345687';
	$db_name = 'csc';
	$dsn = "mysql:host=" . $server_address . ";dbname=" . $db_name;
	try {
		$db = new PDO($dsn, $username, $password);
		if ($flag == 1) { //表示查询
			$query_order = $db->query($sql);
			//echo "$sql\n";
			$arr = $query_order->fetchAll();
			return $arr;
		} else if ($flag == 2) { //表示执行
			$db->exec($sql);
			return '';
		}
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}

}
function decodeUnicode($str)
{
	return preg_replace_callback('/\\\\u([0-9a-f]{4})/i',
			create_function(
					'$matches',
					'return mb_convert_encoding(pack("H*", $matches[1]), "UTF-8", "UCS-2BE");'
			),
			$str);
}
function request($url,$parameter, $type=CURLPROTO_HTTP){
	$retArr = array('fail' => 0);
	try {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		//echo $url;
		//var_dump($parameter);
		//exit();
		curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTP);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $parameter);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
		$responses =curl_exec($ch);
		curl_close($ch);
		$retArr=json_decode($responses,true);
	} catch (Exception $e) {
		$retArr['fail'] = 3015;
		$retArr['mess'] = $e->getMessage();
		//$retArr = json_encode($retArr);
	}
	return $retArr;
}
//退�&#65533;

function do_post_request($url, $data, $optional_headers = null)

{

	$params = array('http' => array(

			'method' => 'get',

			'content' => $data

	));

	if ($optional_headers !== null) {

		$params['http']['header'] = $optional_headers;

	}

	$ctx = stream_context_create($params);

	$fp = @fopen($url, 'rb', false, $ctx);

	if (!$fp) {

		throw new Exception("Problem with $url, $php_errormsg");

	}

	$response = @stream_get_contents($fp);

	//    if ($response === false) {

	//        throw new Exception("Problem reading data from $url, $php_errormsg");

	//    }

	return $response;

}
	/**
	 * 写日志，方便查错
	 * 注意：服务器需要开通fopen配置
	 * @param $suject 要写入日志里的主�&#65533;
	 * @param $text 要写入日志里的文本内�&#65533; 默认值：空付;
	 * @param $path 要写入日志里的文本路�&#65533; 默认值：log\detail;
	 */
	 function dlog($suject='',$text='',$path='log/douguo/douguo.log') {
		if(!strstr($path,'.')>0){
			$path=$path.'/'.date("Ymd").".log";
		}
		$fp = fopen($path,"a");
		flock($fp, LOCK_EX) ;
		fwrite($fp,date("Y-m-d H:m:s")." [".$suject."]:{".$text."}\n");
		flock($fp, LOCK_UN);
		fclose($fp);
	}