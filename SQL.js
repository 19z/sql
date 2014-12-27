SQL = function(){
    $this=this;
    this.学号='1208020210';

    this.课程设计名='音响店VCD销售、出售管理系统';
    this.课程设计副标题='计信系网络工程专业-葛瑞';
    this.课程设计信息='HELLO SQL';
    this.fristrun='';

    this.db_name=this.学号;
    try{
        !openDatabase;
        $this.enable=true;
    }catch (e){
        $this.enable=false;
    }





    store=window.store;//初始化store
    //初始化
    this.start=function(){
        if(!store.get('db_'+$this.学号)){
            $.get("frist.sql", function(result){
                $this.fristrun = result;//从文件加载进来的首次运行执行的SQL列表；
                $this.runSQLList($this.fristrun,isfrist=1);
                store.set('db_'+$this.学号,true);//防止重复初始化
            });
            return 0;
        }
        return 1;

    }

    this.restart=function(){
        store.remove('db_'+$this.学号);
    }

    this.db=openDatabase($this.db_name, "", $this.课程设计名,10737418240 , function () { });

    //运行一组以分号间隔的SQL
    this.runSQLList=function(_sql_list,isfrist){
        sql_list=_sql_list.split(';');

        sql_re=true;
        sql_listlength=sql_list.length;
        for(i=0;i<sql_listlength&&sql_re;i++){
            var $runt=100*(i+1)/sql_listlength;
            $this.runSQL(sql_list[i],[],$runt);

        };
        //手动创建触发器
        $this.runSQL("CREATE TRIGGER 修改\
        AFTER UPDATE ON DVD\
        FOR EACH ROW\
        BEGIN\
        INSERT into 修改历史 values ( new.条形码,old.库存 , new.库存-old.库存 ,time());\
        END;",[],'创建触发器');

    }
    window.runSQLList=$this.runSQLList;

    /**运行单个SQL。并将运行结果，运行时间保存到store，last中
     * 其中，last保存的是一组数据（而不是单独最后一个），
     *运行成功后，将执行 TOOL.scress,否则执行SQL.warning
     */
    this.runSQL=function(_sql,arr,$from){
        //$from引入一个参数，表示来源，方便在TOOL.scress 和TOOL.error中鉴别。
        _sql=_sql.replace(/-{5,}[^\n]*-{5,}/g,'');
        _sql=_sql.replace(/(^\s*)|(\s*$)/g, "");
        if(!$this.enable){
            return null;
            TOOL.cannotSQL();
        }
        db_name=$this.db_name;
        this.db.transaction(function(tx){
            //开始执行SQL；
            tx.executeSql(
                _sql,//执行的SQL
                arr,//随SQL引入的参数
                function(ts,result){//回调函数，运行成功时执行
                    console.log(ts,result);
                    console.log( TOOL.sqlRes(result))
                    //result保存的是运行结果。result.rows.item(3)取出第三行，result.rows.length为结果行数。只有查询才有结果，否则result为undefined
                    _last=store.get('last');
                    if(typeof (_last)=='undefined')
                        _last=[];
                    _last.unshift($last={
                        time:(new Date()).getTime(),
                        sql:_sql,
                        error:false,//表示没有错误.
                        result:TOOL.sqlRes(result)
                    });
                    store.set('last',_last);

                    TOOL.scress($last,$from);

                },
                function (ts,error) {//毁回调函数，运行失败时调用。
                    //error={code: 5,message: "could not prepare statement (1 no such table: Course)"}
                    console.log(ts,error);

                    _last=store.get('last');
                    if(typeof (_last)=='undefined')
                        _last=[];
                    _last.unshift($last={
                        time:(new Date()).getTime(),
                        sql:_sql,
                        error:error
                    });
                    store.set('last',_last);

                    TOOL.error(error,$from);
                }
            );
        });
    }


}




/*
sql执行结果，result的返回为SQLResultSet {rowsAffected: 1, insertId: 5, rows: SQLResultSetRowList}
其中rowsAffected为影响行数。
当执行的是插入时，insertId为插入数据的id。
 rows为查询结果，
 rows.item(i)为查询结果中的第几行数据
 */

TOOL={

     timeview:function(timenum){
        _time = new Date(timenum);//设定的时间
        _thisTime = new Date();//当前时间
        if (_thisTime.getTime() - _time.getTime() < 60) {
            return "一分钟以内";
        } else {
            if ((_time.getMonth() == _thisTime.getMonth()) && (_time.getDate() == _thisTime.getDate())) {
                return '今天' + _time.getHours() + ':' + (nu = function (num) {
                    if (num < 10)return '0' + num; else return '' + num;
                })(_time.getMinutes()) + ':' + nu(_time.getSeconds());
            } else {
                return (_time.getMonth() + 1) + '月' + _time.getDate() + '日' + _time.getHours() + ':' + (nu = function (num) {
                    if (num < 10)return '0' + num; else return '' + num;
                })(_time.getMinutes()) + ':' + nu(_time.getSeconds());
            }

        }

    },



    //提示一段文字
    message:function($str,$type,$where){
            if(!$type) $type='default';
            if(!$where) $where='top';
            var msg=new $.Messager($str,{placement:$where,type:$type});
            msg.show();
        },

    //将一个对象强行转换为普通Object
    sqlRes: function ($result){
        $s=[];
        for(i=0;i<$result.rows.length;i++){
            $s.push($result.rows.item(i));
        }
        try{
            +$result.insertId;
            return {
                rowsAffected:$result.rowsAffected,
                insertId:$result.insertId,
                rows:$s
            }
        }catch (e){
            return {
                rowsAffected:$result.rowsAffected,
                insertId:false,
                rows:$s
            }
        }

    },

    cannotSQL:function(){
        //如果不支持SQL，执行此程序
    },

    scress:function(res,$from) {
        console.log(res);
        var rows= res.result.rows;
        //SQL运行成功调用的函数；


        if(typeof ($from)=='number'){
            $('.progress-bar.progress-bar-info').attr('aria-valuenow',''+$from).css('width',$from+'%');

            if($from==100){
                setTimeout(function () {
                    $('#fristRun').modal('hide');
                    setTimeout(function () {
                        location.reload();
                    },1000);
                },1000);
            }
            return false;
        }

        try{
            _hmt.push(['_sql',$from , res.sql , rows.length]);
        }catch(e) {}

        if($from=="zonglan"){//总览页面
            for(var i=0;i<rows.length;i++){
                $('.zonglanshuju').append('<tr class=""><td>'+rows[i].父类型+'</td><td>'+rows[i].类型名+'</td><td>'+rows[i].DVD种类+'</td><td>'+rows[i].总库存+'</td><td>'+rows[i].总出租在外+'</td><td>'+rows[i].总出售+'</td><td>'+rows[i].总借出次数+'</td></tr>');
            }

            setTimeout(function () {
                //$('table.datatable').datatable({sortable: true});
            },1000)
            return res;
        }

        if($from=="allDVD"){//全部DVD
            console.log(window.eee=rows);
            var $div=$('<div></div>');
            var $str=$('.AllSousuo').val();

            for(var j=0;j<rows.length;j++){
                   //if(rows[j].条形码)
                $div.append('<div class="comment">\
                    <div class="content">\
                    <div class="pull-right"><span class="text-muted" title="">类型： '+rows[j].类型名+'</span>\
                    &nbsp;<strong>#'+rows[j].父类型+'</strong></div>\
                    <span class="author">\
                    <a href="javascript:rukuX(\''+rows[j].条形码+'\')"><strong>'+biao(rows[j].具体名,$str)+'</strong></a>\
                    <span class="text-muted">'+biao(rows[j].条形码,$str)+'</span>\
                </span>\
                    <div class="text">\
                        <div class="pull-right with-padding bg-primary">库存：'+rows[j].库存+'|已出售：'+rows[j].已出售+'张<br />\
                        出租在外'+rows[j].出租在外+'|总共出租次数：'+rows[j].总共借出次数+'张<br />\
                        </div>\
                        '+biao(rows[j].VCD介绍,$str)+'</div>\
                    <div class="actions">\
                        <a href="javascript:xiugai(\''+rows[j].条形码+'\')">出售</a>\
                        <a href="javascript:rukuX(\''+rows[j].条形码+'\')">入库</a>\
                    </div>\
                </div>\
                </div>');
            };
            $('.allDVD').html($div.html());
            //$('table.datatable').datatable({sortable: true});
            return res;
        }

        if($from=='唱片'||$from=='电影'||$from=='电视'||$from=='游戏'||$from=='其他'){
            $('.'+$from+'类型').find('td[rowspan]').attr('rowspan',(rows.length+1)+'');

            $('.'+$from+'类型').after('<tr>\
                <td colspan="2">\
                <a href="javascript:;" class="ClickaddClass"  data-toggle="modal" data-this="'+$from+'" data-target="#addClass"><i class="icon-plus-sign"></i>新增</a>\
                </td>\
            </tr>');

            for(i=0;i<rows.length;i++){
                if(rows[i].类型名!=='默认')
                $('.'+$from+'类型').after('<tr>\
                <td>'+rows[i].类型名+'</td>\
                <td><a href="javascript:removeClass(\''+$from+'\',\''+rows[i].类型名+'\');"><i class="icon-remove-sign"></i>删除</a></td>\
                </tr>');
            }

            return false;
        }

        if($from=='搜索'){
            if(rows.length){
                $('#newRuKu').addClass('hidden');
                $('#addRuKu').removeClass('hidden');
            }else{
                $('#newRuKu').removeClass('hidden');
                $('#addRuKu').addClass('hidden');
            }

            return false;
        }

        if($from=='类别选择'){
            $('.子类型').html('');
            for(i=0;i<rows.length;i++){
                $('.子类型').append('<option value="'+rows[i].类型名+'">'+rows[i].类型名+'</option>');
            }

            return false;
        }

        if($from=='入库'||$from=='追加库存'){

            $入库单号=new Date();
            $入库时间= Date.now();

            $条形码=$('#isbn').val();
            if($from=='入库'){
                $库存=$('#newNum').val();
            }else{
                $库存=$('#addNum').val();
            }
            sql.runSQL("INSERT INTO 入库历史(入库单号, 入库时间, 条形码, 入库数量) VALUES ('"+$入库单号+"','"+$入库时间+"','"+$条形码+"','"+$库存+"')", [], '入库成功');

            return false;
        }

        if($from=='入库成功'){
            TOOL.message('入库成功','success','top');
            $('#VCDRuKu').modal('hide');
            window.f_ruku();
            return false;
        }


        if($from=='删除分类'){
            TOOL.message('删除成功','success','top');

            return false;
        }
        if($from=='添加类型'){
            TOOL.message('添加成功,3秒后自动刷新','success','top');
            setTimeout(function () {
                location.reload();
            },3000);

            return false;
        }
        if($from=='其他'){

            return false;
        }


        if($from=='入库历史'){
            for(i=0;i<rows.length;i++){
                console.log(rows[i].入库单号);
                $('.rukulishi').append('<tr><td>'+ rows[i].入库单号+'</td><td>'+rows[i].条形码+'</td><td>'+rows[i].入库数量+'</td></tr>');
            }


            return false;
        }

        if($from=="未还VCD列表"){
            var $id=$(".input-id-jie").val();
            //biao( ,$id)
            $table=$('<table class="table table-bordered"><tr><th>时间</th><th>借阅者</th><th>借单编号</th><th>分类</th><th>VCD编号</th><th>VCD名字</th><th>操作</th></tr></table>');
            for(i=0;i<rows.length;i++){
                $table.append('<tr><th>'+TOOL.timeview(rows[i].借出时间)+'</th><th>'+biao(rows[i].借阅者,$id)+'</th><th>'+biao(rows[i].借还+'',$id)+'</th><th>'+rows[i].父类型+'</th><th>'+rows[i].条形码+'</th><th>'+rows[i].具体名+'</th><th><a href="javascript:guihuan('+rows[i].借还+')">归还</a></th></tr>')
            }
            $('#jie').html($table[0].outerHTML);
        }

        if($from=='出租搜索'){
            var $str=$('.vcdsousuo').val();
            var $table=$('<tbody></tbody>');
            for(i=0;i<rows.length;i++){
                $table.append('<tr><td>'+ rows[i].父类型+'</td><td>类型:'+rows[i].类型名+'</td><td>条形码:'+biao(rows[i].条形码,$str)+'</td><td>'+biao(rows[i].具体名,$str)+'</td><td>库存:'+rows[i].库存+'</td><td><a href="javascript:;" class="VCDjiechu">立刻借出</a></td></tr>');

            }
            $('.sousuoming').html($table.html());


            return false;
        }

        //借出成功
        if($from=="借出成功"){
            TOOL.message('借出成功，请打印下面的二维码贴与VCD外壳，店长可通过扫描此二维码归还VCD','success','top');
            return false;
        }

        //添加出售记录
        if($from=="添加出售记录"){
            var $num=$(".input-id-num").val();
            var $id=$('.input-id-shou').val();
            sql.runSQL("UPDATE DVD SET 库存 = 库存-"+$num+",已出售=已出售+"+$num+" WHERE 条形码='"+$id+"'",[],'修改库存');
            return false;
        }

        if($from=="修改库存"){
            TOOL.message("销售成功","success",'top');
            return false;
        }

        if($from=="修改归还表"){
            TOOL.message("归还成功","success",'top');

            setTimeout(function () {
                f_jie();
            },3000);
            return false;
        }

    },
    error:function(res,$from) {
        //console.log(res)
        try{
            _hmt.push(['_sql',$from , res.sql ,'错误']);
        }catch(e) {}

        //SQL运行失败时运行；
        if($from=='入库'){
            TOOL.message('添加失败','warning','top');
            return false;
        }
        if($from=='删除分类'){
            TOOL.message('删除失败','warning','top');
            return false;
        }
        if($from=='添加类型'){
            TOOL.message('添加失败','warning','top');
            return false;

        }

        if(typeof ($from)=='number'){
            $('.progress-bar.progress-bar-info').attr('aria-valuenow',''+$from).css('width',$from+'%');
            console.log($from);
            if($from==100){
                setTimeout(function () {
                    $('#fristRun').modal('hide');
                    setTimeout(function () {
                        location.reload();
                    },1000);
                },1000);
            }
            return false;
        }


        else{
            TOOL.message($from+'失败','warning','top');
            return false;
        }
    },

    log:console.log
}


sql=new SQL();