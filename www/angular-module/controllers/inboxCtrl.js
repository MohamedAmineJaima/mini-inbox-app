angular.module('controllers')
.controller('inboxCtrl', function($scope,$http){



	$scope.isoToString = function(str){

		var ps = new Date(str)  ;
		ps = ps.toDateString() + " " + ps.getHours() + ":"+ ps.getMinutes() + " hrs";
		return ps;
	};

	$scope.import = function(){

		$http.post('/import').then(function(res){

    			//console.log(res);

    			alert("Your Facebook Contacts were imported Successfully");

    		},function(err){

    			console.log(err);

    		});

	};



	$scope.search = function(){

		return $http.post('/search',{key:$scope.keyword}).then(function(res){

			//console.log(res);

			return res.data;

		},function(err){

			console.log(err);

		});

	};

	$scope.onSelect = function ($item, $model, $label) {

		//alert(JSON.stringify($item) +" "+$model+" "+$label);
		$http.post('/contactClicked',{id:$item.id}).then(function(res){

			console.log(res);

			window.location.href="http://localhost:3000/"+res.data.fbid+"?threadID="+res.data.threadID+"&messageCount="+res.data.messageCount;

		},function(err){

			console.log(err);

		});
	};





});