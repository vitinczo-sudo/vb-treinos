import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"
req = urllib.request.Request(url)
with urllib.request.urlopen(req, context=ctx) as response:
    data = json.loads(response.read().decode())

out = []
counts = {"chest": 0, "shoulders": 0, "triceps": 0, "middle back": 0, "lats": 0, "biceps": 0, "quadriceps": 0, "hamstrings": 0, "calves": 0, "glutes": 0, "abdominals": 0}

for ex in data:
    if len(ex.get("images", [])) == 0: continue
    
    muscle = ex.get("primaryMuscles", [""])[0]
    
    if muscle in counts and counts[muscle] < 8:
        # Avoid things that need partner or are weird
        if ex.get("equipment") in ["partner", "other"]: continue
        
        counts[muscle] += 1
        
        path = ex["images"][0]
        
        group = ""
        if muscle in ["chest", "shoulders", "triceps"]: group = "push"
        elif muscle in ["middle back", "lats", "biceps"]: group = "pull"
        elif muscle in ["quadriceps", "hamstrings", "calves", "glutes"]: group = "legs"
        elif muscle in ["abdominals"]: group = "core"
        
        out.append(f"""{{ id: "{ex['id']}", name: "{ex['name'].replace('"', "'")}", muscle: "{muscle}", group: "{group}", equip: "{ex.get('equipment')}", img: "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{path}" }}""")

print("const EX_DB = [\n  " + ",\n  ".join(out) + "\n];")
