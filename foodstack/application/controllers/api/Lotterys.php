<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
//require APPPATH . '/libraries/REST_Controller.php';

/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Lotterys extends API_Controller {

    function __construct()
    {
        parent::__construct();
    }
    public function lottery_get()
    {
    	if(!$this->get('type')){
    		$this->retFailed('参数错误');
    	}
    	$param['type']=$this->get('type');
    	$data=$this->req('http://api.yssh365.com//Lotterys.ashx',$param);

		$this->retAccess(@json_decode($data,true));
    }
    private function req($url, $parameter,$type=CURLPROTO_HTTP) {
    	try {
    		$ch = curl_init();
    		curl_setopt($ch, CURLOPT_URL, $url);
    		curl_setopt($ch, CURLOPT_PROTOCOLS, CURLPROTO_HTTP);
    		curl_setopt($ch, CURLOPT_POST, 1);
    		curl_setopt($ch, CURLOPT_POSTFIELDS, $parameter);
    		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
    		$responses = curl_exec($ch);
    		curl_close($ch);
    		return $responses;
    	} catch (Exception $e) {
    		$retArr['status'] = FALSE;
    		$retArr['message'] = $e->getMessage();
    		//$retArr = json_encode($retArr);
    	}
    	return $retArr;
    }
}
