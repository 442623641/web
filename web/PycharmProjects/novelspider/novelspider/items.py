# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class NovelspiderItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    bookName = scrapy.Field()
    bookTitle = scrapy.Field()
    chapterNum = scrapy.Field()
    chapterName = scrapy.Field()
    chapterURL = scrapy.Field()