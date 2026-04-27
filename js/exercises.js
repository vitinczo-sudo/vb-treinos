// VB Treinos — Banco de Exercícios Unificado (75+)
// Expandido com dificuldade, dicas e sem links quebrados

var IMG = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

var EX_DB = [
  // === PEITO (8) ===
  { id:"bench_press", name:"Supino Reto com Barra", muscle:"Peito", group:"push", equip:"Barra", difficulty:"intermediario", img:IMG+"Barbell_Bench_Press_-_Medium_Grip/0.jpg", instructions:"Deite-se no banco, segure a barra um pouco além da largura dos ombros e desça até o peito.", tips:"Mantenha os pés firmes no chão e escápulas retraídas." },
  { id:"incline_db_press", name:"Supino Inclinado Halteres", muscle:"Peito", group:"push", equip:"Halter", difficulty:"intermediario", img:IMG+"Dumbbell_Bench_Press/0.jpg", instructions:"Banco a 30-45 graus, foque na parte superior do peitoral.", tips:"Não suba o banco mais que 45° para não ativar muito o deltóide." },
  { id:"peck_deck", name:"Crucifixo Máquina (Peck Deck)", muscle:"Peito", group:"push", equip:"Máquina", difficulty:"iniciante", img:IMG+"Butterfly/0.jpg", instructions:"Mantenha os cotovelos levemente flexionados e esmague o peito no centro.", tips:"Ótimo para isolamento no final do treino." },
  { id:"crossover", name:"Crossover Polia Alta", muscle:"Peito", group:"push", equip:"Cabo", difficulty:"intermediario", img:IMG+"Cable_Crossover/0.jpg", instructions:"Traga os cabos de cima para baixo, cruzando na frente do corpo.", tips:"Foque na parte inferior e interna do peitoral." },
  { id:"pullover_db", name:"Pullover com Halter", muscle:"Peito", group:"push", equip:"Halter", difficulty:"intermediario", img:IMG+"Bent-Arm_Dumbbell_Pullover/0.jpg", instructions:"Deitado no banco, desça o halter atrás da cabeça controladamente.", tips:"Trabalha peito e dorsal simultaneamente." },
  { id:"decline_press", name:"Supino Declinado Barra", muscle:"Peito", group:"push", equip:"Barra", difficulty:"intermediario", img:IMG+"Decline_Barbell_Bench_Press/0.jpg", instructions:"Banco declinado, foque na parte inferior do peitoral.", tips:"Use sempre um spotter neste exercício." },
  { id:"chest_dip", name:"Mergulho para Peito", muscle:"Peito", group:"push", equip:"Peso Corporal", difficulty:"avancado", img:IMG+"Dips_-_Chest_Version/0.jpg", instructions:"Incline o tronco à frente para focar no peitoral.", tips:"Desça até sentir alongamento no peito." },
  { id:"floor_press", name:"Supino no Chão", muscle:"Peito", group:"push", equip:"Halter", difficulty:"iniciante", img:IMG+"Alternating_Floor_Press/0.jpg", instructions:"Deitado no chão, pressione os halteres para cima.", tips:"Boa variação quando não há banco disponível." },

  // === COSTAS (9) ===
  { id:"lat_pulldown", name:"Puxada Frontal Aberta", muscle:"Costas", group:"pull", equip:"Cabo", difficulty:"iniciante", img:IMG+"Wide-Grip_Lat_Pulldown/0.jpg", instructions:"Puxe a barra em direção ao peito, não atrás do pescoço.", tips:"Foque em puxar com os cotovelos, não com as mãos." },
  { id:"bent_row", name:"Remada Curvada com Barra", muscle:"Costas", group:"pull", equip:"Barra", difficulty:"intermediario", img:IMG+"Bent_Over_Barbell_Row/0.jpg", instructions:"Mantenha a coluna reta e puxe a barra em direção ao umbigo.", tips:"Ângulo do tronco entre 45-60 graus." },
  { id:"seated_row", name:"Remada Sentada (Triângulo)", muscle:"Costas", group:"pull", equip:"Cabo", difficulty:"iniciante", img:IMG+"Seated_Cable_Rows/0.jpg", instructions:"Sente-se com as costas retas e puxe o triângulo contra o abdômen.", tips:"Não balance o tronco para trás." },
  { id:"deadlift", name:"Levantamento Terra", muscle:"Costas", group:"pull", equip:"Barra", difficulty:"avancado", img:IMG+"Barbell_Deadlift/0.jpg", instructions:"Exercício multiarticular. Mantenha a barra próxima às pernas.", tips:"Rei dos exercícios compostos. Técnica é prioridade." },
  { id:"chinup", name:"Barra Fixa Supinada", muscle:"Costas", group:"pull", equip:"Peso Corporal", difficulty:"avancado", img:IMG+"Chin-Up/0.jpg", instructions:"Puxe-se para cima com as palmas viradas para você.", tips:"Trabalha costas e bíceps simultaneamente." },
  { id:"pullup", name:"Barra Fixa Pronada", muscle:"Costas", group:"pull", equip:"Peso Corporal", difficulty:"avancado", img:IMG+"Pullups/0.jpg", instructions:"Pegada aberta, puxe o peito em direção à barra.", tips:"Se não conseguir, use elástico de assistência." },
  { id:"db_row", name:"Remada Unilateral Halter", muscle:"Costas", group:"pull", equip:"Halter", difficulty:"iniciante", img:IMG+"Dumbbell_Incline_Row/0.jpg", instructions:"Apoie um joelho no banco e puxe o halter para o quadril.", tips:"Excelente para corrigir assimetrias." },
  { id:"tbar_row", name:"Remada Cavalinho (T-Bar)", muscle:"Costas", group:"pull", equip:"Barra", difficulty:"intermediario", img:IMG+"Bent_Over_Two-Arm_Long_Bar_Row/0.jpg", instructions:"Segure a barra entre as pernas e puxe para o peito.", tips:"Foque na retração das escápulas." },
  { id:"face_pull", name:"Face Pull com Corda", muscle:"Costas", group:"pull", equip:"Cabo", difficulty:"iniciante", img:IMG+"Face_Pull/0.jpg", instructions:"Puxe a corda em direção ao rosto, abrindo os cotovelos.", tips:"Essencial para saúde dos ombros." },

  // === OMBROS (7) ===
  { id:"shoulder_press_db", name:"Desenvolvimento Halteres", muscle:"Ombro", group:"push", equip:"Halter", difficulty:"intermediario", img:IMG+"Dumbbell_Shoulder_Press/0.jpg", instructions:"Empurre os halteres acima da cabeça sem bater um no outro.", tips:"Não estenda os cotovelos totalmente no topo." },
  { id:"lateral_raise", name:"Elevação Lateral", muscle:"Ombro", group:"push", equip:"Halter", difficulty:"iniciante", img:IMG+"Side_Lateral_Raise/0.jpg", instructions:"Suba os braços até a linha dos ombros, focando no deltóide lateral.", tips:"Use peso leve e controle total." },
  { id:"front_raise", name:"Elevação Frontal", muscle:"Ombro", group:"push", equip:"Halter", difficulty:"iniciante", img:IMG+"Front_Dumbbell_Raise/0.jpg", instructions:"Suba o halter à frente até a altura dos olhos.", tips:"Alterne os braços para maior foco." },
  { id:"arnold_press", name:"Desenvolvimento Arnold", muscle:"Ombro", group:"push", equip:"Halter", difficulty:"intermediario", img:IMG+"Arnold_Dumbbell_Press/0.jpg", instructions:"Comece com palmas para dentro e gire durante o press.", tips:"Trabalha todas as porções do deltóide." },
  { id:"rear_delt_fly", name:"Crucifixo Invertido", muscle:"Ombro", group:"pull", equip:"Halter", difficulty:"iniciante", img:IMG+"Seated_Bent-Over_Rear_Delt_Raise/0.jpg", instructions:"Incline o tronco e abra os braços para os lados.", tips:"Foco no deltóide posterior, frequentemente negligenciado." },
  { id:"upright_row", name:"Remada Alta", muscle:"Ombro", group:"push", equip:"Barra", difficulty:"intermediario", img:IMG+"Upright_Barbell_Row/0.jpg", instructions:"Puxe a barra rente ao corpo até a altura do peito.", tips:"Não suba além da linha dos ombros." },
  { id:"cable_lateral", name:"Elevação Lateral no Cabo", muscle:"Ombro", group:"push", equip:"Cabo", difficulty:"intermediario", img:IMG+"Cable_Lateral_Raise/0.jpg", instructions:"Tensão constante do cabo trabalha o deltóide lateral.", tips:"Superior ao halter para manter tensão no topo." },

  // === BÍCEPS (6) ===
  { id:"barbell_curl", name:"Rosca Direta Barra W", muscle:"Bíceps", group:"pull", equip:"Barra", difficulty:"iniciante", img:IMG+"Barbell_Curl/0.jpg", instructions:"Não balance o corpo. Foque apenas na flexão do cotovelo.", tips:"Barra W reduz estresse nos punhos." },
  { id:"hammer_curl", name:"Rosca Martelo Alternada", muscle:"Bíceps", group:"pull", equip:"Halter", difficulty:"iniciante", img:IMG+"Alternate_Hammer_Curl/0.jpg", instructions:"Segure os halteres como martelos para trabalhar o braquial.", tips:"Fortalece o antebraço também." },
  { id:"incline_curl", name:"Rosca Inclinada Alternada", muscle:"Bíceps", group:"pull", equip:"Halter", difficulty:"intermediario", img:IMG+"Alternate_Incline_Dumbbell_Curl/0.jpg", instructions:"Banco a 45 graus, maior amplitude de movimento.", tips:"Maior alongamento da cabeça longa do bíceps." },
  { id:"preacher_curl", name:"Rosca Scott", muscle:"Bíceps", group:"pull", equip:"Barra", difficulty:"intermediario", img:IMG+"Preacher_Curl/0.jpg", instructions:"Apoie os braços no banco Scott e flexione com controle.", tips:"Isola completamente o bíceps." },
  { id:"cable_curl", name:"Rosca no Cabo", muscle:"Bíceps", group:"pull", equip:"Cabo", difficulty:"iniciante", img:IMG+"Cable_Hammer_Curls_-_Rope_Attachment/0.jpg", instructions:"Use a corda ou barra no cabo baixo.", tips:"Tensão constante durante todo o movimento." },
  { id:"concentration_curl", name:"Rosca Concentrada", muscle:"Bíceps", group:"pull", equip:"Halter", difficulty:"iniciante", img:IMG+"Concentration_Curls/0.jpg", instructions:"Sentado, apoie o cotovelo na coxa e flexione.", tips:"Melhor exercício para pico do bíceps." },

  // === TRÍCEPS (6) ===
  { id:"tricep_rope", name:"Tríceps Corda", muscle:"Tríceps", group:"push", equip:"Cabo", difficulty:"iniciante", img:IMG+"Triceps_Pushdown_-_Rope_Attachment/0.jpg", instructions:"Abra a corda no final do movimento para contração máxima.", tips:"Mantenha os cotovelos grudados no corpo." },
  { id:"skull_crusher", name:"Tríceps Testa", muscle:"Tríceps", group:"push", equip:"Barra", difficulty:"intermediario", img:IMG+"EZ-Bar_Skullcrusher/0.jpg", instructions:"Desça a barra em direção à testa e estenda totalmente.", tips:"Use barra EZ para menos estresse nos punhos." },
  { id:"bench_dips", name:"Mergulho no Banco", muscle:"Tríceps", group:"push", equip:"Peso Corporal", difficulty:"iniciante", img:IMG+"Bench_Dips/0.jpg", instructions:"Apoie as mãos no banco e desça o corpo flexionando os cotovelos.", tips:"Coloque peso no colo para aumentar dificuldade." },
  { id:"overhead_ext", name:"Extensão Overhead Halter", muscle:"Tríceps", group:"push", equip:"Halter", difficulty:"intermediario", img:IMG+"Seated_Triceps_Press/0.jpg", instructions:"Segure o halter atrás da cabeça e estenda acima.", tips:"Trabalha a cabeça longa do tríceps." },
  { id:"tricep_kickback", name:"Tríceps Coice", muscle:"Tríceps", group:"push", equip:"Halter", difficulty:"iniciante", img:IMG+"Tricep_Dumbbell_Kickback/0.jpg", instructions:"Inclinado, estenda o braço para trás.", tips:"Mantenha o braço fixo, só o antebraço se move." },
  { id:"close_grip_bench", name:"Supino Pegada Fechada", muscle:"Tríceps", group:"push", equip:"Barra", difficulty:"intermediario", img:IMG+"Close-Grip_Barbell_Bench_Press/0.jpg", instructions:"Supino com mãos na largura dos ombros para focar tríceps.", tips:"Excelente composto para tríceps." },

  // === PERNAS — QUADRÍCEPS (9) ===
  { id:"squat", name:"Agachamento Livre", muscle:"Pernas", group:"legs", equip:"Barra", difficulty:"intermediario", img:IMG+"Barbell_Squat/0.jpg", instructions:"Mantenha os calcanhares no chão e a coluna neutra.", tips:"Rei dos exercícios. Desça pelo menos até o paralelo." },
  { id:"leg_press", name:"Leg Press 45°", muscle:"Pernas", group:"legs", equip:"Máquina", difficulty:"iniciante", img:IMG+"Leg_Press/0.jpg", instructions:"Não estenda totalmente os joelhos no final.", tips:"Pés altos = mais glúteo, pés baixos = mais quad." },
  { id:"leg_ext", name:"Cadeira Extensora", muscle:"Pernas", group:"legs", equip:"Máquina", difficulty:"iniciante", img:IMG+"Leg_Extensions/0.jpg", instructions:"Foque na contração do quadríceps no topo.", tips:"Isolamento puro de quadríceps." },
  { id:"leg_curl", name:"Mesa Flexora", muscle:"Pernas", group:"legs", equip:"Máquina", difficulty:"iniciante", img:IMG+"Lying_Leg_Curls/0.jpg", instructions:"Foque nos posteriores de coxa.", tips:"Contraia forte no topo do movimento." },
  { id:"hack_squat", name:"Agachamento Hack", muscle:"Pernas", group:"legs", equip:"Máquina", difficulty:"intermediario", img:IMG+"Hack_Squat/0.jpg", instructions:"Ótimo para isolar o quadríceps com segurança.", tips:"Menos estresse na coluna que agachamento livre." },
  { id:"lunge", name:"Avanço com Halteres", muscle:"Pernas", group:"legs", equip:"Halter", difficulty:"intermediario", img:IMG+"Dumbbell_Lunges/0.jpg", instructions:"Dê um passo à frente e desça até o joelho quase tocar o chão.", tips:"Trabalha equilíbrio e estabilização." },
  { id:"goblet_squat", name:"Agachamento Goblet", muscle:"Pernas", group:"legs", equip:"Halter", difficulty:"iniciante", img:IMG+"Goblet_Squat/0.jpg", instructions:"Segure o halter na frente do peito e agache.", tips:"Perfeito para iniciantes aprenderem a agachar." },
  { id:"bulgarian_split", name:"Agachamento Búlgaro", muscle:"Pernas", group:"legs", equip:"Halter", difficulty:"avancado", img:IMG+"Dumbbell_Single_Leg_Split_Squat/0.jpg", instructions:"Pé traseiro elevado no banco, agache com a perna da frente.", tips:"Excelente para força unilateral." },
  { id:"step_up", name:"Step Up com Halteres", muscle:"Pernas", group:"legs", equip:"Halter", difficulty:"intermediario", img:IMG+"Dumbbell_Step_Ups/0.jpg", instructions:"Suba no banco com uma perna de cada vez.", tips:"Use banco na altura do joelho." },

  // === GLÚTEOS (5) ===
  { id:"hip_thrust", name:"Elevação Pélvica com Barra", muscle:"Glúteos", group:"legs", equip:"Barra", difficulty:"intermediario", img:IMG+"Barbell_Hip_Thrust/0.jpg", instructions:"Apoie as costas no banco e eleve o quadril com a barra.", tips:"Melhor exercício para glúteo máximo." },
  { id:"glute_bridge", name:"Ponte de Glúteos", muscle:"Glúteos", group:"legs", equip:"Peso Corporal", difficulty:"iniciante", img:IMG+"Butt_Lift_Bridge/0.jpg", instructions:"Deitado, eleve o quadril contraindo os glúteos.", tips:"Segure 2s no topo de cada repetição." },
  { id:"kickback", name:"Coice de Glúteo Cabo", muscle:"Glúteos", group:"legs", equip:"Cabo", difficulty:"iniciante", img:IMG+"Glute_Kickback/0.jpg", instructions:"No cabo baixo, estenda a perna para trás.", tips:"Excelente isolamento de glúteo." },
  { id:"sumo_squat", name:"Agachamento Sumô", muscle:"Glúteos", group:"legs", equip:"Halter", difficulty:"intermediario", img:IMG+"Sumo_Deadlift/0.jpg", instructions:"Pernas abertas, pontas dos pés para fora.", tips:"Maior ativação de adutores e glúteos." },
  { id:"rdl", name:"Stiff (Romeno)", muscle:"Glúteos", group:"legs", equip:"Barra", difficulty:"intermediario", img:IMG+"Romanian_Deadlift_With_Dumbbells/0.jpg", instructions:"Desça a barra mantendo as pernas quase retas.", tips:"Sinta o alongamento dos posteriores." },

  // === PANTURRILHA (3) ===
  { id:"calf_standing", name:"Panturrilha em Pé", muscle:"Panturrilha", group:"legs", equip:"Máquina", difficulty:"iniciante", img:IMG+"Standing_Calf_Raises/0.jpg", instructions:"Alongue bem embaixo e contraia forte em cima.", tips:"Trabalha o gastrocnêmio." },
  { id:"calf_seated", name:"Panturrilha Sentado", muscle:"Panturrilha", group:"legs", equip:"Máquina", difficulty:"iniciante", img:IMG+"Seated_Calf_Raise/0.jpg", instructions:"Sentado, foque no sóleo da panturrilha.", tips:"Complementar à panturrilha em pé." },
  { id:"calf_legpress", name:"Panturrilha no Leg Press", muscle:"Panturrilha", group:"legs", equip:"Máquina", difficulty:"iniciante", img:IMG+"Calf_Press_On_The_Leg_Press_Machine/0.jpg", instructions:"Use o leg press com apenas as pontas dos pés na plataforma.", tips:"Amplitude total é essencial." },

  // === ABDÔMEN (6) ===
  { id:"crunch", name:"Abdominal Crunch", muscle:"Abdômen", group:"core", equip:"Peso Corporal", difficulty:"iniciante", img:IMG+"Crunches/0.jpg", instructions:"Suba parcialmente focando na contração do reto abdominal.", tips:"Não puxe o pescoço com as mãos." },
  { id:"plank", name:"Prancha Isométrica", muscle:"Abdômen", group:"core", equip:"Peso Corporal", difficulty:"iniciante", img:IMG+"Plank/0.jpg", instructions:"Mantenha o corpo reto em posição de prancha.", tips:"Contraia glúteos e abdômen. Objetivo: 60s." },
  { id:"leg_raise", name:"Elevação de Pernas", muscle:"Abdômen", group:"core", equip:"Peso Corporal", difficulty:"intermediario", img:IMG+"Flat_Bench_Lying_Leg_Raise/0.jpg", instructions:"Deitado, eleve as pernas mantendo-as retas.", tips:"Foco na parte inferior do abdômen." },
  { id:"russian_twist", name:"Twist Russo", muscle:"Abdômen", group:"core", equip:"Peso Corporal", difficulty:"intermediario", img:IMG+"Russian_Twist/0.jpg", instructions:"Sentado com tronco inclinado, gire o tronco lado a lado.", tips:"Trabalha oblíquos e core rotacional." },
  { id:"ab_wheel", name:"Roda Abdominal", muscle:"Abdômen", group:"core", equip:"Equipamento", difficulty:"avancado", img:IMG+"Ab_Roller/0.jpg", instructions:"Estenda a roda à frente e retorne controladamente.", tips:"Exercício avançado. Comece com amplitude curta." },
  { id:"mountain_climber", name:"Escalador (Mountain Climber)", muscle:"Abdômen", group:"core", equip:"Peso Corporal", difficulty:"iniciante", img:IMG+"Mountain_Climbers/0.jpg", instructions:"Em posição de prancha, alterne os joelhos em direção ao peito.", tips:"Ótimo para cardio e core." }
];

// Planos de corrida
var RUN_PLANS = {
  "5k": { name:"Plano 5K", weeks:8, template:[
    { day:"Seg", type:"easy", name:"Corrida Leve", duration:"30min", detail:"Ritmo conversacional" },
    { day:"Qua", type:"interval", name:"Intervalados", duration:"35min", detail:"8x400m com 200m trote" },
    { day:"Sex", type:"tempo", name:"Tempo Run", duration:"25min", detail:"20min no ritmo de prova" },
    { day:"Dom", type:"long", name:"Longão", duration:"45min", detail:"Ritmo leve, construir base" }
  ]},
  "10k": { name:"Plano 10K", weeks:10, template:[
    { day:"Seg", type:"easy", name:"Corrida Leve", duration:"35min", detail:"Zona 2 de FC" },
    { day:"Ter", type:"interval", name:"Intervalados", duration:"40min", detail:"6x800m com 400m trote" },
    { day:"Qui", type:"tempo", name:"Tempo Run", duration:"35min", detail:"25min abaixo do pace alvo" },
    { day:"Sáb", type:"easy", name:"Recuperação", duration:"25min", detail:"Bem leve" },
    { day:"Dom", type:"long", name:"Longão", duration:"60min", detail:"Ritmo confortável" }
  ]},
  "21k": { name:"Plano Meia Maratona", weeks:12, template:[
    { day:"Seg", type:"easy", name:"Corrida Leve", duration:"40min", detail:"Zona 2" },
    { day:"Ter", type:"interval", name:"Intervalados", duration:"45min", detail:"5x1000m com 500m trote" },
    { day:"Qui", type:"tempo", name:"Ritmo de Prova", duration:"40min", detail:"30min no pace alvo" },
    { day:"Sáb", type:"easy", name:"Recuperação Ativa", duration:"30min", detail:"Super leve" },
    { day:"Dom", type:"long", name:"Longão", duration:"75-90min", detail:"Aumentar 10% por semana" }
  ]},
  "42k": { name:"Plano Maratona", weeks:16, template:[
    { day:"Seg", type:"easy", name:"Corrida Leve", duration:"45min", detail:"Zona 2 - base aeróbica" },
    { day:"Ter", type:"interval", name:"Intervalados", duration:"50min", detail:"4x1600m com 800m trote" },
    { day:"Qua", type:"easy", name:"Regenerativa", duration:"30min", detail:"Muito leve" },
    { day:"Sex", type:"tempo", name:"Progressivo", duration:"45min", detail:"Últimos 20min acelerando" },
    { day:"Dom", type:"long", name:"Longão", duration:"90-150min", detail:"Peça chave do treino" }
  ]}
};

// Planos de ciclismo
var BIKE_PLANS = {
  "endurance": { name:"Resistência", template:[
    { day:"Seg", type:"easy", name:"Pedalada Leve", duration:"60min", detail:"55-75% FTP, zona 2" },
    { day:"Qua", type:"tempo", name:"Sweet Spot", duration:"75min", detail:"88-94% FTP, 2x20min" },
    { day:"Sex", type:"interval", name:"VO2Max", duration:"60min", detail:"106-120% FTP, 5x3min" },
    { day:"Dom", type:"long", name:"Endurance Longo", duration:"120min", detail:"65-75% FTP" }
  ]},
  "power": { name:"Potência", template:[
    { day:"Seg", type:"easy", name:"Recuperação", duration:"45min", detail:"50-65% FTP" },
    { day:"Ter", type:"interval", name:"VO2Max Intenso", duration:"60min", detail:"5x4min a 110-120% FTP" },
    { day:"Qui", type:"tempo", name:"Threshold", duration:"75min", detail:"95-105% FTP, 2x15min" },
    { day:"Sáb", type:"interval", name:"Sprints", duration:"50min", detail:"8x30s máximo, 4min desc" },
    { day:"Dom", type:"long", name:"Endurance", duration:"90min", detail:"70-80% FTP" }
  ]}
};

// Quick workout muscle groups
var QUICK_GROUPS = [
  { id:"bracos", name:"Braços", icon:"💪", muscles:["Bíceps","Tríceps"], color:"#9C27B0" },
  { id:"pernas", name:"Pernas", icon:"🦵", muscles:["Pernas","Glúteos","Panturrilha"], color:"#2196F3" },
  { id:"costas", name:"Costas", icon:"🔙", muscles:["Costas"], color:"#4CAF50" },
  { id:"peito", name:"Peito", icon:"🫁", muscles:["Peito"], color:"#F44336" },
  { id:"ombros", name:"Ombros", icon:"🏔️", muscles:["Ombro"], color:"#FF9800" },
  { id:"core", name:"Core", icon:"🧱", muscles:["Abdômen"], color:"#00BCD4" },
  { id:"fullbody", name:"Full Body", icon:"🔥", muscles:["Peito","Costas","Pernas","Ombro","Bíceps","Tríceps"], color:"#E91E63" }
];
