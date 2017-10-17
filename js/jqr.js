

//开始，结束号码
var startNum = localStorage.getItem("startNum");
var endNum = localStorage.getItem("endNum");
if(startNum== null){
    startNum = "1";
}
if(endNum== null){
    endNum = "100";
}

//保存当天记录
var d = new Date();
var datestr = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
var  correntValue =localStorage.getItem(datestr);


/////////////////////////////////

$(document).ready(function () {
    if(window.localStorage){
        //alert('浏览器不支持本地存储，将无法查看历史记录！');
    }else{
        alert('浏览器不支持本地存储，将无法查看历史记录！');
    }

    //显示历史记录
    if(correntValue==null){

    }
    else{
        $('#res').text('当天产生的号码：'+correntValue);
    }

    //设置
    $('.settingBtn').on('click', function(){
        // $('.settingInput').toggle();
        var html = "<label>开始号码：<input class='confirm_input' id='startNum' value='"+startNum+"' placeholder='请输入开始号码'></label><br>" +
            "<label style='padding-top: 5px;display:block;' >结束号码：<input  class='confirm_input' id='endNum' value='"+endNum+"' placeholder='请输入结束号码'></label>";
        popTipShow.confirm('提示',html,['确 定','取 消'],
            function(e){
                //callback 处理按钮事件
                var button = $(e.target).attr('class');
                if(button == 'ok'){
                    if(null==$(".confirm_input").val() || ""==$(".confirm_input").val()){
                        webToast("开始号码和结束号码不能为空！","bottom", 3000);
                        return;
                    }

                    this.hide();

                    localStorage.setItem("startNum",$("#startNum").val());
                    localStorage.setItem("endNum",$("#endNum").val());
                    startNum = localStorage.getItem("startNum");
                    endNum = localStorage.getItem("endNum");
                    /*setTimeout(function() {
                        webToast($(".confirm_input").val(),"bottom", 3000);
                    }, 300);*/

                    //按下确定按钮执行的操作
                    //todo ....
                }

                if(button == 'cancel') {
                    //按下取消按钮执行的操作
                    //todo ....
                    this.hide();
                    /*setTimeout(function() {
                        webToast("您选择“取消”了","top", 2000);
                    }, 300);*/
                }
            }
        );
    });


    //清楚历史
    $('.deleteBtn').on('click', function(){

        popTipShow.confirm('提示','确定要删除所有保存记录？',['确 定','取 消'],
            function(e){
                //callback 处理按钮事件
                var button = $(e.target).attr('class');
                if(button == 'ok'){
                    //按下确定按钮执行的操作
                    //todo ....
                    this.hide();
                    localStorage.removeItem(datestr);
                    correntValue =localStorage.getItem(datestr);
                    $('#res').text("");
                    //alert(str)
                }
                if(button == 'cancel') {
                    //按下取消按钮执行的操作
                    //todo ....
                    this.hide();
                    /* setTimeout(function() {
                         webToast("您选择“取消”了","bottom", 2000);
                     }, 300);*/
                }
            }
        );

    });

    //取消设置
    $('#cancel').on('click', function(){
        $('.settingInput').toggle();
    });


    //避免产生所有号码后死循环
    var index=1;

    function getRandom(min,max){

        var rand;
        rand = Math.floor(min + Math.random()*(max - min));
        if (rand < 10) {
            rand = "00" + rand;
        }
        else if(10<=rand<100){
            rand = "0" + rand;
        }
        else if(rand==0){
            rand="001";
        }
        rand ="0"+rand;


        if(correntValue!=null){
            if(correntValue.indexOf(rand+",")>=0){
                index++;
                if(index>=(max-min)){
                    rand="0000";
                    //alert("已经没有非重复号码！");
                    webToast("已经没有非重复号码！","bottom", 2000);
                }
                else{
                    rand = getRandom(min,max);
                }

            }
        }

        return rand;
    }

    var result="0000";
    //开始摇号
    var isBegin = false;
    $(function(){
        var u = 265;
        $('.btn').click(function(){
            if(isBegin) return false;
            isBegin = true;
            $(".num").css('backgroundPositionY',0);
            result = getRandom(parseInt(startNum),parseInt(endNum));

            if(result=="0000"){
                isBegin = false;
                return;
            }
            var num_arr = (result+'').split('');
            $(".num").each(function(index){

                var _num = $(this);
                setTimeout(function(){
                    _num.animate({
                        backgroundPositionY: (u*60) - (u*num_arr[index])
                    },{
                        duration: 1000+index*500,
                        easing: "easeInOutCirc",
                        complete: function(){

                            if(index==3) {
                                //console.log(index);
                                isBegin = false;
                                setTimeout(function() {
                                    //是否本地保存
                                    popTipShow.confirm('结果','生成号码为：'+result+'。是否保存记录？',['确 定','取 消'],
                                        function(e){
                                            //callback 处理按钮事件
                                            var button = $(e.target).attr('class');
                                            if(button == 'ok'){
                                                //按下确定按钮执行的操作
                                                //todo ....
                                                this.hide();
                                                if(correntValue==null){
                                                    correntValue = result+",";
                                                }
                                                else{
                                                    correntValue = correntValue+result+",";
                                                }
                                                localStorage.setItem(datestr,correntValue);
                                                $('#res').text('当天产生的号码：'+correntValue);
                                                //alert(str)
                                            }
                                            if(button == 'cancel') {
                                                //按下取消按钮执行的操作
                                                //todo ....
                                                this.hide();
                                                /* setTimeout(function() {
                                                     webToast("您选择“取消”了","bottom", 2000);
                                                 }, 300);*/
                                            }
                                        }
                                    );
                                }, 500);


                            }



                        }
                    });
                }, index * 300);
            });
        });
    });



    //打印

    $('.btnPrint').on('click',function () {
        if(result=="0000"){
            webToast("无效的号码","bottom", 1000);
        }
        else{
            $('#number').text(result);
            $("#printArea").jqprint();
        }


    });


    //自定义打印
    $('.printBtn').on('click',function () {



        var html = "<label>打印号码：<input class='confirm_input' id='printText'  placeholder='请输入想要打印的数字'></label>";
        popTipShow.confirm('提示',html,['确 定','取 消'],
            function(e){
                //callback 处理按钮事件
                var button = $(e.target).attr('class');
                if(button == 'ok'){
                    if(null==$(".confirm_input").val() || ""==$(".confirm_input").val()){
                        webToast("号码不能为空！","bottom", 2000);
                        return;
                    }

                    this.hide();


                    $('#number').text($('#printText').val());
                    $("#printArea").jqprint();

                    //按下确定按钮执行的操作
                    //todo ....
                }

                if(button == 'cancel') {
                    //按下取消按钮执行的操作
                    //todo ....
                    this.hide();

                }
            }
        );

    });





});