<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class ConvertMaterial extends API_Controller {

	function __construct()
	{
		parent::__construct();
		$this->load->Model('Markets_model');
	}
	public function material_get()
	{
		$condition[1]=1;
		$data=$this->Markets_model->get_material($condition);
		foreach ($data as $item){
			$newdata[]['per']=$item['per'];
			$newdata[]['content']=$item['content'];
			$newdata[]['name']=$item['name'];
			$newdata[]['goodcp']=$item['goodcp'];
			$newdata[]['badcp']=$item['badcp'];
			$newdata[]['description']=$item['description'];
			$newdata[]['synonym']=$item['synonym'];
			$newdata[]['link']=$item['link'];
		}
		$re=$this->Markets_model->insert_material($newdata);
		$this->retAccess($re);
	}
}
?>