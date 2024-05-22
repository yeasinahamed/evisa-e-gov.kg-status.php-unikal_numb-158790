$(document).ready(function(e){
    $("input").keypress(function(e){ if( String.fromCharCode(e.which) == "'" || String.fromCharCode(e.which) == '"' ) return false; });
	$("textarea").keypress(function(e){ if( String.fromCharCode(e.which) == "'" || String.fromCharCode(e.which) == '"' ) return false; });
});


//VALIDATE ONLY TEXT
function is_TEXT(str){
	var intRegex = /[a-zA-Z]/;
	if(intRegex.test(str)){
		return true;
	}else{
		return false; 
	}
}
//VALIDATE ONLY TEXT


function showMsg(msg_type,msg,buttons){
	if( msg_type == 'error' ){
		$(".modal-dialog-title").html('Notification');
		$(".modal-dialog-header").css("background-color","#e45252");
	}
	if( msg_type == 'warning' ){
		$(".modal-dialog-title").html('Warning');
		$(".modal-dialog-header").css("background-color","#f56a07");
	}
	if( msg_type == 'success' ){
		$(".modal-dialog-title").html('Success');
		$(".modal-dialog-header").css("background-color","#5cb85c");
	}
	if( msg_type == 'ait' ){
		$(".modal-dialog-title").html('AIT');
		$(".modal-dialog-header").css("background-color","#5cb85c");
	}
	if( typeof(buttons) == 'undefined' ){
		$(".modal-dialog-footer").html('<div class="modal-dialog-ok" onclick="$(\'.modal-dialog\').hide();">Ok</div>');
	}else{
		$(".modal-dialog-footer").html(buttons);
	}
	$(".modal-dialog-body p").html(msg);
	$(".modal-dialog").show();
}


function vpb_refresh_aptcha(){
	return $("#vpb_captcha_code").val('').focus(),document.images['captchaimg'].src = document.images['captchaimg'].src.substring(0,document.images['captchaimg'].src.lastIndexOf("?"))+"?rand="+Math.random()*1000;
}


function is_EMAIL(str){
	if (str=="") return true;
	var intRegex = /\S+@\S+\.\S+/;
	if(intRegex.test(str)) {
		return true;
	}else{
		return false; 
	}
}


function step_1_next(){
	var fldValid = 0;
	$("input[type=text]").css("border","1px solid #c8c8c8");
	$("select").css("border","1px solid #c8c8c8");
	$(".underVisaTypeBox").css("border","1px solid #c8c8c8");
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("select").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '0' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if( $(".underVisaTypeBox_selected").length == 0 ){ $(".underVisaTypeBox").css("border","1px solid red"); fldValid = 1; }
	if( $("#agree_step_1").is(':checked') == false ) fldValid = 1;
	if( fldValid == 1 ) return; 
	$(".spinner").show();
	var visa_type = $(".underVisaTypeBox_selected").attr("id").replace("underVisa_","");
	var visa_type_name = $("#visaType").val();
	
	$.ajax({
		   type: "POST",
		   url: "api.php?method=ConfirmStep_1",
		   cache: false,
		   dataType: "json",
		   data: $("#step_1_form").serialize()+"&visa_type="+visa_type+"&visa_type_name="+visa_type_name,
		   success: function(msg){
			   $(".spinner").hide();
			   if( msg.status == 'incorrect_security_code' ){
				    $("#vpb_captcha_code").css("border","1px solid red");
					return;
			   }
			   $("#vpb_captcha_code").val('');
			   $("#vpb_captcha_code").css("border","1px solid #c8c8c8");
			   vpb_refresh_aptcha();
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
			   }
			   if( msg.status == '1' ){
			   	   window.location.href = msg.message + '.php?lng=' + $(".actLang").attr("alt")+'&unikal_numb='+msg.unikal_numb;
			   }
		   },
		   error: function (request, status, error) {
				$(".spinner").hide();
				showMsg('error',request.responseText);
				return;
		   }
	});
}


function step_2_next(){
	var fldValid = 0;
	$("input[type=text]").css("border","1px solid #c8c8c8");
	$("select").css("border","1px solid #c8c8c8");
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' && $(this).is(':visible') == true ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("select").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '0' && $(this).is(':visible') == true ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if( is_EMAIL( $("#email_address").val() ) == false ){ $("#email_address").css("border","1px solid red"); fldValid = 1; }
	if( fldValid == 1 ) return;
	$(".spinner").show();
	var applicant_type = $(".innerBtn_6699_active").attr("id").replace("applicant_type_","");
	$("input[type=text]").prop("disabled", false);


	var str=$("#step_2_form").serialize()+"&applicant_type="+applicant_type+"&unikal_numb="+$("#unikal_numb").val();

    var nonceValue = '1251jh1h125ih12o5h12lk312l3';
	let encryption = new Encryption();
    var encrypted = encryption.encrypt(str, nonceValue);
    console.log(encrypted);
  
   var decrypted = encryption.decrypt(encrypted, nonceValue);
   //console.log(decrypted);


	$.ajax({
		   type: "POST",
		   url: "api.php?method=ConfirmStep_2",
		   cache: false,
		   dataType: "json",
		   data: 'encryptedData='+encodeURIComponent(encrypted),
		   success: function(msg){
			   $(".spinner").hide();
			   if( msg.status == 'incorrect_security_code' ){
				    $("#vpb_captcha_code").css("border","1px solid red");
					return;
			   }
			   $("#vpb_captcha_code").val('');
			   $("#vpb_captcha_code").css("border","1px solid #c8c8c8");
			   vpb_refresh_aptcha();
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
			   }
			   if( msg.status == '1' ){
			   	  $("#step_2_form").html('<center><div class="successfulMailBox_6431">'+msg.message+'</div></center>');
				  $("html, body").animate({ scrollTop: 0 });
				  return;
			   }
		   },
		   error: function (request, status, error) {
				$(".spinner").hide();
				showMsg('error',request.responseText);
				return;
		   }
	});
}


function step_3_next(){
	var fldValid = 0;
	$("input").css("border","1px solid #c8c8c8");
	$("select").css("border","1px solid #c8c8c8");
	$("textarea").css("border","1px solid #c8c8c8");
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("select").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '0' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("textarea").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if( fldValid == 1 ) return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=ConfirmStep_3",
		   cache: false,
		   dataType: "json",
		   data: $("#step_3_form").serialize()+"&unikal_numb="+$("#unikal_numb").val(),
		   success: function(msg){
			   $(".spinner").hide();
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
			   }
			   if( msg.status == '1' ){
			   	   window.location.href = msg.message + '.php?lng=' + $(".actLang").attr("alt")+'&unikal_numb='+$("#unikal_numb").val();
			   }
		   },
		   error: function (request, status, error) {
				$(".spinner").hide();
				showMsg('error',request.responseText);
				return;
		   }
	});
}


function step_4_next(){
	if(!valid_file_count()){ showMsg('error','Error file count'); return; }
	var fldValid = 0;
	$(".filename").css("border-bottom","1px solid #515151");
    $(".filename").css("border-top","1px solid #191C23");
    $(".filename").css("border-left","1px solid #191C23");
    $(".filename").css("border-right","1px solid #191C23");
	$("input[type=file]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).parent().prev().css("border-bottom","1px solid red"); fldValid = 1; }
    });
	var visa_name = $(".step_4_tab tr:first-child").attr("visa_name");
	if( visa_name == '68' ){
		if( $("#doc_1_1").val() != '' && $("#doc_2_1").val() != '' ){
			if( $("#doc_27_1").val() != '' ) fldValid = 0;
			if( $("#doc_29_1").val() != '' ) fldValid = 0;
			if( $("#doc_49_1").val() != '' ) fldValid = 0;
		}
	}
	if( fldValid == 1 ) return;
	var documents_name = $("#documents_name").val();
	if( documents_name != '' ){
		var documents_name_array = documents_name.split(',');
		for(var i in documents_name_array){
				var curr = documents_name_array[i];
				if( curr == '' || typeof(curr) == 'undefined' ) continue; 
				var file_hidden = '';
				$("."+curr+"_table tr").each(function(index, element){
					if( file_hidden == '' ){
						file_hidden = this.id.replace('row_'+curr+'_','');
					}else{
						file_hidden = file_hidden +','+ this.id.replace('row_'+curr+'_','');
					}
				});
				$("#"+curr+"_hidden").val(file_hidden);
		}
	}
	$(".spinner").show();
	$("#step_4_form").submit();
}


function valid_file_count(){
		var ctn = 0;
		$('input[type=file]').each(function(index, element) {
            if( $(this).val() == '' ) return true;
			ctn++;
        });
		if( ctn > 20 ){ return false; }else{ return true; }
}


function showConfirmIcon(id){
	$("#"+id).removeAttr("disabled");
	$("#"+id+"_confirm").attr("onclick","saveThisValue('"+id+"');");
	$("#"+id+"_confirm").css("opacity","1");
}


function saveThisValue(id){
	$("input").css("border","1px solid #c8c8c8");
	$("select").css("border","1px solid #c8c8c8");
	$("textarea").css("border","1px solid #c8c8c8");
	if( $("#"+id).prop('disabled') == false && $("#"+id).attr('required') == 'required' && $("#"+id).val() == '' ){
		 $("#"+id).css("border","1px solid red");
		 return;
	}
	if( id == 'email_address' && is_EMAIL( $("#"+id).val() ) == false ){
		$("#"+id).css("border","1px solid red");
		return;
	}
	var currVal = $("#"+id).val();
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=ConfirmThisValue",
		   cache: false,
		   dataType: "json",
		   data: "currVal="+currVal+"&id="+id+"&unikal_numb="+$("#unikal_numb").val()+"&currUrl="+window.location.pathname,
		   success: function(msg){
				$(".spinner").hide();
				if( msg.status == 'error' ){
				   showMsg('error',msg.message);
				   return;
				}
				if( msg.status == 'success' ){
					$("#"+id).attr("disabled","disabled");
					$("#"+id+"_confirm").css("opacity","0");
				}
		   }
	});
}


function preview_confirmation(){
	if( $("#preview_confirmation_form").serialize() != '' ){
		 showMsg('warning','You have unsaved data.','<div class="modal-dialog-ok" onclick="it_is_ok();">It is ok</div>');
	}else{
		 send_preview_confirmation();
	}
}

function it_is_ok(){
	$(".modal-dialog").hide();
	send_preview_confirmation();
}


function send_preview_confirmation(){
	$(".spinner").show();
	$.ajax({
		type: "POST",
		url: "api.php?method=ConfirmPreviewConfirmation",
		cache: false,
		dataType: "json",
		data: "unikal_numb="+$("#unikal_numb").val(),
		success: function(msg){
			$(".spinner").hide();
			if( msg.status == '0' ){
			    showMsg('error',msg.message);
			    return;
			}
			if( msg.status == '1' ){
				window.location.href = msg.message + '.php?lng=' + $(".actLang").attr("alt")+'&unikal_numb='+$("#unikal_numb").val();
			}
		}
	});
}


function payment(){
	if ( $(".innerBtn_6699_active").attr("id") == 'payment_by_credit_debit_card' ){
		window.location.href='pay/pay.php?unikal_numb='+$("#unikal_numb").val();
		return;
	}
	var exempted_from_payment_val = $(".exempted_from_payment_tr_selected").attr("val");
	if( typeof(exempted_from_payment_val) == 'undefined' ){ showMsg('error','Please, select the case for approving the exemption from payment!!!'); return; }
	var payment_type = '';
	if( $(".innerBtn_6699_active").attr("id") == 'exempted_from_payment' ) payment_type = '1';
	if( $(".innerBtn_6699_active").attr("id") == 'payment_by_credit_debit_card' ) payment_type = '2';
	$("#payment_type").val(payment_type);
	$("#exempted_from_payment_val").val(exempted_from_payment_val);
	if( $("#file_options").attr("status") == '1' && $("#file_options").val() == '' ){ $(".filename").css("border","1px solid red"); return; }
	$("#step_6_form").submit();
	return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=paymentConfirmation",
		   cache: false,
		   dataType: "json",
		   data: "payment_type="+payment_type+"&exempted_from_payment_val="+exempted_from_payment_val,
		   success: function(msg){
				$(".spinner").hide();
				if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
				}
				if( msg.status == '1' ){
					window.location.href = msg.message + '.php?lng=' + $(".actLang").attr("alt");
					return;
				}
		   }
	});
}



function go_print_page(page){
	$.ajax({
		   type: "POST",
		   url: "api.php?method=GoPrintPage",
		   cache: false,
		   dataType: "json",
		   data: $("#group_visa_step_3_form").serialize()+"&unikal_numb="+$("#unikal_numb").val(),
		   success: function(msg){
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
			   }
			   if( msg.status == '1' ){
			   	   window.location.href = page + '.php?lng=' + $(".actLang").attr("alt")+'&unikal_numb='+$("#unikal_numb").val();
			   }
		   },
		   error: function (request, status, error) {
				showMsg('error',request.responseText);
				return;
		   }
	});
}



function check_status(){
	var fldValid = 0;
	$("input").css("border","1px solid #c8c8c8");
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if( fldValid == 1 ) return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=ConfirmCheckStatus",
		   cache: false,
		   dataType: "json",
		   data: $("#check_status_form").serialize(),
		   success: function(msg){
			   $(".spinner").hide();
			   if( msg.status == 'incorrect_security_code' ){
				    $("#vpb_captcha_code").css("border","1px solid red");
					return;
			   }
			   $("#vpb_captcha_code").val('');
			   $("#vpb_captcha_code").css("border","1px solid #c8c8c8");
			   vpb_refresh_aptcha();
			   if( msg.status == '1' ){
					window.location.href = msg.message + '.php?lng=' + $(".actLang").attr("alt")+'&unikal_numb='+msg.unikal_numb;
					return;
			   }
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
			   }
		   }
	});
}



function contact_us_next(){
	$(".messSucc_7733").hide();
	$("input").css("border","1px solid #c8c8c8");
	$("textarea").css("border","1px solid #c8c8c8");
	var fldValid = 0;
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("textarea").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if ( is_EMAIL( $("#email").val() ) == false ){ $("#email").css("border","1px solid red"); fldValid = 1; }
	if( fldValid == 1 ) return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=SendContactMessage",
		   cache: false,
		   data: $("#contact_us_form").serialize(),
		   success: function(msg){
					$(".spinner").hide();
				    if( msg.status == 'incorrect_security_code' ){
						$("#vpb_captcha_code").css("border","1px solid red");
						return;
				    }
				    $("#vpb_captcha_code").val('');
				    $("#vpb_captcha_code").css("border","1px solid #c8c8c8");
				    vpb_refresh_aptcha();
					if( msg.trim() == 'message_sent' ){
					  $("#firstname").val('');
					  $("#email").val('');
					  $("#message").val('');
					  $(".messSucc_7733").show();
					}else{
					   showMsg('error','Please send again');
					   return;
					}
		   }
	});
}


function contact_us_next_2(){
	$(".messSucc_7733").hide();
	$("input").css("border","1px solid white");
	$("textarea").css("border","1px solid white");
	var fldValid = 0;
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("textarea").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if ( is_EMAIL( $("#email").val() ) == false ){ $("#email").css("border","1px solid red"); fldValid = 1; }
	if( fldValid == 1 ) return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=SendContactMessage_2",
		   cache: false,
		   data: $("#contact_us_form").serialize(),
		   success: function(msg){
					$(".spinner").hide();
					if( msg.trim() == 'message_sent' ){
					  $("#firstname").val('');
					  $("#email").val('');
					  $("#message").val('');
					  $(".messSucc_7733").show();
					}else{
					   showMsg('error','Please send again');
					   return;
					}
		   }
	});
}



function callVisaTypeInfo(){
	var doc_issued_by = $("#doc_issued_by").val();
	if( doc_issued_by == '' ) return;
	$(".eligibility_table").hide();
	$.ajax({
		type: "POST",
		url: "api.php?method=getVisaTypeInfo",
		cache: false,
		dataType: "json",
		data: "doc_issued_by="+doc_issued_by,
		success: function(json){
			var ordinary_passport1 = '';
			var str = '';
			$.each(json, function(p, item) {
				ordinary_passport1 = item['ordinary_passport1'];
				if( ordinary_passport1 == 'undefined' || typeof(ordinary_passport1) == 'undefined' ) ordinary_passport1 = '';
				str += '<tr><td>'+item['regime']+'</td><td>'+item['ordinary_passport']+'</td><td>'+item['service_passport']+'</td><td>'+item['diplomatic_passport']+'</td><td>'+ordinary_passport1+'</td><tr>';
			});
			if( str != '' ){
				$(".eligibility_table tbody").html(str);
				$(".eligibility_table").fadeIn();
			}
			if( ordinary_passport1 != '' ) $("#resident_card_txt").show(); else ("#resident_card_txt").hide();
		}
	});
}




function add_member(){
	$("input").css("border","1px solid #c8c8c8");
	$("select").css("border","1px solid #c8c8c8");
	$(".filename").css("border-bottom","1px solid #515151");
    $(".filename").css("border-top","1px solid #191C23");
    $(".filename").css("border-left","1px solid #191C23");
    $(".filename").css("border-right","1px solid #191C23");
	var fldValid = 0;
	$("input[type=text]").each(function(index, element) {
		if( this.id == 'email_group' ) return true;
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("select").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("input[type=file]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).parent().prev().css("border","1px solid red"); fldValid = 1; }
    });
	if( fldValid == 1 ) return;
	$.ajax({
		   type: "POST",
		   url: "api.php?method=new_group_evisa_step_1_check_zapret",
		   cache: false,
		   data: $("#group_visa_step_1_form").serialize(),
		   success: function(msg){
			    if( msg != '' && msg != 'OK' ){ showMsg('error',msg); return; }
			    $(".spinner").show();
				$("#group_visa_step_1_form").submit();
		   
		   },
		   error: function (request, status, error) {
				showMsg('error',request.responseText);
				return;
		   }
	});
}


function groupItemsOption(id){
	 if( $("#top_arrow_"+id).is(":visible") ){
		 $("#top_arrow_"+id).hide();
		 $("#groupItems_"+id+" table").hide();
		 $("#bottom_arrow_"+id).show();
	 }else{
		 $("#bottom_arrow_"+id).hide();
		 $("#groupItems_"+id+" table").fadeIn();
		  $("#top_arrow_"+id).show();
	 }
 }


function delete_group_user(id){
	showMsg('error','The member will be deleted from the list.','<div class="modal-dialog-ok" onclick="$(\'.modal-dialog\').hide();">No</div><div class="showMeBtn_3449" onclick="delete_group_user_confirm(\''+id+'\');">Yes</div>');
}


function delete_group_user_confirm(id){
	$.ajax({
		   type: "POST",
		   url: "api.php?method=DELETE_USER_GROUP",
		   cache: false,
		   dataType: "json",
		   data: "id="+id,
		   success: function(msg){
			    $(".modal-dialog").hide();
				if( msg.status == '0' ){
				    showMsg('error',msg.message);
				    return;
			    }
				if( msg.status == '1' ){
			   	    location.href = location.href;
			    }
		   },
		   error: function (request, status, error) {
				showMsg('error',request.responseText);
				return;
		   }
	});
}



function group_visa_step_1_next(unikal_numb){
	$("input").css("border","1px solid #c8c8c8");
	var email_group = $("#email_group").val();
	var group_id = $("#group_id").val();
	if( email_group == '' ){ $("#email_group").css("border","1px solid red"); return; }
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=ConfirmGroupVisa",
		   cache: false,
		   dataType: "json",
		   data: "email_group="+email_group+"&group_id="+group_id+"&unikal_numb="+unikal_numb,
		   success: function(msg){
			   $(".spinner").hide();
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
			   }
			   if( msg.status == '1' ){
			   	  $(".pageContent_6446").html('<center><div class="successfulMailBox_6431">'+msg.message+'</div></center>');
				  $("html, body").animate({ scrollTop: 0 });
				  return;
			   }
		   },
		   error: function (request, status, error) {
				$(".spinner").hide();
				showMsg('error',request.responseText);
				return;
		   }
	});
}



function group_visa_step_2_next(){
	if(!valid_file_count()){  showMsg('error','Error file count'); return; }
	var fldValid = 0;
	$("input").css("border","1px solid #c8c8c8");
	$("textarea").css("border","1px solid #c8c8c8");
	$(".filename").css("border-bottom","1px solid #515151");
    $(".filename").css("border-top","1px solid #191C23");
    $(".filename").css("border-left","1px solid #191C23");
    $(".filename").css("border-right","1px solid #191C23");
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("textarea").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("input[type=file]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).parent().prev().css("border","1px solid red"); fldValid = 1; }
    });
	if( fldValid == 1 ) return;
	var documents_name = $("#documents_name").val();
	if( documents_name != '' ){
		var documents_name_array = documents_name.split(',');
		for(var i in documents_name_array){
				var curr = documents_name_array[i];
				if( curr == '' || typeof(curr) == 'undefined' ) continue; 
				var file_hidden = '';
				$("."+curr+"_table tr").each(function(index, element){
					if( file_hidden == '' ){
						file_hidden = this.id.replace('row_'+curr+'_','');
					}else{
						file_hidden = file_hidden +','+ this.id.replace('row_'+curr+'_','');
					}
				});
				$("#"+curr+"_hidden").val(file_hidden);
		}
	}
	$(".spinner").show();
	$("#group_visa_step_2_form").submit();
}



function group_visa_step_3_next(unikal_numb){
	var fldValid = 0;
	$("input").css("border","1px solid #c8c8c8");
	$("select").css("border","1px solid #c8c8c8");
	$("textarea").css("border","1px solid #c8c8c8");
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("select").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("textarea").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if( fldValid == 1 ) return;
	$("input").prop("disabled", false);
	$("select").prop("disabled", false);
	$("textarea").prop("disabled", false);
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=ConfirmGroupStep_3",
		   cache: false,
		   dataType: "json",
		   data: $("#group_visa_step_3_form").serialize()+"&unikal_numb="+unikal_numb,
		   success: function(msg){
			   $(".spinner").hide();
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   $("input").prop("disabled", true);
				   $("select").prop("disabled", true);
				   $("textarea").prop("disabled", true);
				   return;
			   }
			   if( msg.status == '1' ){
			   	   window.location.href = msg.message + '.php?lng=' + $(".actLang").attr("alt")+'&unikal_numb='+unikal_numb;
			   }
		   },
		   error: function (request, status, error) {
				$(".spinner").hide();
				showMsg('error',request.responseText);
				$("input").prop("disabled", true);
				$("select").prop("disabled", true);
				$("textarea").prop("disabled", true);
				return;
		   }
	});
}



function showConfirmIcon_GROUP(id){
	$("#"+id).removeAttr("disabled");
	$("#"+id+"_confirm").attr("onclick","saveThisValue_GROUP('"+id+"');");
	$("#"+id+"_confirm").css("opacity","1");
}


function saveThisValue_GROUP(id){
	$("input").css("border","1px solid #c8c8c8");
	$("select").css("border","1px solid #c8c8c8");
	$("textarea").css("border","1px solid #c8c8c8");
	if( $("#"+id).prop('disabled') == false && $("#"+id).attr('required') == 'required' && $("#"+id).val() == '' ){
		 $("#"+id).css("border","1px solid red");
		 return;
	}
	$("#"+id).attr("disabled","disabled");
	$("#"+id+"_confirm").css("opacity","0");
}


function showConfirmIcon_GROUP_2(id){
	$("#"+id+" input").removeAttr("disabled");
	$("#"+id+" select").removeAttr("disabled");
	$("#"+id+"_confirm").attr("onclick","saveThisValue_GROUP_2('"+id+"');");
	$("#"+id+"_confirm").css("opacity","1");
}

function saveThisValue_GROUP_2(id){
	$("input").css("border","1px solid #c8c8c8");
	$("select").css("border","1px solid #c8c8c8");
	var valids = 0;
	$("#"+id+" input").each(function(index, element) {
		if( $(this).prop('disabled') == false && $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); valids = 1; }
    });
	if( valids == 1 ) return;
	var valids_2 = 0;
	$("#"+id+" select").each(function(index, element) {
		if( $(this).prop('disabled') == false && $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); valids_2 = 1; }
    });
	if( valids_2 == 1 ) return;
	$("#"+id+" input").attr("disabled","disabled");
	$("#"+id+" select").attr("disabled","disabled");
	$("#"+id+"_confirm").css("opacity","0");
}


function preview_confirmation_GROUP(unikal_numb){
	if( $("#group_visa_step_3_form").serialize() != '' ){
		 showMsg('warning','You have unsaved data.','<div class="modal-dialog-ok" onclick="$(\'.modal-dialog\').hide();">Ok</div>');
	}else{
		group_visa_step_3_next(unikal_numb);
	}
}


function call_validation(fld){
	var val = $("#"+fld).val();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=Call_Validation",
		   cache: false,
		   dataType: "json",
		   data: "val="+val+"&fld="+fld,
		   success: function(msg){
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   $("#"+fld).val('');
				   return;
			   }
		   }
	});
}


function payment_group(unikal_numb){
	window.location.href='pay/pay.php?unikal_numb='+unikal_numb;
	return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=paymentGroupConfirmation",
		   cache: false,
		   dataType: "json",
		   data: "",
		   success: function(msg){
				$(".spinner").hide();
				if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
				}
				if( msg.status == '1' ){
					window.location.href = msg.message + '.php?lng=' + $(".actLang").attr("alt");
					return;
				}
		   }
	});
}



function register(){
	$("input").css("border","1px solid #c8c8c8");
	var fldValid = 0;
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if( is_EMAIL( $("#email_address").val() ) == false ){ $("#email_address").css("border","1px solid red"); fldValid = 1; }
	$("input[type=file]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).parent().prev().css("border-bottom","1px solid red"); fldValid = 1; }
    });
    $("input[type=password]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
    if( $("#password").val().length < 6 ){ $("#password").css("border","1px solid red"); fldValid = 1; }
    if( $("#password").val() != $("#re_password").val() ){ $("#password").css("border","1px solid red"); $("#re_password").css("border","1px solid red"); fldValid = 1; }
	if( fldValid == 1 ) return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=new_evisa_personal_cabinet_application_submit",
		   cache: false,
		   data: $("#register_form").serialize(),
		   success: function(msg){
			   if( msg == 'incorrect_security_code' ){
			   		$(".spinner").hide();
				    $("#vpb_captcha_code").css("border","1px solid red");
					return;
			   }
			   $("#vpb_captcha_code").val('');
			   $("#vpb_captcha_code").css("border","1px solid #c8c8c8");
			   vpb_refresh_aptcha();
			   var dataArray = msg.split('####');
			   if( dataArray[0].toLowerCase() != 'ok' ){
			   	   $(".spinner").hide();
				   showMsg('error',dataArray[0]);
				   return;
			   }
			   $("#rown").val(dataArray[1]);
			   var documents_name = $("#documents_name").val();
			   if( documents_name != '' ){
					var documents_name_array = documents_name.split(',');
					for(var i in documents_name_array){
							var curr = documents_name_array[i];
							if( curr == '' || typeof(curr) == 'undefined' ) continue; 
							var file_hidden = '';
							$("."+curr+"_table tr").each(function(index, element){
								if( file_hidden == '' ){
									file_hidden = this.id.replace('row_'+curr+'_','');
								}else{
									file_hidden = file_hidden +','+ this.id.replace('row_'+curr+'_','');
								}
							});
							$("#"+curr+"_hidden").val(file_hidden);
					}
			   }
			   $("#register_form").submit();
		   },
		   error: function (request, status, error) {
				$(".spinner").hide();
				showMsg('error',request.responseText);
				return;
		   }
	});
}


function login(){
	$("input").css("border","1px solid #c8c8c8");
	var fldValid = 0;
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	$("input[type=file]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).parent().prev().css("border-bottom","1px solid red"); fldValid = 1; }
    });
    $("input[type=password]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if( fldValid == 1 ) return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=new_evisa_personal_cabinet_login",
		   cache: false,
		   data: $("#login_form").serialize(),
		   success: function(msg){
		   	   var dataArray = msg.split('####');	
			   if( dataArray[0].toLowerCase() != 'ok' ){
			   	   $(".spinner").hide();
				   showMsg('error',dataArray[0]);
				   return;
			   }
			   $("#pk_cabinet").val(dataArray[1]);
			   $("#login_form").submit();
		   },
		   error: function (request, status, error) {
				$(".spinner").hide();
				showMsg('error',request.responseText);
				return;
		   }
	});
}





function lose_key(){
	$("input").css("border","1px solid #c8c8c8");
	if( is_EMAIL( $("#email_address").val() ) == false || $("#email_address").val() == '' ){ $("#email_address").css("border","1px solid red"); return; }
	if( $("#vpb_captcha_code").val() == '' ){ $("#vpb_captcha_code").css("border","1px solid red"); return; }
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=new_evisa_personal_cabinet_pass_change_1",
		   cache: false,
		   dataType: "json",
		   data: "email_address="+$("#email_address").val()+"&vpb_captcha_code="+$("#vpb_captcha_code").val(),
		   success: function(msg){
		   	   $(".spinner").hide();
			   if( msg.status == 'incorrect_security_code' ){
				    $("#vpb_captcha_code").css("border","1px solid red");
					return;
			   }
			   $("#vpb_captcha_code").val('');
			   $("#vpb_captcha_code").css("border","1px solid #c8c8c8");
			   vpb_refresh_aptcha();
			   if( msg.status == 'error' ){
				   showMsg('error',msg.message);
				   return;
			   }
			   if( msg.status == 'ok' ){
			   	   $("#email_address").val('');
			   	   showMsg('success','Please, check your email. We have sent you a confirmation link to get new password.');
			   }
		   },
		   error: function (request, status, error) {
				$(".spinner").hide();
				showMsg('error',request.responseText);
				return;
		   }
	});
}












/**
 * Encryption class for encrypt/decrypt that works between programming languages.
 * 
 * @author Vee Winch.
 * @link https://stackoverflow.com/questions/41222162/encrypt-in-php-openssl-and-decrypt-in-javascript-cryptojs Reference.
 * @link https://github.com/brix/crypto-js/releases crypto-js.js can be download from here.
 */
class Encryption {


    /**
     * @var integer Return encrypt method or Cipher method number. (128, 192, 256)
     */
    get encryptMethodLength() {
        var encryptMethod = this.encryptMethod;
        // get only number from string.
        // @link https://stackoverflow.com/a/10003709/128761 Reference.
        var aesNumber = encryptMethod.match(/\d+/)[0];
        return parseInt(aesNumber);
    }// encryptMethodLength


    /**
     * @var integer Return cipher method divide by 8. example: AES number 256 will be 256/8 = 32.
     */
    get encryptKeySize() {
        var aesNumber = this.encryptMethodLength;
        return parseInt(aesNumber / 8);
    }// encryptKeySize


    /**
     * @link http://php.net/manual/en/function.openssl-get-cipher-methods.php Refer to available methods in PHP if we are working between JS & PHP encryption.
     * @var string Cipher method. 
     *              Recommended AES-128-CBC, AES-192-CBC, AES-256-CBC 
     *              due to there is no `openssl_cipher_iv_length()` function in JavaScript 
     *              and all of these methods are known as 16 in iv_length.
     */
    get encryptMethod() {
        return 'AES-256-CBC';
    }// encryptMethod


    /**
     * Decrypt string.
     * 
     * @link https://stackoverflow.com/questions/41222162/encrypt-in-php-openssl-and-decrypt-in-javascript-cryptojs Reference.
     * @link https://stackoverflow.com/questions/25492179/decode-a-base64-string-using-cryptojs Crypto JS base64 encode/decode reference.
     * @param string encryptedString The encrypted string to be decrypt.
     * @param string key The key.
     * @return string Return decrypted string.
     */
    decrypt(encryptedString, key) {
        var json = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString)));

        var salt = CryptoJS.enc.Hex.parse(json.salt);
        var iv = CryptoJS.enc.Hex.parse(json.iv);

        var encrypted = json.ciphertext;// no need to base64 decode.

        var iterations = parseInt(json.iterations);
        if (iterations <= 0) {
            iterations = 999;
        }
        var encryptMethodLength = (this.encryptMethodLength/4);// example: AES number is 256 / 4 = 64
        var hashKey = CryptoJS.PBKDF2(key, salt, {'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength/8), 'iterations': iterations});

        var decrypted = CryptoJS.AES.decrypt(encrypted, hashKey, {'mode': CryptoJS.mode.CBC, 'iv': iv});

        return decrypted.toString(CryptoJS.enc.Utf8);
    }// decrypt


    /**
     * Encrypt string.
     * 
     * @link https://stackoverflow.com/questions/41222162/encrypt-in-php-openssl-and-decrypt-in-javascript-cryptojs Reference.
     * @link https://stackoverflow.com/questions/25492179/decode-a-base64-string-using-cryptojs Crypto JS base64 encode/decode reference.
     * @param string string The original string to be encrypt.
     * @param string key The key.
     * @return string Return encrypted string.
     */
    encrypt(string, key) {
        var iv = CryptoJS.lib.WordArray.random(16);// the reason to be 16, please read on `encryptMethod` property.

        var salt = CryptoJS.lib.WordArray.random(256);
        var iterations = 999;
        var encryptMethodLength = (this.encryptMethodLength/4);// example: AES number is 256 / 4 = 64
        var hashKey = CryptoJS.PBKDF2(key, salt, {'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength/8), 'iterations': iterations});

        var encrypted = CryptoJS.AES.encrypt(string, hashKey, {'mode': CryptoJS.mode.CBC, 'iv': iv});
        var encryptedString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

        var output = {
            'ciphertext': encryptedString,
            'iv': CryptoJS.enc.Hex.stringify(iv),
            'salt': CryptoJS.enc.Hex.stringify(salt),
            'iterations': iterations
        };

        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(output)));
    }// encrypt


}



function check_transfer_visa(){
	var fldValid = 0;
	$("input").css("border","1px solid #c8c8c8");
	$("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
	if( fldValid == 1 ) return;
	$(".spinner").show();
	$.ajax({
		   type: "POST",
		   url: "api.php?method=new_evisa_perenos_check_reference",
		   cache: false,
		   dataType: "json",
		   data: $("#check_status_form").serialize(),
		   success: function(msg){
			   $(".spinner").hide();
			   if( msg.status == 'incorrect_security_code' ){
				    $("#vpb_captcha_code").css("border","1px solid red");
					return;
			   }
			   $("#vpb_captcha_code").val('');
			   $("#vpb_captcha_code").css("border","1px solid #c8c8c8");
			   vpb_refresh_aptcha();
			   if( msg.status == '1' ){
					window.location.href = 'transfer.php?lng=' + $(".actLang").attr("alt")+'&unikal_numb='+msg.unikal_numb;
					return;
			   }
			   if( msg.status == '0' ){
				   showMsg('error',msg.message);
				   return;
			   }
		   }
	});
}


function transfer_submit(){
    var fldValid = 0;
    $("input[type=text]").css("border","1px solid #a6a6a6");
    $("textarea").css("border","1px solid #a6a6a6");
    $("select").css("border","1px solid #a6a6a6");
    $("input[type=text]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
    $("select").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
    $("input[type=file]").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).parent().prev().css("border","1px solid red"); fldValid = 1; }
    });
    $("textarea").each(function(index, element) {
        if( $(this).attr('required') == 'required' && $(this).val() == '' ){ $(this).css("border","1px solid red"); fldValid = 1; }
    });
    if( is_EMAIL( $("#email_address").val() ) == false ){ $("#email_address").css("border","1px solid red"); fldValid = 1; }
    if( fldValid == 1 ) return;
    var documents_name = $("#documents_name").val();
    if( documents_name != '' ){
        var documents_name_array = documents_name.split(',');
        for(var i in documents_name_array){
                var curr = documents_name_array[i];
                if( curr == '' || typeof(curr) == 'undefined' ) continue; 
                var file_hidden = '';
                $("."+curr+"_table tr").each(function(index, element){
                    if( file_hidden == '' ){
                        file_hidden = this.id.replace('row_'+curr+'_','');
                    }else{
                        file_hidden = file_hidden +','+ this.id.replace('row_'+curr+'_','');
                    }
                });
                $("#"+curr+"_hidden").val(file_hidden);
        }
    }
    $("#transfer_form").submit();
}