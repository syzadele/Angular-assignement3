(function() {
'use strict';

  angular.module('NarrowItDownApp',[])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItemsDirective);


function FoundItemsDirective () {
  var ddo = {
    templateUrl : "menuResult.html",
    scope: {
      found: '<',
      onRemove: '&',
      nothingFound:'='
    }
  };
  return ddo;
}




NarrowItDownController.$inject=['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
  var narrowItDownCtrl = this;

  narrowItDownCtrl.searchTerm = "";
  narrowItDownCtrl.found = [];
  narrowItDownCtrl.nothingFound = false;

  narrowItDownCtrl.getSearchItem = function () {
    if (narrowItDownCtrl.searchTerm != null && narrowItDownCtrl.searchTerm != "") {
      var promise = MenuSearchService.getMatchedMenuItems(narrowItDownCtrl.searchTerm);

      promise.then(function (result) {
          narrowItDownCtrl.found = [];
          narrowItDownCtrl.nothingFound = false;
          // return processed items
          console.log(result);
          narrowItDownCtrl.found = result;
          if (narrowItDownCtrl.found.length == 0) {
            narrowItDownCtrl.nothingFound = true;
          }
          //return foundItems;
      }).catch(function(error) {
        console.log("something wrong");
      });
    } else {
      narrowItDownCtrl.nothingFound = true;
      narrowItDownCtrl.found = [];
    }
  }

  narrowItDownCtrl.remove = function (index) {
    narrowItDownCtrl.found.splice(index,1);
  }

}

MenuSearchService.$inject=['$http'];
function MenuSearchService ($http) {
  var menuSearchService = this;

  menuSearchService.getMatchedMenuItems = function (searchItems) {
    return $http({
      method : "GET",
      url : "https://davids-restaurant.herokuapp.com/menu_items.json"
    }
  ).then(function (result) {
      console.log(result.data);
      // process result and only keep items that match
      //console.log(result.data[menu_items]);
      var foundItems = [];
      if (result.data != null && result.data != "" && result.data.menu_items.length > 0) {

        for (var i = 0; i < result.data.menu_items.length; i++) {

          if (result.data.menu_items[i].description.includes(searchItems)) {
            foundItems.push(result.data.menu_items[i]);
          }
        }

      }
      // return processed items
      console.log(foundItems);
      return foundItems;
  });
  }
}


})();
