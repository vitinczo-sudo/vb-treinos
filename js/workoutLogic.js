// VB Treinos — Workout Logic (Multi-Sport)

var WorkoutLogic = {

  // ======== ACADEMIA ========
  generateGymPlan: function(userData) {
    var days = parseInt(userData.days) || 3;
    var getByMuscle = function(m) { return EX_DB.filter(function(e){ return e.muscle === m; }); };
    var pick = function(arr, n) { return arr.slice(0, n); };
    var plan = { sport:"gym", days:[] };

    if (days <= 3) {
      plan.days.push({ name:"Treino A — Peito, Ombro & Tríceps", tag:"PUSH", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Peito"),3), pick(getByMuscle("Ombro"),2), pick(getByMuscle("Tríceps"),2)), userData.goal) });
      plan.days.push({ name:"Treino B — Costas & Bíceps", tag:"PULL", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Costas"),4), pick(getByMuscle("Bíceps"),3)), userData.goal) });
      plan.days.push({ name:"Treino C — Pernas & Abdômen", tag:"LEGS", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Pernas"),4), pick(getByMuscle("Glúteos"),2), pick(getByMuscle("Panturrilha"),1), pick(getByMuscle("Abdômen"),2)), userData.goal) });
    } else if (days === 4) {
      plan.days.push({ name:"Treino A — Peito & Ombro", tag:"PUSH A", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Peito"),4), pick(getByMuscle("Ombro"),3)), userData.goal) });
      plan.days.push({ name:"Treino B — Costas & Trapézio", tag:"PULL", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Costas"),5), pick(getByMuscle("Bíceps"),2)), userData.goal) });
      plan.days.push({ name:"Treino C — Pernas Completas", tag:"LEGS", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Pernas"),5), pick(getByMuscle("Glúteos"),2), pick(getByMuscle("Panturrilha"),1)), userData.goal) });
      plan.days.push({ name:"Treino D — Braços & Core", tag:"ARMS", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Bíceps"),3), pick(getByMuscle("Tríceps"),3), pick(getByMuscle("Abdômen"),2)), userData.goal) });
    } else {
      plan.days.push({ name:"Segunda — Peito", tag:"CHEST", exercises: this._assignSetsReps(pick(getByMuscle("Peito"),5), userData.goal) });
      plan.days.push({ name:"Terça — Costas", tag:"BACK", exercises: this._assignSetsReps(pick(getByMuscle("Costas"),5), userData.goal) });
      plan.days.push({ name:"Quarta — Pernas", tag:"LEGS", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Pernas"),5), pick(getByMuscle("Glúteos"),2)), userData.goal) });
      plan.days.push({ name:"Quinta — Ombros", tag:"SHOULDERS", exercises: this._assignSetsReps(pick(getByMuscle("Ombro"),5), userData.goal) });
      plan.days.push({ name:"Sexta — Braços", tag:"ARMS", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Bíceps"),3), pick(getByMuscle("Tríceps"),3)), userData.goal) });
      if (days >= 6) {
        plan.days.push({ name:"Sábado — Core & Cardio", tag:"CORE", exercises: this._assignSetsReps([].concat(pick(getByMuscle("Abdômen"),4), pick(getByMuscle("Panturrilha"),2)), userData.goal) });
      }
    }
    return plan;
  },

  _assignSetsReps: function(exercises, goal) {
    var config = goal === "emagrecimento"
      ? { sets:3, reps:"12-15", rest:45 }
      : { sets:4, reps:"8-12", rest:90 };
    return exercises.map(function(ex, i) {
      return Object.assign({}, ex, {
        sets: i === 0 ? config.sets + 1 : config.sets,
        reps: config.reps,
        rest: config.rest,
        isWarmup: i === 0
      });
    });
  },

  // ======== CORRIDA ========
  generateRunPlan: function(userData) {
    var target = userData.runTarget || "5k";
    var template = RUN_PLANS[target];
    if (!template) template = RUN_PLANS["5k"];

    var pace = userData.pace || "6:00";

    return {
      sport: "run",
      planName: template.name,
      weeks: template.weeks,
      paceTarget: pace,
      weekPlan: template.template.map(function(session) {
        return Object.assign({}, session, { paceRef: pace });
      })
    };
  },

  // ======== CICLISMO ========
  generateBikePlan: function(userData) {
    var type = userData.bikeGoal || "endurance";
    var template = BIKE_PLANS[type];
    if (!template) template = BIKE_PLANS["endurance"];

    var ftp = parseInt(userData.ftp) || 200;

    return {
      sport: "bike",
      planName: template.name,
      ftp: ftp,
      weekPlan: template.template.map(function(session) {
        return Object.assign({}, session, { ftpRef: ftp });
      })
    };
  },

  // ======== HISTÓRICO ========
  saveCompletedWorkout: function(workout) {
    var history = JSON.parse(localStorage.getItem('vb_history') || '[]');
    history.unshift({
      date: new Date().toISOString(),
      sport: workout.sport || 'gym',
      name: workout.name || 'Treino',
      duration: workout.duration || 0,
      volume: workout.volume || 0,
      exercises: workout.exerciseCount || 0
    });
    if (history.length > 100) history = history.slice(0, 100);
    localStorage.setItem('vb_history', JSON.stringify(history));
  },

  getHistory: function() {
    return JSON.parse(localStorage.getItem('vb_history') || '[]');
  },

  getStats: function() {
    var history = this.getHistory();
    var total = history.length;
    var thisWeek = 0;
    var now = new Date();
    var weekAgo = new Date(now.getTime() - 7*24*60*60*1000);
    var totalVolume = 0;
    var streak = 0;

    history.forEach(function(h) {
      if (new Date(h.date) >= weekAgo) thisWeek++;
      totalVolume += (h.volume || 0);
    });

    // Calculate streak
    var today = new Date(); today.setHours(0,0,0,0);
    for (var i = 0; i < 365; i++) {
      var checkDate = new Date(today.getTime() - i*24*60*60*1000);
      var dateStr = checkDate.toISOString().split('T')[0];
      var found = history.some(function(h) { return h.date.split('T')[0] === dateStr; });
      if (found) streak++; else if (i > 0) break;
    }

    return { total:total, thisWeek:thisWeek, totalVolume:totalVolume, streak:streak };
  }
};
