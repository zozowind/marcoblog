---
title: 数据备份+外网访问！手把手教你用群晖NAS同步七牛云，告别数据焦虑
image: 'http://images.chenzhijie.me/blog/2025/04/cloud_sync_qiniu_cover.png'
published: 2025-04-08
tags: [群晖, 七牛云, 云备份, 操作指南]
category: nas
draft: false
lang: zh-CN
---

很多朋友在搭建网站或博客时会考虑使用家用的NAS或SaaS服务来储存图片或静态资源用于外网访问。最近在折腾图床方案时，发现很多朋友都面临这样的困境：

* 1️⃣ 家用NAS虽好但外网访问总抽风
* 2️⃣ 依赖SaaS云服务又担心数据主权

我分享一下遇到的实际场景，和如何一步步实现**群晖NAS与七牛云之间的自动同步**，给也有类似需求的朋友做个参考，建议收藏备用👇

## 🌩 家用NAS最大的问题：无法提供稳定的外网访问

我用的是群晖DS920+，利用cloudflare tunnel实现了外网访问，但考虑到安全问题，不想所有人都能访问到家里的NAS，就开启了Zero Trust，这就导致无法用于图床功能。另外家用NAS服务由于电源，计算资源等问题很难保证7x24小时稳定服务。

## ☁️ 为什么不干脆用云服务？——我还是想**自己保留一份**

把图片等静态资源托管到云服务，体验很好，当然也需要付出一定的费用。

> 我真的敢把**唯一一份数据**交给一个云服务平台吗？

我的答案是否定的。毕竟平台可能改政策、限制功能，甚至某天“跑路”或封号——这种“数据不在自己手上”的不安感让我决定：

✅ **重要数据同步备份一份到自己的NAS中，掌握在自己手里！**

所以我就开始研究**如何实现NAS与云服务之间的**双向同步**，最好还能自动运行、稳定可靠。

## 🧩 我的解决方案：群晖 + 七牛云对象存储

[七牛云](https://s.qiniu.com/BJj6Vj)提供了对象存储服务（Kodo），兼容S3协议。适合做文件备份。特别的是七牛云为新用户提供了免费额度。

核心包括：

* 标准存储免费空间 10G 
* HTTP CDN服务 10G

详细免费额度查看[网站说明](https://developer.qiniu.com/af/kb/1574/free-credit-information?category=kb)。超过部分按量计费，价格也比较合理。

同时，群晖的`Cloud Sync`工具原生支持s3协议，配置过程相对简单。

---

## 🔧 配置步骤详解

### 步骤一：注册七牛云账号

1. 前往[七牛云官网](https://s.qiniu.com/BJj6Vj)注册并实名认证。
2. 进入控制台后，选择对象存储→空间管理，创建一个新的「对象存储空间」，选择合适的区域（距离你的用户近的区域），访问控制设置为`公开`
![创建空间](http://images.chenzhijie.me/blog/2025/04/qiniu_space_create.png)

3. 点击头像→密钥管理获取`Access Key` 和 `Secret Key`，用于授权NAS访问。
![生成Key](http://images.chenzhijie.me/blog/2025/04/qiuniu_key_create.png)

### 步骤二：群晖NAS中安装 Cloud Sync

1. 打开群晖的「套件中心」；
2. 搜索“Cloud Sync”，直接安装；

### 步骤三：同步任务设置
1. 打开后`Cloud Sync`，点击“+”新增连接，选择服务商「**S3 Storage**」；
![添加S3](http://images.chenzhijie.me/blog/2025/04/cloud_sync_add_qiniu_1.png)
![七牛同步设置](http://images.chenzhijie.me/blog/2025/04/cloud_sync_qiniu_setting.png)


2. 输入如下信息，点击下一步会进行校验，如失败请检查填写的内容

| 参数 | 设置 |
|------|------|
| S3 服务器 | 选择自定义服务器URL|
| 服务器地址 | 七牛云区域对应的endpoint，具体见下图或[七牛云开发文档](https://developer.qiniu.com/kodo/4088/s3-access-domainname)|
| Access Key | 填写上一步申请的Access Key|
| Secret Key | 填写上一步申请的Secret Key|
| Bucket 名称 | 填写七牛创建的存储空间名称 |

![服务器地址列表](http://images.chenzhijie.me/blog/2025/04/qiniu_endpoint_list.png)

3. 任务设置

| 参数 | 设置 |
|------|------|
| 连接名称 |取个名称：比如qiniu storage |
| 本地路径 |选择NAS上一个路径用于保存同步文件，需要先建好文件夹|
| 远程路径 |选择整个存储空间或特定目录进行同步|
| 同步方向 |双向同步：NAS操作会同步到云存储|
| 拆分大小| 对大文件会进行拆分同步，避免网络波动导致的影响|

![任务设置](http://images.chenzhijie.me/blog/2025/04/cloud_sync_task_setting.png)

4. 计划任务设置

设置定期执行任务，勾上计划任务，选择`暂停`或`启用`，在下方方块处进行拖拉设置
![计划任务设置](http://images.chenzhijie.me/blog/2025/04/cloud_sync_schedule_setting.png)

5. 其他配置
可以在配置完成在相关的界面进行配置
* 支持配置同步文件类型或后缀名过滤
* 支持设置同步速率
![文件类型后缀过滤](http://images.chenzhijie.me/blog/2025/04/cloud_sync_file_filter.png)
![同步速率设置](http://images.chenzhijie.me/blog/2025/04/cloud_sync_speed_limit.png)

---

## 🧪 实测效果

- 群晖文件夹内的新增/修改，**会自动同步到七牛云**；
- 七牛云作为异地备份，**稳定可靠、几乎无延迟**；
- 使用过程中未出现中断或数据冲突；
- 若NAS损坏或误删，也能从七牛完整恢复。

![同步日志](http://images.chenzhijie.me/blog/2025/04/cloud_sync_log.png)


---

## 🔚 总结 & 一些建议

### 适合人群：
- 希望在使用SaaS服务时**留存本地副本**的用户；
- 有家用NAS，不想完全依赖云服务但又要远程访问能力；

### 小贴士：
- 七牛云有免费额度, 但需要关注一下访问量，避免超限产生费用
- 注意安全性，可以考虑定期更换Access Key；
