<?php
defined ( 'BASEPATH' ) or exit ( 'No direct script access allowed' );
class Shop extends API_Controller {
	function __construct() {
		parent::__construct ();
		$this->load->Model('Shop_model');
	}
	/**
	获取店铺信息
	*/
	public function shop_get() {
		$params=array('id'=>'店铺编号');
    	$this->params_valid($params,$this->get());
    	$data=$this->Shop_model->get_shop(['id'=>$this->get('id')]);
		$this->retAcess($data);
	}
	/**
	创建店铺
	*/
	public function shop_post() {
		$params=array('name'=>'店铺名称','merchant'=>'用户编号');
    	//var_dump($this->post());
    	$this->params_valid($params,$this->post());
    	if(!$this->post('ID')){
			if (!$this->Shop_model->insert_shop($this->post())){
	    		$this->retFailed('保存店铺失败');
	    	}
    	}
    	if (!$this->Shop_model->update_shop($this->post())){
    		$this->retFailed('保存店铺失败');
    	}
    	$ret['status']=TRUE;
		$ret['message']='保存店铺信息成功';
		$this->retAcess($ret,REST_Controller::HTTP_CREATED);
	}
	public function type_get() {
		// 		$index=empty($this->get('rows'))?10:$this->get('rows');
		// 		$offset=@$this->get('start');
		// 		$num=($index*$offset)-$offset;
		$data=$this->Menu_model->get_type($this->get('shopID'));
		//$dd=from($d)->in($data)->where('$dd =>$dd[\'type\'] == 30031');
		$this->retAccess($data);
	}
	public function upload_post()
    {
        $config['upload_path']      = FCPATH'/upload/';
        $config['allowed_types']    = 'gif|jpg|png';
        $config['max_size']     = 100;
        $config['max_width']        = 1024;
        $config['max_height']       = 768;

        $this->load->library('upload', $config);

        if ( ! $this->upload->do_upload('userfile'))
        {
            $error = array('error' => $this->upload->display_errors());
            $this->retFailed($this->upload->display_errors());

            // $this->load->view('upload_form', $error);
        }
        else
        {
        	$this->retFailed($this->upload->data());
            //$data = array('upload_data' => $this->upload->data());

            //$this->load->view('upload_success', $data);
        }
    }
}
?>