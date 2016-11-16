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
class Lotteryuser extends API_Controller {

    function __construct()
    {
        parent::__construct();
        $this->load->Model('Lotteryuser_model');
        $this->load->Model('Lotteryissue_model');
    }
    public function lotterys_post()
    {
    	$this->valid();
		$cisue=$this->check_issue($this->post('issue'));
    	#生成订单号
    	$addID=$this->generalSeek(BUY_GENERAL);//.$this->userID;
    	$this->pending($addID,$_REQUEST['issue'].'期');
    	$data=array('ID'=>$addID,
	    		'userID'=>$this->post('userID'),
	    		'money'=>$this->post('money'),
	    		'issue'=>$this->post('issue'),
	    		'lotteryID'=>$this->post('lotteryID'),
	    		'multiple'=>$this->post('multiple'),
	    		'state'=>LOTTERY_STATE_WAIT_KJ,
	    		'memo'=>@$this->post('memo'),
    			'createDate'=>date('Y-m-d H:i:s',time())
    	);
    	$dataEntity=['lotteryUserID'=>$addID,'text'=>$this->post('text')];
    	#入库
    	if (!$this->Lotteryuser_model->add_lotteryuser($data,$dataEntity)){
    		$this->retFailed('下单失败');
    	}
    	$ret['status']=TRUE;
		$ret['message']='成功下单';
		$this->retAccess($ret,REST_Controller::HTTP_CREATED);
    }
    public function lotterys_get()
    {
    	//var_dump($this->get());
    	$id=$this->get('id');
    	if ($id === NULL){
	    	$params=array('userID'=>'用户编号');
	    	Extension::params_valid($params,$this->get());
	    	$index=@$this->get('index');
			$offset=@$this->get('pageSize');
			$num=($index*$offset)-$offset;
			$condition['userID']=$this->get('userID');
			if($this->get('state')!=NULL){
				$condition['state']=$this->get('state');	
			}
			//var_dump($this->get());
			$data = $this->Lotteryuser_model->get_lotteryusers($condition,$num,$offset);
    	}else{
    	 	//$id = intval($id);
        	// Validate the id.
	        if ($id <= 0)
	        {
	            $this->response(NULL, REST_Controller::HTTP_BAD_REQUEST);
	        }
			$data = $this->Lotteryuser_model->get_lotteryuser($id);
		}
     	if (!$data)
        {
            $this->retFailed('用户暂无投注信息', REST_Controller::HTTP_NOT_FOUND); // OK (200) being the HTTP response code
        }
       	$this->retAcess($data);
    }
    private function valid(){
    	//var_dump($_REQUEST);
    	$params=array('userID'=>'用户编号','money'=>'金额','issue'=>'期号','lotteryID'=>'彩种','multiple'=>'倍数','text'=>'投注');
    	//var_dump($this->post());
    	Extension::params_valid($params,$this->post());
    	$count=Extension::getBetCount($this->post('lotteryID'),$this->post('text'));
    	if($count*(int)$this->post('multiple')*2!=$this->post('money')){
    		$this->retFailed('金额有误');
    	}
    	return true;
    }
}
