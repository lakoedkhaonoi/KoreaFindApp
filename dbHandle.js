var db = null;
var var_no = null;
var position = null;
var index;
 
// 데이터베이스 생성 및 오픈
function openDB(){
   db = window.openDatabase('addStoryDB', '1.0', 'addStoryDB', 1024*1024); 
   console.log('1_DB 생성...'); 
} 
// 테이블 생성 트랜잭션 실행
function createTable() {
   db.transaction(function(tr){
   var createSQL = 'create table if not exists addStory(type text, name text, area text, phone text)';       
   tr.executeSql(createSQL, [], function(){
     		console.log('2_1_테이블생성_sql 실행 성공...');        
	   }, function(){
	      console.log('2_1_테이블생성_sql 실행 실패...');            
	   });
	   }, function(){
	      console.log('2_2_테이블 생성 트랜잭션 실패...롤백은 자동');
	   }, function(){
	      console.log('2_2_테이블 생성 트랜잭션 성공...');
     });
 } 
 // 데이터 입력 트랜잭션 실행
 function insertStory(){ 
    db.transaction(function(tr){
  		var type = $('#addType1').val();
  		var name = $('#addName1').val();
		var area = $('#areaType1').val();
  		var phone = $('#addPhone1').val();

  		var insertSQL = 'insert into addStory(type, name, area, phone) values(?, ?, ?, ?)';      
     	tr.executeSql(insertSQL, [type, name, area, phone], function(tr, rs){    
      	    console.log('3_ 의뢰 등록...no: ' + rs.insertId);
	        alert('의뢰명 ' + $('#addName1').val() + ' 이 입력되었습니다');      	       
	   		$('#addName1').val('');      
			$('#addType1').val('미정').attr('selected', 'selected'); 
			$('#addType1').selectmenu('refresh');		   		   	      
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });      
 }
// 전체 데이터 검색 트랜잭션 실행
function listStory(){
  db.transaction(function(tr){
 	var selectSQL = 'select * from addStory';    
  	tr.executeSql(selectSQL, [], function(tr, rs){    
       console.log(' 의뢰 조회... ' + rs.rows.length + '건.');
       if (position == 'first') {
       	  if(index == 0) 
       	  	alert('더 이상의 의뢰가 없습니다');   
          else       	
          	index = 0;
	   	 }
       else if (position == 'prev') {
       	  if(index == 0) 
       	  	alert('더 이상의 의뢰가 없습니다');   
          else
          	index = --index;
	 		 }
       else if (position == 'next') {
       	  if(index == rs.rows.length-1) 
       	  	alert('더 이상의 의뢰가 없습니다');          	
		      else
		      	index = ++index;
       }
       else 
       {  
       	  if(index == rs.rows.length-1) 
       	  	alert('더 이상의 의뢰가 없습니다');          	
		      else       	
	       	  index = rs.rows.length-1;
       }
       $('#addType4').val(rs.rows.item(index).type);
       $('#addName4').val(rs.rows.item(index).name);
 		});   
  });           
}
// 데이터 수정 트랜잭션 실행
function updateStory(){
    db.transaction(function(tr){
    	var type = $('#addType2').val();
    	var new_name = $('#addName2').val();
    	var old_name = $('#addsName2').val();
		var updateSQL = 'update addStory set type = ?, name = ? where name = ?';          
     	tr.executeSql(updateSQL, [type, new_name, old_name], function(tr, rs){    
	         console.log('5_의뢰 수정.... ') ;
	         alert('의뢰명 ' + $('#addsName2').val() + ' 이 수정되었습니다');   	         
	   		 $('#addName2').val(''); $('#addsName2').val('');   
	   		 $('#addType2').val('미정').attr('selected', 'selected'); 
			 $('#addType2').selectmenu('refresh');	
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
    });       
}
// 데이터 삭제 트랜잭션 실행
function deleteStory(){
   db.transaction(function(tr){
	  var name = $('#addsName3').val();   
 	  var deleteSQL = 'delete from addStory where name = ?';      
	  tr.executeSql(deleteSQL, [name], function(tr, rs){    
	     console.log('6_의뢰 삭제... ');   
	     alert('의뢰명 ' + $('#addName3').val() + ' 이 삭제되었습니다');   	     
	   	 $('#addType3').val(''); $('#addName3').val(''); $('#addsName3').val('');   	     
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });         
}
// 데이터 조건 검색 트랜잭션 실행
function selectFindStory(area){
   db.transaction(function(tr){
 	 var selectSQL = 'select type, name, area, phone from addStory where area=?';      
  	 tr.executeSql(selectSQL, [area], function(tr, rs){
         $('#sArea').val(rs.rows.item(0).area);
		 $('#addName4').val(rs.rows.item(0).name);
		 $('#addType4').val(rs.rows.item(0).type);
         $('#addPhone4').val(rs.rows.item(0).phone);
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });         
 };
