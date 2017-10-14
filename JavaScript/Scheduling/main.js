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

  function repaint(div,seq,start_num){
    for(i=start_num ; i<seq.length ; i++){
      block_name ='block'+ i.toString();
      AddJob(div,block_name,seq[i]);
      $(div+' .Job_block[name = '+block_name+']').fadeIn(1);
    }
  }

  function paintC(Job_seq){
    $('#completion').html('<h4></h4>');
      var C = 0
      for(i=0;i<Job_seq.length;i++){
        var str = "";
        var C_id = "C"+(i).toString()

        var block_name = 'block'+ i.toString();
        var pos = $('.job_seq .Job_block[name ='+block_name+']').position().left;

        C += Job_seq[i].pt;
        Job_seq[i].c = C;
        var rate = (Job_seq[i].pt/totalPT)*98;
        str += "<h4 class ='C' id='"+C_id+"'>"+C+"</h4> \n";

        console.log();
        $('#completion').append(str);

        $('#'+C_id).css("width", rate.toString() + "%");
        //$('#'+C_id).css("position","absolute");
      //  console.log(pos);
      }
    }

  function delay_detection(Job_seq){
    for (i=0 ;i<Job_seq.length;i++){
      if (Job_seq[i].isdelay()){
        var C_id = "C"+(i).toString()
        $('#'+C_id).css("color", 'red');
      }
    }
  }
  var Job = function(pt,d){
    this.pt = pt;
    this.d = d;
    this.c = 0;
    this.color = '#DDD';//default color

    this.isdelay=function(){
      if(this.c > this.d)
        return true;
      else
        return false;
    }
  };

  var Status = function(Jobs,Job_seq,job_count){
    this.Jobs = Jobs;
    this.Job_seq = Job_seq;
    this.job_count = job_count;
  }

  var processingTime = [7,6,3,9,4];
  var dueDate = [28,21,18,12,24];
  var n = 5;
  var totalPT = 29;
  var job_count = 0;
  var animation_time = 200;

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

    Status_stack = new Array();
    //clear seq
    $('.sorted_seq').html('');
    $('.job_seq').html('');
    $('#completion').html('');
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
      if (((Jobs[i].pt / totalPT)*100) >10){
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
      $('.Job_block[name = '+block_name+']').slideLeftShow(i*animation_time);

    };
    // Add status to stack
    var currentStatus = new Status(Jobs.slice(),Job_seq.slice(),job_count);
    Status_stack.push(currentStatus);
  });

  $('#add').click(function(){
    var p = parseInt($('#PT').val());
    var d = parseInt($('#duedate').val());
    totalPT += p;
    n++; //add job
    if(p && d){
      Jobs.push(new Job(p,d));
    }
    else if(p>d){
      alert("Processing Time can't be larger than Due date");
    }
    else{
      alert("Processing Time and Due date should be integer.");
    }

    var str = 'Job['+n+'] : '+'PT = '+Jobs[n-1].pt+'    Due Date = '+Jobs[n-1].d+'\n'
    $('#JobList').append(str);
  });

  $('#random_add').click(function(){

    var num = parseInt($('#num').val());
    console.log(num);
    for (i=0 ; i<num ; i++){
      var range = n*6;
      var dd = Math.floor(Math.random()*range+10);
      var pt = Math.floor(Math.random()*9+1);
      console.log(dd,pt);;
      Jobs.push(new Job(pt,dd));

      totalPT += pt;
      n++;

      var str = 'Job['+n+'] : '+'PT = '+Jobs[n-1].pt+'    Due Date = '+Jobs[n-1].d+'\n'
      $('#JobList').append(str);
  }
  });
  $('#Next').click(function(){
    if(job_count < Jobs.length){
      block_name = "block"+job_count.toString();
      delete_block = "block"+job_count.toString();
      //pop job 0 and push to job sequence
      j = Jobs[job_count];
      Job_seq.push(j);

      AddJob('.job_seq',block_name,j);
      $('.job_seq .Job_block[name = '+block_name+']').slideLeftShow(animation_time);
      $('.sorted_seq .Job_block[name = '+delete_block+']').fadeOut(animation_time);

      var currentStatus = new Status(Jobs.slice(),Job_seq.slice(),job_count);
      Status_stack.push(currentStatus);

      job_count += 1;
      paintC(Job_seq);
      delay_detection(Job_seq);
    }
  });

  //Last button
  $('#Last').click(function(){
    //clear all and repaint
    if(Status_stack.length > 1){
      $('.sorted_seq').html('');
      $('.job_seq').html('');

      Status_stack.pop();
      Job_seq.pop();

      var status = Status_stack[Status_stack.length - 1 ];
      repaint('.sorted_seq',status.Jobs,job_count-1);
      repaint('.job_seq',status.Job_seq,0);

      job_count--;
      paintC(Job_seq);
    }
  })
});
