<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Conf extends API_Controller {
	
	function __construct()
	{
		parent::__construct();
		$this->load->Model('Conf_model');
	}
	public function market_get()
	{
		$data=$this->Conf_model->get_market();
		$this->retAccess($data);
	}
}
?>