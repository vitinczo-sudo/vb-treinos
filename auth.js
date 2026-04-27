// Configuração do Supabase
const SUPABASE_URL = 'https://vpcnqzeaxlfepebgexub.supabase.co';
const SUPABASE_KEY = 'sb_publishable_H5At8jw6574HxRz4CL9qog_0KZoa6HX';

const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const Auth = {
    user: null,

    init: function(callback) {
        if (!supabase) {
            console.error('Supabase não carregado');
            return;
        }

        // Verificar sessão atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            this.user = session?.user || null;
            if (this.user) {
                this._loadProfile(callback);
            } else {
                callback(null);
            }
        });

        // Escutar mudanças na auth
        supabase.auth.onAuthStateChange((event, session) => {
            this.user = session?.user || null;
            if (event === 'SIGNED_IN') {
                this._loadProfile(() => location.reload());
            }
            if (event === 'SIGNED_OUT') {
                location.reload();
            }
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
        
        if(confirm('Deseja criar uma nova conta com este e-mail?')) {
            this._showLoading(true);
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                alert('Erro no cadastro: ' + error.message);
                this._showLoading(false);
            } else {
                alert('Conta criada! Verifique seu e-mail para confirmar (se necessário).');
                this._showLoading(false);
            }
        }
    },

    logout: async function() {
        await supabase.auth.signOut();
    },

    _loadProfile: async function(callback) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', this.user.id)
            .single();

        if (data) {
            localStorage.setItem('vb_user', JSON.stringify(data));
            callback(data);
        } else {
            // Se logado mas sem perfil, inicia onboarding
            callback(null);
        }
    },

    saveProfile: async function(profileData) {
        if (!this.user) return;
        const { error } = await supabase
            .from('profiles')
            .upsert({ id: this.user.id, ...profileData });
        
        if (error) console.error('Erro ao salvar perfil:', error);
    },

    saveWorkout: async function(workoutData) {
        if (!this.user) return;
        const { error } = await supabase
            .from('workouts')
            .insert({ user_id: this.user.id, ...workoutData });
        
        if (error) console.error('Erro ao salvar treino:', error);
    },

    syncHistory: async function() {
        if (!this.user) return [];
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .order('date', { ascending: false });
        
        return data || [];
    },

    _showLoading: function(show) {
        document.getElementById('auth-form-container').style.display = show ? 'none' : 'block';
        document.getElementById('auth-loading').style.display = show ? 'block' : 'none';
    }
};
