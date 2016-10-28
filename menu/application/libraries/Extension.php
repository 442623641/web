<?php
class Extension extends CI_Output {
	#输出
	static function export($msg,$code=false) {
		header('http/1.1 406, NOT ACCEPTABLE');
		$ret['status']=false;
		$ret['message']=$msg;
		$data = self::decodeUnicode(json_encode($ret));
		echo $data;
        exit;
	}
	/// <summary>
	/// 组合
	/// </summary>
	/// <param name="N"></param>
	/// <param name="R"></param>
	/// <returns></returns>
	static function combine($m, $n)
	{
		if ($m < $n || $n < 0) return 0;
		return (int)(self::fac($m, $n) / self::fac($n, $n));
	}

	static function decodeUnicode($str)
	{
	    return preg_replace_callback('/\\\\u([0-9a-f]{4})/i',
	        create_function(
	            '$matches',
	            'return mb_convert_encoding(pack("H*", $matches[1]), "UTF-8", "UCS-2BE");'
	        ),
	        $str);
	}
	/**
	 * POST请求接口
	 * @param  [type] $class     接口类名
	 * @param  [type] $function  接口方法名
	 * @param  [type] $parameter 传递post参数
	 * @param  [type] $type      请求类型HTTP, HTTPS
	 * @return [type]            请求结果
	 */
	static function params_valid($params,$args) {

		foreach ($params as $key => $val){
			//echo $key.'ddd'.$val.'ddd'.$_REQUEST[$key].'</br>';
			if(!isset($args[$key])||$args[$key]===''){
				self::export($val.'不能为空');
			}
		}
		return;
	}

	function encrypt($data, $key) {
		$prep_code = serialize($data);
		$block = mcrypt_get_block_size('des', 'ecb');
		if (($pad = $block - (strlen($prep_code) % $block)) < $block) {
			$prep_code .= str_repeat(chr($pad), $pad);
		}
		$encrypt = mcrypt_encrypt(MCRYPT_DES, $key, $prep_code, MCRYPT_MODE_ECB);
		return base64_encode($encrypt);
	}

	function decrypt($str, $key) {
		$str = base64_decode($str);
		$str = mcrypt_decrypt(MCRYPT_DES, $key, $str, MCRYPT_MODE_ECB);
		$block = mcrypt_get_block_size('des', 'ecb');
		$pad = ord($str[($len = strlen($str)) - 1]);
		if ($pad && $pad < $block && preg_match('/' . chr($pad) . '{' . $pad . '}$/', $str)) {
			$str = substr($str, 0, strlen($str) - $pad);
		}
		return unserialize($str);
	}
}