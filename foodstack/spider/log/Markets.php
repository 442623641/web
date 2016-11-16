<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Markets extends API_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->Model('Markets_model');
	}
	public function market_get()
	{
		
		$index=empty($this->get('index'))?1:$this->get('index');
		$offset=@$this->get('pageSize');
		$num=($index*$offset)-$offset;
		if(!empty($this->get('foodType'))){
			$condition['type']=$this->get('foodType');
		}
		$condition['marketID']=empty($this->get('marketID'))?56:(int)$this->get('marketID');
		if($this->get('foodType')){
			$condition['type']=$this->get('foodType');
			$data=$this->Markets_model->get_markets($condition,$num,$offset);
		}else{
			$data=array();
			$foodTypes=$this->Markets_model->get_foodType();
			for ($i=0;$i<count($foodTypes);$i++){
				$condition['type']=$foodTypes[$i]['ID'];
				$data[$i]['food']=$this->Markets_model->get_markets($condition,$num,$offset);
				$data[$i]['name']=$foodTypes[$i]['name'];
				$data[$i]['id']=$foodTypes[$i]['ID'];
			}
		}
		$this->retAccess($data);
	}
	public function materialOfMongo_get()
	{
		if(empty($this->get('link'))&&!$this->get('link')===0&&!$this->get('name')){
			$this->retFailed('食物编号或名称不能同时为空');
		}
		if($this->get('link')){
			$condition['link']=(string)$this->get('link');
		}
		if($this->get('name')){
			$condition['name']=urldecode($this->get('name'));
		}
		$data=$this->Markets_model->get_material($condition);
		if(!$data){
			  $this->retFailed('暂无信息', REST_Controller::HTTP_NOT_FOUND);
		}
		$this->retAccess($data[0]);
	}
	public function material_get()
	{
		if(empty($this->get('link'))&&!$this->get('link')===0&&!$this->get('name')){
			$this->retFailed('食物编号或名称不能同时为空');
		}
		if($this->get('link')){
			$condition['link']=(string)$this->get('link');
		}
		if($this->get('name')){
			$condition['name']=urldecode($this->get('name'));
		}
		$item=$this->Markets_model->get_material($condition);
		if(!$item){
			  $this->retFailed('暂无信息', REST_Controller::HTTP_NOT_FOUND);
		}
		$newdata['per']=$item['per'];
		$newdata['content']=json_decode($item['content']);
		$newdata['name']=$item['name'];
		$newdata['goodcp']=json_decode($item['goodcp']);
		$newdata['badcp']=json_decode($item['badcp']);
		$newdata['description']=json_decode($item['description']);
		$newdata['synonym']=json_decode($item['synonym']);
		$newdata['link']=$item['link'];
		$this->retAccess($newdata);

	}
	public function foods_get()
	{
		$index=empty($this->get('index'))?1:$this->get('index');
		$offset=@$this->get('pageSize');
		$num=($index*$offset)-$offset;
		$data=$this->Markets_model->get_foods($num,$offset);
		$this->retAccess($data);
	}
	public function marketInfo_get(){
		$data=$this->Markets_model->get_marketConf();
		$this->retAccess($data);
	}
}
?>