function MedalsController($scope, $http) {
  var ctrl = this;
  ctrl.testing = false;
  ctrl.order = "-Total";
  const genders = ["Men", "Women"];
  const medalTypes = ["Gold", "Silver", "Bronze"];
  ctrl.columns = ["Country"].concat(medalTypes, genders, ["Total"]);
  ctrl.medalFilter = "All";
  ctrl.genderFilter = "All";
  ctrl.medalDropdownOptions = ["All", "Gold winners", "Silver winners", "Bronze winners"];
  ctrl.genderDropdownOptions = ["All", "Male medalists", "Female medalists"];

  ctrl.filterFunction = (filter, type) => {
    if (!ctrl.medalDropdownOptions.includes(filter) && !ctrl.genderDropdownOptions.includes(filter)) {
      console.log("Invalid filter attempted: ", filter);
      return;
    }
    ctrl.medalFilter = type === "medal" ?  filter : ctrl.medalFilter;
    ctrl.genderFilter = type === "gender" ?  filter : ctrl.genderFilter;

    ctrl.medals = ctrl.reducedData.filter(m => {
      let medalVal = true;
      if ((ctrl.medalFilter === "Gold winners" && m.Gold === 0) ||
          (ctrl.medalFilter === "Silver winners" && m.Silver === 0) ||
          (ctrl.medalFilter === "Bronze winners" && m.Bronze === 0)) {
        medalVal = false;
      }
      let genderVal = true;
      if ((ctrl.genderFilter === "Male medalists" && m.Men === 0) ||
          (ctrl.genderFilter === "Female medalists" && m.Women === 0)) {
        genderVal = false;
      }
      return medalVal && genderVal;
    });
  }

  ctrl.sort = (column) => {
    if (!ctrl.columns.includes(column)) {
      console.log("Error - invalid column passed to sort: ", column);
      return;
    }
    if (column === ctrl.order.replace("-", "")) {
      ctrl.order = ctrl.order.includes("-") ? column : "-" + column;
    } else {
      ctrl.order = "-" + column;
    }
  }

  ctrl.reduceData = (data) => {
    if(data.constructor !== Array){
      console.log("Error: data is not an array");
      return [];
    };
    const medalsMap = {};
    data.forEach(medal => {
        if (!medalsMap[medal.country]) {
          medalsMap[medal.country] = {
            Country: medal.country,
            Gold: 0,
            Silver: 0,
            Bronze: 0,
            Men: 0,
            Women: 0,
            Total: 0
          }
        };
        medalsMap[medal.country].Total += 1;
        if (!medalTypes.includes(medal.medal)){
          console.log("Error - Invalid medal type value: ", medal.medal);
        } else {
          medalsMap[medal.country][medal.medal] += 1;
        }
        if (!genders.includes(medal.sex)) {
          console.log("Error - Invalid gender value: ", medal.sex);
          return;
        }
        medalsMap[medal.country][medal.sex] += 1;
    });
    const medalsArray = [];
    for (let key in medalsMap) {
      if (medalsMap.hasOwnProperty(key)) {
        medalsArray.push(medalsMap[key]);
      }
    };
    return medalsArray;
  };
  $http.get("../../data/medals.json").then((res) => {
    ctrl.rawData = res.data;
    ctrl.reducedData = ctrl.reduceData(ctrl.rawData);
    ctrl.medals = ctrl.reducedData.filter(a => a);
  }).catch((e) => {
    console.log("Error getting medals data: ", e);
  });
}


angular.module("testApp").component("medals", {
  templateUrl: "components/medals/medals.html",
  controller: MedalsController,
  bindings: {
    showMedals: "="
  }
});
