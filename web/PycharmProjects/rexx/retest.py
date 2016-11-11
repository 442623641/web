#-*- coding: UTF-8 -*-
import re
import time,datetime
str='4.40元/公斤'
#print  re.sub("[A-Za-z0-9\[\.]", "", str)
dateq=u'2016-01-21'
t = time.strptime(dateq,'%Y-%m-%d')
y,m,d=t[0:3]
print time.mktime(t)
print time.time()
print datetime(y,m,d)
print datetime.date.today()
a=1
b=1
exit()
x=a+b
