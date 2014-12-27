/**
 * Created by Administrator on 14-11-20.
 */
$(function () {
    if(!store.get('db_'+$this.学号)){
        $("#fristRun").modal({
            keyboard:false,
            title:$this.课程设计名
        }).modal('show');
        $('.FristRun').click(function () {
            $this.start();
        });
    }else{
        //初始化总览数据;
        sql.runSQL('SELECT 类型名, 父类型, COUNT(类型名) DVD种类,SUM(库存) 总库存,SUM(出租在外) 总出租在外,SUM(已出售) 总出售,SUM(总共借出次数) 总借出次数 FROM DVD GROUP BY 类型名,父类型 ORDER BY 父类型',[],'zonglan');
        //初始化全部DVD数据；
        setTimeout(function () {
            sql.runSQL('SELECT * FROM DVD',[],'allDVD');
        },100);
        //依次初始化五个类别
        setTimeout(function () {
            sql.runSQL("SELECT * FROM 类型 where 父类型='唱片'",[],'唱片');
        },200);
        setTimeout(function () {
            sql.runSQL("SELECT * FROM 类型 where 父类型='电影'",[],'电影');
        },300);
        setTimeout(function () {
            sql.runSQL("SELECT * FROM 类型 where 父类型='电视'",[],'电视');
        },400);
        setTimeout(function () {
            sql.runSQL("SELECT * FROM 类型 where 父类型='游戏'",[],'游戏');
        },500);
        setTimeout(function () {
            sql.runSQL("SELECT * FROM 类型 where 父类型='其他'",[],'其他');
        },600);
        //入库历史
        setTimeout(window.f_ruku=function () {
            sql.runSQL("SELECT * FROM 入库历史 ORDER BY 入库时间 DESC",[],'入库历史');
        },600);
        //借还表
        setTimeout(function () {
            sql.runSQL("select 借还.借还,借还.借阅者,借还.条形码,借还.借出时间,DVD.父类型,DVD.具体名 from 借还,DVD where 借还.条形码=DVD.条形码 AND 借还.归还时间=0 ORDER BY 借出时间",[],'未还VCD列表');
        },700);
        //$('table.datatable').datatable({sortable: true});//初始化数据表格,需等页面数据加载完成后再运行
        //通过URL来固定最后访问的标签
        $hash=location.hash?location.hash:'';
        if($hash){
            $("#myTab a[href='"+$hash+"']").tab('show');
        }
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            e.target;
            //console.log(e);
            window.history.pushState({},0,''+ e.target.hash);
        });
        //添加类别模态框显示时出发
        $('#addClass').on('shown.zui.modal', function()
        {
            $('.'+window.$addClass).attr('selected','selected');
        });
        //库存添加按钮
        $('.addRuKu').click(function () {
            window.ruku=2;
        });
        $('.newRuKu').click(function () {
            window.ruku=1;
        });
        $('.quityRuKu').click(function () {
            window.ruku=0;
        });
        $('#VCDRuKu').on('shown.zui.modal', function () {
            类别();
            if(window.ruku==2){// window.ruku 0：自动，1新增，2：追加
                $('#newRuKu').addClass('hidden');
                $('#addRuKu').removeClass('hidden');
            }
            if(window.ruku==1){
                $('#newRuKu').removeClass('hidden');
                $('#addRuKu').addClass('hidden');
            }
            if(window.ruku==0){
                $('#newRuKu').removeClass('hidden');
                $('#addRuKu').addClass('hidden');
            }
            sosuo();
        })
    }
})
//删除一个类别
removeClass= function (_fclass,_class) {
    sql.runSQL("UPDATE DVD SET 类型名 = '默认' WHERE 类型名 like '"+_class+"' and 父类型 like '"+_fclass+"'",[],'移动类型');
    //console.log("UPDATE DVD SET 类型名 = '默认' WHERE 类型名 like '"+_class+"' and 父类型 like '"+_fclass+"'");
    TOOL.message('移动至默认分类');
    setTimeout(function () {
        sql.runSQL("DELETE FROM 类型 WHERE 类型名 like '"+_class+"' and 父类型 like '"+_fclass+"'",[],'删除分类');
        TOOL.message('删除分类');
        setTimeout(function () {
            location.reload();
        },1000)
    },1000)
}
rukuX= function (_tiao) {
    //window.last_tiao=_tiao;
    window.ruku=4;
    $("#VCDRuKu").modal({
        title:_tiao+'入库'
    }).modal('show');
    $('#addRuKu').removeClass('hidden');
    $('#newRuKu').addClass('hidden');
    $('.input_isbn').val(_tiao);
}
guihuan= function ($id) {
    sql.runSQL("UPDATE 借还 SET 归还时间="+(Date.now())+" where 借还 = "+$id ,[],"修改归还表");
    sql.runSQL("UPDATE DVD SET 库存 = 库存+1,出租在外=出租在外-1 WHERE 条形码='"+$id+"'",[],"修改DVD库存");
}
$('.input_isbn').keyup(sosuo=function () {
    //当VCD入库条形码输入框里按下键盘时，查询数据库。
    if($('.input_isbn').val()){
        sql.runSQL("select * from DVD where 条形码 like '"+$('.input_isbn').val()+"'",[],'搜索');
    }
});
$('.父类别').change(类别=function(){
    sql.runSQL("SELECT * FROM 类型 where 父类型='"+$('.父类别').val()+"'",[],'类别选择');
});
$('.save').click(function () {
    if($('#addRuKu').is('.hidden')){
        //新增
        var $条形码=$('#isbn').val();
        var $父类型=$('.父类别').val();
        var $库存=$('#newNum').val();
        var $类型名=$('.子类型').val();
        var $具体名=$('#title').val()||$条形码;
        var $VCD介绍=$('#content').val();
        if($条形码&&$类型名&&$父类型&&$具体名&&$库存){
            sql.runSQL("INSERT INTO `dvd` (`条形码`, `类型名`, `父类型`, `具体名`, `VCD介绍`, `库存`, `已出售`, `出租在外`, `总共借出次数`) VALUES('"+$条形码+"', '"+$类型名+"', '"+$父类型+"', '"+$具体名+"', '"+$VCD介绍+"','"+$库存+"',0,0,0);",
                [],
                '入库');
            TOOL.message('稍后');
        }
        else
        TOOL.message('你是不是少填了什么？','warning','top');
    }else{
        //追加
        var $条形码=$('#isbn').val();
        var $库存=$('#addNum').val();
        if($条形码&&$库存){
            sql.runSQL("UPDATE DVD SET 库存 = 库存+"+$库存+" WHERE 条形码 like '"+$条形码+"'",[],'追加库存');
            TOOL.message('稍后');
        }
    }
});
$('#VCD类型管理').delegate(".ClickaddClass",'click',function(){
    window.$addClass=$(this).attr('data-this');
    $('.'+$(this).attr('data-this')).attr('selected','selected');
})
$('.addClass').click(function () {
    var $父类型=$('.addClassFrom').val();
    var $类型名=$('#addClassThis').val();
    if($父类型&&$类型名){
        sql.runSQL("INSERT INTO 类型(类型名, 父类型) VALUES ('"+$类型名+"', '"+$父类型+"')",[],'添加类型');
        TOOL.message('稍后');
    }else{
        TOOL.message('你是不是少填了什么？');
    }
});
//出租成功。
$('#chujie').delegate('.chujieYes','click', function () {
    var $VCD=$('.vcd-id').val();
    var $people=$('.people-id').val();
    window.rand=Math.floor(Math.random()*1000000000) //生成9位随机数
    sql.runSQL("INSERT INTO 借还(借还,借阅者,条形码,借出时间,归还时间) VALUES ('"+window.rand+"','"+$people+"','"+$VCD+"','"+(Date.now())+"','0')",[],"借出成功");
    sql.runSQL("UPDATE DVD SET 库存 = 库存-1,出租在外=出租在外+1,总共借出次数=总共借出次数+1 WHERE 条形码='"+$VCD+"'",[],"");
    $('#code').qrcode({
        render: "canvas", //table方式
        width: 250, //宽度
        height:250, //高度
        text: rand+'' //任意内容
    });
    $('#code').before('<p style="text-align: center;">请将下面的二维码打印出来贴与出借VCD外盘</p>');
    $('.chujieYes').after('<button type="button" class="btn btn-success 打印" data-dismiss="modal">打印</button>').remove()
});
//打印
$('#chujie').delegate('.打印','click', function () {
    $canvas=$('#code>canvas')[0];
    var imgURI = $canvas.toDataURL('image/png')
    var image = document.createElement('img')
    image.src = imgURI
    var newwin= window.open('','newwindow','height=330,width=300,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
    newwin.document.write('<div style="border: 4px double #00f;width: 250px;">'+image.outerHTML+
    '<div style="text-align: center;font-family: &quot;微软雅黑&quot;;color: #9D9D9D;font-size: 12px;">' +
        ('租借号：'+window.rand) +   '</div><div style="text-align: center;font-family: &quot;微软雅黑&quot;;color: #111;">' +
        ($('.vcd-id').val())+'</div></div>');
    setTimeout(function () {
        newwin.print();
    },1000)
});
//显示出借框时，
$('#chujie').on('show.zui.modal', function () {
    $('#chujie').data('jie',$('#chujie').html());
})
//出借框隐藏时，删除保存在出借框中的内容
$('#chujie').on('hide.zui.modal', function () {
    $('#chujie').html($('#chujie').data('jie'));
})
$('.vcdsousuo').keyup(function () {
    //select * from DVD where 具体名 like '%1%' OR 条形码 like '%1%'
    var vcdsousuo=$('.vcdsousuo').val();
    if(vcdsousuo)
    sql.runSQL("select 条形码,父类型,类型名,具体名,库存 from DVD where 具体名 like '%"+vcdsousuo+"%' OR 条形码 like '%"+vcdsousuo+"%'",[],'出租搜索');
});
$('.AllSousuo').keyup(function () {
    var vcdsousuo=$('.AllSousuo').val();
    //console.log("SELECT * FROM DVD where 具体名 like '%"+vcdsousuo+"%' OR 条形码 like '%"+vcdsousuo+"%'");
    sql.runSQL("SELECT * FROM DVD where 具体名 like '%"+vcdsousuo+"%' OR 条形码 like '%"+vcdsousuo+"%' OR VCD介绍 like '%"+vcdsousuo+"%'",[],'allDVD');
});
//借出历史中搜索
$('.input-id-jie').keyup(f_jie=function () {
    var $id=$(".input-id-jie").val();
    sql.runSQL("select 借还.借还,借还.借阅者,借还.条形码,借还.借出时间,DVD.父类型,DVD.具体名 from 借还,DVD where 借还.条形码=DVD.条形码 and ( 借还 like '%"+$id+"%'OR 借阅者 like '%"+$id+"%') and 借还.归还时间=0 ORDER BY 借出时间",[],'未还VCD列表');
})
xiugai= function ($str) {
    $('.input-id-shou').val($str+'');
    $("#myTab a[href='#VCD零售管理']").tab('show');
}
$('.sousuoming').delegate('.VCDjiechu','click',function () {
    var $条形码=$(this).parent().prev().prev().prev().text().replace('条形码:','');
    var $实际名=$(this).parent().prev().prev().text();
    console.log($条形码, $实际名);
    $('.vcd-id').val($条形码);
    $("#chujie").modal().modal('show');
});
$('.chushouOK').click(function () {
    var $id=$('.input-id-shou').val();
    var $num=$('.input-id-num').val();
    if($id&&$num){
        sql.runSQL("INSERT INTO 出售历史(ID,出售时间,条形码,出售数量) VALUES('"+(Date.now()%1000000000)+"','"+(Date.now())+"','"+$id+"',"+$num+")",[],'添加出售记录');
    }else{
        TOOL.message("你是不是少填了什么?");
    }
});
biao= function (str,str2) {
    if(str2){
        var str1=str;
        try{
            str1=str1.replace((new RegExp(str2,'gmi')),'<span class="bg-warning">'+str2+'</span>');
            return str1;
        }catch(e){
            return str;
        }
    }
    else
    return str;
}