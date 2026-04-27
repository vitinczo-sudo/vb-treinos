// VB Treinos — App Controller (SPA)

var App = {
  user: null,
  plan: null,
  activeView: 'plan',
  workoutTimer: null,
  workoutSeconds: 0,
  restTimer: null,
  restSeconds: 0,

  init: function() {
    var self = this;
    
    // Iniciar sistema de Auth
    if (typeof Auth !== 'undefined') {
        Auth.init(function(profile) {
            if (!Auth.user) {
                document.getElementById('modal-auth').classList.add('active');
                return;
            }
            
            document.getElementById('modal-auth').classList.remove('active');
            
            self.user = profile || JSON.parse(localStorage.getItem('vb_user'));
            
            if (!self.user) {
                Onboarding.start(function(userData) {
                    self.user = userData;
                    Auth.saveProfile(userData); // Salva no Supabase
                    self._generatePlan();
                    self.renderDashboard();
                    self._setupNav();
                });
            } else {
                self._checkPlan();
                self.switchView('plan');
                self._setupNav();
            }
            lucide.createIcons();
        });
    }
  },

  _checkPlan: function() {
    this.plan = JSON.parse(localStorage.getItem('vb_plan'));
    if (!this.plan) this._generatePlan();
  },

  _generatePlan: function() {
    if (this.user.sport === 'gym') {
      this.plan = WorkoutLogic.generateGymPlan(this.user);
    } else if (this.user.sport === 'run') {
      this.plan = WorkoutLogic.generateRunPlan(this.user);
    } else {
      this.plan = WorkoutLogic.generateBikePlan(this.user);
    }
    localStorage.setItem('vb_plan', JSON.stringify(this.plan));
  },

  _setupNav: function() {
    var self = this;
    document.querySelectorAll('.nav-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var view = btn.getAttribute('data-view');
        self.switchView(view, btn);
      });
    });
  },

  switchView: function(viewId, btn) {
    this.activeView = viewId;
    document.querySelectorAll('.nav-item').forEach(function(b){ b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    else {
      document.querySelectorAll('.nav-item').forEach(function(b){
        if(b.getAttribute('data-view')===viewId) b.classList.add('active');
      });
    }
    if (viewId === 'plan') this.renderDashboard();
    else if (viewId === 'library') this.renderLibrary();
    else if (viewId === 'progress') this.renderProgress();
    else if (viewId === 'profile') this.renderProfile();
  },

  // ========== DASHBOARD ==========
  renderDashboard: function() {
    var mc = document.getElementById('main-content');
    if (this.user.sport === 'gym') this._renderGymDashboard(mc);
    else if (this.user.sport === 'run') this._renderRunDashboard(mc);
    else this._renderBikeDashboard(mc);
    lucide.createIcons();
  },

  _renderGymDashboard: function(mc) {
    var self = this;
    var plan = this.plan;
    var name = (this.user.name || 'Atleta').split(' ')[0];

    // Date slider
    var days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    var today = new Date();
    var dateSlider = '';
    for (var i = -2; i <= 4; i++) {
      var d = new Date(today.getTime() + i*86400000);
      var isToday = i === 0;
      var hasDot = i >= 0 && i < plan.days.length;
      dateSlider += '<div class="date-item' + (isToday?' active':'') + '" data-offset="'+i+'">' +
        '<span class="day-name">' + days[d.getDay()] + '</span>' +
        '<span class="day-num">' + d.getDate() + '</span>' +
        (hasDot ? '<div class="dot"></div>' : '') +
      '</div>';
    }

    var dayChips = plan.days.map(function(day, idx) {
      return '<div class="chip' + (idx===0?' active':'') + '" data-day="'+idx+'">' +
        String.fromCharCode(65+idx) + '</div>';
    }).join('');

    mc.innerHTML = '\
      <div class="page-header">\
        <div><h1>Olá, ' + name + '! 👋</h1><p style="color:var(--text-muted);font-size:.85rem;margin-top:2px">Bora treinar hoje?</p></div>\
        <div class="header-actions"><button><i data-lucide="bell" size="20"></i></button></div>\
      </div>\
      <div class="date-slider">' + dateSlider + '</div>\
      <div class="section-label">SEU PLANO</div>\
      <div class="chips-row" style="padding:0 1.5rem;margin-bottom:1rem">' + dayChips + '</div>\
      <div id="day-exercises"></div>\
      <div class="section-label">TREINO RÁPIDO</div>\
      <div class="quick-grid">\
        ' + QUICK_GROUPS.map(function(g) {
          return '<div class="quick-card" data-group="'+g.id+'">\
            <div class="q-icon">'+g.icon+'</div>\
            <div class="q-name">'+g.name+'</div>\
            <div class="q-tag">5 EXERCÍCIOS</div>\
          </div>';
        }).join('') + '\
      </div>\
      <div class="btn-container-sticky">\
        <button class="btn-primary" id="btn-start-workout"><i data-lucide="play" size="18"></i> INICIAR TREINO DO DIA</button>\
      </div>';

    this._renderGymDay(0);

    // Events
    mc.querySelectorAll('.chip[data-day]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        mc.querySelectorAll('.chip[data-day]').forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
        self._renderGymDay(parseInt(chip.getAttribute('data-day')));
      });
    });

    document.getElementById('btn-start-workout').addEventListener('click', function() {
      var activeIdx = 0;
      mc.querySelectorAll('.chip[data-day]').forEach(function(c,i){ if(c.classList.contains('active')) activeIdx=i; });
      self.startGymWorkout(activeIdx);
    });

    mc.querySelectorAll('.quick-card').forEach(function(card) {
      card.addEventListener('click', function() {
        self.startQuickWorkout(card.getAttribute('data-group'));
      });
    });
  },

  startQuickWorkout: function(groupId) {
    var group = QUICK_GROUPS.find(function(g){ return g.id === groupId; });
    if (!group) return;

    // Filter exercises for this group
    var available = EX_DB.filter(function(ex) {
      return group.muscles.indexOf(ex.muscle) !== -1;
    });

    // Pick 5 random
    var selected = [];
    var temp = available.slice();
    for(var i=0; i<5 && temp.length > 0; i++) {
      var idx = Math.floor(Math.random() * temp.length);
      selected.push(temp.splice(idx, 1)[0]);
    }

    var workout = {
      name: "Treino Rápido: " + group.name,
      exercises: selected.map(function(ex) {
        return {
          id: ex.id,
          name: ex.name,
          sets: 3,
          reps: "10-12",
          rest: 60,
          muscle: ex.muscle
        };
      })
    };

    this._openWorkoutModal(workout);
  },

  _openWorkoutModal: function(workout) {
    var self = this;
    var modal = document.getElementById('modal-workout-run');
    document.getElementById('w-title').textContent = workout.name;
    document.getElementById('w-ex-count').textContent = workout.exercises.length + " Exercícios";
    
    // Add progress bar to modal
    var metrics = modal.querySelector('.workout-metrics');
    if(!document.getElementById('w-progress-container')) {
        var pb = document.createElement('div');
        pb.id = 'w-progress-container';
        pb.className = 'workout-progress-container';
        pb.innerHTML = '<div id="w-progress-bar" class="workout-progress-bar"></div>';
        modal.insertBefore(pb, metrics);
    }

    this.workoutSeconds = 0;
    this.workoutTimer = setInterval(function() {
      self.workoutSeconds++;
      var m = Math.floor(self.workoutSeconds/60);
      var s = self.workoutSeconds % 60;
      document.getElementById('w-duration').textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
      document.getElementById('w-calories').textContent = Math.floor(self.workoutSeconds * 0.12);
    }, 1000);

    this._renderWorkoutList(workout.exercises);
    modal.classList.add('active');
    this._updateWorkoutProgress();
  },

  _updateWorkoutProgress: function() {
    var checks = document.querySelectorAll('.check-btn');
    var done = document.querySelectorAll('.check-btn.checked').length;
    var total = checks.length;
    var pct = total > 0 ? (done / total) * 100 : 0;
    var bar = document.getElementById('w-progress-bar');
    if(bar) bar.style.width = pct + '%';
  },

  _renderGymDay: function(idx) {
    var day = this.plan.days[idx];
    if (!day) return;
    var container = document.getElementById('day-exercises');
    var self = this;

    container.innerHTML = '<div class="section-label">' + day.name + ' <span style="color:var(--accent);margin-left:8px">' + day.tag + '</span></div>' +
      day.exercises.map(function(ex, i) {
        var tagHtml = '';
        if (ex.isWarmup) tagHtml = '<span class="tag tag-warmup">AQUECIMENTO</span>';
        return '<div class="ex-card" data-exid="' + ex.id + '">' +
          '<div class="ex-thumb"><img src="' + ex.img + '" alt="' + ex.name + '"></div>' +
          '<div class="ex-info">' + tagHtml +
            '<div class="ex-name">' + ex.name + '</div>' +
            '<div class="ex-meta">' + ex.sets + ' séries • ' + ex.reps + ' reps • <i data-lucide="clock" size="11"></i> ' + ex.rest + 's</div>' +
          '</div>' +
          '<i data-lucide="chevron-right" size="18" style="color:var(--text-dim)"></i>' +
        '</div>';
      }).join('');

    lucide.createIcons();

    container.querySelectorAll('.ex-card').forEach(function(card) {
      card.addEventListener('click', function() {
        self.openExerciseDetail(card.getAttribute('data-exid'));
      });
    });
  },

  // ========== RUN DASHBOARD ==========
  _renderRunDashboard: function(mc) {
    var plan = this.plan;
    var name = (this.user.name || 'Atleta').split(' ')[0];
    var typeIcons = { easy:'🟢', tempo:'🟠', interval:'🔴', long:'🔵' };
    var typeColors = { easy:'var(--run-easy)', tempo:'var(--run-tempo)', interval:'var(--run-interval)', long:'var(--run-long)' };

    mc.innerHTML = '\
      <div class="page-header">\
        <div><h1>🏃 ' + name + '</h1><p style="color:var(--text-muted);font-size:.85rem">' + plan.planName + ' • Pace: ' + plan.paceTarget + '/km</p></div>\
      </div>\
      <div class="section-label">ESTA SEMANA</div>' +
      plan.weekPlan.map(function(s) {
        return '<div class="run-card">' +
          '<div class="run-icon" style="background:' + (typeColors[s.type]||'var(--border)') + '20;color:' + (typeColors[s.type]||'#fff') + '">' + (typeIcons[s.type]||'🏃') + '</div>' +
          '<div class="run-card-info">' +
            '<h4>' + s.day + ' — ' + s.name + '</h4>' +
            '<p>' + s.duration + ' • ' + s.detail + '</p>' +
          '</div>' +
          '<i data-lucide="chevron-right" size="16" style="color:var(--text-dim)"></i>' +
        '</div>';
      }).join('') +
      '<div class="btn-container"><button class="btn-secondary" style="gap:8px"><i data-lucide="watch" size="16"></i> Enviar para Garmin (em breve)</button></div>';
  },

  // ========== BIKE DASHBOARD ==========
  _renderBikeDashboard: function(mc) {
    var plan = this.plan;
    var name = (this.user.name || 'Atleta').split(' ')[0];
    var typeIcons = { easy:'🟢', tempo:'🟠', interval:'🔴', long:'🔵' };
    var typeColors = { easy:'var(--bike-endurance)', tempo:'var(--bike-sweet)', interval:'var(--bike-vo2)', long:'var(--bike-endurance)' };

    mc.innerHTML = '\
      <div class="page-header">\
        <div><h1>🚴 ' + name + '</h1><p style="color:var(--text-muted);font-size:.85rem">' + plan.planName + ' • FTP: ' + plan.ftp + 'w</p></div>\
      </div>\
      <div class="section-label">ESTA SEMANA</div>' +
      plan.weekPlan.map(function(s) {
        return '<div class="run-card">' +
          '<div class="run-icon" style="background:' + (typeColors[s.type]||'var(--border)') + '20;color:' + (typeColors[s.type]||'#fff') + '">' + (typeIcons[s.type]||'🚴') + '</div>' +
          '<div class="run-card-info">' +
            '<h4>' + s.day + ' — ' + s.name + '</h4>' +
            '<p>' + s.duration + ' • ' + s.detail + '</p>' +
          '</div>' +
          '<i data-lucide="chevron-right" size="16" style="color:var(--text-dim)"></i>' +
        '</div>';
      }).join('') +
      '<div class="btn-container"><button class="btn-secondary" style="gap:8px"><i data-lucide="watch" size="16"></i> Enviar para Garmin (em breve)</button></div>';
  },

  // ========== GYM WORKOUT EXECUTION ==========
  startGymWorkout: function(dayIdx) {
    var self = this;
    var day = this.plan.days[dayIdx];
    if (!day) return;
    var modal = document.getElementById('modal-workout-run');
    modal.classList.add('active');

    document.getElementById('w-title').textContent = day.name;
    document.getElementById('w-ex-count').textContent = day.exercises.length + ' EXERCÍCIOS';

    this._renderWorkoutList(day.exercises);

    // Start timer

    lucide.createIcons();

    // Start timer
    this.workoutSeconds = 0;
    if (this.workoutTimer) clearInterval(this.workoutTimer);
    this.workoutTimer = setInterval(function() {
      self.workoutSeconds++;
      var m = Math.floor(self.workoutSeconds/60).toString().padStart(2,'0');
      var s = (self.workoutSeconds%60).toString().padStart(2,'0');
      document.getElementById('w-duration').textContent = m + ':' + s;
      document.getElementById('w-calories').textContent = Math.floor(self.workoutSeconds * 0.12);
    }, 1000);
  },

  toggleSet: function(btn) {
    btn.classList.toggle('checked');
    var row = btn.closest('tr');
    var badge = row.querySelector('.set-badge');
    if (badge && badge.classList.contains('normal')) {
      if (btn.classList.contains('checked')) { badge.classList.remove('normal'); badge.classList.add('done'); }
      else { badge.classList.add('normal'); badge.classList.remove('done'); }
    }
    // Volume calc
    var inputs = row.querySelectorAll('.set-input');
    var reps = parseInt(inputs[0].value) || 0;
    var kg = parseInt(inputs[1].value) || 0;
    var volEl = document.getElementById('w-volume');
    var vol = parseInt(volEl.textContent) || 0;
    if (btn.classList.contains('checked')) volEl.textContent = vol + (reps * kg);
    else volEl.textContent = Math.max(0, vol - (reps * kg));

    // Show rest timer
    if (btn.classList.contains('checked')) this.showRestTimer(90);

    this._updateWorkoutProgress();
  },

  _renderWorkoutList: function(exercises) {
    var container = document.getElementById('active-workout-list');
    container.innerHTML = exercises.map(function(ex, i) {
      var warmupRow = '';
      if (ex.isWarmup) {
        warmupRow = '<tr><td><span class="set-badge warmup">W</span></td>' +
          '<td><input type="number" class="set-input" value="10"></td>' +
          '<td><input type="number" class="set-input" value="0"></td>' +
          '<td><button class="check-btn" onclick="App.toggleSet(this)"><i data-lucide="check" size="16"></i></button></td></tr>';
      }
      var setsRows = '';
      for (var s = 1; s <= ex.sets; s++) {
        setsRows += '<tr><td><span class="set-badge normal">' + s + '</span></td>' +
          '<td><input type="number" class="set-input" value="' + (ex.reps.split('-')[0] || '10') + '"></td>' +
          '<td><input type="number" class="set-input" value="0"></td>' +
          '<td><button class="check-btn" onclick="App.toggleSet(this)"><i data-lucide="check" size="16"></i></button></td></tr>';
      }
      return '<div class="card" style="margin:0.6rem 1rem">' +
        (ex.isWarmup ? '<span class="tag tag-warmup" style="margin-bottom:8px">AQUECIMENTO</span>' : '') +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">' +
          '<div class="ex-thumb" style="width:46px;height:46px"><img src="' + (ex.img || 'https://via.placeholder.com/46') + '"></div>' +
          '<div class="ex-info"><div class="ex-name" style="font-size:.9rem">' + ex.name + '</div>' +
          '<div class="ex-meta">' + (ex.sets || 3) + '×' + (ex.reps || '10-12') + ' • ' + (ex.rest || 60) + 's desc</div></div>' +
        '</div>' +
        '<table class="sets-table"><tr><th>SÉRIE</th><th>REPS</th><th>KG</th><th>✓</th></tr>' +
        warmupRow + setsRows + '</table>' +
        '<button style="background:none;border:none;color:var(--accent);font-weight:700;font-size:.75rem;padding:8px 0;display:flex;align-items:center;gap:4px" onclick="App.addSet(this,\'' + (ex.reps ? ex.reps.split('-')[0] : '10') + '\')"><i data-lucide="plus" size="12"></i> SÉRIE</button>' +
      '</div>';
    }).join('');
    lucide.createIcons();
  },

  addSet: function(btn, defaultReps) {
    var table = btn.previousElementSibling;
    var rows = table.querySelectorAll('tr');
    var num = rows.length;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><span class="set-badge normal">' + num + '</span></td>' +
      '<td><input type="number" class="set-input" value="' + defaultReps + '"></td>' +
      '<td><input type="number" class="set-input" value="0"></td>' +
      '<td><button class="check-btn" onclick="App.toggleSet(this)"><i data-lucide="check" size="16"></i></button></td>';
    table.appendChild(tr);
    lucide.createIcons();
  },

  showRestTimer: function(seconds) {
    var self = this;
    var overlay = document.getElementById('rest-timer');
    overlay.classList.add('active');
    this.restSeconds = seconds;
    document.getElementById('rest-value').textContent = seconds;

    if (this.restTimer) clearInterval(this.restTimer);
    this.restTimer = setInterval(function() {
      self.restSeconds--;
      document.getElementById('rest-value').textContent = self.restSeconds;
      if (self.restSeconds <= 0) {
        clearInterval(self.restTimer);
        overlay.classList.remove('active');
      }
    }, 1000);
  },

  skipRest: function() {
    clearInterval(this.restTimer);
    document.getElementById('rest-timer').classList.remove('active');
  },

  closeWorkout: function() {
    document.getElementById('modal-workout-run').classList.remove('active');
    clearInterval(this.workoutTimer);
  },

  finishWorkout: function() {
    var vol = parseInt(document.getElementById('w-volume').textContent) || 0;
    var log = {
      sport: 'gym',
      name: document.getElementById('w-title').textContent,
      duration: this.workoutSeconds,
      volume: vol,
      exerciseCount: this.plan.days[0].exercises.length,
      date: new Date().toISOString()
    };

    WorkoutLogic.saveCompletedWorkout(log);
    if (typeof Auth !== 'undefined') Auth.saveWorkout(log); // Salva na nuvem
    
    this.closeWorkout();
    this.switchView('progress');
  },

  // ========== LIBRARY ==========
  renderLibrary: function() {
    var mc = document.getElementById('main-content');
    var self = this;
    var muscles = [];
    EX_DB.forEach(function(e) { if (muscles.indexOf(e.muscle)===-1) muscles.push(e.muscle); });

    mc.innerHTML = '\
      <div class="page-header"><h1>Biblioteca</h1></div>\
      <div class="search-bar"><svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" id="lib-search" placeholder="Pesquisar exercício..."></div>\
      <div class="chips-row" style="padding:0 1.5rem;margin-bottom:1rem">\
        <div class="chip active" data-muscle="Todos">Todos</div>' +
        muscles.map(function(m){ return '<div class="chip" data-muscle="'+m+'">'+m+'</div>'; }).join('') +
      '</div>\
      <div id="lib-list">' + this._renderExList(EX_DB) + '</div>';

    lucide.createIcons();

    mc.querySelectorAll('.chip[data-muscle]').forEach(function(chip) {
      chip.addEventListener('click', function() {
        mc.querySelectorAll('.chip[data-muscle]').forEach(function(c){ c.classList.remove('active'); });
        chip.classList.add('active');
        var m = chip.getAttribute('data-muscle');
        var filtered = m === 'Todos' ? EX_DB : EX_DB.filter(function(e){ return e.muscle===m; });
        document.getElementById('lib-list').innerHTML = self._renderExList(filtered);
        self._attachExClicks();
        lucide.createIcons();
      });
    });

    document.getElementById('lib-search').addEventListener('input', function(e) {
      var q = e.target.value.toLowerCase();
      var filtered = EX_DB.filter(function(ex){ return ex.name.toLowerCase().indexOf(q)!==-1 || ex.muscle.toLowerCase().indexOf(q)!==-1; });
      document.getElementById('lib-list').innerHTML = self._renderExList(filtered);
      self._attachExClicks();
      lucide.createIcons();
    });

    this._attachExClicks();
  },

  _renderExList: function(list) {
    return list.map(function(ex) {
      return '<div class="ex-card" data-exid="'+ex.id+'">' +
        '<div class="ex-thumb"><img src="'+ex.img+'" alt="'+ex.name+'"></div>' +
        '<div class="ex-info"><div class="ex-name">'+ex.name+'</div>' +
        '<div class="ex-meta" style="text-transform:capitalize">'+ex.muscle+' • '+ex.equip+'</div></div></div>';
    }).join('');
  },

  _attachExClicks: function() {
    var self = this;
    document.querySelectorAll('#lib-list .ex-card').forEach(function(card) {
      card.addEventListener('click', function() { self.openExerciseDetail(card.getAttribute('data-exid')); });
    });
  },

  // ========== EXERCISE DETAIL ==========
  openExerciseDetail: function(id) {
    var ex = EX_DB.find(function(e){ return e.id===id; });
    if (!ex) return;
    var modal = document.getElementById('modal-exercise-detail');
    document.getElementById('detail-title').textContent = ex.name;
    document.getElementById('detail-tags').textContent = ex.muscle + ' • ' + ex.equip;
    document.getElementById('detail-img').src = ex.img;
    document.getElementById('detail-instructions').textContent = ex.instructions || 'Sem instruções disponíveis.';
    modal.classList.add('active');
  },

  closeExerciseDetail: function() {
    document.getElementById('modal-exercise-detail').classList.remove('active');
  },

  // ========== PROGRESS ==========
  renderProgress: async function() {
    var mc = document.getElementById('main-content');
    var stats = WorkoutLogic.getStats();
    
    // Tenta sincronizar com a nuvem
    var history = await Auth.syncHistory();
    if (history.length === 0) history = WorkoutLogic.getHistory();

    // Week streak
    var days = ['D','S','T','Q','Q','S','S'];
    var today = new Date();
    var streakHtml = '';
    for (var i = 6; i >= 0; i--) {
      var d = new Date(today.getTime() - i*86400000);
      var dateStr = d.toISOString().split('T')[0];
      var done = history.some(function(h){ return h.date.split('T')[0]===dateStr; });
      streakHtml += '<div class="streak-day'+(done?' done':'')+'">'+days[d.getDay()]+'</div>';
    }

    var historyHtml = history.slice(0,10).map(function(h) {
      var d = new Date(h.date);
      var dateStr = d.getDate()+'/'+(d.getMonth()+1);
      var dur = Math.floor((h.duration||0)/60)+'min';
      var icon = h.sport==='run'?'🏃':h.sport==='bike'?'🚴':'🏋️';
      return '<div class="list-item"><span>'+icon+' '+h.name+'</span><span style="color:var(--text-muted);font-size:.8rem">'+dateStr+' • '+dur+'</span></div>';
    }).join('');

    mc.innerHTML = '\
      <div class="page-header"><h1>Progresso</h1></div>\
      <div class="section-label">VOLUME SEMANAL (KG)</div>\
      ' + this._renderVolumeGraph(history) + '\
      <div class="section-label">ESTA SEMANA</div>\
      <div class="streak-bar">' + streakHtml + '</div>\
      <div class="stats-grid">\
        <div class="stat-card"><div class="stat-value">'+stats.total+'</div><div class="stat-label">Treinos</div></div>\
        <div class="stat-card"><div class="stat-value">'+stats.streak+'</div><div class="stat-label">Streak 🔥</div></div>\
        <div class="stat-card"><div class="stat-value">'+stats.thisWeek+'</div><div class="stat-label">Esta Semana</div></div>\
        <div class="stat-card"><div class="stat-value">'+(stats.totalVolume > 1000 ? Math.round(stats.totalVolume/1000)+'k' : stats.totalVolume)+'</div><div class="stat-label">Volume Total</div></div>\
      </div>\
      <div class="section-label" style="margin-top:1.5rem">HISTÓRICO RECENTE</div>\
      ' + (historyHtml || '<p style="color:var(--text-muted);padding:1rem 1.5rem;font-size:.85rem">Nenhum treino registrado ainda. Bora treinar! 💪</p>');

    lucide.createIcons();
  },

  _renderVolumeGraph: function(history) {
    var days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    var today = new Date();
    var volumes = [0,0,0,0,0,0,0];
    
    // Get volumes for last 7 days
    history.forEach(function(h) {
        var d = new Date(h.date);
        var diff = Math.floor((today - d) / 86400000);
        if(diff >= 0 && diff < 7) {
            volumes[d.getDay()] += (h.volume || 0);
        }
    });

    var maxVol = Math.max.apply(null, volumes) || 1000;
    var html = '<div class="volume-graph">';
    for(var i=0; i<7; i++) {
        var dIdx = (today.getDay() - 6 + i + 7) % 7;
        var hPct = (volumes[dIdx] / maxVol) * 100;
        html += '<div class="vol-bar-container">\
            <div class="vol-bar' + (dIdx === today.getDay() ? ' active' : '') + '" style="height:' + Math.max(hPct, 5) + '%"></div>\
            <div class="vol-label">' + days[dIdx] + '</div>\
        </div>';
    }
    html += '</div>';
    return html;
  },

  // ========== PROFILE ==========
  renderProfile: function() {
    var mc = document.getElementById('main-content');
    var u = this.user;
    var initials = (u.name || 'VB').split(' ').map(function(n){return n[0];}).join('').substring(0,2).toUpperCase();
    var sportLabel = {gym:'🏋️ Academia', run:'🏃 Corrida', bike:'🚴 Ciclismo'}[u.sport] || 'Academia';
    var stats = WorkoutLogic.getStats();
    
    var bmi = '--';
    if(u.weight && u.height) {
        bmi = (u.weight / ((u.height/100) * (u.height/100))).toFixed(1);
    }

    mc.innerHTML = '\
      <div class="profile-header">\
        <div class="avatar">'+initials+'</div>\
        <h2>'+(u.name||'Atleta')+'</h2>\
        <p style="color:var(--text-muted);margin-top:4px">'+sportLabel+'</p>\
        <div class="profile-stat-row">\
          <div class="profile-stat"><div class="val">'+stats.total+'</div><div class="lbl">Treinos</div></div>\
          <div class="profile-stat"><div class="val">'+stats.streak+'</div><div class="lbl">Streak</div></div>\
          <div class="profile-stat"><div class="val">'+bmi+'</div><div class="lbl">IMC</div></div>\
        </div>\
      </div>\
      <div class="section-label">INFORMAÇÕES</div>\
      <div class="list-item"><span>Peso</span><span style="color:var(--text-muted)">'+(u.weight||'--')+' kg</span></div>\
      <div class="list-item"><span>Altura</span><span style="color:var(--text-muted)">'+(u.height||'--')+' cm</span></div>\
      <div class="list-item"><span>Idade</span><span style="color:var(--text-muted)">'+(u.age||'--')+' anos</span></div>\
      <div class="list-item"><span>Objetivo</span><span style="color:var(--text-muted);text-transform:capitalize">'+(u.goal||'--')+'</span></div>\
      <div class="section-label">CONFIGURAÇÕES</div>\
      <div class="list-item" id="btn-change-sport"><span>Alterar Esporte</span><span style="color:var(--accent)">'+sportLabel+'</span></div>\
      <div class="list-item" id="btn-regen-plan"><span>Regenerar Plano</span><i data-lucide="refresh-cw" size="16" style="color:var(--text-muted)"></i></div>\
      <div class="profile-reset-section">\
        <button class="btn-primary btn-danger" id="btn-reset">Sair e Limpar Dados</button>\
      </div>';

    lucide.createIcons();

    var self = this;
    document.getElementById('btn-reset').addEventListener('click', function() {
      if (confirm('Tem certeza? Todos os dados serão apagados.')) {
        localStorage.clear(); location.reload();
      }
    });
    document.getElementById('btn-change-sport').addEventListener('click', function() {
      localStorage.removeItem('vb_user');
      localStorage.removeItem('vb_plan');
      location.reload();
    });
    document.getElementById('btn-regen-plan').addEventListener('click', function() {
      self._generatePlan();
      self.switchView('plan');
    });
  }
};

// Boot
document.addEventListener('DOMContentLoaded', function() {
  App.init();
});
