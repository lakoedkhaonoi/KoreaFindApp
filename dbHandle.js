var db = null;
var var_no = null;
var position = null;
var index;
 
// 데이터베이스 생성 및 오픈
function openDB(){
   db = window.openDatabase('addDB', '1.0', 'addStoryDB', 1024*1024); 
   console.log('1_DB 생성...'); 
} 
// 테이블 생성 트랜잭션 실행
function createTable() {
   db.transaction(function(tr){
   var createSQL = 'create table if not exists addStory(type text, name text)';       
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
  		var insertSQL = 'insert into addStory(type, name) values(?, ?)';      
     	tr.executeSql(insertSQL, [type, name], function(tr, rs){    
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
function listBook(){
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
function updateBook(){
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
function deleteBook(){
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
// 데이터 수정 위한 데이터 검색 트랜잭션 실행
function selectBook2(name){
   db.transaction(function(tr){
	 var selectSQL = 'select type, name from addStory where name=?';        
  	 tr.executeSql(selectSQL, [name], function(tr, rs){
  	 	 $('#addType2').val(rs.rows.item(0).type).attr('selected', 'selected'); 	
	 		 $('#addType2').selectmenu('refresh');	
       $('#addName2').val(rs.rows.item(0).name);
	 	});
   });         
}
// 데이터 삭제 위한 데이터 검색 트랜잭션 실행
function selectBook3(name){
   db.transaction(function(tr){
 	 var selectSQL = 'select type, name from addStory where name=?';      
		tr.executeSql(selectSQL, [name], function(tr, rs){ 
			 $('#addType3').val(rs.rows.item(0).type);
       $('#addName3').val(rs.rows.item(0).name);
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
	});         
}
// 데이터 조건 검색 트랜잭션 실행
function selectBook4(name){
   db.transaction(function(tr){
 	 var selectSQL = 'select type, name from addStory where name=?';      
  	 tr.executeSql(selectSQL, [name], function(tr, rs){ 
         $('#addType4').val(rs.rows.item(0).type);
         $('#addName4').val(rs.rows.item(0).name);
		}, function(tr, err){
				alert('DB오류 ' + err.message + err.code);
			}
		);
   });         
 };
