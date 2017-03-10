angular.module('controllers')
    .controller('conversationCtrl', function($scope,$http,$location,mySocket) {

        mySocket.on('private',function(data){

            var param = $location.search();

            console.log(data.msg);

            var el = angular.element( document.querySelector( '.full-height-scroll' ) );
            if(data.senderID == param.threadID){

                el.append('<div class="pull-left msg-left">&nbsp;'+data.msg+'&nbsp;</div><br><br><br><br>');


            }else{

                el.append('<div class="pull-right msg-right">&nbsp;'+data.msg+'&nbsp;</div><br><br><br><br>');

            }

            
        });



        $scope.msg ="" ;

    	$scope.send = function(){

    		var param = $location.search();

    		//console.log($scope.msg);

    		$http.post('http://localhost:3000/send',{id:param.threadID,msg:$scope.msg}).then(function(res){

    			console.log(res);

                $scope.msg ="" ;

    		},function(err){

    			console.log(err);
    		});

    	};

        $scope.redirect = function(){

            window.location.href="http://localhost:3000/";

        };



    
    });
