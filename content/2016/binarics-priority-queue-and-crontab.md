---
title: Binarics：优先级队列和定时任务
date: 2016-04-07 07:00:00
layout: post
---

1998 年发布的游戏《博德之门》时隔十八年又出了一个资料片。一下勾起了我大学的回忆。

那时候玩《博德之门 2》如醉如痴，遗憾的是没有玩完，只玩到大概三分之一。卸载之前保存下来了进度文件，如今早不知道丢哪去了。

随着年龄增长，渐渐失去了对游戏的兴趣。当我快30岁的时候，出了一套适配高分辨率的翻新版博德二，毫不犹豫地买下。钱早就不是问题，时间也有，但物是人非，再也回不去当年的状态。

想想挺后悔的，博德二是最好的 RPG 没有之一，可我就那样错过了。有些珍贵的东西，只在某个特定时期才珍贵，一旦错过，便永远错过。

希望这样遗憾的事不再发生。下面探讨一下如何做到。

计算机科班出身的我，对人的理解有时候真不如对计算机。过去人们仿照生物的样子来造机器，是仿生学（bionics），现在我反过来借鉴计算机的原理来改善自身。

我特地造了一个词，叫 binarics（由二进制 binary 衍生而来）。计划写一个系列。本文是该系列的第一篇。

<split></split>

最能决定人生高度的，是那些重要却不紧急的事。比如学习某项技能，需要大量的时间投入。然而本该投入到这些任务上的时间却被其他事情挤占，我们经常会给自己找各种理由来解释为什么「没有时间」，但其实我们内心很清楚，并不是没有时间，而是浪费在一些没有价值的琐事上，又或是精力过于分散，很多事只开了头而没有继续跟进。

解决不专一的问题，又有可能矫枉过正，比如做这样的决定：但凡能自由支配的时间，只用来做一件事。

方向是对的，但细节上过于激进。举个例子，你打算学习前端开发，结果强求自己除了工作时间之外都用来学习。那你还有时间锻炼和休息吗？还有时间陪家人吗？很快你的身体出了状况或者家庭出了问题，会严重干扰系统的稳定性。越是需要长期大量的时间投入，系统的稳定性就越宝贵。

下面来解释，如何使用优先级队列配合定时任务来搞定这事。

什么是优先级队列？就是一个能插队的队列，优先级高的任务可插到前面。需要指出的是，这个优先级队列不用来管理小任务，只管理重量级的大任务（需耗费 60 个小时以上，且每个任务都有优先级数值）。也就是说，如果另一个大任务想插队，势必是一个非常重的操作，需要重新评估优先级，慎重地修改优先级的值后再做调整。

这样做的目的是，让优先大任务队列保持精简，从而能够常驻内存（大脑）。我们清醒地知道目前队列第一位的是哪个任务。不断强化这个任务的印象，把任务的名字烧进你的大脑。之后，只要有可支配的时间，都用来做这一项任务。

可生活不只有一件事要做，就像人不仅要呼吸，还要喝水吃饭休息，缺一不可。这些必须要做的事，往往是例行的，不妨为它们分配固定的时间，比如每天21:00-21:40锻炼，23:30-06:00睡觉。这些时间并没有浪费，而是消耗在了无可避免的系统维护上，为的是稳定和长远，程序员应该不难理解这一点。设置定时任务，是不是很像 crontab 做的事，只不过执行者换成了人，提醒的方式换成了闹钟。

来个 demo 吧，拿我自己做例子：

优先级队列：
1. 以 Node.js 为主的后端知识积累（优先级100）
2. 以 React.js 为主的前端知识积累（优先级70）
3. 做 banned.photo 项目（优先级50）

定时任务：
- 21:10-21:50 锻炼
- 22:30-23:10 阅读
- 00:00-06:00 睡觉