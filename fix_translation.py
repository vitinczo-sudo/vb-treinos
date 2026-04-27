import re

with open("validacao.html", "r") as f:
    html = f.read()

fixes = {
    'data-lucide="halter"': 'data-lucide="dumbbell"',
    'generatePlano': 'generatePlan',
    'Editar Workout Settings': 'Editar Configurações do Treino',
    'EXERCISES': 'EXERCÍCIOS',
}

for pt, eng in fixes.items():
    html = html.replace(pt, eng)

# Check if EX_DB structure is broken (e.g. key names)
# Check for any other lucide icon broken. 
# "star", "activity", "user", "bar-chart-2", "layout-grid", "x", "more-vertical", "clock", "check", "check-circle", "plus", "chevron-right"
# Only "dumbbell" was "halter".

with open("validacao.html", "w") as f:
    f.write(html)
