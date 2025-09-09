import { Annotate } from "./api.type";

/**
 * 添加注释
 * @param params
 * @returns
 */
export const addAnnotateService = async (params: Record<string, any>) => {
  return Promise.resolve({ success: true, data: "success" });
};

/**
 * 获取注释
 * @param params
 * @returns
 */
export const getAnnotationsService = async (params: Record<string, any>) => {
  const mockList: Annotate[] = [
    {
      uid: "y0c1hth9xga9hdain6qhg0kuyzkrllaw6bo1mmg5h3p33wbosrp2zwntvsomnkuj",
      data: {
        notes: [
          {
            userId: "A111111",
            userName: "otherUser",
            text: "这是其他用户的标注信息",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "A222222",
            userName: "otherUser",
            text: "这是其他用户的标注信息2",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "A333333",
            userName: "currentUser",
            text: "这是你自己的标注信息",
            date: 1753874324149,
            isMe: true,
          },
        ],
      },
      textBefore:
        "   \n                                                1. 为什么表格很重要\n                                                 表格是工作生活中，大家比较常用",
      text: "的数据可视化方式，其重要性不言而喻。",
      textAfter:
        "表格结构简单，分隔归纳明确，特别适合组织和展示大量的信息内容，易于用户浏览和获取信息。通过表格可以对信息数据进行排序、搜索、筛选、分页、自定义选项等复杂操作。表格的归纳与分类，使信息之间易于对比，便于用户快速查询其中的差异与变化、关联和区别。表格是数据的详",
      pageData: {
        url: "https://help.fanruan.com/dvg/doc-view-59.html",
        title: "为什么表格很重要- 数据分析与可视化指南",
        host: "help.fanruan.com",
      },
      startContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[5]",
        "P[1]",
        "#text[0]",
      ],
      endContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[5]",
        "P[1]",
        "#text[0]",
      ],
      startOffset: 15,
      endOffset: 33,
      color: "#2474b5",
      createDate: 1753874324149,
      updateDate: 1754154074160,
    },
    {
      uid: "z6v6j5f9hrw4d548rep43qtuxm89i0plupkl4mdcpmevfgfo01h407t5dzv5pu1a",
      data: {
        notes: [
          {
            userId: "B111111",
            userName: "otherUser",
            text: "这是其他用户的标注信息",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "B222222",
            userName: "otherUser",
            text: "这是其他用户的标注信息2",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "B333333",
            userName: "currentUser",
            text: "这是你自己的标注信息",
            date: 1753874324149,
            isMe: true,
          },
        ],
      },
      textBefore:
        "重要\n                                                 表格是工作生活中，大家比较常用的数据可视化方式，其重要性不言而喻。表格结构简单，分隔归纳明确，特别适合组织和展示大量的信息内容，易于用户浏览和获取信息。",
      text: "通过表格可以对信息数据进行排序、搜索、筛选、分页、自定义选项等复杂操作。\n\n表格的归纳与分类，使信息之间易于对比，便于用户快速查询其中的差异与变化、关联和区别。\n\n表格是数据的详情罗列，能看到明细信息，相比较图表，能给用户更清晰、直观的数据体验。",
      textAfter:
        "因此，在很多场景下，大家会直接选用表格来表达数据、传递信息，或者通过图表结合的表格来传递和表达。 \n                                                2. 表格的组成要素\n                   ",
      pageData: {
        url: "https://help.fanruan.com/dvg/doc-view-59.html",
        title: "为什么表格很重要- 数据分析与可视化指南",
        host: "help.fanruan.com",
      },
      startContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[5]",
        "UL[2]",
        "LI[1]",
        "P[0]",
        "#text[0]",
      ],
      endContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[5]",
        "UL[2]",
        "LI[3]",
        "P[0]",
        "#text[0]",
      ],
      startOffset: 0,
      endOffset: 41,
      color: "#43b244",
      createDate: 1753874324149,
      updateDate: 1754154074160,
    },
    {
      uid: "vh89i6tft1geabl3bmreclcq61r4nqzinml7rfcyjjqk8v2wsz3ioq10tzqa77m8",
      data: {
        notes: [
          {
            userId: "C111111",
            userName: "otherUser",
            text: "这是其他用户的标注信息",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "C222222",
            userName: "otherUser",
            text: "这是其他用户的标注信息2",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "C333333",
            userName: "currentUser",
            text: "这是你自己的标注信息",
            date: 1753874324149,
            isMe: true,
          },
        ],
      },
      textBefore:
        "能清楚到看到数据内容。 \n                                                3. 有那些类型的表格\n                                                 分类说明示例",
      text: "行表头表格\t\n行表头表格表头在行，为制表中的常用形式，表头可在上，可在下，一般在上。\n\n行表头表格会弱化列的存在，强调行信息的连贯性，适用于用户阅读信息时是从左到右逐条扫描的场景。",
      textAfter:
        "列表头表格列表头表格表头在列，一般不常用。列表头表格通过强化列的视觉特征来突出不同列信息的对比，适用于用户阅读信息时是从上到下逐条扫描的场景。行列表头表格行列表头表格有行表头和列表头，在制表中也极为常见。行列表头表格每个表头都是一个维度，适用于从两个维度来",
      pageData: {
        url: "https://help.fanruan.com/dvg/doc-view-59.html",
        title: "为什么表格很重要- 数据分析与可视化指南",
        host: "help.fanruan.com",
      },
      startContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[13]",
        "TABLE[1]",
        "TBODY[0]",
        "TR[1]",
        "TD[0]",
        "#text[0]",
      ],
      endContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[13]",
        "TABLE[1]",
        "TBODY[0]",
        "TR[1]",
        "TD[1]",
        "P[1]",
        "#text[0]",
      ],
      startOffset: 0,
      endOffset: 46,
      color: "#e3b4b8",
      createDate: 1753874324149,
      updateDate: 1754154074160,
    },
    {
      uid: "msik6lwoenld6u45bya261gev0fcibyoqccoan69klmti79omt2jkva7m8lacct8",
      data: {
        notes: [
          {
            userId: "D111111",
            userName: "otherUser",
            text: "这是其他用户的标注信息",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "D222222",
            userName: "otherUser",
            text: "这是其他用户的标注信息2",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "D333333",
            userName: "currentUser",
            text: "这是你自己的标注信息",
            date: 1753874324149,
            isMe: true,
          },
        ],
      },
      textBefore:
        "                            2. 表格的组成要素\n                                                 表格一般由标题、表头、单元格组成。有些可能会因为场景需要，需要再加些图例备注等。",
      text: "表格标题：表格信息内容的整体概括。标题应该尽可能回答三个问题，「何事、何地、何时」。\n\n表头：表格信息的属性分类或基本概括，表头在能够概括的情况下，尽量简练、准确。\n\n单元格：具体信息内容的填充区域，一般要求格式要整齐，能清楚到看到数据内容。",
      textAfter:
        " \n                                                3. 有那些类型的表格\n                                                 分类说明示例行表头表格行表头表格表",
      pageData: {
        url: "https://help.fanruan.com/dvg/doc-view-59.html",
        title: "为什么表格很重要- 数据分析与可视化指南",
        host: "help.fanruan.com",
      },
      startContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[9]",
        "UL[2]",
        "LI[0]",
        "P[0]",
        "#text[0]",
      ],
      endContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[9]",
        "UL[2]",
        "LI[2]",
        "P[0]",
        "#text[0]",
      ],
      startOffset: 0,
      endOffset: 37,
      color: "#2474b5",
      createDate: 1753874324149,
      updateDate: 1754154074160,
    },
    {
      uid: "mka4rphzbr9lava0cl6968hqsf0j3cm90knyxhcldd4er9mo9i2cxqmd7imh9iv8",
      data: {
        notes: [
          {
            userId: "E111111",
            userName: "otherUser",
            text: "这是其他用户的标注信息",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "E222222",
            userName: "otherUser",
            text: "这是其他用户的标注信息2",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "E333333",
            userName: "currentUser",
            text: "这是你自己的标注信息",
            date: 1753874324149,
            isMe: true,
          },
        ],
      },
      textBefore:
        "为制表中的常用形式，表头可在上，可在下，一般在上。行表头表格会弱化列的存在，强调行信息的连贯性，适用于用户阅读信息时是从左到右逐条扫描的场景。列表头表格列表头表格表头在列，一般不常用。列表头表格通过强化列的视觉特征来突出不同列信息的对比，适用于用户阅读信息",
      text: "时是从上到下逐条扫描的场景。",
      textAfter:
        "行列表头表格行列表头表格有行表头和列表头，在制表中也极为常见。行列表头表格每个表头都是一个维度，适用于从两个维度来观察数据的场景。多层表头表格多层表头表格比上述三种表格复杂了一些，多层表头表格可以行表头多层，也可以列表头多层，也是常用的一种表格形式。多层表",
      pageData: {
        url: "https://help.fanruan.com/dvg/doc-view-59.html",
        title: "为什么表格很重要- 数据分析与可视化指南",
        host: "help.fanruan.com",
      },
      startContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[13]",
        "TABLE[1]",
        "TBODY[0]",
        "TR[2]",
        "TD[1]",
        "P[1]",
        "#text[2]",
      ],
      endContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[13]",
        "TABLE[1]",
        "TBODY[0]",
        "TR[2]",
        "TD[1]",
        "P[1]",
        "#text[2]",
      ],
      startOffset: 10,
      endOffset: 24,
      color: "#e2d849",
      createDate: 1753874324149,
      updateDate: 1754154074160,
    },
    {
      uid: "oc5p24tu3y8xit8j8szciprjl1kh9o43uh962pgb6clllw6g23lxc72bqmzlq4h2",
      data: {
        notes: [
          {
            userId: "F11111",
            userName: "otherUser",
            text: "这是其他用户的标注信息",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "F222222",
            userName: "otherUser",
            text: "这是其他用户的标注信息2",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "F333333",
            userName: "currentUser",
            text: "这是你自己的标注信息",
            date: 1753874324149,
            isMe: true,
          },
        ],
      },
      textBefore:
        "户浏览和获取信息。通过表格可以对信息数据进行排序、搜索、筛选、分页、自定义选项等复杂操作。表格的归纳与分类，使信息之间易于对比，便于用户快速查询其中的差异与变化、关联和区别。表格是数据的详情罗列，能看到明细信息，相比较图表，能给用户更清晰、直观的数据体验。",
      text: "因此，在很多场景下，大家会直接选用表格来表达数据、传递信息，或者通过图表结合的表格来传递和表达。",
      textAfter:
        " \n                                                2. 表格的组成要素\n                                                 表格一般由标题、表头、单元格组成。有",
      pageData: {
        url: "https://help.fanruan.com/dvg/doc-view-59.html",
        title: "为什么表格很重要- 数据分析与可视化指南",
        host: "help.fanruan.com",
      },
      startContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[5]",
        "P[3]",
        "#text[1]",
      ],
      endContainerPath: [
        "DIV[2]",
        "DIV[1]",
        "DIV[11]",
        "DIV[3]",
        "DIV[3]",
        "DIV[5]",
        "P[3]",
        "#text[1]",
      ],
      startOffset: 0,
      endOffset: 48,
      color: "#4b2e2b",
      createDate: 1753874324149,
      updateDate: 1754154074160,
    },
  ];
  const mockList2: Annotate[] = [
    {
      uid: "d2nrbg1zmx33a8rjd3erz7ga0kha85f7m7he0rp5rnbbj2ov1ujbf0dfm992mivw",
      data: {
        notes: [
          {
            userId: "P111111",
            userName: "晓响雷电王提督",
            text: "2020年8月4日，鹿鳴上传了视频《从今天起，你每天都可以见到鹿鸣了》，公开其身份為米哈遊旗下虛擬主播[7]。同日，米哈游推出动态桌面壁纸软件《人工桌面》（英語：N0va Desktop[a]），於Windows平臺發佈，軟體完全免費[9]。軟體中包含多種以鹿鳴為主題的動態壁紙[9]。12月1日，《人工桌面》追加Android平臺，首日即登TapTap热门榜、新品榜榜首，應用商店评分达8.2[4]。同日，鹿鳴bilibili、YouTube賬號發佈了推广视频《唤醒鹿鸣，体验暖心陪伴》，在一天內获得近60万播放量，获赞5.3万，全站排行榜最高播放排名55名",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "P222222",
            userName: "Christinaao",
            text: "在物理中牛顿（Newton，符号为N）是力的公制单位。它是以创立经典力学的艾萨克·牛顿（Sir Isaac Newton）命名。牛顿是一个国际单位制导出单位，它是由kg·m/s²的国际单位制基本单位导出",
            date: 1753874324149,
            isMe: false,
          },
          {
            userId: "P333333",
            userName: "曦芷凨祤",
            text: "劉偉表示，鹿鸣未来会在直播中与公众见面，「直播会达到和离线内容完全相同的品质，动作和声音都实时呈现给观众」",
            date: 1753874324149,
            isMe: true,
          },
        ],
      },
      textBefore:
        "系方式个人中心牛顿播报编辑讨论2上传视频物理学单位展开20个同名词条牛顿：国际单位制中力的单位01:05重力单位：物理学中的一个重要单位00:48收藏14178299本词条由“科普中国”科学百科词条编写与应用工作项目 审核 。牛顿（Newton），简称牛，",
      text: "符号为N",
      textAfter:
        "。是一种衡量力的大小的国际单位，以科学家 艾萨克·牛顿（Isaac Newton）的名字而命名。在国际单位制(SI)中，力的计量单位为牛顿。牛顿的定义是：加在质量为1kg的物体上，使之产生1m/s2加速度的力为1N。其量纲为[F]=M・L・T-2，即：1N",
      pageData: {
        url: "https://baike.baidu.com/item/%E7%89%9B%E9%A1%BF/5489111",
        title: "牛顿（物理学单位）_百度百科",
        host: "baike.baidu.com",
      },
      startContainerPath: [
        "DIV[0]",
        "DIV[0]",
        "DIV[1]",
        "DIV[1]",
        "DIV[0]",
        "DIV[0]",
        "DIV[0]",
        "DIV[2]",
        "DIV[1]",
        "SPAN[0]",
        "#text[0]",
      ],
      endContainerPath: [
        "DIV[0]",
        "DIV[0]",
        "DIV[1]",
        "DIV[1]",
        "DIV[0]",
        "DIV[0]",
        "DIV[0]",
        "DIV[2]",
        "DIV[1]",
        "SPAN[0]",
        "#text[1]",
      ],
      startOffset: 15,
      endOffset: 4,
      color: "#e3b4b8",
      createDate: 1753874324149,
      updateDate: 1754154074160,
    },
  ];
  const annotateObj: { [key: string]: Annotate[] } = {
    "https://help.fanruan.com/dvg/doc-view-59.html": mockList,
    "https://baike.baidu.com/item/%E7%89%9B%E9%A1%BF/5489111": mockList2,
  };
  const sortedList = annotateObj[params.path as string] || [];
  return Promise.resolve({ success: true, data: sortedList });
};

/**
 * 更新注释
 * @param params
 * @returns
 */
export const updateAnnotateService = async (params: Record<string, any>) => {
  return Promise.resolve({ success: true, data: params });
};

/**
 * 删除注释
 * @param params
 * @returns
 */
export const deleteAnnotateService = async (params: Record<string, any>) => {
  return Promise.resolve({ success: true, data: params });
};
