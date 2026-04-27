// Configuração do Supabase
const SUPABASE_URL = 'https://vpcnqzeaxlfepebgexub.supabase.co';
const SUPABASE_KEY = 'sb_publishable_H5At8jw6574HxRz4CL9qog_0KZoa6HX';

// Criar cliente
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const Auth = {
    user: null,

    init: function(callback) {
        console.log("Iniciando Auth...");
        if (!supabase) {
            console.error('Erro: SDK do Supabase não foi carregado via CDN.');
            alert('Erro crítico: Banco de dados não carregado. Verifique sua internet.');
            return;
        }

        // Timeout de segurança: Se em 5 segundos não carregar, tenta mostrar o login
        const timeout = setTimeout(() => {
            console.warn("Auth demorando muito... forçando tela de login.");
            document.getElementById('modal-auth').classList.add('active');
        }, 5000);

        // Verificar sessão atual
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            clearTimeout(timeout);
            if (error) console.error("Erro na sessão:", error);
            
            this.user = session?.user || null;
            console.log("Usuário detectado:", this.user);

            if (this.user) {
                this._loadProfile(callback);
            } else {
                callback(null);
            }
        }).catch(err => {
            clearTimeout(timeout);
            console.error("Erro fatal no GetSession:", err);
            callback(null);
        });

        this._setupListeners();
    },

    _setupListeners: function() {
        const btnLogin = document.getElementById('btn-login');
        const btnSignup = document.getElementById('btn-signup');
        if(btnLogin) btnLogin.onclick = () => this.login();
        if(btnSignup) btnSignup.onclick = () => this.signup();
    },

    login: async function() {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        if(!email || !password) return alert('Preencha e-mail e senha');

        this._showLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Erro no login: ' + error.message);
            this._showLoading(false);
        }
    },

    signup: async function() {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        if(!email || !password) return alert('Preencha e-mail e senha');

        this._showLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            alert('Erro no cadastro: ' + error.message);
            this._showLoading(false);
        } else {
            alert('Conta criada! Verifique seu e-mail para confirmar.');
            this._showLoading(false);
        }
    },

    _loadProfile: async function(callback) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', this.user.id).single();
        if (data) {
            localStorage.setItem('vb_user', JSON.stringify(data));
            callback(data);
        } else {
            callback(null);
        }
    },

    saveProfile: async function(profileData) {
        if (!this.user) return;
        await supabase.from('profiles').upsert({ id: this.user.id, ...profileData });
    },

    saveWorkout: async function(workoutData) {
        if (!this.user) return;
        await supabase.from('workouts').insert({ user_id: this.user.id, ...workoutData });
    },

    syncHistory: async function() {
        if (!this.user) return [];
        const { data } = await supabase.from('workouts').select('*').order('date', { ascending: false });
        return data || [];
    },

    _showLoading: function(show) {
        document.getElementById('auth-form-container').style.display = show ? 'none' : 'block';
        document.getElementById('auth-loading').style.display = show ? 'block' : 'none';
    }
};
