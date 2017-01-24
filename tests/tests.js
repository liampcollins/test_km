window.assert = chai.assert;
var expect = chai.expect;

describe('Test App', function () {
  let $componentController;

  beforeEach(module('testApp'));
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  describe('#MedalsController', function () {
    let ctrl;
    beforeEach(function () {
      var bindings = {showMedals: true};
      ctrl = $componentController('medals', null, bindings);
    });

    describe('#sort', function () {
      it('should leave ctrl.order unchanged when an invalid column name is passsed to sort', function () {
        ctrl.order = '-Total';
        const column = 'fdsfdsfsd';
        const expected = '-Total';
        ctrl.sort(column);
        expect(ctrl.order).to.equal(expected);
      });

      it('should set ctrl.order to the reverse of a column when ctrl.order already uses a column that is passed to sort ', function () {
        ctrl.order = '-Gold';
        const column = 'Gold';
        const expected = 'Gold';
        ctrl.sort(column);
        expect(ctrl.order).to.equal(expected);
      });

      it('should sets ctrl.order to a column when it is passed to sort', function () {
        ctrl.order = '-Total';
        const column = 'Gold';
        const expected = '-Gold';
        ctrl.sort(column);
        expect(ctrl.order).to.eql(expected);
      });
    });

    describe('#reduceData', function () {
      it('should return empty array if passed non-array argument', function () {
        const data = 'fdsfdsfdss';
        const expected = [];
        const result = ctrl.reduceData(data);
        expect(result).to.eql(expected);
      });

      it('should correctly attributes a medal to the appropriate gender, medal type and country', function () {
        const data = [
          {
            "athlete": "KOGO, Micah",
            "country": "KEN",
            "sex": "Men",
            "event": "10000m",
            "medal": "Bronze"
          },
          {
            "athlete": "BEKELE, Kenenisa",
            "country": "ETH",
            "sex": "Men",
            "event": "10000m",
            "medal": "Gold"
          }
        ];
        const expected = [
          {
            "Bronze": 1,
            "Country": "KEN",
            "Gold": 0,
            "Men": 1,
            "Silver": 0,
            "Total": 1,
            "Women": 0
          },
          {
            "Bronze": 0,
            "Country": "ETH",
            "Gold": 1,
            "Men": 1,
            "Silver": 0,
            "Total": 1,
            "Women": 0
          }
        ];
        const result = ctrl.reduceData(data);
        expect(result).to.eql(expected);
      });

      it('should skip over medals with invalid values', function () {
        const data = [
          {
            "athlete": "FLANAGAN, Shalane",
            "country": "USA",
            "sex": "Women",
            "event": "10000m",
            "medal": "Bronze"
          },
          {
            "athlete": "KOGO, Micah",
            "country": "KEN",
            "sex": "Men",
            "event": "10000m",
            "medal": "FDSDSFSDF"
          },
          {
            "athlete": "BEKELE, Kenenisa",
            "country": "ETH",
            "sex": "FDSFDSF",
            "event": "10000m",
            "medal": "Gold"
          }
        ];
        const expected = [
          {
            "Bronze": 1,
            "Country": "USA",
            "Gold": 0,
            "Men": 0,
            "Silver": 0,
            "Total": 1,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "KEN",
            "Gold": 0,
            "Men": 1,
            "Silver": 0,
            "Total": 1,
            "Women": 0
          },
          {
            "Bronze": 0,
            "Country": "ETH",
            "Gold": 1,
            "Men": 0,
            "Silver": 0,
            "Total": 1,
            "Women": 0
          }
        ];
        var result = ctrl.reduceData(data);
        expect(result).to.eql(expected);
      });

      it('should correctly aggregate medal counts into their respective categories and total', function () {
        const data = [
          {
            "athlete": "SIHINE, Sileshi",
            "country": "ETH",
            "sex": "Men",
            "event": "10000m",
            "medal": "Silver"
          },
          {
            "athlete": "DIBABA, Tirunesh",
            "country": "ETH",
            "sex": "Women",
            "event": "10000m",
            "medal": "Gold"
          },
          {
            "athlete": "BEKELE, Kenenisa",
            "country": "ETH",
            "sex": "Men",
            "event": "10000m",
            "medal": "Gold"
          }
        ];
        const expected = [
          {
            "Bronze": 0,
            "Country": "ETH",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        var result = ctrl.reduceData(data);
        expect(result).to.eql(expected);
      });
    });

    describe('#filter', function() {
      beforeEach(function () {
        ctrl.medalFilter = 'All';
        ctrl.genderFilter = 'All';
      });

      it('should leave the medals unchanged after filtering by an invalid filter', function () {
        ctrl.medals = [
          {
            "Bronze": 0,
            "Country": "USA",
            "Gold": 0,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "GB",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "RS",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        ctrl.filterFunction('xxxxxx', 'medal');
        const expected = [
          {
            "Bronze": 0,
            "Country": "USA",
            "Gold": 0,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "GB",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "RS",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        expect(ctrl.medals).to.eql(expected);
      });

      it('should remove no values from the reduced data when filtering by all medals and all genders', function () {
        ctrl.reducedData = [
          {
            "Bronze": 0,
            "Country": "USA",
            "Gold": 0,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "GB",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "RS",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        ctrl.medalFilter = 'Gold winners';
        ctrl.filterFunction('All', 'medal');
        const result = [
          {
            "Bronze": 0,
            "Country": "USA",
            "Gold": 0,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "GB",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "RS",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        expect(result).to.eql(ctrl.medals);

        ctrl.medalFilter = 'All';
        ctrl.genderFilter = 'Male medalists';
        ctrl.filterFunction('All', 'gender');
        expect(result).to.eql(ctrl.medals);
      });

      it('should return countries that have won medals of that type when filtering by medal type', function () {
        ctrl.reducedData = [
          {
            "Bronze": 0,
            "Country": "USA",
            "Gold": 0,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "GB",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "RS",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        ctrl.filterFunction('Gold winners', 'medal');
        const result = [
          {
            "Bronze": 0,
            "Country": "GB",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "RS",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        expect(result).to.eql(ctrl.medals);
      });

      it('should return countries that have medal winners of that gender when filtering by gender', function () {
        ctrl.reducedData = [
          {
            "Bronze": 0,
            "Country": "USA",
            "Gold": 0,
            "Men": 0,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "GB",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "RS",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        ctrl.filterFunction('Male medalists', 'gender');
        const result = [
          {
            "Bronze": 0,
            "Country": "GB",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          },
          {
            "Bronze": 0,
            "Country": "RS",
            "Gold": 2,
            "Men": 2,
            "Silver": 1,
            "Total": 3,
            "Women": 1
          }
        ];
        expect(result).to.eql(ctrl.medals);
      });
    })
  });


  describe('#RugbyTeamController', function () {
    let ctrl;
    beforeEach(function () {
      var bindings = {showRugby: true};
      ctrl = $componentController('rugbyTeam', null, bindings);
    });
    describe('#pickTeam', function () {
      it('should fill the team with availalble fit players or "No fit player available" if no fit player for a position', function () {
        const data = [
          {
            "name": "Marsh Armstrong",
            "position": "full-back",
            "is_injured": false,
            "id": 5
          },
          {
            "name": "Conley Odonnell",
            "position": "centre",
            "is_injured": false,
            "id": 6
          },
          {
            "name": "Gallagher Grimes",
            "position": "flanker",
            "is_injured": false,
            "id": 7
          },
          {
            "name": "Britney Ballard",
            "position": "hooker",
            "is_injured": false,
            "id": 8
          },
          {
            "name": "Ashlee Burks",
            "position": "scrum-half",
            "is_injured": true,
            "id": 75
          },
          {
            "name": "Flowers Merrill",
            "position": "out-half",
            "is_injured": true,
            "id": 76
          }
        ]
        const players = ctrl.pickTeam(data);
        expect(players["full-back"]).to.eql(["Marsh Armstrong"]);
        expect(players["hooker"]).to.eql(["Britney Ballard"]);
        expect(players["flanker"]).to.eql(["Gallagher Grimes", "No fit player available", "No fit player available"]);
        expect(players["centre"]).to.eql(["Conley Odonnell", "No fit player available"]);
        expect(players["scrum-half"]).to.eql(["No fit player available"]);
      });
    });
    describe('#nameTeam', function () {

      it('should return a name and id for the new team that are currently not in use by another team', function () {
        const data = [
          {
            "club": "Ontality",
            "name": "Squad 0",
            "id": 0
          },
          {
            "club": "Comvey",
            "name": "Squad 2",
            "id": 1
          },
          {
            "club": "Mediot",
            "name": "Squad 3",
            "id": 2
          }
        ]
        const teamDetails = ctrl.nameTeam(data);
        const expected = {
          name: "Squad 1",
          id: 3
        }
        expect(teamDetails).to.eql(expected);
      });
    });
  });
});
