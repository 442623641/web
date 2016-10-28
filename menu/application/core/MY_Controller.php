<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require APPPATH . '/libraries/REST_Controller.php';
#--------------------------------------------------------------
# 公共类
# -------------------------------------------------------------
# zhangshuai created
# -------------------------------------------------------------
# 2015-7-21
#--------------------------------------------------------------
class API_Controller extends REST_Controller {
	public function __construct() {
		parent::__construct();
		$this->methods['user_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['user_post']['limit'] = 100; // 100 requests per hour per user/key
        //$this->methods['user_delete']['limit'] = 50; // 50 requests per hour per user/key
		// $this->load->library('Extension');
	}
	/**
	 * POST请求接口
	 * @param  [type] $class     接口类名
	 * @param  [type] $function  接口方法名
	 * @param  [type] $parameter 传递post参数
	 * @param  [type] $type      请求类型HTTP, HTTPS
	 * @return [type]            请求结果
	 */
	public function request($class, $function, $parameter, $type=CURLPROTO_HTTP) {
		$retArr = array('fail' => 0);
		$url =config_item("api_url") . '/' .$class . '/' . $function;	
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
			$responses = curl_exec($ch);
			curl_close($ch);
			$responses=explode("\n\n\n",$responses);
			$retArr= json_decode(count($responses)>1?$responses[1]:$responses[0],true);
		} catch (Exception $e) {
			$retArr['status'] = FALSE;
			$retArr['message'] = $e->getMessage();
			//$retArr = json_encode($retArr);
		}
		return $retArr;
	}
	/**
	 * 返回错误
	 */
	public  function retFailed($msg,$code=406){
		 $this->response(array(
                    'status' => FALSE,
                    'message' => $msg
                ), $code); 
	}
	/**
	 * 返回错误和准确数据
	 */
	public  function retFailedwithData($msg,$data=null,$code=406){
		 $this->response(array_merge(array(
                    'status' => FALSE,
                    'message' => $msg	 			
                ), $data), $code); 
	}
	/**
	 * 返回成功
	 */
	public  function retAcess($data,$code=200){
		$this->response($data, $code);
	}
	/**
	 * 订单号
	 */
	protected function generalSeek($buyType){
		return date("YmdHis").str_pad((int)$this->post('userID'),6,0,STR_PAD_LEFT).$this->post('lotteryID').$buyType;//.$this->userID;
	}
	public function params_valid($params,$args) {

		foreach ($params as $key => $val){
			//echo $key.'ddd'.$val.'ddd'.$_REQUEST[$key].'</br>';
			if(!isset($args[$key])||$args[$key]===''){
				 $this->response(array(
                    'status' => FALSE,
                    'message' => '不能为空'
                ), $code); 
			}
		}
		return;
	}
}
