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
SEARCH_DATE=datetime.date.today()-datetime.timedelta(days=1)
DOCDATE=datetime.date.today()-datetime.timedelta(days=1)
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
MONGODB_DBNAME = 'agriculture'

MONGODB_DOCNAME = 'price_'+(DOCDATE).strftime('%y%m%d')