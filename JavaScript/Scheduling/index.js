$(document).ready(function() {
  jQuery.fn.slideLeftShow = function( speed, callback ) {
    this.animate({
    width : "show",
    paddingLeft : "show",
    paddingRight : "show",
    marginLeft : "show",
    marginRight : "show"
    }, speed, callback );
  };

  function sortObj(list, key) {
    function compare(a, b) {
        a = a[key];
        b = b[key];
        var type = (typeof(a) === 'string' ||
                    typeof(b) === 'string') ? 'string' : 'number';
        var result;
        if (type === 'string') result = a.localeCompare(b);
        else result = a - b;
        return result;
    }
    return list.sort(compare);
}

  var Job = function(pt,d){
    this.pt = pt;
    this.d = d;
    this.c = 0;
  };
  var processingTime = [7,6,3,9,4];
  var dueDate = [12,21,18,29,24];
  var n = 5;
  var totalPT = 29;

  Jobs = new Array();
  //Load all jobs
  for(i = 0 ; i<n ; i++){
    j = new Job(processingTime[i],dueDate[i]);
    Jobs.push(j);
    var str = 'Job['+(i+1)+'] : '+'PT = '+Jobs[i].pt+'    Due Date = '+Jobs[i].d+'\n'
    $('#JobList').append(str);
  }
  //start button
  $('#Start').click(function(){

    //clear seq
    $('.sorted_seq').html('');
    Jobs = sortObj(Jobs,'d');
    for (i=0;i<n;i++){
      lineBreak = '<br/>'
      //add a block
      block_name = 'block'+ i.toString();
      Add = "<div class='Job_block' style ='display: none' name = "+block_name+">";
      Add += "<p>PT : "+Jobs[i].pt+lineBreak+"D : "+Jobs[i].d+"</p>";
      Add += "</div>";
      //$('.Job_block[name = block_name]').css("display","none");
      $('.sorted_seq').append(Add);
      rd_color = '#'+Math.floor(Math.random()*16777215).toString(16);

      var rate = ((Jobs[i].pt / totalPT)*100).toString()+"%";

      $('.Job_block[name = '+block_name+']').css("background",rd_color);
      $('.Job_block[name = '+block_name+']').css('width',rate);
      //show animation
      $('.Job_block[name = '+block_name+']').slideLeftShow(i*200);
    }

    $('#lable1').show();
  });
});
