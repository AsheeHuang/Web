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

  function AddJob(div,block_name,job){

    Add = "<div class='Job_block' style ='display: none' name = "+block_name+">";
    if (((job.pt / totalPT)*100) > 6){
      Add += "<p>PT : "+job.pt+'<br/>'+"D : "+job.d+"</p>";
    }
    else {
      Add += "<p>"+job.pt+'<br/>'+job.d+"</p>";
    }
    Add += "</div>";
    $(div).append(Add);

    var rate = ((job.pt / totalPT)*95).toString()+"%";
    $('.Job_block[name = '+block_name+']').css("background",job.color);
    $('.Job_block[name = '+block_name+']').css('width',rate);
  }

  var Job = function(pt,d){
    this.pt = pt;
    this.d = d;
    this.c = 0;
    this.color = '#DDD' //default color
  };


  var processingTime = [7,6,3,9,4];
  var dueDate = [12,21,18,29,24];
  var n = 5;
  var totalPT = 29;
  var job_count = 0;

  Jobs = new Array();
  Job_seq = new Array();
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
    $('.job_seq').html('');
    //sort Jobs by deadline
    Jobs = sortObj(Jobs,'d');

    $('#lable1').show();
    $('#lable2').show();

    Job_seq = [];
    job_count = 0;

    for (i=0;i<n;i++){
      //add a block
      block_name = 'block'+ i.toString();
      Add = "<div class='Job_block' style ='display: none' name = "+block_name+">";
      if (((Jobs[i].pt / totalPT)*100) > 6){
        Add += "<p>PT : "+Jobs[i].pt+'<br/>'+"D : "+Jobs[i].d+"</p>";
      }
      else {
        Add += "<p>"+Jobs[i].pt+'<br/>'+Jobs[i].d+"</p>";
      }
      Add += "</div>";
      $('.sorted_seq').append(Add);

      rd_color = '#'+Math.floor(Math.random()*16777215).toString(16);
      Jobs[i].color = rd_color;
      var rate = ((Jobs[i].pt / totalPT)*95).toString()+"%";

      $('.Job_block[name = '+block_name+']').css("background",Jobs[i].color);
      $('.Job_block[name = '+block_name+']').css('width',rate);
      //show animation
      $('.Job_block[name = '+block_name+']').slideLeftShow(i*200);
    };
  });

  $('#add').click(function(){
    var p = parseInt($('#PT').val());
    var d = parseInt($('#duedate').val());
    totalPT += p;
    n++; //add job
    if(p && d){
      Jobs.push(new Job(p,d));
    }
    else{
      alert("Processing Time and Due date should be integer.")
    }

    var str = 'Job['+n+'] : '+'PT = '+Jobs[n-1].pt+'   Due Date = '+Jobs[n-1].d+'\n'
    $('#JobList').append(str);
  });

  $('#Next').click(function(){
    block_name = "Jblock"+job_count.toString();
    delete_block = "block"+job_count.toString();
    //pop job 0 and push to
    j = Jobs[job_count++];

    Job_seq.push(j);
    AddJob('.job_seq',block_name,j);
    $('.Job_block[name = '+block_name+']').slideLeftShow(200);
    $('.Job_block[name = '+delete_block+']').fadeOut(200);


  })
});
