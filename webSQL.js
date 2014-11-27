try{
	!!openDatabase;
}catch(e){
	$(document).ready(function(){
        	$("#success").css("display","none");
        	$(".example").css("display","none");
    });
}

if(!!openDatabase){
    $(document).ready(function(){
        $("#error").css("display","none");
        $("#from").keyup(function(){
            $from=$("#from").val();
            if(!!$from){
                $("#sqlbox").attr("placeholder","输入SQL，运行在数据库 "+$from+" 中，如果数据库不存在则会自动创建");
                $("#newdb").attr("data-original-title","创建 "+$from+" 数据库");
            }else{
                $("#sqlbox").attr("placeholder","输入SQL，请先填写所运行的数据库名");

            }
        });


        $(".sqlfile").click(function () {
            $.get("frist.sql", function (data,status) {
                document.body.innerHTML="<pre>"+data+"</pre>";
            });
        });

        run=function(runli){
        	if(runli){
        		runli=runli.split(';');
        		for(ii=0;ii<runli.length;ii++){
				if(runli[ii]){
					webSql.sql(runli[ii]);	
				}
			}
        	}
        }
        
        //////?????????


        $("#runsql").click(runs=function(){
			if($("#sqlbox").val()){
				run($("#sqlbox").val());
                $("#sqlbox").val('');
			}
        });

        $("#sqlbox").keyup(function () {
            var $s=$("#sqlbox").val()
            if($s[$s.length-1]==';'){
                runs();
            }
        });
		
	//运行多条SQL
        $("#go").click(function(){
			$(document).data('SQLlist',$('#SQLlist').text().split(';'));
			$('#success').css('display','none');
			list_sql=0;
			
			SQLlist=$('#SQLlist').text().split(';');
			for(ii=0;ii<SQLlist.length-1;ii++){
				$('#sqlbox').val(SQLlist[ii]);
				webSql.sql(SQLlist[ii]);
			}
			
        });
		
		slide=function(_this){
			$(_this).next().slideToggle("slow");
		}
			
		
    });
}else{
    $(document).ready(function(){
        $("#success").css("display","none");
    });
}

function    HTMLEnCode(str)  
  {  
        var    s    =    "";  
        if    (str.length    ==    0)    return    "";  
        s    =    str.replace(/&/g,    "&gt;");  
        s    =    s.replace(/ </g,        "&lt;");  
        s    =    s.replace(/>/g,        "&gt;");  
        s    =    s.replace(/    /g,        "&nbsp;");  
        s    =    s.replace(/\'/g,      "'");  
        s    =    s.replace(/\"/g,      "&quot;");  
        s    =    s.replace(/\n/g,      " <br>");  
        return    s;  
  }  
  function    HTMLDeCode(str)  
  {  
        var    s    =    "";  
        if    (str.length    ==    0)    return    "";  
        s    =    str.replace(/&gt;/g,    "&");  
        s    =    s.replace(/&lt;/g,        " <");  
        s    =    s.replace(/&gt;/g,        ">");  
        s    =    s.replace(/&nbsp;/g,        "    ");  
        s    =    s.replace(/'/g,      "\'");  
        s    =    s.replace(/&quot;/g,      "\"");  
        s    =    s.replace(/ <br>/g,      "\n");  
        return    s;  
  }


//历史记录
try{
	JSON.parse(localStorage.sqlhistory);
}catch(e){
	localStorage.sqlhistory='[]';	
}
S=JSON.parse(localStorage.sqlhistory);
$('#histnum').text(S.length+'条');
$('#histnum').attr('data-id',S.length);
for(i=0;i<S.length;i++){
	if(!S[i].err){
		if(S[i].table){
			//有返回数据
			$('#S').prepend('<tr class="success"><td>'
				+timeview(S[i]['time'])
				+'</td><td class="hissql text-success">'
				+S[i]['sql']
				+'</td><td><span class="label label-badge label-success sqlhistre" style="cursor: pointer;" data-id="'
				+i
				+'">'
				+S[i]['table']
				+'条,点击查看详情</span></td></tr>');
		}else{
			$('#S').prepend('<tr class="active"><td>'
				+timeview(S[i]['time'])
				+'</td><td class="text-special active hissql"><span class="label label-dot label-success"></span>'
				+S[i]['sql']
				+'</td><td>&nbsp;</td></tr>');
		}
	}else{
		$('#S').prepend('<tr class="danger"><td>'
			+timeview(S[i]['time'])
			+'</td><td class="highlight-default hissql">'
			+S[i]['sql']
			+'</td><td><span style="cursor: pointer;" class="label label-badge label-danger errorre" data-id="'
			+i
			+'">ERROR</span></td></tr>');
	}
}

	
$('.hissql').css('cursor','pointer');
$('.hissql').click(function(){
	$('#sqlbox').val($(this).text());
});
//SQL快速按钮
$('.sqlbutton').click(function(){
	$('#sqlbox').val($(this).attr('title'));
	if((_index=$('#sqlbox').val().indexOf('stu'))>0){
		var selection = new Selection($('#sqlbox')[0]);
		selection.setCaret(_index,_index+3);
		$('#sqlbox')[0].focus()
	}
})

//查看历史详情
$('.sqlhistre').click(function(){
	i=(+$(this).attr('data-id'));
	_S=S[i]['div'].replace('运行成功','运行历史，运行于'+timeview(S[i]['time'])).replace('bg-success','bg-special')
	$thissqltable=$(document.createElement('div')).append(_S);
	$("#panel-body").prepend($thissqltable[0]);
	$(this).remove();
});
//查看历史详情
$('.errorre').click(function(){
	i=(+$(this).attr('data-id'));
	_S=S[i]['div'].replace('警告','运行历史，运行于'+timeview(S[i]['time'])).replace('alert-danger','alert-info')
	$thissqltable=$(document.createElement('div')).append(_S);
	$("#panel-body").prepend($thissqltable[0]);
	$(this).remove();
});


//清除历史按钮
$('.clshist').click(function(){
	_confirm=confirm("确定删除？删除历史不影响数据库结构")
	if(_confirm){
		localStorage.sqlhistory='[]';
		$('#histnum').text('已清除，剩余0条');
		$("#S").text('');
	}
});

//时间
function timeview(timenum){
	_time=new Date();//设定的时间
	_thisTime=new Date();//当前时间
	_time.setTime(timenum);
	if(_thisTime.getTime()-_time.getTime()<60){
		return "一分钟以内";
	}else{
		if((_time.getMonth()==_thisTime.getMonth())&&(_time.getDate()==_thisTime.getDate())){
			return '今天'+_time.getHours()+':'+(nu=function(num){if(num<10)return '0'+num;else return ''+num;})(_time.getMinutes())+':'+nu(_time.getSeconds());
		}else{
			return (_time.getMonth()+1)+'月'+_time.getDate()+'日'+_time.getHours()+':'+(nu=function(num){if(num<10)return '0'+num;else return ''+num;})(_time.getMinutes())+':'+nu(_time.getSeconds());
		}
		
	}
	
}




function strr (str) {
    /*<tr class="success">
    <td>1</td>
    <td>表示成功或积极的行为。</td>
        <td>01/04/2012</td>
        <td>Approved</td>
    </tr>*/
    if(str.length){
        $docu=$(document.createElement('thead'));
        $tr="<tr>";
        for(var key in str[0]){
           $tr+="<th>"+ key +"</th>"
        }
        $tr+="</tr>";
        $docu.html($tr);

        $doctbody=$(document.createElement('tbody'));
        for(i=0;i<str.length;i++){
            if(i%2){
                $trdoc=$(document.createElement('tr')).addClass('success');
                $td="";
                for(var key in str[0]){
                    $td+="<td>"+ str[i][key] +"</td>"
                }
                $trdoc.html($td);
                $trdoc.appendTo($doctbody);
            }else{
                $trdoc=$(document.createElement('tr')).addClass('danger');
                $td="";
                for(var key in str[0]){
                    $td+="<td>"+ str[i][key] +"</td>"
                }
                $trdoc.html($td);
                $trdoc.appendTo($doctbody);
                //$docu=$(document.createElement('tr')).addClass('danger')
            }
            //$docbody[0].appendChild()
            //for(var key in str[0])
            //$docu.html('<tr class="success"><td>1</td><td>表示成功或积极的行为。</td><td>01/04/2012</td></tr>');
        }
        $table=$(document.createElement('table')).addClass('table');
        $table[0].appendChild($docu[0]);
        $table[0].appendChild($doctbody[0]);
        return $table;
    }

}
var webStorage = {};
webStorage.webSql = function () {

    var _this = this;

    //数据库
    var _dataBase;

    //打开数据库连接或者创建数据库
    this.openDatabase = function () {

        if (!!_dataBase) {
            return _dataBase;
        }
        _dataBase = openDatabase("1208020210", "", "音响店VCD销售、出售管理系统", 10737418240, function () { });

//        if (!_dataBase) {
//            alert("数据库创建失败！");
//        } else {
//            alert("数据库创建成功！");
//        }
        return _dataBase;

    }




//执行SQL
    //callback=function(){}
    this.sql = function (sql,callback) {
		//$('document').data('sql',sql);
		//window.sql=sql;
        var dataBase = _this.openDatabase();
		$(document).data('err','');
        dataBase.transaction(function(ts){
            ts.executeSql(sql, [], function(ts, result){
				/*******************************************/
					//$(document).data('err','');
                    if(!result){
                        window.res=[];
                    }else{
                        window.res=[];
                        for(i=0;i<result.rows.length;i++){
                            window.res.push(result.rows.item(i));
                        }
                    }

					
					res=window.res;
					if(res.length){
							$thissqltable=$(document.createElement('div')).append('<h3 class="with-padding bg-success" onclick="slide(this)"  style="cursor:pointer">运行成功<code>'+HTMLEnCode(sql)+'</code></h3>');
							$thissqltable[0].appendChild(strr(window.res)[0]);
							
							//$("#panel-body").append('<h3 class="with-padding bg-success">运行成功<code>'+$("#sqlbox").val()+'</code></h3>');
							
							$("#panel-body").prepend($thissqltable[0]);
							
						}else{
							$thissqltable=$(document.createElement('div')).prepend('<div class="alert alert-info"><strong>通知！</strong> 运行SQL：<code>'+HTMLEnCode(sql)+'</code>完成,修改了'+result.rowsAffected+'条数据</div>');
							
							$("#panel-body").prepend($thissqltable[0]);
							
							//$("#panel-body")[0].innerHTML='<h3><i class="icon-info-sign "></i><code>'+$("#sqlbox").val()+'</code></h3><table class="table"><thead><tr><th>运行成功</th><th>无返回内容</th></tr></thead></table>';
						}
						
						if(localStorage.sqlhistory===undefined){
							localStorage.sqlhistory='[]';
						}
						try{
							JSON.parse(localStorage.sqlhistory);
						}catch(e){
							localStorage.sqlhistory='[]';
						}

						sqlhistory=localStorage.sqlhistory;
						_sqlhistory=JSON.parse(sqlhistory);
						_sqlhistory.push({
							'time':(new Date()).getTime(),
							'sql':sql,
							//'err':$(document).data('err'),
							'table':res.length,
							'res':res,
							'div':$thissqltable[0].outerHTML
						});
						localStorage.sqlhistory=JSON.stringify(_sqlhistory);
						S=JSON.parse(localStorage.sqlhistory);
						$('#histnum').text(S.length+'条，其中'+$('#histnum').attr('data-id')+'条是之前的');
                    /* if(!!callback){
                        callback(window.res);
                    } */
				/*****************************************************/
                },
                function(ts, error){
						$(document).data('err',error);
						$thissqltable=$(document.createElement('div')).
						$thissqltable='<div class="alert alert-danger"><strong>警告！</strong> 运行SQL：“'+HTMLEnCode(sql)+'”出现了问题，如果你的SQL没有错误，请尝试重新启动浏览器！<p>'+error.message+'</p></div>'
						$("#panel-body").prepend($thissqltable);
						console.log($thissqltable);
						
						sqlhistory=localStorage.sqlhistory;
						_sqlhistory=JSON.parse(sqlhistory);
						_sqlhistory.push({
							'time':(new Date()).getTime(),
							'sql':sql,
							'err':error.message,
							//'table':window.res.length,
							//'res':window.res,
							'div':$thissqltable
						});
						localStorage.sqlhistory=JSON.stringify(_sqlhistory);
						S=JSON.parse(localStorage.sqlhistory);
						$('#histnum').text(S.length+'条，其中'+$('#histnum').attr('data-id')+'条是之前的');
						console.log(error);
                });
        });
        //return window.res;
    }



}

/*******文本选中***************/
/**
 var f = document.forms.form;
var selection = new Selection(f.text);

f.getText.onclick = function(){
        alert(selection.getText());
        f.text.focus();
};
f.setText.onclick = function(){
        var s = prompt("New text:", selection.getText());
        s !== null && selection.setText(s);
        f.text.focus();
};
f.getSel.onclick = function(){
        var s = selection.getCaret();
        alert("Start: " + s.start + "\nEnd: " + s.end);
        f.text.focus();
};
f.setSel.onclick = function(){
        var s = selection.getCaret();
        selection.setCaret(+prompt("开始:", s.start) || 0, +prompt("结束:", s.end) || 0);
        f.text.focus();
};
 **/
Selection = function(input){
        this.isTA = (this.input = input).nodeName.toLowerCase() == "textarea";
};
with({o: Selection.prototype}){
        o.setCaret = function(start, end){
                var o = this.input;
                if(Selection.isStandard)
                        o.setSelectionRange(start, end);
                else if(Selection.isSupported){
                        var t = this.input.createTextRange();
                        end -= start + o.value.slice(start + 1, end).split("\n").length - 1;
                        start -= o.value.slice(0, start).split("\n").length - 1;
                        t.move("character", start), t.moveEnd("character", end), t.select();
                }
        };
        o.getCaret = function(){
                var o = this.input, d = document;
                if(Selection.isStandard)
                        return {start: o.selectionStart, end: o.selectionEnd};
                else if(Selection.isSupported){
                        var s = (this.input.focus(), d.selection.createRange()), r, start, end, value;
                        if(s.parentElement() != o)
                                return {start: 0, end: 0};
                        if(this.isTA ? (r = s.duplicate()).moveToElementText(o) : r = o.createTextRange(), !this.isTA)
                                return r.setEndPoint("EndToStart", s), {start: r.text.length, end: r.text.length + s.text.length};
                        for(var $ = "[###]"; (value = o.value).indexOf($) + 1; $ += $);
                        r.setEndPoint("StartToEnd", s), r.text = $ + r.text, end = o.value.indexOf($);
                        s.text = $, start = o.value.indexOf($);
                        if(d.execCommand && d.queryCommandSupported("Undo"))
                                for(r = 3; --r; d.execCommand("Undo"));
                        return o.value = value, this.setCaret(start, end), {start: start, end: end};
                }
                return {start: 0, end: 0};
        };
        o.getText = function(){
                var o = this.getCaret();
                return this.input.value.slice(o.start, o.end);
        };
        o.setText = function(text){
                var o = this.getCaret(), i = this.input, s = i.value;
                i.value = s.slice(0, o.start) + text + s.slice(o.end);
                this.setCaret(o.start += text.length, o.start);
        };
        new function(){
                var d = document, o = d.createElement("input"), s = Selection;
                s.isStandard = "selectionStart" in o;
                s.isSupported = s.isStandard || (o = d.selection) && !!o.createRange();
        };
}

/***************************/

var webSql = new webStorage.webSql();
