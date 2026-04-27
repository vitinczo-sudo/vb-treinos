// VB Treinos — Onboarding Multi-Esporte

var Onboarding = {
  step: 0,
  totalSteps: 4,
  userData: {
    name: '', email: '', sport: 'gym',
    weight: '', height: '', age: '', sex: 'M',
    goal: 'hipertrofia', days: 3, level: 'intermediario',
    runTarget: '5k', pace: '6:00',
    bikeGoal: 'endurance', ftp: 200
  },
  onComplete: null,

  start: function(callback) {
    this.onComplete = callback;
    this.step = 0;
    var existing = JSON.parse(localStorage.getItem('vb_user'));
    if (existing) {
      this.userData = existing;
      callback(existing);
      return;
    }
    document.getElementById('onboarding-overlay').classList.remove('hidden');
    this.render();
  },

  render: function() {
    var c = document.getElementById('onboarding-steps');
    var self = this;
    var dots = '';
    for (var i = 0; i < this.totalSteps; i++) {
      dots += '<div class="step-dot' + (i === this.step ? ' active' : '') + '"></div>';
    }

    var html = '<div class="step-dots">' + dots + '</div>';

    if (this.step === 0) {
      html += '\
        <h2>Bem-vindo ao VB Treinos</h2>\
        <p class="subtitle">Escolha seu esporte principal</p>\
        <div class="sport-grid">\
          <div class="sport-option' + (this.userData.sport==='gym'?' selected':'') + '" data-sport="gym">\
            <div class="sport-icon">🏋️</div>\
            <div class="sport-name">Academia</div>\
          </div>\
          <div class="sport-option' + (this.userData.sport==='run'?' selected':'') + '" data-sport="run">\
            <div class="sport-icon">🏃</div>\
            <div class="sport-name">Corrida</div>\
          </div>\
          <div class="sport-option' + (this.userData.sport==='bike'?' selected':'') + '" data-sport="bike">\
            <div class="sport-icon">🚴</div>\
            <div class="sport-name">Ciclismo</div>\
          </div>\
        </div>\
        <button class="btn-primary" id="ob-next">Próximo</button>';
    } else if (this.step === 1) {
      html += '\
        <h2>Dados Pessoais</h2>\
        <p class="subtitle">Precisamos conhecer você</p>\
        <div class="form-group">\
          <label>Nome</label>\
          <input class="form-input" type="text" id="ob-name" placeholder="Seu nome" value="' + this.userData.name + '">\
        </div>\
        <div class="form-group">\
          <label>Peso (kg)</label>\
          <input class="form-input" type="number" id="ob-weight" placeholder="Ex: 80" value="' + this.userData.weight + '">\
        </div>\
        <div class="form-group">\
          <label>Altura (cm)</label>\
          <input class="form-input" type="number" id="ob-height" placeholder="Ex: 175" value="' + this.userData.height + '">\
        </div>\
        <div class="form-group">\
          <label>Idade</label>\
          <input class="form-input" type="number" id="ob-age" placeholder="Ex: 28" value="' + this.userData.age + '">\
        </div>\
        <div style="display:flex;gap:10px">\
          <button class="btn-secondary" id="ob-back" style="flex:1">Voltar</button>\
          <button class="btn-primary" id="ob-next" style="flex:2">Próximo</button>\
        </div>';
    } else if (this.step === 2) {
      if (this.userData.sport === 'gym') {
        html += '\
          <h2>Configuração de Treino</h2>\
          <p class="subtitle">Personalize sua rotina de academia</p>\
          <div class="form-group">\
            <label>Objetivo Principal</label>\
            <select class="form-input" id="ob-goal">\
              <option value="hipertrofia"' + (this.userData.goal==='hipertrofia'?' selected':'') + '>💪 Ganho de Massa</option>\
              <option value="emagrecimento"' + (this.userData.goal==='emagrecimento'?' selected':'') + '>🔥 Definição / Perda de Gordura</option>\
            </select>\
          </div>\
          <div class="form-group">\
            <label>Dias por semana</label>\
            <select class="form-input" id="ob-days">\
              <option value="3"' + (this.userData.days==3?' selected':'') + '>3 dias — ABC Clássico</option>\
              <option value="4"' + (this.userData.days==4?' selected':'') + '>4 dias — ABCD Avançado</option>\
              <option value="5"' + (this.userData.days==5?' selected':'') + '>5 dias — Bro Split</option>\
              <option value="6"' + (this.userData.days==6?' selected':'') + '>6 dias — Alta Performance</option>\
            </select>\
          </div>\
          <div class="form-group">\
            <label>Nível</label>\
            <select class="form-input" id="ob-level">\
              <option value="iniciante">Iniciante (< 6 meses)</option>\
              <option value="intermediario" selected>Intermediário (6m - 2a)</option>\
              <option value="avancado">Avançado (2+ anos)</option>\
            </select>\
          </div>';
      } else if (this.userData.sport === 'run') {
        html += '\
          <h2>Configuração de Corrida</h2>\
          <p class="subtitle">Monte seu plano de treino</p>\
          <div class="form-group">\
            <label>Objetivo de Prova</label>\
            <select class="form-input" id="ob-runtarget">\
              <option value="5k"' + (this.userData.runTarget==='5k'?' selected':'') + '>5K</option>\
              <option value="10k"' + (this.userData.runTarget==='10k'?' selected':'') + '>10K</option>\
              <option value="21k"' + (this.userData.runTarget==='21k'?' selected':'') + '>Meia Maratona (21K)</option>\
              <option value="42k"' + (this.userData.runTarget==='42k'?' selected':'') + '>Maratona (42K)</option>\
            </select>\
          </div>\
          <div class="form-group">\
            <label>Pace atual (min/km)</label>\
            <input class="form-input" type="text" id="ob-pace" placeholder="Ex: 6:00" value="' + this.userData.pace + '">\
          </div>';
      } else {
        html += '\
          <h2>Configuração de Ciclismo</h2>\
          <p class="subtitle">Monte seu plano de pedal</p>\
          <div class="form-group">\
            <label>Objetivo</label>\
            <select class="form-input" id="ob-bikegoal">\
              <option value="endurance"' + (this.userData.bikeGoal==='endurance'?' selected':'') + '>🚴 Resistência / Endurance</option>\
              <option value="power"' + (this.userData.bikeGoal==='power'?' selected':'') + '>⚡ Potência / Sprints</option>\
            </select>\
          </div>\
          <div class="form-group">\
            <label>FTP (watts)</label>\
            <input class="form-input" type="number" id="ob-ftp" placeholder="Ex: 200" value="' + this.userData.ftp + '">\
          </div>';
      }
      html += '<div style="display:flex;gap:10px">\
        <button class="btn-secondary" id="ob-back" style="flex:1">Voltar</button>\
        <button class="btn-primary" id="ob-next" style="flex:2">Próximo</button>\
      </div>';
    } else if (this.step === 3) {
      var sportLabel = {gym:'🏋️ Academia', run:'🏃 Corrida', bike:'🚴 Ciclismo'}[this.userData.sport];
      var detailHtml = '';
      if (this.userData.sport === 'gym') {
        var goalLabel = this.userData.goal === 'hipertrofia' ? 'Ganho de Massa' : 'Definição';
        detailHtml = '<p>Objetivo: <strong>' + goalLabel + '</strong></p>\
          <p>Frequência: <strong>' + this.userData.days + ' dias/semana</strong></p>';
      } else if (this.userData.sport === 'run') {
        detailHtml = '<p>Prova: <strong>' + this.userData.runTarget.toUpperCase() + '</strong></p>\
          <p>Pace atual: <strong>' + this.userData.pace + ' min/km</strong></p>';
      } else {
        detailHtml = '<p>Foco: <strong>' + (this.userData.bikeGoal === 'endurance' ? 'Resistência' : 'Potência') + '</strong></p>\
          <p>FTP: <strong>' + this.userData.ftp + 'w</strong></p>';
      }

      html += '\
        <h2>Tudo Pronto! 🎉</h2>\
        <p class="subtitle">Confirme seus dados</p>\
        <div class="card" style="margin:1rem 0;background:var(--bg-surface-light)">\
          <p style="margin-bottom:.5rem"><strong>' + (this.userData.name || 'Atleta') + '</strong></p>\
          <p>' + sportLabel + '</p>\
          ' + detailHtml + '\
          <p>' + this.userData.weight + 'kg • ' + this.userData.height + 'cm</p>\
        </div>\
        <div style="display:flex;gap:10px">\
          <button class="btn-secondary" id="ob-back" style="flex:1">Voltar</button>\
          <button class="btn-primary" id="ob-finish" style="flex:2">🚀 Começar Treino</button>\
        </div>';
    }

    c.innerHTML = html;
    this._attachEvents();
  },

  _attachEvents: function() {
    var self = this;

    // Sport selection
    document.querySelectorAll('.sport-option').forEach(function(opt) {
      opt.addEventListener('click', function() {
        document.querySelectorAll('.sport-option').forEach(function(o){ o.classList.remove('selected'); });
        opt.classList.add('selected');
        self.userData.sport = opt.getAttribute('data-sport');
      });
    });

    var nextBtn = document.getElementById('ob-next');
    var backBtn = document.getElementById('ob-back');
    var finishBtn = document.getElementById('ob-finish');

    if (nextBtn) nextBtn.addEventListener('click', function() { self._saveStep(); self.step++; self.render(); });
    if (backBtn) backBtn.addEventListener('click', function() { self.step--; self.render(); });
    if (finishBtn) finishBtn.addEventListener('click', function() { self._finish(); });
  },

  _saveStep: function() {
    if (this.step === 1) {
      var n = document.getElementById('ob-name');
      var w = document.getElementById('ob-weight');
      var h = document.getElementById('ob-height');
      var a = document.getElementById('ob-age');
      if (n) this.userData.name = n.value;
      if (w) this.userData.weight = w.value;
      if (h) this.userData.height = h.value;
      if (a) this.userData.age = a.value;
    } else if (this.step === 2) {
      if (this.userData.sport === 'gym') {
        var g = document.getElementById('ob-goal');
        var d = document.getElementById('ob-days');
        var l = document.getElementById('ob-level');
        if (g) this.userData.goal = g.value;
        if (d) this.userData.days = parseInt(d.value);
        if (l) this.userData.level = l.value;
      } else if (this.userData.sport === 'run') {
        var rt = document.getElementById('ob-runtarget');
        var p = document.getElementById('ob-pace');
        if (rt) this.userData.runTarget = rt.value;
        if (p) this.userData.pace = p.value;
      } else {
        var bg = document.getElementById('ob-bikegoal');
        var f = document.getElementById('ob-ftp');
        if (bg) this.userData.bikeGoal = bg.value;
        if (f) this.userData.ftp = parseInt(f.value);
      }
    }
  },

  _finish: function() {
    localStorage.setItem('vb_user', JSON.stringify(this.userData));
    document.getElementById('onboarding-overlay').classList.add('hidden');
    if (this.onComplete) this.onComplete(this.userData);
  }
};
