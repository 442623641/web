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
		//$this->load->library('Extension');
	}
	/**
	 * POST请求接口
	 * @param  [type] $class     接口类名
	 * @param  [type] $function  接口方法名
	 * @param  [type] $parameter 传递post参数
	 * @param  [type] $type      请求类型HTTP, HTTPS
	 * @return [type]            请求结果
	 */
	public function request($url) {
		try {
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTP);
			curl_setopt($ch, CURLOPT_HTTPGET, 1);
	    	//curl_setopt($ch, CURLOPT_POSTFIELDS, $parameter);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
			$responses = curl_exec($ch);
			curl_close($ch);	
			return json_decode($responses,JSON_UNESCAPED_UNICODE);
		} catch (Exception $e) {
		}
		return ;
	}
	/**
	 * 返回错误
	 */
	protected  function retFailed($msg,$code=406){
		 $this->response(array(
                    'status' => FALSE,
                    'message' => $msg
                ), $code); 
	}
	/**
	 * 返回错误和准确数据
	 */
	protected  function retFailedwithData($msg,$data=null,$code=406){
		 $this->response(array_merge(array(
                    'status' => FALSE,
                    'message' => $msg	 			
                ), $data), $code); 
	}
	/**
	 * 返回成功
	 */
	protected  function retAccess($data,$code=200){
		$this->response($data, $code);
	}
}
