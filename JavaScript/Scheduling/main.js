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
  function sleep( sleepDuration ){
      var now = new Date().getTime();
      while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
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
      if(start_num ==0 && seq[i].pt == 0) //pt = 0 -> do not paint
        continue;
      block_name ='block'+ i.toString();
      AddJob(div,block_name,seq[i]);
      $(div+' .Job_block[name = '+block_name+']').fadeIn(1);
    }
  }

  function paintC(Job_seq){
    $('#completion').html('<h4></h4>');
      var C = 0
      for(i=0;i<Job_seq.length;i++){
        if(Job_seq[i].pt != 0){
          var str = "";
          var C_id = "C"+(i).toString()

          var block_name = 'block'+ i.toString();

          //var pos = $('.job_seq .Job_block[name ='+block_name+']').position().left;

          C += Job_seq[i].pt;
          Job_seq[i].c = C;
          var rate = (Job_seq[i].pt/totalPT)*98;
          str += "<h4 class ='C' id='"+C_id+"'>"+C+"</h4> \n";

          $('#completion').append(str);

          $('#'+C_id).css("width", rate.toString() + "%");
          //$('#'+C_id).css("position","absolute");
          //console.log(pos);
        }
      }
    }

  function delay_detection(Job_seq){
    var delay=false;
    for (i=0 ;i<Job_seq.length;i++){
      if (Job_seq[i].isdelay()){
        var C_id = "C"+(i).toString()
        $('#'+C_id).css("color", 'red');
        delay = true;
      }
    }
    return delay;
  }
  function heapify(maxheap,root){
    var size = maxheap.length;
    var j = maxheap[root];
    var key = maxheap[root].pt;
    var temp = maxheap[root];
    var child = root*2+1;
    while(child <= size -1){
      var childnode = maxheap[child];
      if(child < size -1 && childnode.pt < maxheap[child+1].pt){
        child ++ ;
        childnode = maxheap[child];
      }
      if(key>childnode.pt || (key == childnode.pt && j.d <= childnode.d))
        break;
      else if(key<childnode.pt || (key ==childnode.pt && j.d > childnode.d)){
        maxheap[(child-1)/2] = childnode;
        child = child*2 +1;
      }
    }
    maxheap[(child-1)/2] = temp;
  }

  var heap_pop=function(maxheap){
    var size = maxheap.length;
    var temp = maxheap[0];
    maxheap[0] = maxheap[size-1]
    maxheap.pop();
    heapify(maxheap,0);
    return temp;
  }

  var Job = function(pt,d,index){
    this.pt = pt;
    this.d = d;
    this.c = 0;
    this.index = index ;
    this.color = '#DDD';//default color

    this.isdelay=function(){
      if(this.c > this.d)
        return true;
      else
        return false;
    }
  };

  var Status = function(maxheap,Job_seq,job_count,pop){
    this.maxheap = maxheap;
    this.Job_seq = Job_seq;
    this.job_count = job_count;
    this.pop = pop;
  }
  var click_next = function(){
    $('#Next').trigger('click');
  }

  var select = function(num){
    var p_id = '#step'+num.toString();
    $('.step').removeClass('select');
    $(p_id).addClass('select');
    console.log(p_id);
  }
/*---------------------------------------------------------------------*/
  var processingTime = [];
  var dueDate = [];
  var n = 0;
  var totalPT = 0;
  var job_count = 0;
  empty_job = new Job(0,0,0)
  var animation_time = 200;
  var pop = false;
  var finish = false;

  Jobs = new Array();
  Job_seq = new Array();
  maxheap = new Array();

  //Load all jobs
  for(i = 0 ; i<processingTime.length ; i++){
    j = new Job(processingTime[i],dueDate[i],i);
    Jobs.push(j);
    var str = 'Job['+(i+1)+'] : '+'PT = '+Jobs[i].pt+'    Due Date = '+Jobs[i].d+'\n'
    $('#JobList').append(str);
    totalPT += j.pt;
    n++;
  }
/*---------------------------------------------------------------------*/
  //start button
  $('#Start').click(function(){
    Status_stack = new Array();
    maxheap = new Array();
    //clear seq
    $('.sorted_seq').html('');
    $('.job_seq').html('');
    $('#completion').html('');
    //sort Jobs by deadline
    Jobs = sortObj(Jobs,'d');

    if(Jobs.length>0){
      $('#lable1').show();
      $('#lable2').show();
      select(1);  //color step1
    }
    Job_seq = [];
    job_count = 0;
    finish = false;

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
      $('.Job_block[name = '+block_name+']').slideLeftShow(1000-(n-i)*(1000/n));

    };
    // Add status to stack
    var currentStatus = new Status(maxheap.slice(),Job_seq.slice(),job_count,false);
    Status_stack.push(currentStatus);

    var auto = $("#auto:checked").val();
    if(auto && Jobs){
      while(!finish){
        setInterval(click_next,1)
        // sleep(1000);
      }
    }

  });
  //hover event

  $('#add').click(function(){
    var p = parseInt($('#PT').val());
    var d = parseInt($('#duedate').val());
    totalPT += p;
    n++; //add job
    if(n>25){
      confirm("Number of jobs can't larger than 25.");
      return ;
    }
    if(p && d){
      Jobs.push(new Job(p,d,Jobs.length));
    }
    else if(p>d){
      alert("Processing Time can't be larger than Due date");
    }
    else{
      alert("Processing Time and Due date should be integer.");
    }

    var str = 'Job['+n+'] : '+'PT = '+Jobs[n-1].pt+'    Due Date = '+Jobs[n-1].d+'\n'
    $('#JobList').append(str);

    $('#Start').trigger("click");
  });

  $('#random_add').click(function(){

    var num = parseInt($('#num').val());
    if(num+n > 25){
      confirm("Number of jobs can't larger than 25.");
      return ;
    }

    for (i=0 ; i<num ; i++){
      var range = n*4;
      var dd = Math.floor(Math.random()*range+15);
      var pt = Math.floor(Math.random()*8+2);

      Jobs.push(new Job(pt,dd,Jobs.length));

      totalPT += pt;
      n++;

      var str = 'Job['+n+'] : '+'PT = '+Jobs[n-1].pt+'    Due Date = '+Jobs[n-1].d+'\n'
      $('#JobList').append(str);
  }
      $('#Start').trigger("click");
  });
  $('#Next').click(function(){
    if(!delay_detection(Job_seq)){
      if(job_count < Jobs.length){
        block_name = "block"+job_count.toString();
        delete_block = "block"+job_count.toString();
        //pop job 0 and push to job sequence
        j = Jobs[job_count];
        Job_seq.push(j);
        maxheap.unshift(j); //insert to first
        heapify(maxheap,0);


        AddJob('.job_seq',block_name,j);
        $('.job_seq .Job_block[name = '+block_name+']').slideLeftShow(animation_time);
        $('.sorted_seq .Job_block[name = '+delete_block+']').fadeOut(animation_time);
        select(2); //color step2 to red

        var currentStatus = new Status(maxheap.slice(),Job_seq.slice(),job_count,false);
        Status_stack.push(currentStatus);
      }
        job_count+=1;
    }
    else{
      tardy = heap_pop(maxheap);

      var pos = Job_seq.indexOf(tardy);
      var block_name = "block"+pos.toString();
      $('.job_seq .Job_block[name = '+block_name+']').fadeOut('slow');
      select(3);
      Job_seq[pos] = empty_job;

      var currentStatus = new Status(maxheap.slice(),Job_seq.slice(),job_count,true);
      Status_stack.push(currentStatus);
    }
    paintC(Job_seq);
    delay_detection(Job_seq);
    console.log(Status_stack);
    if(job_count == n)
      finish = true;
  });

  //Last button
  $('#Last').click(function(){
    //clear all and repaint
    if(Status_stack.length > 1){
      $('.sorted_seq').html('');
      $('.job_seq').html('');

      s = Status_stack.pop();

      if(s.pop == true){
        job_count++;
      }

      var status = Status_stack[Status_stack.length - 1 ];
      maxheap = status.maxheap;

      if(Status_stack.length ==1 ){
        repaint('.sorted_seq',Jobs,0);
        Job_seq = [];
        job_count =1;
      }
      else{
        repaint('.sorted_seq',Jobs,status.job_count+1);
        repaint('.job_seq',status.Job_seq,0);
        Job_seq = status.Job_seq;
      }
      delay_detection(Job_seq)
      paintC(Job_seq);
      job_count--;
      console.log(Status_stack);
    }
  })
  $(".sorted_seq").on("mouseover",".Job_block",function(){
          $(this).addClass("hover")      //hover, add class "hover"
  });
  $(".sorted_seq").on("mouseout", ".Job_block",function(){
            $(this).removeClass("hover");  //hover out, remove class "hover"
    });
  $(".job_seq").on("mouseover",".Job_block",function(){
          $(this).addClass("hover")      //hover, add class "hover"
  });
  $(".job_seq").on("mouseout", ".Job_block",function(){
            $(this).removeClass("hover");  //hover out, remove class "hover"
    });


});
