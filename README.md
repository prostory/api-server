# 服务器接口定义

root: [http://106.54.193.117/api/](http://106.54.193.117/api/)

### 资源服务器

接口地址拼接规则：root + function

例如：上传文件的接口：`http://106.54.193.117/api/upload`

返回值定义如下：

```json
{
    "url": "http://106.54.193.117/api/public/upload/images/2019/11/28/xxx.jpg",	// 图片的url
    "width": 658,		// 图片宽度
    "height": 494,		// 图片长度
    "filed": {},
    "file": {}			// 文件详细信息（包括大小、类型等等）
}
```

接口定义如下：

|  方法  |          接口           |         参数          |  返回值  | 功能                                              |
| :----: | :---------------------: | :-------------------: | :------: | ------------------------------------------------- |
|  POST  |         /upload         |        {files}        | [{File}] | 上传文件                                          |
|  GET   | /public/upload/images/* | ?[ext, x, y, quality] |  {file}  | 获取指定格式(ext)、大小(x/y)、质量(quality)的图片 |
| DELETE | /public/upload/images/* |        {token}        |    {}    | 删除指定文件                                      |

> 可通过`http://106.54.193.117/api/public/upload/images/2019/11/28/xxx.jpg?ext=webp&x=500&quality=80`，获取宽度为500，质量为80%的webp格式的图片

### 售后系统

接口地址拼接规则：root + 'after-sale/' + model

例如：管理员登录的接口：`http://106.54.193.117/api/after-sale/admin/login`

返回值格式：

```json
{
	"status": 0,1,2,3,	// 0表示成功，1表示登录状态错误, 2和3表示失败
    "message": "xxx",	// 返回的消息
    "data": {},			// 成功时返回
	"reason": {}		// 失败时返回
}
```

#### 管理员(/admin)

接口定义如下：

| 方法 |  接口  |         参数         |    返回值     | 功能         |
| :--: | :----: | :------------------: | :-----------: | ------------ |
| POST | /login | {username, password} | {token, user} | 管理员登录   |
| POST | /check |       {token}        |      {}       | 检测登录状态 |

#### 手机(/phones)

模型定义如下：

```json
{
 	"_id": "5de8b0385cdfd92edf16677f",				// id号
    "unique": "84d8f4b25399946964213c316e2b55bb",	// 防止重复创建，可忽略
    "brand": "Condor",								// 品牌
    "model": "Griffe T9",							// 型号
	"appearance": "",								// 外观（图片路径）
	"publish": "2019-12-05T06:27:10.310Z",			// 发布时间
    "published": false,								// 是否已发布
    "warranty_duration": 12,						// 质保时长：默认12个月
    "created_at": "2019-12-05T07:22:32.177Z",		// 创建时间
    "updated_at": "2019-12-05T07:22:32.177Z"		// 更新时间
}
```
接口定义如下：

|  方法  |      接口      |                             参数                             |  返回值   | 功能                         |
| :----: | :------------: | :----------------------------------------------------------: | :-------: | ---------------------------- |
|  GET   |       /        |                              {}                              | [{Phone}] | 获取所有手机信息             |
|  GET   |    /latest     |                              {}                              |  {Phone}  | 获取最近发布的手机信息       |
|  GET   |    /brands     |                              {}                              |  {Brand}  | 获取所有手机品牌             |
|  GET   |      /:id      |                              {}                              |  {Phone}  | 获取指定id的手机信息         |
|  GET   | /:brand/:model |                              {}                              |  {Phone}  | 获取指定品牌和型号的手机信息 |
|  POST  |       /        | {token, brand, model, [appearance, publish, published, warranty_duration]} |  {Phone}  | 创建新的手机                 |
|  PUT   |      /:id      | {token, brand, model, [appearance, publish, published, warranty_duration]} |    {}     | 更新指定id的手机的信息       |
| DELETE |      /:id      |                           {token}                            |    {}     | 删除指定id的手机的信息       |

#### 维修网点(/sites)

模型定义如下：

```json
{
    "_id": "5de793cb8072307db42216a8",			// id号
    "name": "Condor",							// 网点名称
    "address": "aaaa",							// 网点地址
    "long": 1111,								// 网点经纬度
    "lat": 2222,
    "created_at": "2019-12-04T11:08:59.330Z",	// 创建时间
    "updated_at": "2019-12-04T11:11:18.395Z",	// 更新时间
	"locales": [								// 翻译
        {
            "_id": "5e54c6557a032a4f84a5da89",
            "lang": "en",
            "name": "Shenzhen center park",
            "address": "Shenzen center park"
        },
        {
            "_id": "5e54c6557a032a4f84a5da88",
            "lang": "fr",
            "name": "Shenzhen center park",
            "address": "Shenzhen center park"
        },
        {
            "_id": "5e54c6557a032a4f84a5da87",
            "lang": "ar",
            "name": "Shenzhen center park",
            "address": "Shenzhen center park"
        }
    ]
}
```

接口定义如下：

|  方法  |  接口   |                    参数                    |  返回值  | 功能                       |
| :----: | :-----: | :----------------------------------------: | :------: | -------------------------- |
|  GET   | /:brand |                  {brand}                   | [{Site}] | 获取指定手机品牌的维修网点 |
|  POST  | /fetch  |     {token, filter, skip, limit, sort}     | [{Site}] | 根据查询条件获取网点信息   |
|  POST  |    /    | {token, name, address, long, lat, locales} |  {Site}  | 创建新网点                 |
|  PUT   |  /:id   | {token, name, address, long, lat, locales} |    {}    | 更新指定id的网点信息       |
| DELETE |  /:id   |                  {token}                   |    {}    | 删除指定id的网点信息       |

#### 电子保卡(/warranties)

模型定义如下：

```json
{
    "_id": "5de865df1b2e7b53e4dde7d8",			// id号
    "phone": "5de864a72423d552d5803351",		// 对应的手机id号
    "brand": "Xiaomi",							// 手机品牌
    "model": "MI 6",							// 手机型号
    "paper": "a.jpg",							// 纸质保卡（图片路径）
    "imei": "112323124",						// IMEI号
    "sn": "34324234235",						// SN号
    "phone_no": "13424895679",					// 电话号码
    "ip": "127.0.0.1",							// IP地址
    "created_at": "2019-12-05T02:05:19.229Z"	// 创建时间
}
```

接口定义如下：

|  方法  |         接口          |                     参数                      |    返回值    | 功能                               |
| :----: | :-------------------: | :-------------------------------------------: | :----------: | ---------------------------------- |
|  POST  |        /fetch         |      {token, filter, skip, limit, sort}       | [{Warranty}] | 根据查询条件获取保卡信息           |
|  GET   |      /imei/:imei      |                      {}                       |  {Warranty}  | 获取指定IMEI号的保卡信息           |
|  GET   |        /sn/:sn        |                      {}                       |  {Warranty}  | 获取指定SN号的保卡信息             |
|  GET   |  /phoneNo/:phone_no   |                      {}                       | [{Warranty}] | 获取指定电话号码的保卡信息         |
|  GET   | /phones/:brand/:model |                      {}                       | [{Warranty}] | 获取指定品牌和型号的手机的保卡信息 |
|  POST  |           /           | {brand, model, paper, imei, sn, phone_no, ip} |  {Warranty}  | 创建电子保卡                       |
| DELETE |         /:id          |                    {token}                    |      {}      | 删除电子保卡                       |


#### 应用程序（/applications）
模型定义如下：
```json
{
   "_id": "5e2151d08bae82074dc01c96",					// id号
   "package": "com.condor.weather",						// 应用包名
   "title": "Weather",									// 应用名称
   "description": "Weather for condor phones",			// 描述
    "history": [										// 历史版本
        {
            "_id": "5e2151e58bae82074dc01c97",
            "version_code": 1,							// 版本号
            "version": "1.0",							// 版本名称
            "url": 	"http://127.0.0.1:3000/api/upload/apk/com.condor.weather_1.0.apk",  // apk下载地址
            "details": "The first version",				// 更新内容
            "created_at": "2020-01-17T06:19:17.352Z",	// 发布时间
        }
    ],
    "created_at": "2020-01-17T06:18:56.518Z",			// 应用创建时间
    "updated_at": "2020-01-17T06:19:17.350Z",			// 更新时间
}
```
根据包名和版本号返回需要更新的版本信息

(`/applications/available/com.condor.weather/0`)获取成功返回:

```json
{
    "status": 0,
    "message": "Query successfully",
    "data": {
        "description": "Weather for condor phones",
        "package": "com.condor.weather",
        "title": "Weather",
        "version": "1.0",
        "versionCode": 1,
        "url": "http://127.0.0.1:3000/api/upload/apk/com.condor.weather_1.0.apk",
        "details": "The first version",
        "created_at": "2020-01-17T06:19:17.352Z"
    }
}
```

(`/applications/available/com.condor.weather/1`)获取失败返回：

```json
{
    "status": 2,
    "message": "Query failed",
    "reason": null
}
```

接口定义如下：

|  方法  |             接口             |                      参数                      |     返回值      | 功能                                     |
| :----: | :--------------------------: | :--------------------------------------------: | :-------------: | ---------------------------------------- |
|  GET   |              /               |                    {token}                     | [{Application}] | 返回所有应用                             |
|  GET   |             /:id             |                    {token}                     |  {Application}  | 返回指定id的应用                         |
|  GET   | /available/:package/:version |                       {}                       |    {Version}    | 根据包名和版本号，返回需要更新的版本信息 |
|  POST  |              /               |     {token, title, package, [description]}     |  {Application}  | 创建应用                                 |
|  PUT   |             /:id             |     {token, title, package, [description]}     |       {}        | 修改应用信息                             |
|  POST  |         /version/:id         | {token, url, version, version_code, [details]} |       {}        | 发布应用版本                             |
| DELETE |         /version/:id         |             {token, version_code}              |       {}        | 删除应用版本                             |
| DELETE |             /:id             |                    {token}                     |       {}        | 删除应用                                 |

#### 电子说明书（/instructions）

模型定义如下：

```json
{
    "_id": "5de8780a0acde262d2a57e48",
    "unique": "e452d767d6db1c101495a937b4d2fa60",
    "phone_id": "5de864a72423d552d5803351",
    "lang": "zh",
    "title": "上手指南",
    "description": "更多好用的功能 任您探索",
    "banners": [
        {
            "image": {
                "width": 1280,
                "height": 400,
                "url": "xxx.jpg"
            },
            "_id": "5dde5062b46e135e6c99b636",
            "url": "http://www.baidu.com"
        }
    ],
    "items": [
        {
            "pages": [
                {
                    "jump": {
                        "name": "立即体验",
                        "url": "android-app://com.android.settings"
                    },
                    "media": {
                        "desc": {
                            "width": 658,
                            "height": 494,
                            "size": 83692,
                            "isVideo": false
                        },
                        "url": "xxx.png"
                    },
                    "_id": "5dde0cf31fae06277f13de4e",
                    "title": "数据克隆",
                    "icon": "xxx.jpeg",
                    "description": "数据克隆可以协助您将旧手机的照片、音视频、文件、联系人、短信、通话记录、应用等数据迁移至新手机。仅需通过两个手机的热点连接即可完成传输，迁移速度快，稳定性强，无需担心隐私泄露。"
                }
            ],
            "_id": "5dde0cf31fae06277f13de4d",
            "title": "快速上手",
            "description": "快速了解基本功能",
            "image": "xxx.jpeg"
        }
    ],
    "created_at": "2019-12-05T03:22:50.808Z",
    "updated_at": "2019-12-05T03:29:01.418Z"
}
```

接口定义如下：

|  方法  |            接口             |                            参数                             |       返回值       | 功能                                       |
| :----: | :-------------------------: | :---------------------------------------------------------: | :----------------: | ------------------------------------------ |
|  GET   |              /              |                             {}                              |  [{Instruction}]   | 获取所有说明书                             |
|  GET   |            /:id             |                             {}                              |   {Instruction}    | 获取指定id的电子书                         |
|  GET   |         /items/:id          |                             {}                              | {Instruction.Item} | 获取指定id的说明项                         |
|  GET   |         /phones/:id         |                             {}                              |  [{Instruction}]   | 获取指定id的手机的说明书                   |
|  GET   |    /phones/:brand/:model    |                             {}                              |  [{Instruction}]   | 获取指定品牌和型号的手机的说明书           |
|  GET   | /phones/:brand/:model/:lang |                             {}                              |   {Instruction}    | 获取指定品牌和型号的手机的指定语言的说明书 |
|  POST  |              /              |         {token, phone_id, lang, title, description}         |   {Instruction}    | 创建新的说明书                             |
|  PUT   |            /:id             | {token, phone_id, lang, title, description, banners, items} |         {}         | 更新指定id的说明书                         |
| DELETE |            /:id             |                           {token}                           |         {}         | 删除指定id的说明书                         |


> 注意，表格中的返回值表示成功时返回的数据`data`，[]表示返回数组。参数中的`token`存储在header中，在[]中的参数是可选参数。