from scrapy import cmdline
import redis
r = redis.Redis(host='localhost', port=6379)
r.flushdb()
cmdline.execute("scrapy crawl agrspider".split())
