with open("validacao.html", "r") as f:
    html = f.read()

html = html.replace('renderPlanoList', 'renderPlanList')

with open("validacao.html", "w") as f:
    f.write(html)
