/*
Navicat MySQL Data Transfer

Source Server         : 115.28.152.37
Source Server Version : 50544
Source Host           : 115.28.152.37:3306
Source Database       : caipiaokong

Target Server Type    : MYSQL
Target Server Version : 50544
File Encoding         : 65001

Date: 2016-01-26 22:21:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `currentlottery`
-- ----------------------------
DROP TABLE IF EXISTS `currentlottery`;
CREATE TABLE `currentlottery` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `lotteryID` varchar(10) COLLATE utf8_bin DEFAULT NULL COMMENT '彩种编号',
  `issue` varchar(15) COLLATE utf8_bin DEFAULT NULL COMMENT '期号',
  `num` varchar(20) COLLATE utf8_bin DEFAULT NULL COMMENT '开奖号码',
  `order_num` varchar(20) COLLATE utf8_bin DEFAULT NULL COMMENT '顺序开奖号码',
  `dt` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='存放最新一期的开奖信息';

-- ----------------------------
-- Records of currentlottery
-- ----------------------------
INSERT INTO `currentlottery` VALUES ('1', '1', '16025', '5,0,0', null, '2016-01-25 00:00:00');
INSERT INTO `currentlottery` VALUES ('3', '0', '16012679', '05,11,08,09,01', '01,05,08,09,11', '2016-01-26 22:01:02');
INSERT INTO `currentlottery` VALUES ('4', '2', '16025', '5,0,0,5,4', null, '2016-01-25 00:00:00');
INSERT INTO `currentlottery` VALUES ('5', '3', '16011', '2,3,8,3,1,6,2', null, '2016-01-24 00:00:00');
INSERT INTO `currentlottery` VALUES ('6', '4', '16011', '02,08,10,15,23+05,10', null, '2016-01-25 00:00:00');
INSERT INTO `currentlottery` VALUES ('7', '5', '16012681', '08,04,07,09,03', '03,04,07,08,09', '2016-01-26 22:01:35');
INSERT INTO `currentlottery` VALUES ('8', '6', '16012680', '06,10,11,03,08', '03,06,08,10,11', '2016-01-26 22:01:36');
