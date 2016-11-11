# -*- coding: utf-8 -*-

# Scrapy settings for novelspider project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:db.price_160123.find({marketcode:56})
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#
import datetime

BOT_NAME = 'agriculturespider'
SEARCH_DATE=datetime.date.today()-datetime.timedelta(days=0)
DOCDATE=datetime.date.today()-datetime.timedelta(days=0)
SPIDER_MODULES = ['agriculturespider.spiders']
NEWSPIDER_MODULE = 'agriculturespider.spiders'

ITEM_PIPELINES = ['agriculturespider.pipelines.AgrspiderPipeline']

USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.54 Safari/536.5'
COOKIES_ENABLED = True

SCHEDULER = "scrapy_redis.scheduler.Scheduler"
SCHEDULER_PERSIST = True
SCHEDULER_QUEUE_CLASS = 'scrapy_redis.queue.SpiderPriorityQueue'

REDIS_URL = None
REDIS_HOST = '127.0.0.1'
REDIS_PORT = 6379

MONGODB_HOST = '127.0.0.1'
MONGODB_PORT = 27017
MONGODB_DBNAME = 'food'

MONGODB_DOCNAME = 'material'
FOODS=[
   {
      "name": "大黄花鱼",
      "link": "2659"
   },
   {
      "name": "丝瓜",
      "link": "918"
   },
	{
      "name": "丰水梨",
      "link": "1349"
   },
   {
      "name": "养殖鲶鱼",
      "link": "2413"
   },
   {
      "name": "南瓜",
      "link": "915"
   },
   {
      "name": "哈密瓜",
      "link": "1495"
   },
   {
      "name": "国光苹果",
      "link": "1263"
   },
   {
      "name": "圆茄子",
      "link": "891"
   },
   {
      "name": "土豆",
      "link": "60"
   },
   {
      "name": "基围虾",
      "link": "2891"
   },
   {
      "name": "大平鱼",
      "link": "2753"
   },
   {
      "name": "大白菜",
      "link": "944"
   },
   {
      "name": "大葱",
      "link": "931"
   },
   {
      "name": "大蒜",
      "link": "927"
   },
   {
      "name": "大豆",
      "link": "116"
   },
   {
      "name": "富士苹果",
      "link": "1263"
   },
   {
      "name": "小平鱼",
      "link": "2753"
   },
   {
      "name": "小白菜",
      "link": "950"
   },
   {
      "name": "小黄花鱼",
      "link": "2659"
   },
   {
      "name": "山楂",
      "link": "1500"
   },
   {
      "name": "山竹",
      "link": "1489"
   },
   {
      "name": "山药",
      "link": "3"
   },
   {
      "name": "巨峰葡萄",
      "link": "1400"
   },
   {
      "name": "带鱼",
      "link": "2607"
   },
   {
      "name": "平菇",
      "link": "1037"
   },
   {
      "name": "木耳菜",
      "link": "1093"
   },
   {
      "name": "柠檬",
      "link": "1436"
   },
   {
      "name": "柿子",
      "link": "9868"
   },
   {
      "name": "标准粉",
      "link": "100"
   },
   {
      "name": "樱桃",
      "link": "1396"
   },
   {
      "name": "武昌鱼",
      "link": "3569"
   },
   {
      "name": "毛豆",
      "link": "872"
   },
   {
      "name": "水萝卜",
      "link": "832"
   },
   {
      "name": "油菜",
      "link": "954"
   },
   {
      "name": "油麦菜",
      "link": "4"
   },
   {
      "name": "泥鳅",
      "link": "2447"
   },
   {
      "name": "洋白菜",
      "link": "9902"
   },
   {
      "name": "活草鱼",
      "link": "2380"
   },
   {
      "name": "活鲤鱼",
      "link": "2307"
   },
   {
      "name": "活鲫鱼",
      "link": "2531"
   },
   {
      "name": "牛肉",
      "link": "1730"
   },
   {
      "name": "猕猴桃",
      "link": "1137"
   },
   {
      "name": "猪肉(白条猪)",
      "link": "1494"
   },
   {
      "name": "甘蔗",
      "link": "1535"
   },
   {
      "name": "生姜",
      "link": "1031"
   },
   {
      "name": "生菜",
      "link": "985"
   },
   {
      "name": "白条鸡",
      "link": "1800"
   },
   {
      "name": "白萝卜",
      "link": "784"
   },
   {
      "name": "白鲢活鱼",
      "link": "2530"
   },
   {
      "name": "白鳝鱼",
      "link": "3544"
   },
   {
      "name": "空心菜",
      "link": "995"
   },
   {
      "name": "粳米(普通)",
      "link": "39"
   },
   {
      "name": "红小豆",
      "link": "117"
   },
   {
      "name": "红尖椒",
      "link": "897"
   },
   {
      "name": "红椒",
      "link": "0"
   },
   {
      "name": "绿尖椒",
      "link": "897"
   },
   {
      "name": "绿豆",
      "link": "115"
   },
   {
      "name": "绿豆芽",
      "link": "748"
   },
   {
      "name": "羊肉",
      "link": "9886"
   },
   {
      "name": "胡萝卜",
      "link": "9780"
   },
   {
      "name": "脐橙",
      "link": "1417"
   },
   {
      "name": "色拉油",
      "link": "8756"
   },
   {
      "name": "芋头",
      "link": "1027"
   },
   {
      "name": "芒果",
      "link": "1450"
   },
   {
      "name": "芹菜",
      "link": "980"
   },
   {
      "name": "苦瓜",
      "link": "916"
   },
   {
      "name": "茭白",
      "link": "1021"
   },
   {
      "name": "茴香",
      "link": "988"
   },
   {
      "name": "茼蒿",
      "link": "1006"
   },
   {
      "name": "草莓",
      "link": "1136"
   },
   {
      "name": "草菇",
      "link": "880"
   },
   {
      "name": "荷兰豆",
      "link": "870"
   },
   {
      "name": "莲藕",
      "link": "2"
   },
   {
      "name": "莴笋",
      "link": "991"
   },
   {
      "name": "菜花",
      "link": "964"
   },
   {
      "name": "菠菜",
      "link": "975"
   },
   {
      "name": "菠萝",
      "link": "1240"
   },
   {
      "name": "葱头",
      "link": "933"
   },
   {
      "name": "蒜苗",
      "link": "930"
   },
   {
      "name": "虹鳟鱼",
      "link": "3574"
   },
   {
      "name": "蜜桔",
      "link": "1435"
   },
   {
      "name": "西兰花",
      "link": "966"
   },
   {
      "name": "西洋芹",
      "link": "980"
   },
   {
      "name": "西瓜",
      "link": "1"
   },
   {
      "name": "西红柿",
      "link": "894"
   },
   {
      "name": "西葫芦",
      "link": "921"
   },
   {
      "name": "豆角",
      "link": "751"
   },
   {
      "name": "豇豆",
      "link": "751"
   },
   {
      "name": "酥梨",
      "link": "1342"
   },
   {
      "name": "金针菇",
      "link": "945"
   },
   {
      "name": "长茄子",
      "link": "891"
   },
   {
      "name": "雪梨",
      "link": "1346"
   },
   {
      "name": "青冬瓜",
      "link": "9760"
   },
   {
      "name": "青椒",
      "link": "1219"
   },
   {
      "name": "面粉",
      "link": "100"
   },
   {
      "name": "韭菜",
      "link": "935"
   },
   {
      "name": "香梨",
      "link": "1345"
   },
   {
      "name": "香椿",
      "link": "1097"
   },
   {
      "name": "香菇",
      "link": "794"
   },
   {
      "name": "香菜",
      "link": "986"
   },
   {
      "name": "香蕉",
      "link": "1265"
   },
   {
      "name": "鲈鱼",
      "link": "2745"
   },
   {
      "name": "鸡腿菇",
      "link": "1254"
   },
   {
      "name": "鸡蛋",
      "link": "1981"
   },
   {
      "name": "黄瓜",
      "link": "738"
   },
   {
      "name": "黄豆芽",
      "link": "888"
   },
   {
      "name": "黄香蕉苹果",
      "link": "1263"
   },
   {
      "name": "黄鳝",
      "link": "2426"
   }
]