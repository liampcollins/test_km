function RugbyTeamController($scope, $http) {
  const ctrl = this;

  ctrl.teamMap = {
      prop: 2,
      hooker: 1,
      lock: 2,
      flanker: 3,
      "scrum-half": 1,
      "out-half": 1,
      centre: 2,
      winger: 2,
      "full-back": 1
  };

  ctrl.pickAgain = () => {
    ctrl.team.players = ctrl.pickTeam(ctrl.athleteData.sort(function(a, b){return 0.5 - Math.random()}));
  };

  ctrl.pickTeam = (athletes) => {
    const teamMapCopy = Object.assign({}, ctrl.teamMap);
    const players = {};
    athletes.forEach(a => {
      if (!a.is_injured && teamMapCopy[a.position] > 0) {
        if (!players[a.position]) {
          players[a.position] = [a.name];
        } else {
          players[a.position].push(a.name);
        };
        teamMapCopy[a.position] -= 1;
      };
    });
    for (let position in teamMapCopy) {
      if (teamMapCopy.hasOwnProperty(position) && teamMapCopy[position] > 0) {
        for (let i = 0; i < teamMapCopy[position]; i++) {
          if (!players[position]) {
            players[position] = ["No fit player available"];
          } else {
            players[position].push("No fit player available");
          }
        }
      }
    };
    return players;
  };

  ctrl.nameTeam = (squads) => {
    const existingSquadNames = squads.map(s => s.name);
    const existingSquadIds = squads.map(s => s.id);
    const details = {};
    for (let i = 0; i < squads.length + 1; i++) {
      const squad = squads[i];
      if (!existingSquadIds.includes(i) && !details.id) {
        details.id = i;
      };
      if (!existingSquadNames.includes("Squad " + i) && !details.name) {
        details.name = "Squad " + i;
      };
    };
    return details;
  };

  $http.get("../../data/players.json").then((res) => {
    ctrl.athleteData = res.data.athletes;
    ctrl.team = {
      players: ctrl.pickTeam(res.data.athletes),
      details: ctrl.nameTeam(res.data.squads)
    };
  }).catch((e) => {
    console.log("Error getting medals data: ", e);
  });
}

angular.module("testApp").component("rugbyTeam", {
  templateUrl: "components/rugbyTeam/rugbyTeam.html",
  controller: RugbyTeamController,
  bindings: {
    showRugby: "="
  }
});
