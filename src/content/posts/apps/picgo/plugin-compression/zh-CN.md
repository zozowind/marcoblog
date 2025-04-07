---
title: 告别臃肿图床！使用PicGo压缩插件节省75%空间
published: 2025-04-06
tags: [PicGo, 操作指南]
image: 'https://1drv.ms/i/c/3d428bdf7621eadc/IQRJOvXDqGtQQY4P7Hhcyx8JAZc1CejqGG6M-WWfT2LV6Ag?width=660'
category: apps
draft: false
lang: zh-CN
---
## 痛点直击：图床「瘦身」焦虑
不少刚开始使用图床的朋友会发现随着内容的增长，云存储的量也急速上升，而问题所在——博客里未压缩的4K封面图、教程中的高清长截图，正以每张3-8MB的"体重"疯狂吞噬空间，更糟糕的是，移动端读者常抱怨加载转圈时间长。我一般是使用PicGo上传，所以今天来测试一下这款**compression**压缩插件...

## 功能特性
1. 支持格式：JPG/JPEG/GIF/PNG
2. 通过色彩笔网站在线压缩，无需安装本地软件
3. 支持多图并发

* 风险：功能稳定性依赖服务网站稳定性

## 极速配置指南
### 在线安装
PicGo设置→插件→搜索"compression"，选择这个彩色笔的插件秒安装，本操作需要魔法加持。
![在线安装插件](https://1drv.ms/i/c/3d428bdf7621eadc/IQQrQKqTTcVYS6KTX7pjkEelAcMZ9SMXEEddkBr2wS94CX8?width=1024)

### 离线安装
轻松三步：
1. 访问[色彩笔压缩插件 GitHub](https://github.com/Redns/picgo-plugin-compression) 下载插件
![下载插件](https://1drv.ms/i/c/3d428bdf7621eadc/IQSkeSh_ixMGR7N-NMUfLHfOAeVfcIqS6UzYeHMCtrQVaog?width=1024)


2. 解压缩
3. PicGo设置→插件→导入本地插件
![导入插件](https://1drv.ms/i/c/3d428bdf7621eadc/IQQtfsYZ_-HpTLTE_euF_CA3ASYac1UANfoYS7sExkscJ8w?width=1024)

### 配置
![配置插件](https://1drv.ms/i/c/3d428bdf7621eadc/IQTUO_5AN1PbQK1eEL1qyhVJAV1Irl0WKDQEaMo-anp91vk?width=1024)
* 容许质量下降：一般设置为true
* 图片质量：一般设置为0即可，自动选择图片质量，笔者测试下来50也没有太大的问题

### 压缩效果

#### 无文字图片
* 应用场景：照片，标题大图等
* 原图大小：3.88 MB
* 原图格式：jpg
* 原图加载时间：7510ms
* 图像质量分别配置： 0,25,50,75

| 图片质量参数  | 压缩后大小 | 加载时间 |
|---------|----------|----------|
| 0    | 781.42 KB  | 1050ms     | 
| 25    | 233.8 KB  | 699ms     | 
| 50   | 416.37 KB  | 839ms     | 
| 75    | 686.65 KB   | 1020ms   | 

视觉效果上文章配图长宽下无明显差异，放大后细节部分平滑的较多

#### 文字图片
我们平时截图一般为png格式
* 应用场景: 示例截图等
* 原图大小：523.26 KB
* 原图格式：png
* 原图加载时间：2010ms
* 图像质量分别配置 0,25,50,75

发现图片质量参数对png无效😂，文字清晰不影响阅读

| 图片质量参数  | 压缩后大小 | 加载时间 | 肉眼差异 |
|---------|----------|----------|----------|
| 0,25,50,75   | 143.76KB  | 897ms     | 未发现显著差异  |


## 结语

虽然存在png格式无法进行参数配置的问题，按默认配置处理即可有效节省空间75%以上，可显著降低图床空间占用和用户加载时间，值得尝试。

## 本文软件环境
- PicGo：v2.3.1
- picgo-plugin-compression： v1.1.5
- 测试图床：七牛云

## 参考
1. [PicGo Plugin离线安装](https://picgo.github.io/PicGo-Doc/zh/guide/config.html#%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85)
2. [色彩笔压缩插件](https://github.com/Redns/picgo-plugin-compression)