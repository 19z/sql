CREATE TABLE IF NOT EXISTS 类型 (
    类型名 varchar(20) NOT NULL,
    父类型 varchar(20) ,
    PRIMARY KEY (类型名,父类型),
    check(父类型 in ('唱片','电影','电视','游戏','其他'))
);

 CREATE TABLE IF NOT EXISTS DVD (
     条形码 varchar(40) NOT NULL PRIMARY KEY,
     类型名 varchar(20) NOT NULL,
     父类型 varchar(20) NOT NULL,
     具体名 varchar(100) NOT NULL,
     VCD介绍 varchar(255),
     库存 int(7) NOT NULL DEFAULT  '0',
     已出售 int(7) NOT NULL ,
     出租在外 int(7) NOT NULL,
     总共借出次数 int(7) NOT NULL,
     FOREIGN KEY (类型名) REFERENCES 类型(类型名),
     FOREIGN KEY (父类型) REFERENCES 类型(父类型)
 );

CREATE TABLE IF NOT EXISTS 借还 (
     借还 int(10) PRIMARY KEY,
     借阅者 varchar(30) NOT NULL ,
     条形码 varchar(30) NOT NULL ,
     借出时间 int(15) NOT NULL,
     归还时间 int(15) DEFAULT NULL,
     FOREIGN KEY (条形码) REFERENCES DVD(条形码)
 );
 CREATE TABLE IF NOT EXISTS 入库历史 (
    入库单号 varchar(10) PRIMARY KEY,
    入库时间 int(15) not null,
    条形码 varchar(40) not null,
    入库数量 int(6),
    FOREIGN KEY (条形码) REFERENCES DVD(条形码)

 );
 CREATE TABLE IF NOT EXISTS 出售历史 (
    ID int(10) PRIMARY KEY,
    出售时间 int(15) not null,
    条形码 varchar(40) not null,
    出售数量 int(6),
    FOREIGN KEY (条形码) REFERENCES DVD(条形码)

 );


---------视图----------
CREATE VIEW 借出总览 as
    select 借还.借还,借还.借阅者,借还.条形码,借还.借出时间,DVD.父类型,DVD.具体名
    from 借还,DVD
    where 借还.条形码=DVD.条形码;

CREATE VIEW 类型总览 as
    SELECT 类型名, 父类型, COUNT(类型名),SUM(库存),SUM(出租在外),SUM(已出售),SUM(总共借出次数)
    FROM DVD
    GROUP BY 类型名,父类型;

-------------插入分类数据--------------------
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('历史', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('现代', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('警匪', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('神话', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('科幻', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('悬疑', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('言情', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('动画', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('古装', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('默认', '电视');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('传记', '电影');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('默认', '电影');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('音乐', '电影');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('先锋', '电影');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('短片', '电影');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('记录', '电影');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('剧情', '电影');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('动画', '电影');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('策略', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('角色', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('卡牌', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('益智', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('射击', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('休闲', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('即时', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('竞速', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('冒险', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('音乐', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('默认', '游戏');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('流行', '唱片');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('摇滚', '唱片');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('金属', '唱片');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('爵士', '唱片');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('民歌', '唱片');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('古典', '唱片');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('默认', '唱片');
INSERT INTO `类型` (`类型名`, `父类型`) VALUES('默认', '其他');

--------------插入一些默认DVD数据--------------
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787799446196', '流行', '唱片', '第七感', '经过时间历练，信念会指引你方向。视、听、嗅、味、触、直觉感官全开，进入张靓颖带来的音乐新世界。除了人天生的视、听、嗅、味、触五感与直觉第六感之外，有一种感触，需要时间带来的沉淀，将所有经历过的感动、思绪、困境、信念及人性的各种情绪融合，型塑出忠于自我的的“第七感”。张靓颖全新专辑《第七感》，在往国际化迈进的路上，张靓颖以R&B为出发点，透过“第七感”的指引，找出全新曲风方向，不跟随流行，而是要创造独一无二、别人做不到的，专属于张靓颖的全新流行！专辑收录了12首新作包括10首中文和2首英文歌曲，邀请国际一流',258,20,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787799602868', '流行', '唱片', '范特西', '周杰伦的出现，让人们相信台湾创造本土R&B的可能性；周杰伦的走红，彻底地宣布音乐新声代的来临。作曲、填词、编曲、演唱样样俱精的周杰伦，首张同名专辑《Jay杰伦》推出后，销售势如破竹，不单有“音乐新人王”称号，他自成一格的R&B演绎方法，更被誉为陶吉吉的劲敌。 顶着台湾金曲奖“最佳唱片”、“最佳制作人”的光环，周杰伦的第二张专辑《Fantasy(范特西)》终于在万千歌迷的期待中推出。这次杰伦依然一手包办所有作品的作曲，词的部份则延续第一张专辑的徐若？、方文山及他本人的铁三角。曲风较上张专辑更为的广泛，除了抒',51,3,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('0602488972017', '流行', '唱片', '第10个王心凌', '首波推荐曲《Baby Boy》已于6月25日开始首播，清新明快的曲风做为第十个王心凌首支登场的单曲，不但肩负承接大家所熟悉喜爱的心凌，更有开启心凌崭新模样的重大责任。因此这首歌乍听之下就充满着王心凌式的甜蜜轻快，但进入歌曲之后才会发现，原来，甜蜜轻快只是一面，歌曲中用不一样的爱情态度，独具特色的Brass和简洁有力的嘻哈Beats鼓击节奏，打造潮味十足的闪亮音色，第十个王心凌拥有多种不同面向，让歌迷惊喜接招。',22,7,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('0094639027729', '流行', '唱片', '逆光', '从A& R开始，这一次，在制作物上我们保留了燕姿最擅长的曲式也大量运用了新的元素一个听起来熟悉却有新鲜感的孙燕姿。在音乐概念上，不强调刻意的突破与改变， 让焦点回归到原点，企图呈现的是一个真实独特的女生，一首首纯粹深刻的音乐，低调而充满感动力的的开场，全新勾勒歌手的魅力与独特的市场定位，也是迈向一 个新阶段的开始和延续的重要关键',55,18,0,20);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('0602527003399', '爵士', '唱片', 'Zee Avi', '个来自未开发的大自然东马岛屿上的女生，身材娇小却在YouTube上累积了超过150万网友，Zee Avi用她的歌声再度证明了一句俗谚：「音乐无国界」。用创作获得Brushfire唱片公司的赏识，将自己的才华与传奇人物连结在一起。以拿手的吉他、夏威夷四弦琴(Ukulele)，搭配上独特慵懒舒服的嗓音，打造自成一格的音乐氛围，Zee Avi一手包办专辑所有词曲创作。首支主打曲在Folk领域中混搭爵士味觉的“Bitter Heart”，令人想起多项格莱美奖加冕的Norah Jones相同质感；接下来散发淡淡闲适',99,20,3,20);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('0827969309025', '爵士', '唱片', 'Classic Meets Cuba', '·当古典遇上古巴·莫扎特大跳曼波/贝多芬·舞动着·命运的骚沙·悲怆的恰恰恰/古巴女子卡门·与·来自非洲的大黄蜂/一齐聆听·布拉姆斯·爵士摇篮曲',44,20,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787798635928', '摇滚', '唱片', '愿爱无忧', '继《这是个问题》、《不要停止我的音乐》、《改变你的生活》后，痛仰全长专辑。这支乐队，死磕的时候被扛成大旗，试图和解时又被错认成楷模，时至今日，在竞相催眠的时代里，却偏偏把自己酿成了水，变成了充盈剔透的精神透镜。而你我这些微光，则决定着透镜反射的颜色，决定着精神所能投射出的强度。',55,20,30,120);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787798635393', '摇滚', '唱片', '相見恨晚', NULL,15,2,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787880777017', '古典', '唱片', '卡农绝赞', '卡农的作者，德国作曲家帕海贝尔（1653-1706），是巴洛克时期相当重要的作曲家，他的音乐影响了音乐之父巴哈。“卡农”是现今为止最受全世界的喜爱的古典音乐作品，曾称霸美国告示牌流行音乐排行榜长达百周以上。据统计，到目前为止世界上重新演绎的卡农版本达2000余种！如果帕海贝尔还在世的话，可能是全世界版税收入最高的音乐家。“卡农”并不是曲子的名字，而是一种音乐曲式，照字面上是“轮唱”的意思。简单说，就是有好几个声部的旋律重复出现，交织着演奏互相追随，让人有无退延伸的感觉。“卡农”全长仅五分钟，旋律简单仆实，',64,20,10,20);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787880457223', '古典', '唱片', '维瓦尔第：四季', '《维瓦尔第：四季》本碟是德国“小提琴女神”安妮·索菲·穆特与其音乐领路人欧洲指挥大帝卡拉扬早年为EMI留下的一款珍贵唱片。收录了音乐史上流行度最高的小提琴协奏曲——维瓦尔第创作的《四季》！意大利作曲家维瓦尔第本人就是音乐史上一位技艺精湛的小提琴家，同时也是小提琴协奏曲这种音乐演奏形式的发明者。《四季》是他卷帙浩繁的小提琴作品中流行度与艺术成就最高的一部！！据统计，《四季》很可能是全世界被唱片公司录制次数最多的小提琴作品！！',54,20,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787798626896', '民歌', '唱片', '安和桥北', '一个城市漫游者的安和桥北/他/在蓉城的祠堂敲打耳钟的空灵，/在太湖樵头尝过醉人的雨。/在筑城折下腊梅看尽风尘把酒，/在金陵的阅江楼巅览望江淮。/在西湖岸边撑起一把纸伞，/在凤凰城中贺兰山下轻嗅刺玫。/在商都品笑白居不易，/在浏阳河映出的星光里记起奶奶的微笑。/在金城的河床里荡起黄河谣/也在这里点燃一只兰州。',55,9,3,10);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787880891157', '民歌', '唱片', '梵高先生', '欢愉的孤独是什么？城市游吟诗人李志再次让我们体会孤独的别样滋味。他的第二张创作专辑《梵高先生》近期由支持独立好音乐的口袋音乐正式发行，过去只能收藏简陋小样的你们，可以再次的真切聆听来自内心的声音。',99,20,30,100);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('9787880900453', '金属', '唱片', '日光倾城', '首张专辑《日光倾城》以清馨的电子乐加以纯美的嗓音表达，个性且不失流行。专辑大胆融合了西方文化和中国情调的多元化曲风，并没有影响音乐强烈的整体感，音乐与词曲浑然一体，清馨而纯净，简单却不乏内涵，优雅且不浮躁。大概是乐团长期生活在青岛这座美丽的海滨半岛小城的缘故，聆听他们，有一种“词曲本天成，妙手偶得之”的感觉。也许是淳朴自然的气息总能给人以简单却震撼心灵的力量，所以尽管作品专注于成人内心世界的游吟浅唱，却难得地渗透着童话式的纯真。专辑《日光倾城》所有的词曲和制作由卡奇社独立完成',120,20,100,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('0724384497828', '金属', '唱片', 'Moon Safari', '他们是一支流行电子乐队，乐风抒情悦耳。2001年的专辑《10千赫传奇》(100HzLegend)将Air愈发成熟、具有惊人的深度和美感的音乐才华展现无遗。其中既有轻快的曲调，又有阴暗沉郁的声响 ',144,8,30,35);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('轩辕剑3外传天之痕', '角色', '游戏', '轩辕剑3外传天之痕', '本作是单机角色扮演游戏《轩辕剑》系列的第五代作品，也是该系列第二款外传作品。本次剧情的时间设定在隋朝末年，故事背景庞大复杂，以赤贯星贯穿整个故事，它的出现将神州九天结界划开一个口子，这个现象就是“天之痕”。伴随着这一事件的是，南陈皇室遗孤陈靖仇踏上复国之路，并被卷入一场精心布置的大阴谋和明争暗斗中。本作是《轩辕剑》系列的经典之作，以催人泪下的剧情和出色的水墨画备受赞誉，做到了当时一个角色扮演游戏理应做到却也是最难做的高度，后于2011年被改编成电视剧《轩辕剑之天之痕》，于2012年播出。',77,20,30,100);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('最终幻想10', '角色', '游戏', '最终幻想10', '最终幻想10中文版是一款以Spira的星球为背景的角色扮演游戏。最终幻想10是所有系列中比较理想化的一款游戏，强大的模拟器所赐，FFX不只是PS2的专利，PC也可以完美运行经典的FFX是你不想错过最佳理由。',22,3,10,20);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('魔域神兵', '角色', '游戏', '魔域神兵', '这是一款与火炬之光比较相似的ARPG游戏，由Rebelmind工作室开发制作。玩家可在3 大主角中选择其一开始游戏，无论是想体验奥妙华丽的魔法、百发百中的弓术和枪法，或是破坏力十足的近战威力，都能如你所愿。游戏中提供有 15 类武器，搭配上魔法、炼金术等奇幻元素，玩家可以打造独有的神兵利器，揭开邪恶术士的秘密，决定世界的未来。',54,24,30,40);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('红色警戒2', '即时', '游戏', '红色警戒2', '此红色警戒2合集的版本中一共包含了21个不同版本的红色警戒2。大家耳熟能详的尤里复仇以及共和国之辉自然是有的。还包括了更多的包括狂狮怒吼、中国雄起、兵临城下、第三帝国等等等等，就不在多做赘述。全部通过版本转换器1键进入不同的版本畅游红色警戒2游戏。',33,0,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('魔兽争霸3冰封王座', '即时', '游戏', '魔兽争霸3冰封王座', '《魔兽争霸3冰封王座》(WarcraftⅢ)暴雪第一次让"英雄"在一个即时战略游戏中起到了如此重要的作用，也让即时战略游戏进入到一个崭新的时期。在制作之前就广受关注的本作，即便现在流行了2 年多也丝毫不见衰退的痕迹，反而随着版本的更新而越来越焕发出勃勃生机。3C、TD、熊猫，暴雪驾驭游戏的能力得到了十足的体现，最大程度上给予玩家最大的可能，充分调动玩家的主动性和创造性。也许成为了一种定律，只有暴雪的游戏只有发布了资料片才能称之为"完整"，魔兽2、星际争霸、暗黑破坏神2等等无不如此，魔兽3也不例外。"冰峰王',87,20,30,20);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('暴力摩托2004', '竞速', '游戏', '暴力摩托2004', '暴力摩托2004中文版暴力摩托车”是一款与众不同的竞速类游戏，英文名叫“Road Rush”，移植于3DO游戏主机的一款动作赛车游戏。暴力摩托2004 其实就是暴力摩托2002 汉化以后的版本。',109,9,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('NBA2K', '竞速', '游戏', 'NBA2K', '作为目前最好的篮球游戏系列，NBA2K一年一度的盛宴是球迷们翘首以盼的。《NBA 2K14》将首次加入欧洲联赛的队伍，在3年后重新加入国际篮球因素。14只顶尖欧洲联赛俱乐部将会加入到游戏中。这些队伍可以在游戏中被选择用来对抗美国球队',44,1,30,50);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('罗马之路3', '益智', '游戏', '罗马之路3', ' 罗马的道路展示了宏伟的爱情故事，挑战的智慧和狡猾的凯撒，胡人地与野生森林，名利和成功都在等待你来征服！使罗马的精神和文化的野蛮人来修建道路并证明你是最好的和平与战争的罗马军团！画风漂亮。游戏是在规定时间内，开荒，并建造一条象征罗马征服蛮荒的路，途中要合理分配食物、木材、石头、发掘到宝石等等，不用动太多脑筋，很休闲、很好玩~',44,7,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('贸易帝国', '益智', '游戏', '贸易帝国', ' 贸易帝国中文版是2002年世纪雷神代理发行的一款大型模拟经营游戏，在《贸易帝国》中，玩家可以充分证明自己在商业经营方面的能力，因为游戏的背景是地球历史上最尔虞我诈的商业战场。沙漠、海峡、江河流域、大陆，到处都可以成为玩家的贸易帝国，庞大的人群会构成巨大的消费力量，帮助玩家完成自己的雄伟目标。而一旦忽视了供求关系和市场规律，等待玩家的则是破产的厄运。',21,16,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('炉石传说', '卡牌', '游戏', '炉石传说', '《炉石传说：魔兽英雄传》是一款在Windows、Mac系统上推出的免费策略类卡牌游戏。《炉石传说：魔兽英雄传》中国大陆地区独家运营权已被授予网易公司。',40,20,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('三国杀', '卡牌', '游戏', '三国杀', '三国杀》是中国传媒大学动画学院04级游戏专业学生基于bang规则设计，2009年6月底《三国杀》被移植至网游平台，推出Online版。最近又有热心网友自己将其做成了单机版，在《三国杀》游戏中，玩家将扮演一名三国时期的武将，结合本局身份，合纵连横，经过一轮一轮的谋略和动作获得最终的胜利。',22,14,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('反恐精英', '射击', '游戏', '反恐精英', 'CS是一种以团队合作为主的第一人称射击游戏，它是由著名游戏《半条命》（Half-Life）的其中一个游戏模组（MOD）衍生而成的游戏。虽然只是简单的一个MOD，但是它却在全世界风靡起来，WCG、CPL、ESWC等世界顶级电子竞技大赛都以CS1.6作为比赛项目。',11,9,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('使命召唤', '射击', '游戏', '使命召唤', '《使命召唤4：现代战争》第一次将第一次将该系列游戏的故事背景由二战时期转移到现代。游戏于2007年11月5日上市后立刻获得了玩家和媒体的好评，并拿下了众多游戏奖项。国外众多游戏评分机构纷纷为其打出高分，其中IGN为该游戏打出9.4分，而GameSpy则打出9.3分。',30,8,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('认知：艾丽卡里德的惊悚故事', '冒险', '游戏', '认知：艾丽卡里德的惊悚故事', NULL,44,2,10,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('睡梦之中', '冒险', '游戏', '睡梦之中', '《睡梦之中》是一款极度具有特色的第一人称恐怖新作。游戏的画面极度的昏暗，朦朦胧胧的，营造出了一种恐怖的气氛。游戏的操作非常的简单，全都是一些跑、跳、拿物品等的基本动作。《睡梦之中》主角非常的有意思，是一个小孩子，小孩子的无限想象力也使得游戏非常的有意思，我们能够进入他的世界来探秘一系列的神秘事件。',88,0,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('人鱼的旋律', '音乐', '游戏', '人鱼的旋律', '一个类似跳舞机模式的游戏，游戏的画面还可以，音乐也不错。',80,14,10,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('劲舞单机版', '音乐', '游戏', '劲舞单机版', '《劲舞单机版》是全球首款竞技舞蹈游戏《舞侠OL》单机版！虽然只是单机版，但是它同样拥有上百首劲爆舞曲，首创舞斗PK和音乐副本新玩法。你可以随时随地畅享音乐的世界。只要打开电脑，没有网络，也能即刻融入那疯狂、激情的乐舞之中。',98,2,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('植物大战僵尸', '休闲', '游戏', '植物大战僵尸', '《植物大战僵尸》是由PopCap Games为Windows、Mac OS X、iPhone OS和Android系统开发，并于2009年5月5日发售的一款益智策略类塔防御战游戏。玩家通过武装多种植物切换不同的功能，快速有效地把僵尸阻挡在入侵的道路上。不同的敌人，不同的玩法构成五种不同的游戏模式，加之黑夜、浓雾以及泳池之类的障碍增加了游戏挑战性。目前在PC上同时有普通版、年度版、Adobe Flash动画缩减版及正在公测的人人网社区版等多个版本。',87,20,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('超级玛丽', '休闲', '游戏', '超级玛丽', '我就是那个风靡全球20多年的红帽子水管工马里奥，采蘑菇、踩怪物、打BOSS、救公主，这都是我的拿手好戏。快跟我和我的兄弟路易基一起来冒险吧，我们就是威震江湖的超级玛丽兄弟！',122,14,0,20);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('The Grand Budapest Hotel', '剧情', '电影', '布达佩斯大饭店', '故事要从一位无名作家（裘德·洛 Jude Law 饰）说起，为了专心创作，他来到了名为“布达佩斯”的饭店，在这里，作家遇见了饭店的主人穆斯塔法（F·莫里·亚伯拉罕 F. Murray Abraham 饰），穆斯塔法邀请作家共进晚餐，席间，他向作家讲述了这座饱经风雨的大饭店的前世今生。',111,5,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('亲爱的', '剧情', '电影', '亲爱的', '文军（黄渤 饰）和鲁晓娟（郝蕾 饰）曾是一对恩爱的夫妻，然而，两人之间的感情却被时间和争吵消耗殆尽，最终，他们选择了离婚。如今，联系着两人的唯一枢纽，就是可爱的儿子田鹏。然而，某一天，这唯一的纽带也断裂了，田鹏于一次外出玩耍时无故失踪，绝望和崩溃之中，田文军与鲁晓 娟踏 上了漫漫寻子之路，并在途中结识了许多和他们一样无助的父亲和母亲们。',450,20,30,200);
INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('千と千尋の神隠し', '动画', '电影', '千与千寻', '千寻和爸爸妈妈一同驱车前往新家，在郊外的小路上不慎进入了神秘的隧道——他们去到了另外一个诡异世界—一个中世纪的小镇。远处飘来食物的香味，爸爸妈妈大快朵颐，孰料之后变成了猪！这时小镇上渐渐来了许多样子古怪、半透明的人。 千寻仓皇逃出，一个叫小白的人救了他，喂了她阻止身体消失的药，并且告诉她怎样去找锅炉爷爷以及汤婆婆，而且必须获得一分工作才能不被魔法变成别的东西。',450,20,30,200);


----------------插入一些默认入库记录-------------------
INSERT INTO 入库历史(入库单号, 入库时间, 条形码, 入库数量) VALUES ('Thu Nov 27 2014 16:44:27 GMT+0800 (中国标准时间)','1417077867351','0724384497828','10');
INSERT INTO 入库历史(入库单号, 入库时间, 条形码, 入库数量) VALUES ('Thu Nov 27 2014 16:44:22 GMT+0800 (中国标准时间)','1417077862170','9787798626896','200');





----------------插入一些默认的借出记录-------------------
INSERT INTO 借还(借还,借阅者,条形码,借出时间,归还时间) VALUES ('79092127','11','9787880891157','1417078065844','0');
INSERT INTO 借还(借还,借阅者,条形码,借出时间,归还时间) VALUES ('221862631','111','0724384497828','1417078127194','0');
INSERT INTO 借还(借还,借阅者,条形码,借出时间,归还时间) VALUES ('842045478','','千と千尋の神隠し','1417078189474','0')











