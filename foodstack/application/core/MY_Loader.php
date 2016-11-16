<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MY_Loader extends CI_Loader {
	#开启web端
//protected $_web='default/';
	#开启手机端
	public function switch_web_on(){
		$this->_ci_view_paths = array(FCPATH . WEB_DIR => TRUE);
	}
	public function switch_web_off(){
		//just do nothing
	}
}